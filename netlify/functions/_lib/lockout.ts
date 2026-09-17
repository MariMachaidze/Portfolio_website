import type { HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CAS_RETRIES = 3;

interface LockoutRecord {
  count: number;
  firstAttempt: number;
}

function store() {
  return getStore("auth-lockout");
}

/**
 * Only trusts Netlify's own edge-set client IP header, never the
 * client-controlled X-Forwarded-For — that header is trivially spoofable
 * (an attacker could send a fresh fake value per request to dodge lockout
 * entirely). Returns null when unavailable (e.g. local dev without
 * `netlify link`) rather than bucketing unknown clients together, since a
 * shared "unknown" key would let one attacker's failures lock out everyone
 * else who also falls into that bucket.
 */
export function getClientIp(event: HandlerEvent): string | null {
  return event.headers["x-nf-client-connection-ip"] || null;
}

function isMissingBlobsEnvError(error: unknown): boolean {
  return error instanceof Error && error.name === "MissingBlobsEnvironmentError";
}

/** Read-modify-write via compare-and-swap (etag/onlyIfMatch), retrying on write conflicts. */
async function updateRecord(
  key: string,
  updater: (current: LockoutRecord | null) => LockoutRecord | null,
): Promise<void> {
  const s = store();
  for (let attempt = 0; attempt <= CAS_RETRIES; attempt++) {
    const existing = await s.getWithMetadata(key, { type: "json" });
    const current = (existing?.data ?? null) as LockoutRecord | null;
    const next = updater(current);

    if (next === null) {
      await s.delete(key);
      return;
    }

    const options = existing?.etag ? { onlyIfMatch: existing.etag } : { onlyIfNew: true as const };
    const result = await s.setJSON(key, next, options);
    if (result.modified) return;
    // Someone else wrote concurrently — loop and retry with fresh data.
  }
  // Out of retries under heavy contention: lockout is a best-effort defense
  // layered on top of TOTP, not the only one — fail open rather than error.
}

export async function isLockedOut(key: string | null): Promise<boolean> {
  if (!key) return false;
  try {
    const record = (await store().get(key, { type: "json" })) as LockoutRecord | null;
    if (!record) return false;
    if (Date.now() - record.firstAttempt > WINDOW_MS) return false;
    return record.count >= MAX_ATTEMPTS;
  } catch (error) {
    if (isMissingBlobsEnvError(error)) {
      console.warn("[lockout] Netlify Blobs unavailable locally (run `netlify link` to test lockout) — skipping check");
      return false;
    }
    throw error;
  }
}

export async function recordFailedAttempt(key: string | null): Promise<void> {
  if (!key) return;
  try {
    await updateRecord(key, (current) => {
      const now = Date.now();
      if (!current || now - current.firstAttempt > WINDOW_MS) {
        return { count: 1, firstAttempt: now };
      }
      return { count: current.count + 1, firstAttempt: current.firstAttempt };
    });
  } catch (error) {
    if (isMissingBlobsEnvError(error)) return;
    throw error;
  }
}

export async function clearFailedAttempts(key: string | null): Promise<void> {
  if (!key) return;
  try {
    await store().delete(key);
  } catch (error) {
    if (isMissingBlobsEnvError(error)) return;
    throw error;
  }
}

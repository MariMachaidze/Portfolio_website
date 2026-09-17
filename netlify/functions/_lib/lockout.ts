import type { HandlerEvent } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface LockoutRecord {
  count: number;
  firstAttempt: number;
}

function store() {
  return getStore("auth-lockout");
}

export function getClientIp(event: HandlerEvent): string {
  return (
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// Netlify Blobs only works out of the box on deployed functions, or in local
// `netlify dev` after `netlify link`ing to a real site. Without that link,
// local dev throws MissingBlobsEnvironmentError — fail open (skip lockout
// tracking) rather than breaking login entirely for local testing.
function isMissingBlobsEnvError(error: unknown): boolean {
  return error instanceof Error && error.name === "MissingBlobsEnvironmentError";
}

export async function isLockedOut(key: string): Promise<boolean> {
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

export async function recordFailedAttempt(key: string): Promise<void> {
  try {
    const s = store();
    const record = (await s.get(key, { type: "json" })) as LockoutRecord | null;
    const now = Date.now();
    if (!record || now - record.firstAttempt > WINDOW_MS) {
      await s.setJSON(key, { count: 1, firstAttempt: now });
    } else {
      await s.setJSON(key, { count: record.count + 1, firstAttempt: record.firstAttempt });
    }
  } catch (error) {
    if (isMissingBlobsEnvError(error)) return;
    throw error;
  }
}

export async function clearFailedAttempts(key: string): Promise<void> {
  try {
    await store().delete(key);
  } catch (error) {
    if (isMissingBlobsEnvError(error)) return;
    throw error;
  }
}

import { getStore } from "@netlify/blobs";

const KEY = "last-used-counter";

function isMissingBlobsEnvError(error: unknown): boolean {
  return error instanceof Error && error.name === "MissingBlobsEnvironmentError";
}

/**
 * Prevents a captured/observed TOTP code from being replayed a second time
 * within its validation window. `counter` is the absolute 30s period index
 * the code belongs to (current period + the delta TOTP.validate() returned).
 */
export async function isReplayedCounter(counter: number): Promise<boolean> {
  try {
    const store = getStore("auth-totp");
    const last = (await store.get(KEY, { type: "json" })) as number | null;
    return last !== null && counter <= last;
  } catch (error) {
    if (isMissingBlobsEnvError(error)) {
      console.warn("[totp] Netlify Blobs unavailable locally (run `netlify link` to test replay protection) — skipping check");
      return false;
    }
    throw error;
  }
}

export async function recordUsedCounter(counter: number): Promise<void> {
  try {
    const store = getStore("auth-totp");
    await store.setJSON(KEY, counter);
  } catch (error) {
    if (isMissingBlobsEnvError(error)) return;
    throw error;
  }
}

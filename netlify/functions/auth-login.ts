import type { Handler } from "@netlify/functions";
import bcrypt from "bcryptjs";
import { clearFailedAttempts, getClientIp, isLockedOut, recordFailedAttempt } from "./_lib/lockout";
import { createSessionCookie } from "./_lib/session";
import { TOTP_PERIOD, createTotp } from "./_lib/totp";
import { isReplayedCounter, recordUsedCounter } from "./_lib/totpReplay";

function jsonResponse(statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

interface LoginPayload {
  password?: string;
  totpCode?: string;
}

// Placeholder hash of a value nobody will ever type, used only so the
// "no password supplied" path still pays the same bcrypt cost as a real
// comparison — otherwise missing fields would return measurably faster
// than wrong-but-present ones, leaking which case occurred via timing.
const DUMMY_HASH = "$2b$12$Wh.6bIYjtscBLOz2ZQHxyOgBCXg1CtJEl4TVtgraP6aU2GPG5I94u";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const ip = getClientIp(event);
  if (await isLockedOut(ip)) {
    return jsonResponse(429, { error: "Too many attempts. Try again in a few minutes." });
  }

  let payload: LoginPayload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid request" });
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const totpSecret = process.env.TOTP_SECRET;
  const sessionSecretConfigured = Boolean(process.env.SESSION_JWT_SECRET);
  if (!passwordHash || !totpSecret || !sessionSecretConfigured) {
    console.error("auth-login: ADMIN_PASSWORD_HASH, TOTP_SECRET, or SESSION_JWT_SECRET is not configured");
    return jsonResponse(500, { error: "Server misconfigured" });
  }

  // Always run both checks with real crypto cost, even for missing fields,
  // so response timing can't distinguish "nothing submitted" from "wrong
  // credentials submitted" — same reasoning as always checking both factors
  // below rather than short-circuiting on the first failure.
  const { password, totpCode } = payload;
  const passwordOk = bcrypt.compareSync(password || "", passwordHash);

  const totp = createTotp(totpSecret);
  const delta = totp.validate({ token: totpCode || "", window: 1 });
  let totpOk = false;
  let usedCounter: number | null = null;
  if (delta !== null) {
    usedCounter = Math.floor(Date.now() / 1000 / TOTP_PERIOD) + delta;
    totpOk = !(await isReplayedCounter(usedCounter));
  } else {
    // Keep timing consistent with the success path's dummy-hash-shaped cost.
    bcrypt.compareSync(totpCode || "", DUMMY_HASH);
  }

  if (!password || !totpCode || !passwordOk || !totpOk) {
    await recordFailedAttempt(ip);
    return jsonResponse(401, { error: "Invalid credentials" });
  }

  if (usedCounter !== null) await recordUsedCounter(usedCounter);
  await clearFailedAttempts(ip);
  const cookie = await createSessionCookie();

  return jsonResponse(200, { ok: true }, { "Set-Cookie": cookie });
};

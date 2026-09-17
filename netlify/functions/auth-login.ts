import type { Handler } from "@netlify/functions";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";
import { clearFailedAttempts, getClientIp, isLockedOut, recordFailedAttempt } from "./_lib/lockout";
import { createSessionCookie } from "./_lib/session";

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

  const genericError = async () => {
    await recordFailedAttempt(ip);
    return jsonResponse(401, { error: "Invalid credentials" });
  };

  const { password, totpCode } = payload;
  if (!password || !totpCode) {
    return genericError();
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const totpSecret = process.env.TOTP_SECRET;
  if (!passwordHash || !totpSecret) {
    console.error("auth-login: ADMIN_PASSWORD_HASH or TOTP_SECRET is not configured");
    return jsonResponse(500, { error: "Server misconfigured" });
  }

  const passwordOk = bcrypt.compareSync(password, passwordHash);

  const totp = new OTPAuth.TOTP({
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(totpSecret),
  });
  const totpOk = totp.validate({ token: totpCode, window: 1 }) !== null;

  if (!passwordOk || !totpOk) {
    return genericError();
  }

  await clearFailedAttempts(ip);
  const cookie = await createSessionCookie();

  return jsonResponse(200, { ok: true }, { "Set-Cookie": cookie });
};

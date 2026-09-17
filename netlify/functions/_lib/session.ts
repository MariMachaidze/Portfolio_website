import type { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { jwtVerify, SignJWT } from "jose";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

function getSecretKey() {
  const secret = process.env.SESSION_JWT_SECRET;
  if (!secret) throw new Error("SESSION_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSessionCookie(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());

  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const cookies: Record<string, string> = {};
  for (const pair of header.split(";").map((p) => p.trim()).filter(Boolean)) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    try {
      cookies[pair.slice(0, eq)] = decodeURIComponent(pair.slice(eq + 1));
    } catch {
      // Skip a malformed cookie (invalid percent-encoding) rather than
      // letting it take down parsing of every other cookie on the request.
    }
  }
  return cookies;
}

export async function verifySession(event: HandlerEvent): Promise<boolean> {
  try {
    const cookies = parseCookies(event.headers.cookie);
    const token = cookies[COOKIE_NAME];
    if (!token) return false;
    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

/** Call at the top of every admin-only function; returns a 401 response to short-circuit on, or null if OK. */
export async function requireAdminSession(event: HandlerEvent): Promise<HandlerResponse | null> {
  const ok = await verifySession(event);
  if (ok) return null;
  return {
    statusCode: 401,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Unauthorized" }),
  };
}

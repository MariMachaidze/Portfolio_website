import type { Handler } from "@netlify/functions";
import { clearSessionCookie } from "./_lib/session";

function jsonResponse(statusCode: number, body: unknown, extraHeaders: Record<string, string> = {}) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  return jsonResponse(200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
};

import type { Handler } from "@netlify/functions";
import { clearSessionCookie } from "./_lib/session";

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookie(),
    },
    body: JSON.stringify({ ok: true }),
  };
};

import type { Handler } from "@netlify/functions";
import { verifySession } from "./_lib/session";

export const handler: Handler = async (event) => {
  const authenticated = await verifySession(event);
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authenticated }),
  };
};

import type { Handler } from "@netlify/functions";
import { CONTENT_FILES, getContentFile, isContentKey } from "./_lib/github";
import { requireAdminSession } from "./_lib/session";

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  const authError = await requireAdminSession(event);
  if (authError) return authError;

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const key = event.queryStringParameters?.key;
  if (!key || !isContentKey(key)) {
    return jsonResponse(400, { error: `key must be one of: ${Object.keys(CONTENT_FILES).join(", ")}` });
  }

  try {
    const { content, sha } = await getContentFile(key);
    return jsonResponse(200, { content, sha });
  } catch (err) {
    console.error("content-get failed:", err);
    return jsonResponse(502, { error: "Failed to read content from GitHub" });
  }
};

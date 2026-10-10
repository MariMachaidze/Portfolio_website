import type { Handler } from "@netlify/functions";
import { CONTENT_FILES, ContentConflictError, isContentKey, putContentFile } from "./_lib/github";
import { requireAdminSession } from "./_lib/session";
import { CONTENT_SCHEMAS } from "./_lib/contentSchemas";

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

interface SavePayload {
  key?: string;
  content?: unknown;
  expectedSha?: string;
  message?: string;
}

function commitMessageFor(key: string, message: string | undefined): string {
  const trimmed = message?.replace(/\s+/g, " ").trim();
  if (trimmed) return trimmed.slice(0, 200);
  return `Update ${key} via admin panel`;
}

export const handler: Handler = async (event) => {
  const authError = await requireAdminSession(event);
  if (authError) return authError;

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: SavePayload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid request" });
  }

  const { key, content, expectedSha, message } = payload;
  if (!key || !isContentKey(key)) {
    return jsonResponse(400, { error: `key must be one of: ${Object.keys(CONTENT_FILES).join(", ")}` });
  }

  const parsed = CONTENT_SCHEMAS[key].safeParse(content);
  if (!parsed.success) {
    return jsonResponse(400, { error: "Invalid content", issues: parsed.error.issues });
  }

  try {
    const { commitSha, contentSha, dryRun } = await putContentFile(
      key,
      parsed.data,
      expectedSha,
      commitMessageFor(key, message),
    );
    return jsonResponse(200, { commitSha, contentSha, dryRun });
  } catch (err) {
    if (err instanceof ContentConflictError) {
      return jsonResponse(409, { error: "Content changed since you loaded it. Reload and try again." });
    }
    console.error("content-save failed:", err);
    return jsonResponse(502, { error: "Failed to save content to GitHub" });
  }
};

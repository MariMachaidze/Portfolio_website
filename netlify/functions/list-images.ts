import type { Handler } from "@netlify/functions";
import { requireAdminSession } from "./_lib/session";
import { listUploadedImages } from "./_lib/s3";

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export const handler: Handler = async (event) => {
  const authError = await requireAdminSession(event);
  if (authError) return authError;

  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    const images = await listUploadedImages();
    return jsonResponse(200, { images });
  } catch (err) {
    console.error("list-images failed:", err);
    return jsonResponse(502, { error: "Failed to list images" });
  }
};

import type { Handler } from "@netlify/functions";
import { requireAdminSession } from "./_lib/session";
import {
  InvalidImageError,
  MAX_UPLOAD_BYTES,
  isAllowedContentType,
  publicUrlFor,
  uploadImageObject,
} from "./_lib/s3";

function jsonResponse(statusCode: number, body: unknown) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

interface UploadPayload {
  contentType?: string;
  dataBase64?: string;
}

export const handler: Handler = async (event) => {
  const authError = await requireAdminSession(event);
  if (authError) return authError;

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: UploadPayload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid request" });
  }

  const { contentType, dataBase64 } = payload;
  if (!contentType || !isAllowedContentType(contentType)) {
    return jsonResponse(400, { error: "contentType must be one of image/png, image/jpeg, image/gif, image/webp" });
  }
  if (!dataBase64 || typeof dataBase64 !== "string") {
    return jsonResponse(400, { error: "dataBase64 is required" });
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(dataBase64, "base64");
  } catch {
    return jsonResponse(400, { error: "dataBase64 is not valid base64" });
  }

  if (bytes.length > MAX_UPLOAD_BYTES) {
    return jsonResponse(400, { error: `Image exceeds the ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB limit` });
  }

  try {
    const key = await uploadImageObject(contentType, bytes);
    return jsonResponse(200, { key, url: publicUrlFor(key), size: bytes.length });
  } catch (err) {
    if (err instanceof InvalidImageError) {
      return jsonResponse(400, { error: err.message });
    }
    console.error("upload-image failed:", err);
    return jsonResponse(502, { error: "Failed to upload image" });
  }
};

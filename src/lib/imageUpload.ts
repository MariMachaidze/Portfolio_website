import imageCompression from "browser-image-compression";
import { uploadImage, type UploadedImage } from "./adminApi";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

// Mirrors MAX_UPLOAD_BYTES in netlify/functions/_lib/s3.ts — checked client-side
// too so a too-large file fails fast with a clear message instead of a 400 round-trip.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function compressAndUploadImage(file: File): Promise<UploadedImage> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only PNG, JPEG, GIF, or WEBP images are supported");
  }

  // Animated GIFs would be flattened to a single frame by canvas-based
  // compression, so upload those as-is and only compress the other types.
  const output =
    file.type === "image/gif"
      ? file
      : await imageCompression(file, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2000,
          useWebWorker: true,
          fileType: file.type,
        });

  if (output.size > MAX_UPLOAD_BYTES) {
    throw new Error(`Image is too large (max ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB after compression)`);
  }

  const dataBase64 = await fileToBase64(output);
  return uploadImage(file.type, dataBase64);
}

function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const commaIndex = result.indexOf(",");
      resolve(commaIndex === -1 ? result : result.slice(commaIndex + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

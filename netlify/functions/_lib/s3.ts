import { randomUUID } from "node:crypto";
import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const UPLOADS_PREFIX = "uploads/";
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4MB — images are compressed client-side first

export const ALLOWED_TYPES = {
  "image/png": { ext: "png", magic: (b: Buffer) => b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  "image/jpeg": { ext: "jpg", magic: (b: Buffer) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/gif": { ext: "gif", magic: (b: Buffer) => b.length >= 4 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  "image/webp": {
    ext: "webp",
    magic: (b: Buffer) =>
      b.length >= 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
  },
} as const;

export type AllowedContentType = keyof typeof ALLOWED_TYPES;

export function isAllowedContentType(value: string): value is AllowedContentType {
  return Object.prototype.hasOwnProperty.call(ALLOWED_TYPES, value);
}

let cachedClient: S3Client | null = null;

function getS3Client(): S3Client {
  if (cachedClient) return cachedClient;
  const region = process.env.AWS_S3_REGION;
  // Not named AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY: Netlify Functions run on
  // AWS Lambda, which injects its own variables under those exact names for
  // internal use, so Netlify reserves them and refuses to let a site override them.
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("AWS_S3_REGION/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY is not set");
  }
  cachedClient = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  return cachedClient;
}

function getBucketName(): string {
  const bucket = process.env.AWS_S3_BUCKET;
  if (!bucket) throw new Error("AWS_S3_BUCKET is not set");
  return bucket;
}

export function publicUrlFor(key: string): string {
  const bucket = getBucketName();
  const region = process.env.AWS_S3_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export class InvalidImageError extends Error {}

/**
 * Uploads validated image bytes to the uploads/ prefix under a fresh
 * UUID-based key — the client's filename is never trusted or used, which
 * rules out path traversal and accidental overwrites.
 */
export async function uploadImageObject(contentType: AllowedContentType, bytes: Buffer): Promise<string> {
  if (bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES) {
    throw new InvalidImageError(`Image must be between 1 byte and ${MAX_UPLOAD_BYTES} bytes`);
  }
  if (!ALLOWED_TYPES[contentType].magic(bytes)) {
    throw new InvalidImageError("File contents don't match the declared image type");
  }

  const key = `${UPLOADS_PREFIX}${randomUUID()}.${ALLOWED_TYPES[contentType].ext}`;
  const client = getS3Client();
  const bucket = getBucketName();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: bytes,
      ContentType: contentType,
    }),
  );

  return key;
}

export interface ImageLibraryItem {
  key: string;
  url: string;
  size: number;
  uploadedAt: string | null;
}

export async function listUploadedImages(): Promise<ImageLibraryItem[]> {
  const client = getS3Client();
  const bucket = getBucketName();

  const res = await client.send(
    new ListObjectsV2Command({ Bucket: bucket, Prefix: UPLOADS_PREFIX, MaxKeys: 500 }),
  );

  const items = (res.Contents ?? [])
    .filter((obj) => obj.Key && obj.Key !== UPLOADS_PREFIX)
    .map((obj) => ({
      key: obj.Key as string,
      url: publicUrlFor(obj.Key as string),
      size: obj.Size ?? 0,
      uploadedAt: obj.LastModified ? obj.LastModified.toISOString() : null,
    }));

  items.sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? ""));
  return items;
}

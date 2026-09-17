import type { ContentKey } from "../types/content";

const BASE = "/.netlify/functions";

export class AdminApiError extends Error {
  status: number;
  issues?: unknown;

  constructor(message: string, status: number, issues?: unknown) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.issues = issues;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new AdminApiError(
      (data && typeof data.error === "string" && data.error) || `Request failed (${res.status})`,
      res.status,
      data?.issues,
    );
  }
  return data as T;
}

export async function getContent<T>(key: ContentKey): Promise<{ content: T; sha: string }> {
  const res = await fetch(`${BASE}/content-get?key=${encodeURIComponent(key)}`, {
    credentials: "include",
  });
  return handleResponse(res);
}

export interface SaveContentResult {
  commitSha: string;
  contentSha: string;
  dryRun: boolean;
}

export async function saveContent(
  key: ContentKey,
  content: unknown,
  expectedSha: string | undefined,
): Promise<SaveContentResult> {
  const res = await fetch(`${BASE}/content-save`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, content, expectedSha }),
  });
  return handleResponse(res);
}

export interface DeployStatus {
  status: "pending" | "queued" | "in_progress" | "completed" | string;
  conclusion: string | null;
  htmlUrl: string | null;
}

export async function getDeployStatus(commitSha: string): Promise<DeployStatus> {
  const res = await fetch(`${BASE}/deploy-status?sha=${encodeURIComponent(commitSha)}`, {
    credentials: "include",
  });
  return handleResponse(res);
}

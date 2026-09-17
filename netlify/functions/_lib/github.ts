import { Octokit } from "@octokit/rest";

export const CONTENT_FILES = {
  profile: "src/data/profile.json",
  skills: "src/data/skills.json",
  experience: "src/data/experience.json",
  projects: "src/data/projects.json",
} as const;

export type ContentKey = keyof typeof CONTENT_FILES;

export function isContentKey(key: string): key is ContentKey {
  return Object.prototype.hasOwnProperty.call(CONTENT_FILES, key);
}

let cachedOctokit: Octokit | null = null;

export function getOctokit(): Octokit {
  if (cachedOctokit) return cachedOctokit;
  const token = process.env.GITHUB_TOKEN_ADMIN;
  if (!token) throw new Error("GITHUB_TOKEN_ADMIN is not set");
  cachedOctokit = new Octokit({ auth: token });
  return cachedOctokit;
}

export function getRepoConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  if (!owner || !repo) throw new Error("GITHUB_OWNER/GITHUB_REPO is not set");
  return { owner, repo, branch: "master" };
}

/**
 * `netlify dev` sets CONTEXT=dev; a real deploy sets production/deploy-preview/
 * branch-deploy. Without ALLOW_LOCAL_GIT_WRITES=true, local admin-UI development
 * would otherwise spam real commits to the real repo on every save.
 */
export function shouldDryRun(): boolean {
  return process.env.CONTEXT === "dev" && process.env.ALLOW_LOCAL_GIT_WRITES !== "true";
}

export async function getContentFile(key: ContentKey): Promise<{ content: unknown; sha: string }> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoConfig();
  const path = CONTENT_FILES[key];

  const res = await octokit.repos.getContent({ owner, repo, path, ref: branch });
  if (Array.isArray(res.data) || res.data.type !== "file" || !res.data.content) {
    throw new Error(`Unexpected response shape reading ${path}`);
  }

  const raw = Buffer.from(res.data.content, "base64").toString("utf-8");
  return { content: JSON.parse(raw), sha: res.data.sha };
}

export class ContentConflictError extends Error {
  constructor() {
    super("Content changed since it was loaded");
    this.name = "ContentConflictError";
  }
}

export async function putContentFile(
  key: ContentKey,
  content: unknown,
  expectedSha: string | undefined,
  message: string,
): Promise<{ commitSha: string; contentSha: string; dryRun: boolean }> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoConfig();
  const path = CONTENT_FILES[key];

  const current = await octokit.repos.getContent({ owner, repo, path, ref: branch });
  if (Array.isArray(current.data) || current.data.type !== "file") {
    throw new Error(`Unexpected response shape reading ${path}`);
  }
  const currentSha = current.data.sha;
  if (expectedSha && expectedSha !== currentSha) {
    throw new ContentConflictError();
  }

  if (shouldDryRun()) {
    console.log(`[content-save dry run] would commit ${path} — "${message}"`);
    return { commitSha: `dryrun-${Date.now()}`, contentSha: currentSha, dryRun: true };
  }

  const body = JSON.stringify(content, null, 2) + "\n";
  const res = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(body, "utf-8").toString("base64"),
    sha: currentSha,
    branch,
  });

  const commitSha = res.data.commit.sha;
  const contentSha = res.data.content?.sha;
  if (!commitSha || !contentSha) throw new Error("GitHub did not return the expected sha fields");
  return { commitSha, contentSha, dryRun: false };
}

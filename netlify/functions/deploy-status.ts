import type { Handler } from "@netlify/functions";
import { getOctokit, getRepoConfig } from "./_lib/github";
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

  const sha = event.queryStringParameters?.sha;
  if (!sha) {
    return jsonResponse(400, { error: "sha query parameter is required" });
  }

  try {
    const octokit = getOctokit();
    const { owner, repo } = getRepoConfig();
    const res = await octokit.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      head_sha: sha,
      per_page: 1,
    });
    const run = res.data.workflow_runs[0];

    if (!run) {
      return jsonResponse(200, { status: "pending", conclusion: null, htmlUrl: null });
    }

    return jsonResponse(200, { status: run.status, conclusion: run.conclusion, htmlUrl: run.html_url });
  } catch (err) {
    console.error("deploy-status failed:", err);
    return jsonResponse(502, { error: "Failed to check deploy status" });
  }
};

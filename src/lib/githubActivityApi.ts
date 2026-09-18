export interface GithubActivityDay {
  date: string;
  count: number;
}

export interface GithubActivityWeek {
  days: GithubActivityDay[];
}

export interface GithubActivity {
  totalContributions: number;
  weeks: GithubActivityWeek[];
}

export async function getGithubActivity(): Promise<GithubActivity> {
  const res = await fetch("/.netlify/functions/github-activity");
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && typeof data.error === "string" && data.error) || `Request failed (${res.status})`);
  }
  return data as GithubActivity;
}

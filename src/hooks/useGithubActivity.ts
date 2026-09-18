import { useEffect, useState } from "react";
import { getGithubActivity, type GithubActivity } from "../lib/githubActivityApi";

interface UseGithubActivityResult {
  data: GithubActivity | null;
  loading: boolean;
  error: string | null;
}

export function useGithubActivity(): UseGithubActivityResult {
  const [data, setData] = useState<GithubActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getGithubActivity()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load GitHub activity");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

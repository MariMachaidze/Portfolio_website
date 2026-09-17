import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getDeployStatus } from "../lib/adminApi";

export type SaveStage =
  | "idle"
  | "saving"
  | "dry-run"
  | "queued"
  | "in_progress"
  | "completed"
  | "error";

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 60; // ~3 minutes

interface UseDeployStatusResult {
  stage: SaveStage;
  htmlUrl: string | null;
  conclusion: string | null;
  errorMessage: string | null;
  trackSave: (result: { commitSha: string; dryRun: boolean }) => void;
  markSaving: () => void;
  markError: (message: string) => void;
  reset: () => void;
}

export function useDeployStatus(): UseDeployStatusResult {
  const [stage, setStage] = useState<SaveStage>("idle");
  const [htmlUrl, setHtmlUrl] = useState<string | null>(null);
  const [conclusion, setConclusion] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const pollTokenRef = useRef(0);

  const stopPolling = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const reset = useCallback(() => {
    stopPolling();
    pollTokenRef.current += 1;
    attemptsRef.current = 0;
    setStage("idle");
    setHtmlUrl(null);
    setConclusion(null);
    setErrorMessage(null);
  }, [stopPolling]);

  const markSaving = useCallback(() => {
    stopPolling();
    pollTokenRef.current += 1;
    setStage("saving");
    setHtmlUrl(null);
    setConclusion(null);
    setErrorMessage(null);
  }, [stopPolling]);

  const markError = useCallback(
    (message: string) => {
      stopPolling();
      pollTokenRef.current += 1;
      setStage("error");
      setErrorMessage(message);
    },
    [stopPolling],
  );

  const trackSave = useCallback(
    (result: { commitSha: string; dryRun: boolean }) => {
      stopPolling();
      attemptsRef.current = 0;
      setErrorMessage(null);

      if (result.dryRun) {
        setStage("dry-run");
        return;
      }

      setStage("queued");
      const myToken = ++pollTokenRef.current;

      const poll = async () => {
        attemptsRef.current += 1;
        try {
          const status = await getDeployStatus(result.commitSha);
          if (pollTokenRef.current !== myToken) return; // superseded by a newer save/reset

          if (status.status === "completed") {
            setStage("completed");
            setConclusion(status.conclusion);
            setHtmlUrl(status.htmlUrl);
            return;
          }

          setStage(status.status === "in_progress" ? "in_progress" : "queued");

          if (attemptsRef.current >= MAX_POLLS) {
            setStage("error");
            setErrorMessage("Timed out waiting for the deploy to finish — check GitHub Actions directly.");
            return;
          }

          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        } catch (err) {
          if (pollTokenRef.current !== myToken) return;
          setStage("error");
          setErrorMessage(err instanceof Error ? err.message : "Failed to check deploy status");
        }
      };

      timerRef.current = setTimeout(poll, 1500);
    },
    [stopPolling],
  );

  return useMemo(
    () => ({ stage, htmlUrl, conclusion, errorMessage, trackSave, markSaving, markError, reset }),
    [stage, htmlUrl, conclusion, errorMessage, trackSave, markSaving, markError, reset],
  );
}

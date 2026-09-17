import type { SaveStage } from "../../hooks/useDeployStatus";

interface SaveStatusIndicatorProps {
  stage: SaveStage;
  htmlUrl: string | null;
  conclusion: string | null;
  errorMessage: string | null;
}

const LABELS: Record<SaveStage, string> = {
  idle: "",
  saving: "Saving...",
  "dry-run": "Saved locally (dry run) — no real commit made in local dev.",
  queued: "Commit saved. Waiting for the build to start...",
  in_progress: "Build running...",
  completed: "Live!",
  error: "Something went wrong.",
};

export function SaveStatusIndicator({
  stage,
  htmlUrl,
  conclusion,
  errorMessage,
}: SaveStatusIndicatorProps) {
  if (stage === "idle") return null;

  const buildFailed = stage === "completed" && conclusion !== "success";
  const isError = stage === "error" || buildFailed;
  const isDone = stage === "completed" && !buildFailed;
  const showSpinner = stage === "saving" || stage === "queued" || stage === "in_progress";

  const toneClasses = isError
    ? "border-accent-2/40 bg-accent-2/10 text-accent-2"
    : isDone
      ? "border-primary/40 bg-primary/10 text-primary"
      : "border-border bg-surface-alt text-muted";

  return (
    <div role="status" className={`flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${toneClasses}`}>
      {showSpinner && (
        <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      <span>{isError && stage === "error" ? errorMessage || LABELS.error : buildFailed ? "Build failed." : LABELS[stage]}</span>
      {htmlUrl && (stage === "completed") && (
        <a href={htmlUrl} target="_blank" rel="noreferrer" className="ml-auto shrink-0 underline">
          {buildFailed ? "View failed run" : "View run"}
        </a>
      )}
    </div>
  );
}

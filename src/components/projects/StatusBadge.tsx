import type { ProjectStatus } from "../../types";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In Progress",
  archived: "Archived",
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
  live: "bg-success",
  "in-progress": "bg-accent",
  archived: "bg-archived",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text">
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLOR[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

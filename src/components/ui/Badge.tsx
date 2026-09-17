import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface-alt px-2.5 py-1 font-mono text-xs text-muted ${className}`}
      {...props}
    />
  );
}

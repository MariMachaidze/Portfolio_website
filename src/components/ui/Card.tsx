import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${className}`}
      {...props}
    />
  );
}

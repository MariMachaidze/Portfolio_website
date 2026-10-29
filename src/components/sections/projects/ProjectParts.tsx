import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Project, ProjectStatus } from "../../../types";
import "./projectParts.css";

/** Shared between the homepage cards and each project's own page. */

export const GITHUB_PROFILE = "https://github.com/MariMachaidze";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "In development",
  finished: "Completed",
  paused: "Paused",
};

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

/** A link within the site: "back" puts a ← before the text, "forward" a → after it. */
export function InternalLink({
  to,
  direction,
  children,
}: {
  to: string;
  direction: "back" | "forward";
  children: ReactNode;
}) {
  const arrow = <span aria-hidden="true">{direction === "back" ? "←" : "→"}</span>;
  return (
    <Link className={`text-link text-link-${direction}`} to={to}>
      {direction === "back" && arrow}
      {children}
      {direction === "forward" && arrow}
    </Link>
  );
}

export function Status({ value }: { value: ProjectStatus }) {
  return (
    <span className={`status ${value === "finished" ? "status-complete" : ""}`}>
      <span className="status-dot" aria-hidden="true" />
      {STATUS_LABEL[value]}
    </span>
  );
}

export function StackLine({ tech }: { tech: Project["tech"] }) {
  return (
    <div className="stack-line">
      <span>Stack</span>
      <div>
        {tech.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

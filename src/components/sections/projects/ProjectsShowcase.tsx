import { useRef, type ReactNode } from "react";
import { projects } from "../../../data/projects";
import { useReadableSvgText } from "../../../hooks/useReadableSvgText";
import { formatDateRange } from "../../../lib/dateRange";
import type { Project, ProjectStatus, ProjectVisual } from "../../../types";
import { ProjectDiagram } from "./ProjectDiagram";
import "./projectsShowcase.css";

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  "in-progress": "In development",
  finished: "Completed",
  paused: "Paused",
};

/** How many figures each project draws, so captions number on across the section. */
const FIGURE_COUNT: Record<ProjectVisual, number> = {
  sorter: 1,
  mcp: 1,
  jobs: 1,
  pointing: 2,
  trust: 1,
  duckie: 1,
};

const GITHUB_PROFILE = "https://github.com/MariMachaidze";

/** Decorative figure labels: smaller minimum, and they hide rather than overlap. */
const FIGURE_FINE_TEXT = ".sim-axis-label, .sim-hand text, .sorter-legend text, .flow-note, .discard-label";

function Status({ value }: { value: ProjectStatus }) {
  return (
    <span className={`status ${value === "finished" ? "status-complete" : ""}`}>
      <span className="status-dot" aria-hidden="true" />
      {STATUS_LABEL[value]}
    </span>
  );
}

function ProjectCard({ project, number, figure }: { project: Project; number: string; figure: number }) {
  const href = project.links.codeUrl || GITHUB_PROFILE;
  return (
    <article
      className={`project-card project-${project.visual ?? "plain"} ${project.featured ? "project-featured" : ""}`}
      id={`project-${project.slug}`}
    >
      <div className="card-index">{number}</div>
      <div className="project-copy">
        <div className="project-meta">
          {project.category && <span>{project.category}</span>}
          <span>{formatDateRange(project.startDate, project.endDate)}</span>
          <Status value={project.status} />
        </div>
        <h2>{project.title}</h2>
        <p className="description">{project.summary}</p>
        <div className="project-links">
          <ExternalLink href={href}>View repository</ExternalLink>
          {project.links.thesisUrl && <ExternalLink href={project.links.thesisUrl}>Read the thesis (PDF)</ExternalLink>}
        </div>
        <div className="stack-line">
          <span>Stack</span>
          <div>
            {project.tech.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        {project.visual === "pointing" && (
          <div className="project-metrics" aria-label="Pointing project results">
            <div>
              <strong>63.9 mm</strong>
              <span>Mean pointing error, 133 trials</span>
            </div>
            <div>
              <strong>3.10 cm</strong>
              <span>Mean navigation error, 77.8% within 5 cm</span>
            </div>
            <div>
              <strong>55.4 ms</strong>
              <span>Mean pointing latency, 98.1% under 100 ms</span>
            </div>
          </div>
        )}
      </div>
      {project.visual && <ProjectDiagram type={project.visual} figure={figure} sourceHref={href} />}
    </article>
  );
}

/** Each card's first figure number, so captions number on across the section in data order. */
const FIRST_FIGURE = projects.map((_, index) =>
  projects.slice(0, index).reduce((count, p) => count + (p.visual ? FIGURE_COUNT[p.visual] : 0), 1),
);

export function ProjectsShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  useReadableSvgText(rootRef, projects, FIGURE_FINE_TEXT);
  return (
    <div className="projects-showcase" ref={rootRef}>
      {/* component-gallery stands in for the export's <main>, which tightens the section padding. */}
      <div className="component-gallery">
        <div className="projects-section">
          <div className="components-heading">
            <div>
              <span>Recent work</span>
              <h2>Projects</h2>
            </div>
            <p>A selection of things I've built, from shipped products to in-progress experiments.</p>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                number={String(index + 1).padStart(2, "0")}
                figure={FIRST_FIGURE[index]}
              />
            ))}
          </div>
          <div className="all-repositories">
            <ExternalLink href={`${GITHUB_PROFILE}?tab=repositories`}>All repositories on GitHub</ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}

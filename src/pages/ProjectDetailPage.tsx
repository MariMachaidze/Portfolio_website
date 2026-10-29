import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ProjectMedia } from "../components/projects/ProjectMedia";
import { WriteUp } from "../components/projects/WriteUp";
import { FIGURE_FINE_TEXT, ProjectDiagram } from "../components/sections/projects/ProjectDiagram";
import {
  ExternalLink,
  GITHUB_PROFILE,
  InternalLink,
  StackLine,
  Status,
} from "../components/sections/projects/ProjectParts";
import { projects } from "../data/projects";
import { useReadableSvgText } from "../hooks/useReadableSvgText";
import { formatDateRange } from "../lib/dateRange";
import { parseWriteUp } from "../lib/writeUp";
import "../components/sections/projects/projectsShowcase.css";
import "./projectPage.css";

/**
 * A project's own page, in the same blueprint style as the homepage Projects section: the card's
 * details, its figure, the write-up (with a section menu on wide screens), then photos and video.
 * Everything comes from the project's entry in projects.json, so it's all editable in the admin panel.
 */
export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const rootRef = useRef<HTMLDivElement>(null);
  const blocks = useMemo(() => parseWriteUp(project?.description ?? ""), [project]);
  useReadableSvgText(rootRef, project, FIGURE_FINE_TEXT);

  // Arriving from a card halfway down the homepage should start at the top of this page.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    const previous = document.title;
    document.title = `${project?.title ?? "Project not found"} · Mariam Machaidze`;
    return () => {
      document.title = previous;
    };
  }, [project]);

  if (!project) {
    return (
      <div className="projects-showcase project-page">
        <div className="page-inner page-missing">
          <h1>Project not found</h1>
          <p>We couldn&apos;t find a project with that URL.</p>
          <InternalLink to="/#projects" direction="back">
            All projects
          </InternalLink>
        </div>
      </div>
    );
  }

  const href = project.links.codeUrl || GITHUB_PROFILE;
  const backTo = `/#project-${project.slug}`;
  const photos = (project.gallery ?? []).filter((image) => image.src);
  const menu = [
    ...blocks.flatMap((block) => (block.type === "h2" ? [{ id: block.id, title: block.text }] : [])),
    ...(photos.length || import.meta.env.DEV ? [{ id: "photos", title: "Photos" }] : []),
    ...(project.video ? [{ id: "video", title: "Video" }] : []),
  ];

  return (
    <div className="projects-showcase project-page" ref={rootRef}>
      <article className="page-inner">
        <Link className="page-back" to={backTo}>
          <span aria-hidden="true">←</span> All projects
        </Link>

        <header className="page-header">
          <div className="project-meta">
            {project.category && <span>{project.category}</span>}
            <span>{formatDateRange(project.startDate, project.endDate)}</span>
            <Status value={project.status} />
          </div>
          <h1>{project.title}</h1>
          <p className="page-lead">{project.summary}</p>
          <div className="project-links">
            <ExternalLink href={href}>View repository</ExternalLink>
            {project.links.thesisUrl && (
              <ExternalLink href={project.links.thesisUrl}>Read the thesis (PDF)</ExternalLink>
            )}
          </div>
          <StackLine tech={project.tech} />
        </header>

        {project.visual && (
          <div className="page-figure">
            <ProjectDiagram type={project.visual} figure={1} sourceHref={href} />
          </div>
        )}

        <div className={`page-body${menu.length > 1 ? " has-menu" : ""}`}>
          {menu.length > 1 && (
            <nav className="page-menu" aria-label="On this page">
              <span>On this page</span>
              <ol>
                {menu.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="page-main">
            {blocks.length > 0 && <WriteUp blocks={blocks} />}
            <ProjectMedia gallery={project.gallery} video={project.video} />
          </div>
        </div>

        <footer className="page-end">
          <InternalLink to={backTo} direction="back">
            All projects
          </InternalLink>
          <ExternalLink href={href}>View repository</ExternalLink>
        </footer>
      </article>
    </div>
  );
}

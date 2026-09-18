import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { StatusBadge } from "../components/projects/StatusBadge";
import { ShowcaseGrid } from "../components/showcase/ShowcaseGrid";
import { Container } from "../components/ui/Container";
import { projects } from "../data/projects";
import type { ProjectShowcase } from "../types";

const EMPTY_SHOWCASE: ProjectShowcase = { widgets: [], stickers: [] };

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold text-text">Project not found</h1>
        <p className="mt-3 text-muted">
          We couldn&apos;t find a project with that URL.
        </p>
        <Link to="/#projects" className="mt-6 inline-flex items-center gap-1.5 text-primary">
          <ArrowLeft size={16} /> Back to projects
        </Link>
      </Container>
    );
  }

  return (
    <div className="py-16">
      <Container className="max-w-4xl">
        <Link
          to="/#projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to projects
        </Link>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold text-text sm:text-4xl">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>

        <ShowcaseGrid showcase={project.showcase ?? EMPTY_SHOWCASE} />
      </Container>
    </div>
  );
}

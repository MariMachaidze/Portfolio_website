import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { GithubIcon } from "../components/icons/GithubIcon";
import { MediaGallery } from "../components/projects/MediaGallery";
import { StatusBadge } from "../components/projects/StatusBadge";
import { ShowcaseGrid } from "../components/showcase/ShowcaseGrid";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { projects } from "../data/projects";

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

        <p className="mb-8 max-w-2xl text-lg text-muted">{project.description}</p>

        <div className="mb-10 flex flex-wrap gap-4">
          {project.links.demoUrl && (
            <Button as="a" href={project.links.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} /> Live Demo
            </Button>
          )}
          {project.links.codeUrl && (
            <Button as="a" href={project.links.codeUrl} target="_blank" rel="noreferrer" variant="secondary">
              <GithubIcon size={16} /> View Code
            </Button>
          )}
        </div>

        <MediaGallery items={project.gallery} />

        {project.showcase && (project.showcase.widgets.length > 0 || project.showcase.stickers.length > 0) && (
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-text">Showcase</h2>
            <ShowcaseGrid showcase={project.showcase} />
          </div>
        )}

        <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_0.6fr]">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-text">Key Highlights</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-text">Built With</h2>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

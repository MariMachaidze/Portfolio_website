import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../types";
import { GithubIcon } from "../icons/GithubIcon";
import { ProjectCoverPlaceholder } from "../placeholders/ProjectCoverPlaceholder";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col overflow-hidden p-0">
      <Link to={`/projects/${project.slug}`} className="block">
        <ProjectCoverPlaceholder seed={project.coverSeed} title={project.title} className="h-44 w-full" />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-text">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="mb-4 flex-1 text-sm text-muted">{project.summary}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {project.links.codeUrl && (
            <a
              href={project.links.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
            >
              <GithubIcon size={16} /> Code
            </a>
          )}
          <Link
            to={`/projects/${project.slug}`}
            className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary"
          >
            Read more <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Card>
  );
}

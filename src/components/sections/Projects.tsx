import { projects } from "../../data/projects";
import { ProjectCard } from "../projects/ProjectCard";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-16 bg-surface-alt py-20">
      <Container>
        <SectionHeading
          eyebrow="Recent work"
          title="Projects"
          subtitle="A selection of things I've built, from shipped products to in-progress experiments."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}

import { experience } from "../../data/experience";
import { formatDateRange } from "../../lib/dateRange";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 py-20">
      <Container>
        <SectionHeading
          eyebrow="Where I've been"
          title="Experience"
          subtitle="A timeline of roles, teams, and the problems I've helped solve."
        />

        <div className="relative space-y-6 border-l border-border pl-8 sm:pl-10">
          {experience.map((entry) => (
            <Card key={entry.id} className="relative">
              <span className="absolute -left-[calc(2.25rem+1px)] top-8 h-3 w-3 rounded-full border-2 border-bg bg-primary sm:-left-[calc(2.75rem+1px)]" />

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-text">{entry.role}</h3>
                <span className="font-mono text-xs text-muted">
                  {formatDateRange(entry.startDate, entry.endDate)}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-primary">
                {entry.company}
                {entry.locationType ? ` · ${entry.location} (${entry.locationType})` : ` · ${entry.location}`}
              </p>

              <p className="mt-3 text-muted">{entry.summary}</p>

              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-2">
                {entry.tech.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

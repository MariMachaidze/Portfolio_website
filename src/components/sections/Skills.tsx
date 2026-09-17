import { skills } from "../../data/skills";
import { iconMap } from "../../lib/icons";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-16 bg-surface-alt py-20">
      <Container>
        <SectionHeading
          eyebrow="What I work with"
          title="Skills"
          subtitle="A snapshot of the languages, frameworks, and tools I reach for most."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((category) => {
            const Icon = iconMap[category.icon];
            return (
              <Card key={category.id}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-text">{category.title}</h3>
                {category.description && (
                  <p className="mb-3 text-sm text-muted">{category.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Badge key={item.name}>{item.name}</Badge>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

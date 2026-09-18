import { ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { profile } from "../../data/profile";
import { useGithubActivity } from "../../hooks/useGithubActivity";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const LEVEL_CLASSES = ["bg-surface-alt", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];

function levelFor(count: number, max: number): number {
  if (count === 0) return 0;
  if (max === 0) return 1;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function daysAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(`${dateStr}T00:00:00`).getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function GithubActivity() {
  const { data, loading, error } = useGithubActivity();

  const { maxCount, lastActiveDate } = useMemo(() => {
    if (!data) return { maxCount: 0, lastActiveDate: null as string | null };
    let max = 0;
    let last: string | null = null;
    for (const week of data.weeks) {
      for (const day of week.days) {
        if (day.count > max) max = day.count;
        if (day.count > 0 && (!last || day.date > last)) last = day.date;
      }
    }
    return { maxCount: max, lastActiveDate: last };
  }, [data]);

  if (loading || error || !data) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Code activity"
          title="GitHub Activity"
          subtitle={
            `${data.totalContributions.toLocaleString()} contributions in the last year` +
            (lastActiveDate ? ` — last commit ${daysAgo(lastActiveDate)}` : "")
          }
          align="center"
        />

        <div className="flex justify-center overflow-x-auto pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {data.weeks.map((week, weekIndex) =>
              week.days.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                  className={`h-2.5 w-2.5 rounded-sm ${LEVEL_CLASSES[levelFor(day.count, maxCount)]}`}
                />
              )),
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
          >
            View full profile on GitHub <ExternalLink size={14} />
          </a>
        </div>
      </Container>
    </section>
  );
}

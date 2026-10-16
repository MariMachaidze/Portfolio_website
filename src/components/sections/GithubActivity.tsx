import { ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { profile } from "../../data/profile";
import { useGithubActivity } from "../../hooks/useGithubActivity";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

// The section is always navy, so the ramp is fixed: deep blue -> teal -> aqua -> the Hero's sun
// gold. Each step is at least 1.5x brighter than the last, so levels stay apart by lightness
// as well as hue (empty days are 1.4:1 on the navy, the busiest 13.8:1).
const LEVEL_CLASSES = ["bg-[#1d3a5c]", "bg-[#2a6680]", "bg-[#3f9aa3]", "bg-[#86c9bb]", "bg-[#ffe9b0]"];

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
    // theme-navy (index.css) gives this section the Hero's navy; the id lets the navbar match it.
    <section id="github-activity" className="theme-navy bg-bg py-20">
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

        {/* Shrinks to fit instead of scrolling: each week is an equal share of the width, capped
            at the desktop size of 10px cells with 4px gaps. */}
        <div className="flex justify-center">
          <div
            className="grid w-full grid-rows-7 gap-[2px] sm:gap-1"
            style={{
              gridTemplateColumns: `repeat(${data.weeks.length}, minmax(0, 1fr))`,
              maxWidth: `${data.weeks.length * 14 - 4}px`,
            }}
          >
            {data.weeks.map((week, weekIndex) =>
              week.days.map((day) => {
                // GitHub's edge weeks (the start of the year-long window, and
                // the current/in-progress week) are often short — fewer than
                // 7 days. Placing cells by actual day-of-week (rather than
                // relying on grid-auto-flow to assume every week is a full
                // 7) keeps every row aligned to its real weekday regardless.
                const dayOfWeek = new Date(`${day.date}T00:00:00`).getDay();
                return (
                  <div
                    key={day.date}
                    style={{ gridColumn: weekIndex + 1, gridRow: dayOfWeek + 1 }}
                    title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                    className={`aspect-square w-full rounded-[2px] sm:rounded-sm ${LEVEL_CLASSES[levelFor(day.count, maxCount)]}`}
                  />
                );
              }),
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted" aria-hidden="true">
          Less
          {LEVEL_CLASSES.map((level) => (
            <span key={level} className={`h-2.5 w-2.5 rounded-sm ${level}`} />
          ))}
          More
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

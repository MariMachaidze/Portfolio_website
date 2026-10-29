import { useFigureTicker } from "./useFigureTicker";
import "./portfolioFigure.css";

/** The real save path, in order: what the admin panel does when you press Save. */
const STAGES = [
  ["edit", "Admin panel", "Password + authenticator code"],
  ["save", "Netlify Function", "Checks the content, then commits"],
  ["commit", "GitHub", "Every save is a commit"],
  ["build", "GitHub Actions", "Lint, build, deploy"],
  ["live", "Netlify", "Up in about a minute"],
] as const;

/** One step per tick: which stage the save is at, and what the admin's save indicator says. */
const TIMELINE: Array<{ stage: number; status: string }> = [
  { stage: 0, status: "Saving..." },
  { stage: 1, status: "Saving..." },
  { stage: 2, status: "Commit saved. Waiting for the build to start..." },
  { stage: 3, status: "Build running..." },
  { stage: 3, status: "Build running..." },
  { stage: 4, status: "Live!" },
  { stage: STAGES.length, status: "Live!" },
  { stage: STAGES.length, status: "Live!" },
  { stage: STAGES.length, status: "Live!" },
];
const TICK_MS = 900;
const LIVE_STAGE = STAGES.length - 1;

/** This page's own sections, top to bottom, in their real colours. */
const PAGE = [
  ["hero", "navy"],
  ["skills", "light"],
  ["experience", "navy"],
  ["projects", "light"],
  ["activity", "navy"],
  ["contact", "light"],
  ["footer", "navy"],
] as const;

/**
 * Fig. for this site itself: a save travelling from the admin panel to the live page, with the
 * page drawn as its own section stripes. Steps on a timer (like the trust figure) while it's on
 * screen; with reduced motion it shows the finished, live state.
 */
export function PortfolioFigure({ figure }: { figure: number }) {
  const { rootRef, tick } = useFigureTicker(TIMELINE.length, TICK_MS);
  const { stage, status } = TIMELINE[tick];
  const live = stage >= LIVE_STAGE;

  return (
    <div
      className={`reference-figure portfolio-figure${live ? " is-live" : ""}`}
      ref={rootRef}
      aria-label="How an edit in the admin panel reaches the live site"
    >
      <div className="diagram-caption">
        <span>Fig. {figure}</span> From an admin edit to the live site
      </div>
      <div className="portfolio-map">
        <div className="portfolio-pipeline">
          <i className="portfolio-track" aria-hidden="true">
            <i
              className={`portfolio-packet${stage >= STAGES.length ? " is-arrived" : ""}`}
              style={{ top: `${(Math.min(stage, LIVE_STAGE) / LIVE_STAGE) * 100}%` }}
            />
          </i>
          <ol className="portfolio-stages">
            {STAGES.map(([verb, title, note], index) => (
              <li
                className={`portfolio-stage${index < stage ? " is-done" : index === stage ? " is-active" : ""}`}
                key={verb}
              >
                <i className="portfolio-node" aria-hidden="true" />
                <b>{verb}</b>
                <strong>{title}</strong>
                <span>{note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="portfolio-site">
          <div className="portfolio-browser" aria-hidden="true">
            <div className="portfolio-browser-bar">
              <i />
              <i />
              <i />
            </div>
            <div className="portfolio-page">
              {PAGE.map(([name, tone]) => (
                <div className={`portfolio-band band-${tone}`} key={name}>
                  <span>{name}</span>
                  {name === "projects" && <em>you are here</em>}
                </div>
              ))}
              <i className="portfolio-reload" />
            </div>
          </div>
          <div className="portfolio-status" aria-hidden="true">
            <i>{live ? "✓" : ""}</i>
            <span>{status}</span>
          </div>
        </div>
      </div>
      <div className="portfolio-source-caption">
        Content is JSON in the repo and images sit in S3, so there's no database to run, and any save can be
        rolled back like any other commit.
      </div>
    </div>
  );
}

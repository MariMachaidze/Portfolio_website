import { useFigureTicker } from "./useFigureTicker";
import "./fleetFigure.css";

/** The assistant's lookups, in the order the workflow runs them. The values are an example run. */
const TOOLS = [
  ["telemetry", "Robot API", "Robot 2 · AMR-200 · wheel motor stalled"],
  ["search manuals", "Chroma, top 3", "AMR-200 manual · Drive faults"],
  ["check stock", "ERP via MCP", "Wheel motor: 2 in stock"],
] as const;

/** One step per tick: the question, each tool in turn, the answer, then the draft held for a person. */
const STEPS = 10;
const ANSWER_STEP = TOOLS.length + 1;
const DRAFT_STEP = ANSWER_STEP + 1;
const TICK_MS = 900;

/**
 * Fig. for the robot fleet monitor: an operator's question fans out to the three lookups, which
 * come back together as a cited answer and a draft maintenance notification that waits for a
 * person to approve it. Steps on a timer while it's on screen; with reduced motion it shows the
 * finished state.
 */
export function FleetFigure({ figure }: { figure: number }) {
  const { rootRef, tick } = useFigureTicker(STEPS, TICK_MS);
  const toolState = (index: number) => (tick > index + 1 ? " is-done" : tick === index + 1 ? " is-active" : "");

  return (
    <div
      className="reference-figure fleet-figure"
      ref={rootRef}
      aria-label="How the assistant works out why a robot stopped"
    >
      <div className="diagram-caption">
        <span>Fig. {figure}</span> Why did robot 2 stop?
      </div>
      <div className="fleet-map">
        <div className="fleet-question">
          <b>operator</b>
          <p>&ldquo;Why did robot 2 stop?&rdquo;</p>
        </div>

        <svg className="fleet-fan" viewBox="0 0 300 28" preserveAspectRatio="none" aria-hidden="true">
          <path d="M150 0V12M50 12H250M50 12V28M150 12V28M250 12V28" />
        </svg>
        <ol className="fleet-tools">
          {TOOLS.map(([verb, source, result], index) => (
            <li className={`fleet-tool${toolState(index)}`} key={verb}>
              <b>{verb}</b>
              <strong>{source}</strong>
              <span>{result}</span>
            </li>
          ))}
        </ol>
        <svg className="fleet-fan" viewBox="0 0 300 28" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 0V16M150 0V16M250 0V16M50 16H250M150 16V28" />
        </svg>

        <div className="fleet-result">
          <div className={`fleet-answer${tick >= ANSWER_STEP ? " is-shown" : ""}`}>
            <b>answer</b>
            <p>
              Most likely a stalled wheel motor <sup>[1]</sup>. A replacement is in stock.
            </p>
            <small>[1] AMR-200 manual, Drive faults</small>
          </div>
          <div className={`fleet-draft${tick >= DRAFT_STEP ? " is-shown" : ""}`}>
            <b>draft notification</b>
            <p>Robot 2: replace the wheel motor</p>
            <div className="fleet-approval">
              <span className="fleet-wait">Waiting for a person to approve</span>
              <span className="fleet-buttons" aria-hidden="true">
                <i>Approve</i>
                <i>Reject</i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="fleet-source-caption">
        Runs locally on Llama 3.2 (3B) through Ollama, so nothing leaves the laptop. The assistant only drafts; a
        person decides.
      </div>
    </div>
  );
}

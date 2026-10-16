import { useEffect, useRef, useState } from "react";
import type { ProjectVisual } from "../../../types";
import { PointingSimulation } from "./PointingSimulation";
import { PortfolioFigure } from "./PortfolioFigure";
import { clamp, type SimPoint } from "./simGeometry";

/**
 * Portrait version of the box sorter for phones: the same parts, classes and timing as the wide
 * drawing, rearranged into a column so its labels stay readable at phone width. The CSS gives it
 * its own travel distances (see .sorter-phone in projectsShowcase.css).
 */
function SorterPhone() {
  const boxes: Array<["good" | "bad", number]> = [
    ["good", 0],
    ["good", 1],
    ["bad", 2],
    ["good", 3],
    ["bad", 4],
  ];
  return (
    <svg
      className="sorter-system sorter-phone"
      viewBox="0 0 400 724"
      role="img"
      aria-label="ESP32 vision-language box sorter architecture"
    >
      <defs>
        <marker id="prj-arrow-ink-phone" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0L8 4L0 8" className="arrow-ink" />
        </marker>
        <marker id="prj-arrow-accent-phone" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0L8 4L0 8" className="arrow-accent" />
        </marker>
      </defs>

      <path className="flow-line" markerEnd="url(#prj-arrow-ink-phone)" d="M125 160V118" />
      <text className="sorter-label" x="135" y="143">
        MJPEG over WiFi
      </text>
      <path className="signal-line" markerEnd="url(#prj-arrow-accent-phone)" d="M360 68H388V520H200V536" />
      <text className="sorter-label" x="200" y="510" textAnchor="middle">
        HTTP /punch + delay
      </text>

      <g className="system-node">
        <rect x="40" y="20" width="320" height="96" rx="16" />
        <text className="node-title" x="200" y="50">
          Laptop
        </text>
        <text x="200" y="78">
          CLIP ViT-B/32 on CPU
        </text>
        <text x="200" y="102">
          Text prompts: good / bad
        </text>
      </g>

      <g className="system-node">
        <rect x="40" y="160" width="170" height="64" rx="14" />
        <text className="node-title" x="125" y="200">
          ESP32-CAM
        </text>
      </g>
      <path className="camera-cone" d="M125 224L80 300H170Z" />
      {[0, 1, 2, 3, 4].map((slot) => (
        <path className={`camera-flash slot-${slot}`} d="M125 224L80 300H170Z" key={`flash-${slot}`} />
      ))}
      {[0, 1, 2, 3, 4].map((slot) => (
        <circle className={`wifi-dot slot-${slot}`} cx="0" cy="0" r="5" key={`wifi-${slot}`} />
      ))}

      <g className="system-node dashed-node">
        <rect x="230" y="160" width="140" height="64" rx="14" />
        <text className="node-title" x="300" y="200">
          Reject bin
        </text>
      </g>

      <g className="conveyor">
        <rect x="10" y="300" width="360" height="72" rx="36" />
        <g className="belt-chevrons">
          <path d="M40 324L53 336L40 348M100 324L113 336L100 348M160 324L173 336L160 348M220 324L233 336L220 348M280 324L293 336L280 348M340 324L353 336L340 348" />
        </g>
      </g>

      {boxes.map(([quality, slot]) => (
        <g className={`moving-box moving-box-${quality} slot-${slot}`} key={`box-${slot}`}>
          <rect className={`${quality}-box`} x="28" y="314" width="44" height="44" rx="7" />
          {quality === "bad" && <path className="box-crack" d="M45 322L57 333L49 341L58 352" />}
        </g>
      ))}

      {boxes.map(([quality, slot]) => (
        <g className={`classification-badge badge-${quality} slot-${slot}`} key={`badge-${slot}`}>
          <rect x="278" y="32" width="70" height="30" rx="13" />
          <text x="313" y="47" dominantBaseline="central">
            {quality === "good" ? "GOOD" : "BAD"}
          </text>
        </g>
      ))}

      <path className="signal-line" markerEnd="url(#prj-arrow-accent-phone)" d="M300 296V230" />
      <g className="servo-arm">
        <rect x="276" y="382" width="48" height="30" rx="13" />
        <path d="M300 382V372" />
      </g>
      {[2, 4].map((slot) => (
        <g className={`punch-glove slot-${slot}`} key={`glove-${slot}`}>
          <rect x="276" y="382" width="48" height="30" rx="13" />
          <path d="M300 382V372" />
        </g>
      ))}

      <path className="flow-line" d="M60 372V430" />
      <g className="system-node">
        <rect x="20" y="430" width="160" height="60" rx="13" />
        <text className="node-title" x="100" y="468">
          Belt servo
        </text>
      </g>

      <path className="flow-line" d="M300 412V430" />
      <g className="system-node">
        <rect x="220" y="430" width="160" height="60" rx="13" />
        <text className="node-title" x="300" y="468">
          Glove servo
        </text>
      </g>

      <g className="system-node">
        <rect x="80" y="540" width="240" height="72" rx="14" />
        <text className="node-title" x="200" y="570">
          ESP32 #2
        </text>
        <text x="200" y="596">
          HTTP server, servos
        </text>
      </g>
      <path className="flow-line" markerEnd="url(#prj-arrow-ink-phone)" d="M80 576H60V496" />
      <path className="belt-power-pulse" d="M80 576H60V496" />
      <path className="flow-line" markerEnd="url(#prj-arrow-ink-phone)" d="M320 576H340V496" />
      {[2, 4].map((slot) => (
        <g key={`reject-pulse-${slot}`}>
          <path className={`reject-path-pulse slot-${slot}`} d="M360 68H388V520H200V536" />
          <path className={`servo-path-pulse slot-${slot}`} d="M320 576H340V496" />
        </g>
      ))}

      <g className="sorter-legend">
        <rect className="good-box" x="20" y="642" width="18" height="14" rx="3" />
        <text x="48" y="654">
          Good box
        </text>
        <rect className="bad-box" x="200" y="642" width="18" height="14" rx="3" />
        <text x="228" y="654">
          Bad box
        </text>
        <path className="signal-line" d="M20 677H60" />
        <text x="70" y="682">
          Reject signal path
        </text>
        <text x="20" y="710">
          Servos on separate 5V
        </text>
      </g>
    </svg>
  );
}

export function ProjectDiagram({
  type,
  figure,
  sourceHref,
}: {
  type: ProjectVisual;
  /** Number of this project's first figure; the pointing project draws two. */
  figure: number;
  sourceHref: string;
}) {
  const [trustElapsed, setTrustElapsed] = useState(0);
  const trustElapsedRef = useRef(0);
  const trustReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (type !== "trust" || trustReduced) return;
    const started = performance.now() - trustElapsedRef.current;
    let frame = 0;
    const update = (now: number) => {
      const elapsed = (now - started) % 12000;
      trustElapsedRef.current = elapsed;
      setTrustElapsed(elapsed);
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [trustReduced, type]);

  const exactTimer = trustReduced
    ? 203
    : trustElapsed < 4000
      ? 0
      : trustElapsed < 5500
        ? Math.round(((trustElapsed - 4000) / 1500) * 203)
        : 203;
  const noisyTimer = trustReduced
    ? 247
    : trustElapsed < 10000
      ? 0
      : trustElapsed < 11500
        ? Math.round(((trustElapsed - 10000) / 1500) * 247)
        : 247;

  const trustSeconds = trustReduced ? 0 : trustElapsed / 1000;
  const armWaypoints: Array<[number, SimPoint]> = [
    [0, { x: 420, y: 180 }],
    [0.5, { x: 420, y: 170 }],
    [1, { x: 420, y: 160 }],
    [1.5, { x: 442, y: 160 }],
    [2, { x: 465, y: 185 }],
    [2.35, { x: 465, y: 203 }],
    [2.65, { x: 465, y: 203 }],
    [3, { x: 465, y: 175 }],
    [3.5, { x: 505, y: 175 }],
    [3.85, { x: 505, y: 203 }],
    [4.1, { x: 505, y: 203 }],
    [5.5, { x: 420, y: 180 }],
    [6, { x: 420, y: 170 }],
    [6.5, { x: 420, y: 160 }],
    [7, { x: 442, y: 176 }],
    [7.5, { x: 465, y: 185 }],
    [8, { x: 450, y: 192 }],
    [8.4, { x: 465, y: 185 }],
    [8.7, { x: 465, y: 203 }],
    [9, { x: 465, y: 203 }],
    [9.3, { x: 465, y: 175 }],
    [9.65, { x: 505, y: 175 }],
    [9.9, { x: 505, y: 203 }],
    [10.1, { x: 505, y: 203 }],
    [11.5, { x: 420, y: 180 }],
    [12, { x: 420, y: 180 }],
  ];
  let armTarget = armWaypoints[0][1];
  for (let index = 0; index < armWaypoints.length - 1; index += 1) {
    const [fromTime, from] = armWaypoints[index];
    const [toTime, to] = armWaypoints[index + 1];
    if (trustSeconds >= fromTime && trustSeconds <= toTime) {
      const linear = (trustSeconds - fromTime) / (toTime - fromTime);
      const eased = linear * linear * (3 - 2 * linear);
      armTarget = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      };
      break;
    }
  }
  const armBase = { x: 281, y: 236 };
  const upperLength = 120;
  const lowerLength = 115;
  const armDx = armTarget.x - armBase.x;
  const armDy = armTarget.y - armBase.y;
  const armDistance = clamp(Math.hypot(armDx, armDy), 1, upperLength + lowerLength);
  const along = (upperLength * upperLength - lowerLength * lowerLength + armDistance * armDistance) / (2 * armDistance);
  const height = Math.sqrt(Math.max(0, upperLength * upperLength - along * along));
  const elbow = {
    x: armBase.x + (along * armDx) / armDistance + (height * armDy) / armDistance,
    y: armBase.y + (along * armDy) / armDistance - (height * armDx) / armDistance,
  };
  const gripAmount =
    (trustSeconds >= 2.2 && trustSeconds <= 3.85) || (trustSeconds >= 8.55 && trustSeconds <= 9.9) ? 1 : 0;
  let trustBlock = { x: 454, y: 251, opacity: 1 };
  if (trustSeconds >= 2.35 && trustSeconds < 4.25) {
    trustBlock = {
      x: armTarget.x - 11,
      y: armTarget.y + 48,
      opacity: trustSeconds > 4.05 ? 0 : 1,
    };
  } else if (trustSeconds >= 4.25 && trustSeconds < 5.5) {
    trustBlock.opacity = 0;
  } else if (trustSeconds >= 8.7 && trustSeconds < 10.25) {
    trustBlock = {
      x: armTarget.x - 11,
      y: armTarget.y + 48,
      opacity: trustSeconds > 10.05 ? 0 : 1,
    };
  } else if (trustSeconds >= 10.25 && trustSeconds < 11.5) {
    trustBlock.opacity = 0;
  }

  if (type === "sorter") {
    return (
      <div className="diagram sorter-image" aria-label="ESP32 vision-language box sorter architecture">
        <div className="diagram-caption">
          <span>Fig. {figure}</span> Vision-language sorting architecture
        </div>
        <svg
          className="sorter-system"
          viewBox="0 0 900 650"
          role="img"
          aria-labelledby="sorter-title sorter-description"
        >
          <title id="sorter-title">ESP32 vision-language box sorter architecture</title>
          <desc id="sorter-description">
            An ESP32-CAM streams video to a laptop running CLIP. The laptop sends decisions to a second ESP32 that
            controls the conveyor belt and reject gate servos.
          </desc>
          <defs>
            <marker id="prj-arrow-ink" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8" className="arrow-ink" />
            </marker>
            <marker id="prj-arrow-accent" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0L8 4L0 8" className="arrow-accent" />
            </marker>
          </defs>

          <path className="flow-line" markerEnd="url(#prj-arrow-ink)" d="M220 164V72H430" />
          <text className="sorter-label" x="248" y="113">
            MJPEG over WiFi
          </text>
          <path className="signal-line" markerEnd="url(#prj-arrow-accent)" d="M730 72H850V585H410V545" />
          <text className="sorter-label" x="548" y="615">
            HTTP /punch + delay
          </text>

          <g className="system-node">
            <rect x="430" y="24" width="300" height="100" rx="16" />
            <text className="node-title" x="580" y="60">
              Laptop
            </text>
            <text x="580" y="88">
              CLIP ViT-B/32 on CPU
            </text>
            <text x="580" y="110">
              Text prompts: good / bad
            </text>
          </g>

          <g className="system-node">
            <rect x="120" y="164" width="200" height="76" rx="14" />
            <text className="node-title" x="220" y="210">
              ESP32-CAM
            </text>
          </g>
          <path className="camera-cone" d="M220 240L162 320H278Z" />
          {[0, 1, 2, 3, 4].map((slot) => (
            <path className={`camera-flash slot-${slot}`} d="M220 240L162 320H278Z" key={`flash-${slot}`} />
          ))}
          {[0, 1, 2, 3, 4].map((slot) => (
            <circle className={`wifi-dot slot-${slot}`} cx="0" cy="0" r="5" key={`wifi-${slot}`} />
          ))}

          <g className="system-node dashed-node">
            <rect x="630" y="162" width="170" height="76" rx="14" />
            <text className="node-title" x="715" y="207">
              Reject bin
            </text>
          </g>

          <g className="conveyor">
            <rect x="48" y="322" width="804" height="92" rx="46" />
            <g className="belt-chevrons">
              <path d="M84 354L101 368L84 382M178 354L195 368L178 382M272 354L289 368L272 382M366 354L383 368L366 382M460 354L477 368L460 382M554 354L571 368L554 382M648 354L665 368L648 382M742 354L759 368L742 382M836 354L853 368L836 382" />
            </g>
          </g>

          {[
            ["good", 0],
            ["good", 1],
            ["bad", 2],
            ["good", 3],
            ["bad", 4],
          ].map(([quality, slot]) => (
            <g className={`moving-box moving-box-${quality} slot-${slot}`} key={`box-${slot}`}>
              <rect className={`${quality}-box`} x="68" y="340" width="58" height="56" rx="8" />
              {quality === "bad" && <path className="box-crack" d="M91 350L106 365L96 376L108 390" />}
            </g>
          ))}

          {[
            ["good", 0],
            ["good", 1],
            ["bad", 2],
            ["good", 3],
            ["bad", 4],
          ].map(([quality, slot]) => (
            <g className={`classification-badge badge-${quality} slot-${slot}`} key={`badge-${slot}`}>
              <rect x="638" y="35.5" width="70" height="30" rx="13" />
              <text x="673" y="50.5" dominantBaseline="central">
                {quality === "good" ? "GOOD" : "BAD"}
              </text>
            </g>
          ))}

          <path className="signal-line" markerEnd="url(#prj-arrow-accent)" d="M675 334V246" />
          <g className="servo-arm">
            <rect x="651" y="424" width="48" height="30" rx="13" />
            <path d="M675 424V414" />
          </g>
          {[2, 4].map((slot) => (
            <g className={`punch-glove slot-${slot}`} key={`glove-${slot}`}>
              <rect x="651" y="424" width="48" height="30" rx="13" />
              <path d="M675 424V414" />
            </g>
          ))}

          <path className="flow-line" d="M95 414V448" />
          <g className="system-node">
            <rect x="48" y="448" width="155" height="66" rx="13" />
            <text className="node-title" x="125" y="488">
              Belt servo
            </text>
          </g>

          <path className="flow-line" d="M675 454V478" />
          <g className="system-node">
            <rect x="600" y="478" width="155" height="66" rx="13" />
            <text className="node-title" x="677" y="518">
              Glove servo
            </text>
          </g>

          <g className="system-node">
            <rect x="315" y="536" width="230" height="78" rx="14" />
            <text className="node-title" x="430" y="570">
              ESP32 #2
            </text>
            <text x="430" y="596">
              HTTP server, servos
            </text>
          </g>
          <path className="flow-line" markerEnd="url(#prj-arrow-ink)" d="M315 574H125V520" />
          <path className="belt-power-pulse" d="M315 574H125V520" />
          <path className="flow-line" markerEnd="url(#prj-arrow-ink)" d="M545 574H677V550" />
          {[2, 4].map((slot) => (
            <g key={`reject-pulse-${slot}`}>
              <path className={`reject-path-pulse slot-${slot}`} d="M730 72H850V585H410V545" />
              <path className={`servo-path-pulse slot-${slot}`} d="M545 574H677V550" />
            </g>
          ))}

          <g className="sorter-legend">
            <rect className="good-box" x="48" y="630" width="18" height="14" rx="3" />
            <text x="76" y="642">
              Good box
            </text>
            <rect className="bad-box" x="174" y="630" width="18" height="14" rx="3" />
            <text x="202" y="642">
              Bad box
            </text>
            <path className="signal-line" d="M292 637H337" />
            <text x="348" y="642">
              Reject signal path
            </text>
            <text x="570" y="642">
              Servos on separate 5V
            </text>
          </g>
        </svg>
        <SorterPhone />
      </div>
    );
  }

  if (type === "portfolio") return <PortfolioFigure figure={figure} />;

  if (type === "pointing") {
    return (
      <div className="pointing-figures">
        <PointingSimulation figure={figure} sourceHref={sourceHref} />
        <div className="diagram pipeline-diagram" aria-label="Camera frame to robot motion pipeline">
          <div className="diagram-caption">
            <span>Fig. {figure + 1}</span> From camera frame to robot motion
          </div>
          <div className="pipeline-steps">
            {[
              ["01", "RGB-D frames", "RealSense D435i, depth aligned to colour"],
              ["02", "Hand landmarks", "MediaPipe, 21 points per hand"],
              ["03", "Finger ray", "3D joints from depth"],
              ["04", "Ray meets plane", "Fitted workspace plane"],
              ["05", "Target", "x and y in millimetres"],
              ["06", "Closed loop", "Track until arrival"],
            ].map(([number, title, note]) => (
              <div className="pipeline-step" key={number}>
                <span>{number}</span>
                <strong>{title}</strong>
                <small>{note}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "mcp") {
    return (
      <div className="reference-figure mcp-simple-figure" aria-label="Robo-mcp verified lookup architecture">
        <div className="diagram-caption">
          <span>Fig. {figure}</span> Where the facts come from
        </div>
        <div className="mcp-simple-map">
          <div className="mcp-simple-client">
            <strong>Your LLM client</strong>
            <span>Claude Desktop or any MCP host. The reasoning happens here.</span>
          </div>

          <div className="mcp-simple-connection" aria-hidden="true">
            <span>MCP</span>
            <svg className="mcp-connector" viewBox="0 0 100 30">
              <path d="M8 15H92M8 15l8-7M8 15l8 7M92 15l-8-7M92 15l-8 7" />
            </svg>
            <i className="mcp-dot mcp-dot-out" />
            <i className="mcp-dot mcp-dot-back" />
          </div>

          <div className="mcp-simple-server">
            <strong>robo-mcp</strong>
            <div className="mcp-action mcp-action-lookup">
              <i className="mcp-row-highlight" />
              <b>look up</b>
              <span>3 boards, 12 components</span>
            </div>
            <div className="mcp-action mcp-action-check">
              <i className="mcp-row-highlight" />
              <b>check</b>
              <span>compatibility rules</span>
              <i className="mcp-checkmark" aria-hidden="true">
                ✓
              </i>
            </div>
            <div className="mcp-action mcp-action-render">
              <i className="mcp-row-highlight" />
              <b>render</b>
              <span>wiring and pinout diagrams</span>
              <svg className="mcp-wire-icon" viewBox="0 0 28 18" aria-hidden="true">
                <path d="M1 9h4l3-5l4 10l4-10l4 10l3-5h4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mcp-source-caption">
          Data cross-checked against <span className="source-fritzing">Fritzing</span>,{" "}
          <span className="source-kicad">KiCad</span>, <span className="source-platformio">PlatformIO</span> and{" "}
          <span className="source-datasheets">datasheets</span>. No API keys; works offline.
        </div>
      </div>
    );
  }

  if (type === "jobs") {
    return (
      <div className="reference-figure jobs-figure" aria-label="Smart job search agent loop">
        <div className="diagram-caption">
          <span>Fig. {figure}</span> The loop it runs
        </div>
        <div className="agent-loop">
          <div className="loop-ring" aria-hidden="true">
            <svg className="loop-direction" viewBox="0 0 200 200">
              <defs>
                <marker id="prj-loop-arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0 0L6 3L0 6" />
                </marker>
              </defs>
              <circle className="loop-circle" cx="100" cy="100" r="98" />
              <path
                className="loop-arrow-track"
                markerEnd="url(#prj-loop-arrowhead)"
                d="M125 5A98 98 0 0 1 149 15M195 75A98 98 0 0 1 198 100M169 169A98 98 0 0 1 149 185M75 195A98 98 0 0 1 51 185M5 125A98 98 0 0 1 2 100M31 31A98 98 0 0 1 51 15"
              />
            </svg>
          </div>
          <div className="loop-center">
            <strong>LangGraph</strong>
            <span>Gemini 2.5 Flash</span>
          </div>
          {[
            ["discover", "ATS APIs + Playwright"],
            ["filter", "before any LLM call"],
            ["score", "against your profile"],
            ["tailor", "CV + cover letter"],
            ["track", "full status history"],
            ["learn", "updates the scoring"],
          ].map(([title, note], index) => (
            <div className={`loop-node loop-node-${index + 1}`} key={title}>
              <strong>{title}</strong>
              <span>{note}</span>
              {title === "score" && (
                <i className="score-equation" aria-hidden="true">
                  s = w·x + b
                </i>
              )}
              {title === "learn" && (
                <svg className="learn-neuron" viewBox="0 0 34 20" aria-hidden="true">
                  <path d="M4 4L17 10L4 16M17 10L30 4M17 10L30 16" />
                  <circle cx="4" cy="4" r="2" />
                  <circle cx="4" cy="16" r="2" />
                  <circle cx="17" cy="10" r="2" />
                  <circle cx="30" cy="4" r="2" />
                  <circle cx="30" cy="16" r="2" />
                </svg>
              )}
            </div>
          ))}
          <div className="loop-node-dots" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <i className={`loop-node-dot loop-node-dot-${index + 1}`} key={index} />
            ))}
          </div>
          <div className="loop-particles" aria-hidden="true">
            <i className="loop-main-dot" />
            <i className="loop-extra-dot loop-extra-dot-1" />
            <i className="loop-extra-dot loop-extra-dot-2" />
            <i className="loop-extra-dot loop-extra-dot-3" />
          </div>
          <div className="loop-documents" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="track-status" aria-hidden="true">
            <span className="status-applied">applied</span>
            <span className="status-interview">interview</span>
          </div>
        </div>
        <div className="jobs-source-caption">
          Runs on a schedule. Jobs are filtered before any LLM call; Gemini is only used to score and tailor.
        </div>
      </div>
    );
  }

  if (type === "trust") {
    // The drawing is split into parts so the phone layout can rearrange the same (animated) pieces.
    const trustKeys = (
      <>
        <g className="trust-keys">
          {[
            ["Q", 35, 35, "neutral"],
            ["W", 82, 35, "exact"],
            ["A", 35, 82, "exact"],
            ["S", 82, 82, "exact"],
            ["D", 129, 82, "exact"],
            ["C", 105, 129, "noisy"],
          ].map(([label, x, y, tone]) => (
            <g className={`key-${tone} trust-key key-${String(label).toLowerCase()}`} key={label}>
              <rect x={x} y={y} width="38" height="38" rx="7" />
              <text x={Number(x) + 19} y={Number(y) + 25}>
                {label}
              </text>
            </g>
          ))}
        </g>
        <text className="trust-heading" x="84" y="205">
          Keyboard teleop
        </text>
        <text className="trust-copy" x="84" y="225">
          WASD move 3 cm
        </text>
        <text className="trust-copy" x="84" y="243">
          C pick, Q quit
        </text>
      </>
    );
    const trustArm = (
      <>
        <g className="robot-arm">
          <rect className="arm-base" x="250" y="236" width="62" height="34" rx="6" />
          <path className="arm-segment" d={`M${armBase.x} ${armBase.y}L${elbow.x} ${elbow.y}`} />
          <path className="arm-segment" d={`M${elbow.x} ${elbow.y}L${armTarget.x} ${armTarget.y}`} />
          <circle className="base-joint" cx={armBase.x} cy={armBase.y} r="11" />
          <circle cx={elbow.x} cy={elbow.y} r="11" />
          <circle cx={armTarget.x} cy={armTarget.y} r="11" />
          <g className="attached-gripper" transform={`translate(${armTarget.x} ${armTarget.y})`}>
            <path className="gripper-stem" d="M0 11V23" />
            <rect x="-14" y="18" width="28" height="8" rx="3" />
            <path className="gripper-finger" d={`M${-9 + gripAmount * 4} 25V49`} />
            <path className="gripper-finger" d={`M${9 - gripAmount * 4} 25V49`} />
          </g>
          <path className="table-line" d="M220 280H490" />
          <rect className="study-box noisy-box" x="360" y="251" width="22" height="22" rx="4" />
          <rect className="study-box noisy-box" x="397" y="251" width="22" height="22" rx="4" />
          <rect
            className="study-box noisy-box pick-block"
            x={trustBlock.x}
            y={trustBlock.y}
            width="22"
            height="22"
            rx="4"
            opacity={trustBlock.opacity}
          />
          <rect className="discard-tray" x="495" y="246" width="25" height="29" rx="3" />
          <text className="discard-label" x="503" y="239">
            Discard
          </text>
          <text className="gripper-question" x="480" y="210">
            ?
          </text>
        </g>
        <text className="trust-heading" x="355" y="303">
          Franka Panda arm
        </text>
        <text className="trust-copy" x="355" y="321">
          ROS, MoveIt, RViz
        </text>
      </>
    );
    const trustGrid = (
      <>
        <g className="trust-grid">
          <text className="trust-heading" x="556" y="30">
            Top view
          </text>
          <rect x="500" y="44" width="112" height="96" rx="3" />
          {Array.from({ length: 8 }, (_, index) => (
            <line x1={500 + index * 16} x2={500 + index * 16} y1="44" y2="140" key={`gx-${index}`} />
          ))}
          {Array.from({ length: 7 }, (_, index) => (
            <line x1="500" x2="612" y1={44 + index * 16} y2={44 + index * 16} key={`gy-${index}`} />
          ))}
          <circle className="home-dot" cx="516" cy="124" r="3" />
          <path className="exact-path" d="M516 124V92H564V76H596" />
          <path className="noisy-path" d="M516 124V92H548L564 76H596" />
        </g>
      </>
    );
    const trustResults = (
      <>
        {/* Cards are a little wider than the export's, and the noisy result takes two lines, so the
    text still fits once useReadableSvgText enlarges it to the 11px minimum. */}
        <g className="trust-results">
          <g className="exact-result-card">
            <rect className="result-exact" x="526" y="166" width="100" height="50" rx="7" />
            <text className="result-title" x="533" y="188">
              Group B exact
            </text>
            <text x="533" y="205">
              {exactTimer} s average
            </text>
          </g>
          <g className="noisy-result-card">
            <rect className="result-noisy" x="526" y="224" width="100" height="64" rx="7" />
            <text className="result-title" x="533" y="246">
              Group A noisy
            </text>
            <text x="533" y="263">
              {noisyTimer} s
            </text>
            <text x="533" y="279">
              lower trust
            </text>
          </g>
        </g>
      </>
    );

    return (
      <div
        className="reference-figure trust-figure"
        aria-label="Human-robot interaction predictability and trust study"
      >
        <div className="diagram-caption">
          <span>Fig. {figure}</span> Predictability and trust study
        </div>
        <svg className="trust-blueprint trust-wide" viewBox="0 0 640 330" role="img">
          {trustKeys}
          <path className="trust-arrow" d="M166 113H218m-10-7l10 7l-10 7" />
          {trustArm}
          {trustGrid}
          {trustResults}
        </svg>
        {/* Phone layout: keys and top view side by side, the arm below, and the results in a wide row. */}
        <svg className="trust-blueprint trust-phone" viewBox="0 0 340 580" role="img">
          {trustKeys}
          <g transform="translate(-300 0)">{trustGrid}</g>
          <g transform="translate(-200 140)">{trustArm}</g>
          <g className="trust-results">
            <g className="exact-result-card">
              <rect className="result-exact" x="10" y="486" width="155" height="76" rx="7" />
              <text className="result-title" x="20" y="510">
                Group B exact
              </text>
              <text x="20" y="532">
                {exactTimer} s average
              </text>
            </g>
            <g className="noisy-result-card">
              <rect className="result-noisy" x="175" y="486" width="155" height="76" rx="7" />
              <text className="result-title" x="185" y="510">
                Group A noisy
              </text>
              <text x="185" y="532">
                {noisyTimer} s
              </text>
              <text x="185" y="552">
                lower trust
              </text>
            </g>
          </g>
        </svg>
        <div className="trust-footer">
          <span>Exact steps were faster and earned more trust than noisy diagonal motion.</span>
        </div>
      </div>
    );
  }

  if (type === "duckie") {
    // The road scene is shared; the phone layout crops it to where the action happens, with larger
    // tags and the three states stacked underneath.
    const duckRoad = (
      <>
        <rect className="duckie-verge" x="20" y="24" width="600" height="44" rx="8" />
        <rect className="duckie-road" x="20" y="68" width="600" height="160" />
        <rect className="duckie-verge" x="20" y="228" width="600" height="44" rx="8" />
        <path className="road-edge" d="M20 78H620M20 218H620" />
        <path className="lane-dashes" d="M20 148H620" />

        <g className="duckiebot" transform="translate(126 165)">
          <rect className="bot-wheel" x="-26" y="-30" width="17" height="60" rx="4" />
          <rect className="bot-wheel" x="9" y="-30" width="17" height="60" rx="4" />
          <rect className="bot-body" x="-36" y="-25" width="64" height="50" rx="9" />
          <rect className="bot-panel" x="-28" y="-17" width="42" height="34" rx="5" />
          <g className="rubber-duck bot-rubber-duck" transform="translate(-4 1) scale(.68)">
            <path
              className="rubber-duck-body"
              d="M-25 6C-24-2-17-8-7-8C0-7 4-3 10 0C16 3 21 0 25-4C29 1 29 9 25 14C20 21 8 23-6 22C-19 22-26 17-25 6Z"
            />
            <circle className="rubber-duck-head" cx="8" cy="-10" r="12" />
            <path className="rubber-duck-wing" d="M-17 7C-12 1-2 0 5 7C0 14-10 17-17 7Z" />
            <path className="rubber-duck-beak" d="M18-12C24-11 28-8 31-5C27-2 23-1 17-3Z" />
            <circle className="rubber-duck-eye" cx="11" cy="-13" r="2.2" />
            <circle className="rubber-duck-eye-glint" cx="11.7" cy="-13.8" r=".65" />
          </g>
          <circle className="bot-camera" cx="34" cy="0" r="5" />
        </g>

        <path className="vision-cone" d="M165 165L354 127V203Z" />
        <path className="vision-outline" d="M165 165L354 127M165 165L354 203" />

        <g className="crossing-duck" transform="translate(300 165)">
          <g className="rubber-duck" transform="scale(.7)">
            <path
              className="rubber-duck-body"
              d="M-25 6C-24-2-17-8-7-8C0-7 4-3 10 0C16 3 21 0 25-4C29 1 29 9 25 14C20 21 8 23-6 22C-19 22-26 17-25 6Z"
            />
            <circle className="rubber-duck-head" cx="8" cy="-10" r="12" />
            <path className="rubber-duck-wing" d="M-17 7C-12 1-2 0 5 7C0 14-10 17-17 7Z" />
            <path className="rubber-duck-beak" d="M18-12C24-11 28-8 31-5C27-2 23-1 17-3Z" />
            <circle className="rubber-duck-eye" cx="11" cy="-13" r="2.2" />
            <circle className="rubber-duck-eye-glint" cx="11.7" cy="-13.8" r=".65" />
          </g>
        </g>
        <rect className="detection-box" x="276" y="130" width="50" height="72" rx="4" />
      </>
    );

    return (
      <div className="reference-figure duckie-figure" aria-label="DuckieTown autonomous vehicle obstacle detection">
        <div className="diagram-caption">
          <span>Fig. {figure}</span> Detect, stop, resume
        </div>
        <svg className="duckie-blueprint duckie-wide" viewBox="0 0 640 330" role="img">
          {duckRoad}
          <g className="stopped-tag">
            <rect x="82" y="93" width="72" height="28" rx="14" />
            <text x="118" y="112">
              Stopped
            </text>
          </g>
          <g className="crossing-tag">
            <rect x="329" y="132" width="94" height="28" rx="5" />
            <text x="376" y="151">
              Duck crossing
            </text>
          </g>
          <g className="duckie-flow">
            <g className="flow-state flow-driving">
              <rect className="flow-safe" x="45" y="282" width="150" height="42" rx="7" />
              <text x="120" y="299">
                Driving
              </text>
              <text className="flow-note" x="120" y="315">
                Lane following
              </text>
            </g>
            <path d="M201 303H224m-7-6l7 6l-7 6" />
            <g className="flow-state flow-detected">
              <rect className="flow-stop" x="230" y="282" width="180" height="42" rx="7" />
              <text x="320" y="299">
                Duck in view
              </text>
              <text className="flow-note" x="320" y="315">
                Brake and wait
              </text>
            </g>
            <path d="M416 303H439m-7-6l7 6l-7 6" />
            <g className="flow-state flow-clear">
              <rect className="flow-safe" x="445" y="282" width="150" height="42" rx="7" />
              <text x="520" y="299">
                Path clear
              </text>
              <text className="flow-note" x="520" y="315">
                Resume driving
              </text>
            </g>
          </g>
        </svg>
        <svg className="duckie-blueprint duckie-phone" viewBox="50 20 400 470" role="img">
          {duckRoad}
          <g className="stopped-tag">
            <rect x="70" y="86" width="96" height="36" rx="18" />
            <text x="118" y="109">
              Stopped
            </text>
          </g>
          <g className="crossing-tag">
            <rect x="318" y="128" width="128" height="36" rx="6" />
            <text x="382" y="151">
              Duck crossing
            </text>
          </g>
          <g className="duckie-flow">
            <g className="flow-state flow-driving">
              <rect className="flow-safe" x="70" y="292" width="360" height="52" rx="7" />
              <text x="250" y="314">
                Driving
              </text>
              <text className="flow-note" x="250" y="334">
                Lane following
              </text>
            </g>
            <path d="M250 346v12m-5-5l5 5l5-5" />
            <g className="flow-state flow-detected">
              <rect className="flow-stop" x="70" y="362" width="360" height="52" rx="7" />
              <text x="250" y="384">
                Duck in view
              </text>
              <text className="flow-note" x="250" y="404">
                Brake and wait
              </text>
            </g>
            <path d="M250 416v12m-5-5l5 5l5-5" />
            <g className="flow-state flow-clear">
              <rect className="flow-safe" x="70" y="432" width="360" height="52" rx="7" />
              <text x="250" y="454">
                Path clear
              </text>
              <text className="flow-note" x="250" y="474">
                Resume driving
              </text>
            </g>
          </g>
        </svg>
        <div className="duckie-footer">
          <span>Camera detection slows the Duckiebot, waits for a clear lane, then resumes the route.</span>
        </div>
      </div>
    );
  }

  return null;
}

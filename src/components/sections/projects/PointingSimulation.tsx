import { useCallback, useEffect, useRef, useState } from "react";
import { clamp, type SimPoint } from "./simGeometry";

type SimTrip = {
  target: SimPoint;
  estimate: SimPoint;
  endpoint: SimPoint;
  start: SimPoint;
  control: SimPoint;
  path: string;
  duration: number;
  source: "auto demo" | "you pointed";
  pointingError: number;
  navigationError: number;
};

const TABLE = { x: 55, y: 45, width: 850, height: 600 };
const HAND = { x: 480, y: 705 };

function simToSvg(point: SimPoint) {
  return { x: TABLE.x + point.x, y: TABLE.y + point.y };
}

function distance(a: SimPoint, b: SimPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function noisyPoint(point: SimPoint, mean: number, spread: number) {
  const angle = Math.random() * Math.PI * 2;
  const radius = mean - spread / 2 + Math.random() * spread;
  return {
    x: clamp(point.x + Math.cos(angle) * radius, 0, TABLE.width),
    y: clamp(point.y + Math.sin(angle) * radius, 0, TABLE.height),
  };
}

function curveFor(start: SimPoint, end: SimPoint) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const bend = Math.min(90, length * 0.2);
  const control = {
    x: clamp((start.x + end.x) / 2 - (dy / length) * bend, 0, TABLE.width),
    y: clamp((start.y + end.y) / 2 + (dx / length) * bend, 0, TABLE.height),
  };
  const a = simToSvg(start);
  const c = simToSvg(control);
  const b = simToSvg(end);
  return { control, path: `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}` };
}

function pointOnCurve(start: SimPoint, control: SimPoint, end: SimPoint, progress: number) {
  const inverse = 1 - progress;
  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
  };
}

function headingOnCurve(start: SimPoint, control: SimPoint, end: SimPoint, progress: number) {
  const dx = 2 * (1 - progress) * (control.x - start.x) + 2 * progress * (end.x - control.x);
  const dy = 2 * (1 - progress) * (control.y - start.y) + 2 * progress * (end.y - control.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export function PointingSimulation({ figure, sourceHref }: { figure: number; sourceHref: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const robotRef = useRef<SimPoint>({ x: 120, y: 105 });
  const activeTripRef = useRef<SimTrip | null>(null);
  const userStarted = useRef(false);
  const autoTimer = useRef<number | null>(null);
  const targetQueue = useRef<
    Array<{
      target: SimPoint;
      source: SimTrip["source"];
    }>
  >([]);
  const [cursor, setCursor] = useState<SimPoint>({ x: 372, y: 302 });
  const [robotBase, setRobotBase] = useState<SimPoint>(robotRef.current);
  const [trip, setTrip] = useState<SimTrip | null>(null);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [queuedTargets, setQueuedTargets] = useState<SimPoint[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "driving" | "arrived">("idle");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const startTrip = useCallback(
    (target: SimPoint, source: SimTrip["source"]) => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current);
      const estimate = source === "you pointed" ? { ...target } : noisyPoint(target, 64, 38);
      const endpoint = source === "you pointed" ? { ...target } : noisyPoint(estimate, 31, 22);
      const start = robotRef.current;
      const curve = curveFor(start, endpoint);
      if (trip) setPreviousPath(trip.path);
      const nextTrip: SimTrip = {
        target,
        estimate,
        endpoint,
        start,
        control: curve.control,
        path: curve.path,
        duration: reducedMotion ? 0 : source === "you pointed" ? 950 : 1300,
        source,
        pointingError: Math.round(distance(target, estimate)),
        navigationError: Math.round(distance(estimate, endpoint)),
      };
      activeTripRef.current = nextTrip;
      setCursor(target);
      setTrip(nextTrip);
      setProgress(reducedMotion ? 1 : 0);
      setStatus(reducedMotion ? "arrived" : "driving");
      if (reducedMotion) {
        robotRef.current = endpoint;
        setRobotBase(endpoint);
      }
    },
    [reducedMotion, trip],
  );

  useEffect(() => {
    if (!trip || status !== "driving") return;
    const started = performance.now();
    let frame = 0;
    const animate = (now: number) => {
      const linear = clamp((now - started) / trip.duration, 0, 1);
      const eased = (1 - Math.cos(linear * Math.PI)) / 2;
      setProgress(eased);
      const current = pointOnCurve(trip.start, trip.control, trip.endpoint, eased);
      robotRef.current = current;
      if (linear < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        robotRef.current = trip.endpoint;
        setRobotBase(trip.endpoint);
        setProgress(1);
        setStatus("arrived");
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [trip, status]);

  useEffect(() => {
    if (status !== "arrived") return;
    const hasQueuedTarget = targetQueue.current.length > 0;
    const idleTimer = window.setTimeout(
      () => {
        const next = targetQueue.current.shift();
        if (next) {
          setQueuedTargets((targets) => targets.slice(1));
          startTrip(next.target, next.source);
        } else {
          activeTripRef.current = null;
          setStatus("idle");
        }
      },
      hasQueuedTarget ? 120 : 600,
    );
    return () => window.clearTimeout(idleTimer);
  }, [startTrip, status]);

  useEffect(() => {
    if (userStarted.current || status === "driving") return;
    const delay = trip ? 2600 : 500;
    autoTimer.current = window.setTimeout(() => {
      startTrip(
        {
          x: Math.round(110 + Math.random() * 630),
          y: Math.round(80 + Math.random() * 420),
        },
        "auto demo",
      );
    }, delay);
    return () => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current);
    };
  }, [startTrip, status, trip]);

  const pointFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return cursor;
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const local = point.matrixTransform(svg.getScreenCTM()?.inverse());
    return {
      x: Math.round(clamp(local.x - TABLE.x, 0, TABLE.width)),
      y: Math.round(clamp(local.y - TABLE.y, 0, TABLE.height)),
    };
  };

  const userPoint = (target: SimPoint) => {
    userStarted.current = true;
    if (autoTimer.current) window.clearTimeout(autoTimer.current);
    const activeTrip = activeTripRef.current;
    if (activeTrip) {
      if (activeTrip.source === "auto demo") {
        targetQueue.current = [];
        setQueuedTargets([]);
        startTrip(target, "you pointed");
        return;
      }
      targetQueue.current.push({ target, source: "you pointed" });
      setQueuedTargets((targets) => [...targets, target]);
      setCursor(target);
      return;
    }
    startTrip(target, "you pointed");
  };

  const currentRobot =
    trip && status === "driving" ? pointOnCurve(trip.start, trip.control, trip.endpoint, progress) : robotBase;
  const heading = trip && status === "driving" ? headingOnCurve(trip.start, trip.control, trip.endpoint, progress) : 0;
  const robotSvg = simToSvg(currentRobot);
  const cursorSvg = simToSvg(cursor);
  const estimateSvg = trip ? simToSvg(trip.estimate) : null;
  const targetSvg = trip ? simToSvg(trip.target) : null;
  const remaining = trip ? Math.max(0, (trip.duration * (1 - progress)) / 1000) : 0;

  const idleDots = new Set(["1-2", "1-3", "1-4", "2-1", "2-5", "3-1", "3-5", "4-1", "4-5", "5-2", "5-3", "5-4"]);
  const checkDots = new Set(["1-1", "2-2", "3-3", "2-4", "1-5"]);
  const chevronDots = new Set(["1-3", "2-4", "3-1", "3-2", "3-3", "3-4", "3-5", "4-4", "5-3"]);
  const litDots = status === "driving" ? chevronDots : status === "arrived" ? checkDots : idleDots;

  return (
    <div className="diagram pointing-simulator">
      <div className="diagram-caption simulation-header">
        <span>Fig. {figure}</span>
        Point to navigate, simulated
        <small>850 × 600 mm</small>
      </div>
      <div
        className="simulation-plot"
        tabIndex={0}
        onKeyDown={(event) => {
          const step = event.shiftKey ? 50 : 10;
          let next = cursor;
          if (event.key === "ArrowLeft") next = { ...cursor, x: clamp(cursor.x - step, 0, 850) };
          if (event.key === "ArrowRight") next = { ...cursor, x: clamp(cursor.x + step, 0, 850) };
          if (event.key === "ArrowUp") next = { ...cursor, y: clamp(cursor.y - step, 0, 600) };
          if (event.key === "ArrowDown") next = { ...cursor, y: clamp(cursor.y + step, 0, 600) };
          if (event.key.startsWith("Arrow")) {
            event.preventDefault();
            userStarted.current = true;
            if (autoTimer.current) window.clearTimeout(autoTimer.current);
            setCursor(next);
          }
          if (event.key === "Enter") {
            event.preventDefault();
            userPoint(cursor);
          }
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 960 760"
          role="img"
          aria-label="Interactive 850 by 600 millimeter robot table"
          onPointerMove={(event) => setCursor(pointFromPointer(event.clientX, event.clientY))}
          onClick={(event) => userPoint(pointFromPointer(event.clientX, event.clientY))}
        >
          <rect className="sim-table" x={TABLE.x} y={TABLE.y} width={TABLE.width} height={TABLE.height} />
          {Array.from({ length: 18 }, (_, index) => (
            <line
              className="sim-grid-line"
              x1={TABLE.x + index * 50}
              x2={TABLE.x + index * 50}
              y1={TABLE.y}
              y2={TABLE.y + TABLE.height}
              key={`vertical-${index}`}
            />
          ))}
          {Array.from({ length: 13 }, (_, index) => (
            <line
              className="sim-grid-line"
              x1={TABLE.x}
              x2={TABLE.x + TABLE.width}
              y1={TABLE.y + index * 50}
              y2={TABLE.y + index * 50}
              key={`horizontal-${index}`}
            />
          ))}
          {Array.from({ length: 9 }, (_, index) => (
            <text className="sim-axis-label" x={TABLE.x + index * 100} y="27" key={`x-${index}`}>
              {index * 100}
            </text>
          ))}
          {Array.from({ length: 6 }, (_, index) => (
            <text className="sim-axis-label sim-y-label" x="38" y={TABLE.y + (index + 1) * 100} key={`y-${index}`}>
              {(index + 1) * 100}
            </text>
          ))}
          {[
            [TABLE.x, TABLE.y],
            [TABLE.x + TABLE.width, TABLE.y],
            [TABLE.x, TABLE.y + TABLE.height],
            [TABLE.x + TABLE.width, TABLE.y + TABLE.height],
          ].map(([x, y]) => (
            <circle className="sim-corner" cx={x} cy={y} r="6" key={`${x}-${y}`} />
          ))}

          <line className="aim-guide" x1={cursorSvg.x} x2={cursorSvg.x} y1={TABLE.y} y2={TABLE.y + TABLE.height} />
          <line className="aim-guide" x1={TABLE.x} x2={TABLE.x + TABLE.width} y1={cursorSvg.y} y2={cursorSvg.y} />
          <path
            className="aim-crosshair"
            d={`M${cursorSvg.x - 10} ${cursorSvg.y}H${cursorSvg.x + 10}M${cursorSvg.x} ${cursorSvg.y - 10}V${cursorSvg.y + 10}`}
          />
          <g
            className="aim-tag-group"
            transform={`translate(${clamp(cursorSvg.x + 12, 70, 790)} ${clamp(cursorSvg.y - 31, 55, 610)})`}>
            <rect className="aim-tag" width="116" height="24" rx="4" />
            <text className="aim-tag-text" x="58" y="16">
              x {cursor.x}　y {cursor.y}
            </text>
          </g>

          {previousPath && <path className="previous-path" d={previousPath} />}
          {trip && (
            <>
              <path
                className="traveled-path"
                d={trip.path}
                pathLength="100"
                strokeDasharray={`${progress * 100} 100`}
              />
              <path
                className="planned-path"
                d={trip.path}
                pathLength="100"
                strokeDasharray={`${(1 - progress) * 100} 100`}
                strokeDashoffset={-progress * 100}
              />
            </>
          )}
          {trip && estimateSvg && targetSvg && (
            <>
              <line className="pointing-line" x1={HAND.x} y1={HAND.y - 20} x2={estimateSvg.x} y2={estimateSvg.y} />
              <line className="error-line" x1={targetSvg.x} y1={targetSvg.y} x2={estimateSvg.x} y2={estimateSvg.y} />
              <g className="true-point" transform={`translate(${targetSvg.x} ${targetSvg.y})`}>
                <circle r="7" />
                <path d="M-4 0H4M0-4V4" />
              </g>
              <g
                className={`estimate-target ${status === "driving" ? "" : "estimate-collapsed"}`}
                transform={`translate(${estimateSvg.x} ${estimateSvg.y})`}
              >
                <circle r={status === "driving" ? 11 : 6} />
                {status === "driving" && <path d="M-18 0H-11M11 0H18M0-18V-11M0 11V18" />}
              </g>
            </>
          )}
          {queuedTargets.map((target, index) => {
            const point = simToSvg(target);
            return (
              <g
                className="queued-point"
                transform={`translate(${point.x} ${point.y})`}
                key={`${point.x}-${point.y}-${index}`}
              >
                <circle r="8" />
                <circle r="2" />
              </g>
            );
          })}

          <g className="sim-hand" transform={`translate(${HAND.x} ${HAND.y})`}>
            <path d="M-8 9C-11 4-11-3-8-5C-6-6-4-3-4 0V-17C-4-21 1-21 1-17V-5L4-11C5-14 9-12 8-9L7-4L10-8C12-10 15-7 13-3L10 6C8 13 3 17-3 15C-5 14-7 12-8 9Z" />
            <circle cx="0" cy="-20" r="2.5" />
            <text y="31">hand</text>
          </g>

          <g className="sim-robot" transform={`translate(${robotSvg.x} ${robotSvg.y})`}>
            <circle className="robot-shadow" cx="2" cy="2" r="22" />
            <circle className="robot-body" r="22" />
            <g transform={`rotate(${status === "driving" ? heading : 0})`}>
              {Array.from({ length: 49 }, (_, index) => {
                const row = Math.floor(index / 7);
                const column = index % 7;
                const key = `${row}-${column}`;
                return (
                  <circle
                    className={litDots.has(key) ? "robot-led robot-led-lit" : "robot-led"}
                    cx={(column - 3) * 4}
                    cy={(row - 3) * 4}
                    r="1.25"
                    key={key}
                  />
                );
              })}
            </g>
          </g>
        </svg>
      </div>
      <div className="simulation-readouts">
        <div>
          <small>Pointed at</small>
          <strong>
            x {trip?.target.x ?? cursor.x}, y {trip?.target.y ?? cursor.y} mm
          </strong>
          <span>workspace coordinates</span>
        </div>
        <div>
          <small>Pointing error</small>
          <strong>{trip ? `${trip.pointingError} mm` : "—"}</strong>
          <span>thesis mean 63.9 mm</span>
        </div>
        <div>
          <small>Navigation error</small>
          <strong>{status === "driving" ? "..." : trip ? `${trip.navigationError} mm` : "—"}</strong>
          <span>thesis mean 31.0 mm</span>
        </div>
        <div>
          <small>Status</small>
          <strong>{status}</strong>
          <span>
            {status === "driving" && trip?.source === "auto demo"
              ? `auto demo, in ${remaining.toFixed(1)} s`
              : status === "driving"
                ? "you pointed"
                : status === "arrived"
                  ? "in 0.6 s"
                  : (trip?.source ?? "ready")}
          </span>
        </div>
      </div>
      <div className="simulation-caption">
        As in the real system, the estimate lands near the spot you meant, not exactly on it. The noise added here has
        the same means the thesis measured.{" "}
        <a href={sourceHref} target="_blank" rel="noreferrer">
          How the real one works.
        </a>
      </div>
      <div className="simulation-hint">Keyboard: arrow keys aim (Shift for bigger steps), Enter points.</div>
    </div>
  );
}

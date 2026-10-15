import { useState } from "react";
import { experience } from "../../../data/experience";
import { formatDateRange } from "../../../lib/dateRange";
import type { ExperienceEntry } from "../../../types";
import "./experienceCircuit.css";

type Bit = 0 | 1;
/** A circuit "input" slot — null when fewer than 3 real experience entries exist. */
type Slot = ExperienceEntry | null;

const SLOT_COUNT = 3;
const slots: Slot[] = Array.from({ length: SLOT_COUNT }, (_, i) => experience[i] ?? null);

/** Card labels are fixed-size SVG text (no wrapping), so company names longer
 * than the export's placeholders are truncated to keep cards from overlapping. */
function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function Wire({ d, on = false }: { d: string; on?: boolean }) {
  return <path d={d} className={`wire ${on ? "on" : ""}`} />;
}

function Dot({ x, y, on = false }: { x: number; y: number; on?: boolean }) {
  return <circle cx={x} cy={y} r="5" className={`dot ${on ? "on" : ""}`} />;
}

function NotGate({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <g className={`gate ${on ? "on" : ""}`}>
      <path d={`M${x} ${y - 18}V${y + 18}L${x + 38} ${y}Z`} />
      <circle cx={x + 47} cy={y} r="8" />
    </g>
  );
}

function AndGate({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <path
      d={`M${x} ${y - 39}H${x + 45}A39 39 0 0 1 ${x + 45} ${y + 39}H${x}Z`}
      className={`gate ${on ? "on" : ""}`}
    />
  );
}

function OrGate({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <path
      d={`M${x} ${y - 42}Q${x + 19} ${y} ${x} ${y + 42}Q${x + 58} ${y + 38} ${x + 88} ${y}Q${x + 58} ${y - 38} ${x} ${y - 42}Z`}
      className={`gate or ${on ? "on" : ""}`}
    />
  );
}

function CompanyCard({ slot, x, active, index }: { slot: Slot; x: number; active: boolean; index: number }) {
  return (
    <g className={`company-card ${active ? "active" : ""} ${slot ? "" : "empty"}`}>
      <path
        d={`M${x + 8} 46H${x + 176}L${x + 184} 54V150L${x + 176} 158H${x + 8}L${x} 150V54Z`}
        className="component-outline"
      />
      <path d={`M${x + 72} 46V52H${x + 112}V46`} className="component-notch" />
      <text x={x + 10} y="62" className="component-id">
        U{index + 1} / INPUT_{index + 1}
      </text>
      <text x={x + 92} y="96" className="company-name">
        {truncate(slot?.company ?? "Empty slot", 16)}
      </text>
      <text x={x + 92} y="130">
        {slot ? formatDateRange(slot.startDate, slot.endDate) : "No job yet"}
      </text>
      {[24, 69, 115, 160].map((offset, pin) => (
        <g key={offset} className="component-pin">
          <path d={`M${x + offset} 158V168`} />
          <circle cx={x + offset} cy="171" r="3" />
          <text x={x + offset + 7} y="168">
            {pin + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

function Toggle({
  x,
  value,
  index,
  slot,
  onToggle,
}: {
  x: number;
  value: Bit;
  index: number;
  slot: Slot;
  onToggle: () => void;
}) {
  const disabled = slot === null;
  const keyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <g
      className={`svg-toggle ${value ? "active" : ""} ${disabled ? "disabled" : ""}`}
      role="switch"
      aria-checked={Boolean(value)}
      aria-disabled={disabled}
      aria-label={slot ? `Toggle ${slot.company}` : `Input ${index + 1} — empty slot`}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onToggle}
      onKeyDown={keyDown}
    >
      <text x={x + 8} y="177" className="switch-symbol">
        O
      </text>
      <text x={x + 64} y="177" className="switch-symbol">
        I
      </text>
      <rect x={x - 2} y="181" width="76" height="38" rx="5" className="switch-housing-shadow" />
      <rect x={x} y="179" width="72" height="38" rx="5" className="switch-housing" />
      <circle cx={x + 7} cy="186" r="2.4" className="switch-screw" />
      <circle cx={x + 65} cy="186" r="2.4" className="switch-screw" />
      <rect x={x + 9} y="189" width="54" height="17" rx="4" className="switch-slot" />
      <rect x={x + (value ? 40 : 10)} y="186" width="22" height="23" rx="4" className="switch-actuator" />
      <path
        d={`M${x + (value ? 45 : 15)} 191V204M${x + (value ? 51 : 21)} 191V204M${x + (value ? 57 : 27)} 191V204`}
        className="actuator-ridges"
      />
      {[12, 36, 60].map((offset) => (
        <g key={offset}>
          <path d={`M${x + offset} 217V222`} className="switch-leg" />
          <circle cx={x + offset} cy="222" r="3" className="switch-terminal" />
        </g>
      ))}
      <text x={x + 87} y="205" className="switch-state">
        {value ? "ON" : "OFF"}
      </text>
    </g>
  );
}

function ScreenContent({ slot, conflict }: { slot: Slot; conflict: boolean }) {
  if (conflict) {
    return (
      <div className="screen-copy screen-message">
        <span className="warning-dot">!</span>
        <b>SIGNAL CONFLICT</b>
        <p>Turn off the other switches.</p>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="screen-copy screen-message">
        <b>
          NO SIGNAL<span className="blink">_</span>
        </b>
        <p>Flip a switch</p>
      </div>
    );
  }

  return (
    <div className="screen-copy">
      <span className="display-status">ACTIVE EXPERIENCE</span>
      {/* Zero-width space lets "Intern/Researcher"-style titles wrap at the slash. */}
      <strong className="screen-role">{slot.role.replaceAll("/", "/​")}</strong>
      <span className="screen-company">
        {slot.company}
        {slot.locationType ? ` · ${slot.location} (${slot.locationType})` : ` · ${slot.location}`}
      </span>
      <span className="screen-date">{formatDateRange(slot.startDate, slot.endDate)}</span>
      <p>{slot.summary}</p>
      <span className="skills-label">Skills</span>
      <div className="skill-pills">
        {slot.tech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </div>
  );
}

function ModuleReset({ x, y, onReset }: { x: number; y: number; onReset: () => void }) {
  return (
    <g
      className="module-reset"
      role="button"
      tabIndex={0}
      aria-label="Reset all experience inputs"
      onClick={onReset}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onReset();
        }
      }}
    >
      <path
        d={`M${x + 5} ${y + 5}H${x + 10}M${x + 5} ${y + 19}H${x + 10}M${x + 38} ${y + 5}H${x + 43}M${x + 38} ${y + 19}H${x + 43}`}
        className="switch-legs"
      />
      <rect x={x + 9} y={y + 1} width="30" height="22" rx="4" className="switch-body" />
      <rect x={x + 13} y={y + 4} width="22" height="16" rx="3" className="switch-well" />
      <circle cx={x + 24} cy={y + 12} r="6" className="switch-cap" />
      <circle cx={x + 22} cy={y + 10} r="1.8" className="switch-glint" />
      <text x={x + 51} y={y + 15}>
        RST
      </text>
    </g>
  );
}

function SmdPart({ x, y, label, vertical = false }: { x: number; y: number; label: string; vertical?: boolean }) {
  return (
    <g className={`smd-part ${vertical ? "vertical" : ""}`} transform={`translate(${x} ${y}) ${vertical ? "rotate(90)" : ""}`}>
      <rect x="-14" y="-5" width="7" height="10" rx="1" className="smd-pad" />
      <rect x="7" y="-5" width="7" height="10" rx="1" className="smd-pad" />
      <rect x="-8" y="-4" width="16" height="8" rx="2" className="smd-body" />
      <path d="M-5 0H5" className="smd-mark" />
      <text x="-13" y="-8">
        {label}
      </text>
    </g>
  );
}

function Monitor({
  y,
  valid,
  x1,
  x0,
  slot,
  conflict,
  reset,
}: {
  y: Bit[];
  valid: Bit;
  x1: Bit;
  x0: Bit;
  slot: Slot;
  conflict: boolean;
  reset: () => void;
}) {
  return (
    <g className="desktop-monitor-module">
      <rect x="1016" y="60" width="337" height="645" rx="18" className="monitor-shadow" />
      <rect x="1010" y="54" width="337" height="645" rx="18" className="monitor-frame" />
      <rect x="1030" y="74" width="297" height="605" rx="10" className="monitor-inner" />
      <path d="M1038 82H1318" className="bezel-highlight" />
      {[1028, 1329].flatMap((x) =>
        [72, 681].map((y2) => (
          <g key={`${x}-${y2}`} className="bezel-screw">
            <circle cx={x} cy={y2} r="5" />
            <path d={`M${x - 3} ${y2}H${x + 3}`} />
          </g>
        )),
      )}
      <circle cx="1058" cy="114" r="15" className="led-well" />
      <circle cx="1058" cy="114" r="12" className="led-ring" />
      <circle cx="1058" cy="114" r="10" className={`led ${valid ? "on" : ""}`} />
      <circle cx="1055" cy="111" r="3" className="led-highlight" />
      <text x="1083" y="122" className="monitor-label">
        Valid LED
      </text>
      <ModuleReset x={1246} y={102} onReset={reset} />
      <rect x="1040" y="160" width="278" height="502" rx="8" className="oled-shadow" />
      <rect x="1043" y="163" width="272" height="496" rx="6" className="oled-glass" />
      <path d="M1051 171H1305L1272 218H1051Z" className="oled-reflection" />
      <foreignObject x="1049" y="172" width="260" height="482">
        <ScreenContent slot={slot} conflict={conflict} />
      </foreignObject>
      {y.map((bit, index) => (
        <circle key={index} cx="1010" cy={401 + index * 108} r="6" className={`pin ${bit ? "on" : ""}`} />
      ))}
      <circle cx="1010" cy="114" r="6" className={`pin ${valid ? "on" : ""}`} />
      <circle cx="1010" cy="226" r="6" className={`pin ${x1 ? "on" : ""}`} />
      <circle cx="1010" cy="322" r="6" className={`pin ${x0 ? "on" : ""}`} />
      <g className="monitor-vents">
        <path d="M1280 664h10M1296 664h10M1312 664h8" />
      </g>
      <g className="display-ribbon">
        <rect x="1150" y="688" width="58" height="10" rx="2" />
        {[1156, 1165, 1174, 1183, 1192, 1201].map((x) => (
          <path key={x} d={`M${x} 688V698`} />
        ))}
      </g>
    </g>
  );
}

function DesktopSchematic({
  sw,
  y,
  valid,
  x1,
  x0,
  toggle,
  reset,
}: {
  sw: Bit[];
  y: Bit[];
  valid: Bit;
  x1: Bit;
  x0: Bit;
  toggle: (index: number) => void;
  reset: () => void;
}) {
  const n = sw.map((bit) => (bit ? 0 : 1) as Bit);
  const count = sw[0] + sw[1] + sw[2];
  const activeIndex = count === 1 ? sw.findIndex(Boolean) : -1;

  return (
    <div className="desktop-schematic">
      <svg viewBox="0 0 1380 840" aria-label="Experience logic circuit">
        <defs>
          <filter id="exp-paper-grain" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="8" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="grayNoise" />
            <feComponentTransfer in="grayNoise">
              <feFuncA type="table" tableValues="0 .075" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" mode="multiply" />
          </filter>
          <filter id="exp-rough-ink" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency=".016" numOctaves="2" seed="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale=".75" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="exp-marker-edge" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="12" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
            <feGaussianBlur stdDeviation=".08" />
          </filter>
          <filter id="exp-soft-shadow" x="-30%" y="-30%" width="180%" height="180%">
            <feDropShadow dx="3" dy="5" stdDeviation="5" floodColor="#4b3d2b" floodOpacity=".16" />
          </filter>
          <linearGradient id="exp-bezel-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0eee7" />
            <stop offset=".48" stopColor="#d6d3ca" />
            <stop offset="1" stopColor="#bdbab1" />
          </linearGradient>
          <linearGradient id="exp-switch-well" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d8d5cc" />
            <stop offset=".5" stopColor="#fbfaf6" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
          <radialGradient id="exp-switch-knob" cx=".35" cy=".25" r=".8">
            <stop offset="0" stopColor="#faf9f5" />
            <stop offset=".6" stopColor="#a5a49d" />
            <stop offset="1" stopColor="#74756f" />
          </radialGradient>
          <radialGradient id="exp-switch-knob-on" cx=".35" cy=".25" r=".8">
            <stop offset="0" stopColor="#ffd27b" />
            <stop offset=".55" stopColor="#f0a11c" />
            <stop offset="1" stopColor="#b66a00" />
          </radialGradient>
          <linearGradient id="exp-pcb-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#12488f" />
            <stop offset=".45" stopColor="#0a3474" />
            <stop offset="1" stopColor="#062658" />
          </linearGradient>
          <pattern id="exp-pcb-fiber" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="4" r=".65" fill="#8bc4f2" opacity=".12" />
            <circle cx="19" cy="17" r=".45" fill="#031b42" opacity=".34" />
            <path d="M0 27.5H28M27.5 0V28" stroke="#77b4e7" strokeWidth=".35" opacity=".06" />
          </pattern>
        </defs>
        <rect x="8" y="8" width="1364" height="824" rx="18" className="drawing-sheet" />
        <rect x="18" y="18" width="1344" height="804" rx="13" fill="url(#exp-pcb-fiber)" className="pcb-texture" />
        <rect x="18" y="18" width="1344" height="804" rx="13" className="board-edge" />
        <g className="sheet-heading">
          <text x="54" y="31">
            EXPERIENCE SIGNAL ROUTER
          </text>
          <text x="1190" y="31">
            M.Machaidze
          </text>
          <path d="M52 38H1328" />
        </g>
        <CompanyCard slot={slots[0]} x={34} active={Boolean(sw[0])} index={0} />
        <CompanyCard slot={slots[1]} x={226} active={Boolean(sw[1])} index={1} />
        <CompanyCard slot={slots[2]} x={418} active={Boolean(sw[2])} index={2} />
        {[0, 1, 2].map((index) => (
          <Toggle key={index} x={42 + index * 192} value={sw[index]} index={index} slot={slots[index]} onToggle={() => toggle(index)} />
        ))}

        {/* Switch stems and inverter branches */}
        {[78, 270, 462].map((x, i) => (
          <g key={x}>
            <Wire d={`M${x} 218V${[378, 510, 642][i]}`} on={Boolean(sw[i])} />
            <Dot x={x} y={286} on={Boolean(sw[i])} />
            <NotGate x={x + 15} y={286} on={Boolean(n[i])} />
            <Wire d={`M${x + 70} 286H${x + 96}V${[594, 618, 534][i]}`} on={Boolean(n[i])} />
          </g>
        ))}

        {/* Y1 = S1 · ¬S2 · ¬S3 */}
        <Wire d="M78 378H662" on={Boolean(sw[0])} />
        <Wire d="M366 402H662" on={Boolean(n[1])} />
        <Wire d="M558 426H662" on={Boolean(n[2])} />
        {/* Y2 = ¬S1 · S2 · ¬S3 */}
        <Wire d="M174 486H662" on={Boolean(n[0])} />
        <Wire d="M270 510H662" on={Boolean(sw[1])} />
        <Wire d="M558 534H662" on={Boolean(n[2])} />
        {/* Y3 = ¬S1 · ¬S2 · S3 */}
        <Wire d="M174 594H662" on={Boolean(n[0])} />
        <Wire d="M366 618H662" on={Boolean(n[1])} />
        <Wire d="M462 642H662" on={Boolean(sw[2])} />
        {(
          [
            [78, 378, sw[0]],
            [270, 510, sw[1]],
            [462, 642, sw[2]],
            [174, 486, n[0]],
            [174, 594, n[0]],
            [366, 402, n[1]],
            [366, 618, n[1]],
            [558, 426, n[2]],
            [558, 534, n[2]],
          ] as const
        ).map(([x, branchY, bit]) => (
          <Dot key={`${x}-${branchY}`} x={x} y={branchY} on={Boolean(bit)} />
        ))}

        <AndGate x={662} y={402} on={Boolean(y[0])} />
        <AndGate x={662} y={510} on={Boolean(y[1])} />
        <AndGate x={662} y={618} on={Boolean(y[2])} />
        {[402, 510, 618].map((gateY, gateIndex) => (
          <g key={`and-pads-${gateY}`}>
            {[gateY - 24, gateY, gateY + 24].map((padY) => (
              <circle key={padY} cx="662" cy={padY} r="4" className="solder-pad" />
            ))}
            <circle cx="746" cy={gateY} r="4" className="solder-pad" />
            <text x="674" y={gateY - 48} className="component-ref">
              U{gateIndex + 4} / AND3
            </text>
          </g>
        ))}

        <Wire d="M746 402H1010" on={Boolean(y[0])} />
        <Wire d="M746 510H1010" on={Boolean(y[1])} />
        <Wire d="M746 618H1010" on={Boolean(y[2])} />
        <text x="960" y="390" className="line-label">
          Y1
        </text>
        <text x="960" y="498" className="line-label">
          Y2
        </text>
        <text x="960" y="606" className="line-label">
          Y3
        </text>

        {/* OR column */}
        <text x="889" y="50" className="group-label">
          OR gates
        </text>
        <Wire d="M786 402V86H895" on={Boolean(y[0])} />
        <Wire d="M814 510V114H895" on={Boolean(y[1])} />
        <Wire d="M842 618V142H895" on={Boolean(y[2])} />
        <Dot x={786} y={402} on={Boolean(y[0])} />
        <Dot x={814} y={510} on={Boolean(y[1])} />
        <Dot x={842} y={618} on={Boolean(y[2])} />
        <OrGate x={895} y={114} on={Boolean(valid)} />
        <Wire d="M983 114H1010" on={Boolean(valid)} />
        <text x="1002" textAnchor="end"y="102" className="line-label">
          Valid
        </text>

        <Wire d="M814 210H895" on={Boolean(y[1])} />
        <Wire d="M842 242H895" on={Boolean(y[2])} />
        <Dot x={814} y={210} on={Boolean(y[1])} />
        <Dot x={842} y={242} on={Boolean(y[2])} />
        <OrGate x={895} y={226} on={Boolean(x1)} />
        <Wire d="M983 226H1010" on={Boolean(x1)} />
        <text x="1002" textAnchor="end"y="214" className="line-label">
          X1
        </text>

        <Wire d="M786 306H895" on={Boolean(y[0])} />
        <Wire d="M842 338H895" on={Boolean(y[2])} />
        <Dot x={786} y={306} on={Boolean(y[0])} />
        <Dot x={842} y={338} on={Boolean(y[2])} />
        <OrGate x={895} y={322} on={Boolean(x0)} />
        <Wire d="M983 322H1010" on={Boolean(x0)} />
        <text x="1002" textAnchor="end"y="310" className="line-label">
          X0
        </text>
        <g className="encoder-refs">
          <text x="906" y="64">
            U7 / OR3
          </text>
          <text x="906" y="176">
            U8 / OR2
          </text>
          <text x="906" y="272">
            U9 / OR2
          </text>
        </g>

        <g className="board-details">
          {[650, 676, 702, 728].map((x) => (
            <g key={x} className="via-row">
              <circle cx={x} cy="700" r="4" />
              <circle cx={x} cy="700" r="1.5" />
            </g>
          ))}
          <text x="612" y="730" className="fabrication-note">
            GND TEST / ENIG FINISH
          </text>
          <SmdPart x={622} y={122} label="C1" />
          <SmdPart x={622} y={148} label="C2" />
          <SmdPart x={810} y={694} label="C3" />
        </g>

        <Monitor
          y={y}
          valid={valid}
          x1={x1}
          x0={x0}
          slot={activeIndex >= 0 ? slots[activeIndex] : null}
          conflict={count > 1}
          reset={reset}
        />

        <text x="184" y="754" className="caption">
          Switches and NOT gates
        </text>
        <text x="587" y="754" className="caption">
          One AND gate per job
        </text>
        <text x="1030" y="754" className="caption">
          Screen shows the active job
        </text>
        <line x1="76" y1="810" x2="119" y2="810" className="legend on" />
        <text x="130" y="818" className="legend-text">
          signal 1
        </text>
        <line x1="262" y1="810" x2="302" y2="810" className="legend" />
        <text x="314" y="818" className="legend-text">
          signal 0
        </text>
        <text x="466" y="818" className="legend-text">
          Example state: select one switch
        </text>
      </svg>
    </div>
  );
}

function CompactCompany({ slot, x, active, index }: { slot: Slot; x: number; active: boolean; index: number }) {
  return (
    <g className={`compact-company ${active ? "active" : ""} ${slot ? "" : "empty"}`}>
      <rect x={x} y="38" width="100" height="88" rx="9" />
      <text x={x + 6} y="52" className="compact-id">
        U{index + 1}
      </text>
      <text x={x + 50} y="78" className="compact-name">
        {truncate(slot?.company ?? "Empty", 12)}
      </text>
      <text x={x + 50} y="108">
        {slot ? formatDateRange(slot.startDate, slot.endDate) : "No job yet"}
      </text>
    </g>
  );
}

function CompactToggle({
  x,
  value,
  index,
  slot,
  onToggle,
}: {
  x: number;
  value: Bit;
  index: number;
  slot: Slot;
  onToggle: () => void;
}) {
  const disabled = slot === null;
  return (
    <g
      className={`compact-toggle ${value ? "active" : ""} ${disabled ? "disabled" : ""}`}
      role="switch"
      tabIndex={disabled ? -1 : 0}
      aria-checked={Boolean(value)}
      aria-disabled={disabled}
      aria-label={slot ? `Toggle ${slot.company}` : `Input ${index + 1} — empty slot`}
      onClick={disabled ? undefined : onToggle}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
    >
      <text x={x - 18} y="134" className="switch-symbol">
        O
      </text>
      <text x={x + 17} y="134" className="switch-symbol">
        I
      </text>
      <rect x={x - 23} y="137" width="46" height="25" rx="4" className="switch-housing" />
      <rect x={x - 16} y="144" width="32" height="10" rx="3" className="switch-slot" />
      <rect x={x + (value ? 1 : -15)} y="141" width="14" height="16" rx="3" className="switch-actuator" />
      <path d={`M${x + (value ? 5 : -11)} 144V154M${x + (value ? 9 : -7)} 144V154`} className="actuator-ridges" />
      {[-14, 0, 14].map((offset) => (
        <circle key={offset} cx={x + offset} cy="163" r="2.5" className="switch-terminal" />
      ))}
    </g>
  );
}

function DownAndGate({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <path
      d={`M${x - 27} ${y}H${x + 27}V${y + 28}A27 27 0 0 1 ${x - 27} ${y + 28}Z`}
      className={`gate down-and ${on ? "on" : ""}`}
    />
  );
}

function CompactMonitor({
  y,
  valid,
  slot,
  conflict,
  reset,
}: {
  y: Bit[];
  valid: Bit;
  slot: Slot;
  conflict: boolean;
  reset: () => void;
}) {
  return (
    <g className="compact-monitor">
      <rect x="28" y="445" width="334" height="317" rx="12" className="monitor-frame" />
      <rect x="38" y="455" width="314" height="297" rx="8" className="monitor-inner" />
      {(
        [
          [43, 460],
          [347, 460],
          [43, 747],
          [347, 747],
        ] as const
      ).map(([x, screwY]) => (
        <g key={`${x}-${screwY}`} className="bezel-screw compact-screw">
          <circle cx={x} cy={screwY} r="3.5" />
          <path d={`M${x - 2} ${screwY}H${x + 2}`} />
        </g>
      ))}
      <circle cx="58" cy="476" r="9" className="led-well" />
      <circle cx="58" cy="476" r="6" className={`led ${valid ? "on" : ""}`} />
      <text x="71" y="480" className="compact-led-label">
        VALID LED
      </text>
      <text x="184" y="480" className="compact-display-title">
        OLED EXPERIENCE DISPLAY
      </text>
      <ModuleReset x={276} y={464} onReset={reset} />
      <rect x="49" y="492" width="292" height="246" rx="6" className="oled-shadow" />
      <rect x="52" y="495" width="286" height="240" rx="4" className="oled-glass" />
      <foreignObject x="61" y="505" width="268" height="218">
        <ScreenContent slot={slot} conflict={conflict} />
      </foreignObject>
      {y.map((bit, index) => (
        <g key={index}>
          <circle cx={COMPACT_COLUMN_X[index]} cy="445" r="4" className={`pin ${bit ? "on" : ""}`} />
          <text x={COMPACT_COLUMN_X[index]} y="438" className="compact-pin-label">
            Y{index + 1}
          </text>
        </g>
      ))}
      <text x="48" y="753" className="compact-module-label">
        DISPLAY MODULE
      </text>
      <text x="342" y="753" textAnchor="end" className="compact-module-label">
        REV. A
      </text>
      <g className="display-ribbon compact-ribbon">
        <rect x="166" y="744" width="58" height="10" rx="2" />
        {[172, 181, 190, 199, 208, 217].map((x) => (
          <path key={x} d={`M${x} 744V754`} />
        ))}
      </g>
    </g>
  );
}

/** x of each job's switch, AND gate and display pin on the compact board. */
const COMPACT_COLUMN_X = [78, 195, 312];
const COMPACT_RAIL_Y = [205, 230, 255];
/** One-hot wiring: each gate takes its own source straight and the other two inverted. */
const COMPACT_GATE_INPUTS = COMPACT_COLUMN_X.map((gateX, gateIndex) =>
  [0, 1, 2].map((source) => ({ source, inverted: source !== gateIndex, x: gateX + (source - 1) * 18 })),
);

function CompactSchematic({
  sw,
  y,
  valid,
  toggle,
  reset,
}: {
  sw: Bit[];
  y: Bit[];
  valid: Bit;
  toggle: (index: number) => void;
  reset: () => void;
}) {
  const n = sw.map((bit) => (bit ? 0 : 1) as Bit);
  const count = sw[0] + sw[1] + sw[2];
  const activeIndex = count === 1 ? sw.findIndex(Boolean) : -1;

  return (
    <div className="compact-schematic">
      <svg viewBox="0 0 390 780" preserveAspectRatio="none" aria-label="Complete responsive experience logic circuit">
        <defs>
          <linearGradient id="exp-compact-pcb-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#12488f" />
            <stop offset=".5" stopColor="#0a3474" />
            <stop offset="1" stopColor="#062658" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="382" height="772" rx="14" className="drawing-sheet" />
        <rect x="10" y="10" width="370" height="760" rx="10" className="board-edge" />
        <text x="18" y="21" className="compact-title">
          EXPERIENCE ROUTER
        </text>
        <text x="372" y="21" className="compact-signature">
          M.Machaidze
        </text>
        <SmdPart x={24} y={180} label="C1" />
        <SmdPart x={366} y={180} label="C2" vertical />
        <SmdPart x={30} y={420} label="C3" />
        {[28, 145, 262].map((x, index) => (
          <CompactCompany key={x} slot={slots[index]} x={x} active={Boolean(sw[index])} index={index} />
        ))}
        {COMPACT_COLUMN_X.map((x, index) => (
          <CompactToggle key={x} x={x} value={sw[index]} index={index} slot={slots[index]} onToggle={() => toggle(index)} />
        ))}

        {COMPACT_RAIL_Y.map((sourceY, index) => (
          <g key={sourceY}>
            <text x="20" y={sourceY + 3} className="rail-label">
              S{index + 1}
            </text>
            <Wire d={`M48 ${sourceY}H342`} on={Boolean(sw[index])} />
            <Wire d={`M${COMPACT_COLUMN_X[index]} 163V${sourceY}`} on={Boolean(sw[index])} />
            <Dot x={COMPACT_COLUMN_X[index]} y={sourceY} on={Boolean(sw[index])} />
          </g>
        ))}

        {COMPACT_GATE_INPUTS.map((inputs, gateIndex) => (
          <g key={COMPACT_COLUMN_X[gateIndex]}>
            {inputs.map((input) => {
              const sourceValue = sw[input.source];
              const inputValue = input.inverted ? n[input.source] : sourceValue;
              return (
                <g key={`${gateIndex}-${input.source}`}>
                  <Wire d={`M${input.x} ${COMPACT_RAIL_Y[input.source]}V${input.inverted ? 294 : 300}`} on={Boolean(sourceValue)} />
                  <Dot x={input.x} y={COMPACT_RAIL_Y[input.source]} on={Boolean(sourceValue)} />
                  {input.inverted && <circle cx={input.x} cy="296" r="4" className={`gate-bubble ${inputValue ? "on" : ""}`} />}
                </g>
              );
            })}
            <DownAndGate x={COMPACT_COLUMN_X[gateIndex]} y={300} on={Boolean(y[gateIndex])} />
            <Wire d={`M${COMPACT_COLUMN_X[gateIndex]} 355V445`} on={Boolean(y[gateIndex])} />
            <text x={COMPACT_COLUMN_X[gateIndex] + 10} y="400" className="y-label">
              Y{gateIndex + 1}
            </text>
          </g>
        ))}

        <CompactMonitor y={y} valid={valid} slot={activeIndex >= 0 ? slots[activeIndex] : null} conflict={count > 1} reset={reset} />
      </svg>
    </div>
  );
}

const FIRST_REAL_SLOT = slots.findIndex((slot) => slot !== null);
const INITIAL_SWITCHES: Bit[] = [0, 1, 2].map((i) => (i === FIRST_REAL_SLOT ? 1 : 0)) as Bit[];

export function ExperienceCircuit() {
  const [sw, setSw] = useState<Bit[]>(INITIAL_SWITCHES);
  const y: Bit[] = [
    (sw[0] && !sw[1] && !sw[2] ? 1 : 0) as Bit,
    (!sw[0] && sw[1] && !sw[2] ? 1 : 0) as Bit,
    (!sw[0] && !sw[1] && sw[2] ? 1 : 0) as Bit,
  ];
  const valid = (y[0] || y[1] || y[2]) as Bit;
  const x1 = (y[1] || y[2]) as Bit;
  const x0 = (y[0] || y[2]) as Bit;
  const toggle = (index: number) => {
    if (!slots[index]) return;
    setSw((current) => current.map((bit, i) => (i === index ? (bit ? 0 : 1) : bit)) as Bit[]);
  };
  const reset = () => setSw([0, 0, 0]);

  return (
    <div className="experience-circuit">
      <DesktopSchematic sw={sw} y={y} valid={valid} x1={x1} x0={x0} toggle={toggle} reset={reset} />
      <CompactSchematic sw={sw} y={y} valid={valid} toggle={toggle} reset={reset} />
    </div>
  );
}

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

/** The card/switch geometry below is fixed-size SVG text (no wrapping), so
 * real company/role strings longer than the placeholder text it was authored
 * against need truncating to avoid overlapping neighboring cards. */
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
      <text x={x + 92} y="91" className="company-name">
        {truncate(slot?.company ?? "Empty slot", 16)}
      </text>
      <text x={x + 92} y="117">
        {truncate(slot?.role ?? "No role added yet", 24)}
      </text>
      <text x={x + 92} y="141">
        {slot ? formatDateRange(slot.startDate, slot.endDate) : "—"}
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
      <strong className="screen-role">{slot.role}</strong>
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
  slot,
  conflict,
  reset,
}: {
  y: Bit[];
  valid: Bit;
  slot: Slot;
  conflict: boolean;
  source: string;
  reset: () => void;
}) {
  return (
    <g>
      <rect x="1068" y="60" width="285" height="645" rx="18" className="monitor-shadow" />
      <rect x="1062" y="54" width="285" height="645" rx="18" className="monitor-frame" />
      <rect x="1082" y="74" width="245" height="605" rx="10" className="monitor-inner" />
      <path d="M1090 82H1318" className="bezel-highlight" />
      {[1080, 1329].flatMap((x) =>
        [72, 681].map((y2) => (
          <g key={`${x}-${y2}`} className="bezel-screw">
            <circle cx={x} cy={y2} r="5" />
            <path d={`M${x - 3} ${y2}H${x + 3}`} />
          </g>
        )),
      )}
      <circle cx="1110" cy="114" r="15" className="led-well" />
      <circle cx="1110" cy="114" r="12" className="led-ring" />
      <circle cx="1110" cy="114" r="10" className={`led ${valid ? "on" : ""}`} />
      <circle cx="1107" cy="111" r="3" className="led-highlight" />
      <text x="1135" y="122" className="monitor-label">
        Valid LED
      </text>
      <ModuleReset x={1250} y={102} onReset={reset} />
      <rect x="1092" y="160" width="226" height="502" rx="8" className="oled-shadow" />
      <rect x="1095" y="163" width="220" height="496" rx="6" className="oled-glass" />
      <path d="M1103 171H1305L1272 218H1103Z" className="oled-reflection" />
      <foreignObject x="1100" y="172" width="210" height="482">
        <ScreenContent slot={slot} conflict={conflict} />
      </foreignObject>
      {y.map((bit, index) => (
        <circle key={index} cx="1062" cy={401 + index * 108} r="6" className={`pin ${bit ? "on" : ""}`} />
      ))}
      <circle cx="1062" cy="114" r="6" className={`pin ${valid ? "on" : ""}`} />
      <g className="monitor-vents">
        <path d="M1280 664h10M1296 664h10M1312 664h8" />
      </g>
      <g className="display-ribbon">
        <rect x="1176" y="688" width="58" height="10" rx="2" />
        {[1182, 1191, 1200, 1209, 1218, 1227].map((x) => (
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

        <Wire d="M746 402H1062" on={Boolean(y[0])} />
        <Wire d="M746 510H1062" on={Boolean(y[1])} />
        <Wire d="M746 618H1062" on={Boolean(y[2])} />
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
        <Wire d="M983 114H1062" on={Boolean(valid)} />
        <text x="994" y="102" className="line-label">
          Valid
        </text>

        <Wire d="M814 210H895" on={Boolean(y[1])} />
        <Wire d="M842 242H895" on={Boolean(y[2])} />
        <Dot x={814} y={210} on={Boolean(y[1])} />
        <Dot x={842} y={242} on={Boolean(y[2])} />
        <OrGate x={895} y={226} on={Boolean(x1)} />
        <Wire d="M983 226H1062" on={Boolean(x1)} />
        <text x="994" y="214" className="line-label">
          X1
        </text>

        <Wire d="M786 306H895" on={Boolean(y[0])} />
        <Wire d="M842 338H895" on={Boolean(y[2])} />
        <Dot x={786} y={306} on={Boolean(y[0])} />
        <Dot x={842} y={338} on={Boolean(y[2])} />
        <OrGate x={895} y={322} on={Boolean(x0)} />
        <Wire d="M983 322H1062" on={Boolean(x0)} />
        <text x="994" y="310" className="line-label">
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

        <Monitor y={y} valid={valid} slot={activeIndex >= 0 ? slots[activeIndex] : null} conflict={count > 1} source={`${x1}${x0}`} reset={reset} />

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
      <path d={`M${x + 5} 30H${x + 105}L${x + 110} 35V109L${x + 105} 114H${x + 5}L${x} 109V35Z`} />
      <text x={x + 6} y="43" className="compact-id">
        U{index + 1}
      </text>
      <text x={x + 55} y="64" className="compact-name">
        {truncate(slot?.company ?? "Empty", 13)}
      </text>
      <text x={x + 55} y="82">
        {truncate(slot?.role ?? "No role yet", 16)}
      </text>
      <text x={x + 55} y="99">
        {slot ? formatDateRange(slot.startDate, slot.endDate) : "—"}
      </text>
      {[18, 44, 70, 96].map((offset) => (
        <circle key={offset} cx={x + offset} cy="114" r="2.5" className="solder-pad" />
      ))}
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
      <text x={x - 18} y="124" className="switch-symbol">
        O
      </text>
      <text x={x + 17} y="124" className="switch-symbol">
        I
      </text>
      <rect x={x - 23} y="127" width="46" height="25" rx="4" className="switch-housing" />
      <rect x={x - 16} y="134" width="32" height="10" rx="3" className="switch-slot" />
      <rect x={x + (value ? 1 : -15)} y="131" width="14" height="16" rx="3" className="switch-actuator" />
      <path d={`M${x + (value ? 5 : -11)} 134V144M${x + (value ? 9 : -7)} 134V144`} className="actuator-ridges" />
      {[-14, 0, 14].map((offset) => (
        <circle key={offset} cx={x + offset} cy="153" r="2.5" className="switch-terminal" />
      ))}
    </g>
  );
}

function CompactOrGate({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <path
      d={`M${x} ${y - 12}Q${x + 7} ${y} ${x} ${y + 12}Q${x + 29} ${y + 10} ${x + 44} ${y}Q${x + 29} ${y - 10} ${x} ${y - 12}Z`}
      className={`gate ${on ? "on" : ""}`}
    />
  );
}

function CompactNotGate({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <g className={`gate ${on ? "on" : ""}`}>
      <path d={`M${x} ${y - 7}V${y + 7}L${x + 18} ${y}Z`} />
      <circle cx={x + 22} cy={y} r="3" />
    </g>
  );
}

function CompactMonitor({
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
    <g className="compact-monitor">
      <rect x="18" y="514" width="354" height="282" rx="12" className="monitor-frame" />
      <rect x="28" y="524" width="334" height="262" rx="8" className="monitor-inner" />
      <circle cx="48" cy="543" r="9" className="led-well" />
      <circle cx="48" cy="543" r="6" className={`led ${valid ? "on" : ""}`} />
      <text x="61" y="547" className="compact-led-label">
        VALID
      </text>
      <ModuleReset x={282} y={531} onReset={reset} />
      <rect x="38" y="558" width="314" height="216" rx="6" className="oled-shadow" />
      <rect x="41" y="561" width="308" height="210" rx="4" className="oled-glass" />
      <foreignObject x="51" y="570" width="288" height="192">
        <ScreenContent slot={slot} conflict={conflict} />
      </foreignObject>
      {y.map((bit, index) => (
        <g key={index}>
          <circle cx={92 + index * 46} cy="514" r="4" className={`pin ${bit ? "on" : ""}`} />
          <text x={92 + index * 46} y="507" className="compact-pin-label">
            Y{index + 1}
          </text>
        </g>
      ))}
      <circle cx="270" cy="514" r="4" className={`pin ${valid ? "on" : ""}`} />
      <text x="270" y="507" className="compact-pin-label">
        V
      </text>
      <circle cx="306" cy="514" r="4" className={`pin ${x1 ? "on" : ""}`} />
      <text x="306" y="507" className="compact-pin-label">
        X1
      </text>
      <circle cx="326" cy="514" r="4" className={`pin ${x0 ? "on" : ""}`} />
      <text x="326" y="507" className="compact-pin-label">
        X0
      </text>
    </g>
  );
}

function CompactSchematic({
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
  const inputX = [56, 195, 334];

  return (
    <div className="compact-schematic">
      <svg viewBox="0 0 390 814" aria-label="Complete responsive experience logic circuit">
        <defs>
          <linearGradient id="exp-compact-pcb-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#12488f" />
            <stop offset=".5" stopColor="#0a3474" />
            <stop offset="1" stopColor="#062658" />
          </linearGradient>
          <pattern id="exp-compact-pcb-fiber" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="4" r=".45" fill="#8bc4f2" opacity=".12" />
            <circle cx="13" cy="12" r=".35" fill="#031b42" opacity=".32" />
          </pattern>
        </defs>
        <rect x="4" y="4" width="382" height="806" rx="14" className="drawing-sheet" />
        <rect x="10" y="10" width="370" height="794" rx="10" fill="url(#exp-compact-pcb-fiber)" className="pcb-texture" />
        <rect x="10" y="10" width="370" height="794" rx="10" className="board-edge" />
        <text x="18" y="21" className="compact-title">
          EXPERIENCE ROUTER
        </text>
        <text x="372" y="21" className="compact-signature">
          M.Machaidze
        </text>
        <SmdPart x={26} y={204} label="C1" />
        <SmdPart x={358} y={204} label="C2" vertical />
        <SmdPart x={344} y={486} label="C3" />
        {[18, 140, 262].map((x, index) => (
          <CompactCompany key={x} slot={slots[index]} x={x} active={Boolean(sw[index])} index={index} />
        ))}
        {inputX.map((x, index) => (
          <CompactToggle key={x} x={x} value={sw[index]} index={index} slot={slots[index]} onToggle={() => toggle(index)} />
        ))}

        {/* Input rails and NOT gates */}
        <Wire d="M56 153V251" on={Boolean(sw[0])} />
        <Wire d="M195 153V350" on={Boolean(sw[1])} />
        <Wire d="M334 153V449" on={Boolean(sw[2])} />
        <Wire d="M56 173H81" on={Boolean(sw[0])} />
        <Wire d="M195 173H220" on={Boolean(sw[1])} />
        <Wire d="M334 173H260" on={Boolean(sw[2])} />
        <CompactNotGate x={81} y={173} on={Boolean(n[0])} />
        <CompactNotGate x={220} y={173} on={Boolean(n[1])} />
        <CompactNotGate x={260} y={173} on={Boolean(n[2])} />
        <Wire d="M106 173V431" on={Boolean(n[0])} />
        <Wire d="M245 173V440" on={Boolean(n[1])} />
        <Wire d="M285 173V359" on={Boolean(n[2])} />
        {(
          [
            [56, 173, sw[0]],
            [195, 173, sw[1]],
            [334, 173, sw[2]],
            [56, 251, sw[0]],
            [195, 350, sw[1]],
            [334, 449, sw[2]],
            [106, 341, n[0]],
            [106, 431, n[0]],
            [245, 260, n[1]],
            [245, 440, n[1]],
            [285, 269, n[2]],
            [285, 359, n[2]],
          ] as const
        ).map(([x, branchY, bit]) => (
          <Dot key={`${x}-${branchY}`} x={x} y={branchY} on={Boolean(bit)} />
        ))}

        {/* Y1 = S1 · ¬S2 · ¬S3 */}
        <Wire d="M56 251H148" on={Boolean(sw[0])} />
        <Wire d="M245 260H148" on={Boolean(n[1])} />
        <Wire d="M285 269H148" on={Boolean(n[2])} />
        {/* Y2 = ¬S1 · S2 · ¬S3 */}
        <Wire d="M106 341H148" on={Boolean(n[0])} />
        <Wire d="M195 350H148" on={Boolean(sw[1])} />
        <Wire d="M285 359H148" on={Boolean(n[2])} />
        {/* Y3 = ¬S1 · ¬S2 · S3 */}
        <Wire d="M106 431H148" on={Boolean(n[0])} />
        <Wire d="M245 440H148" on={Boolean(n[1])} />
        <Wire d="M334 449H148" on={Boolean(sw[2])} />

        {[260, 350, 440].map((gateY, index) => (
          <g key={gateY}>
            <path d={`M148 ${gateY - 14}H176A14 14 0 0 1 176 ${gateY + 14}H148Z`} className={`gate ${y[index] ? "on" : ""}`} />
            <Wire d={`M190 ${gateY}H${[222, 234, 246][index]}`} on={Boolean(y[index])} />
            <text x="151" y={gateY - 18} className="compact-ref">
              U{index + 4}/AND3
            </text>
            {[gateY - 9, gateY, gateY + 9].map((padY) => (
              <circle key={padY} cx="148" cy={padY} r="2.5" className="solder-pad" />
            ))}
            <circle cx="190" cy={gateY} r="2.5" className="solder-pad" />
          </g>
        ))}

        {/* One-hot buses feed the three encoder gates and the display pins. */}
        <Wire d="M222 260V250H314" on={Boolean(y[0])} />
        <Wire d="M234 350V260H314" on={Boolean(y[1])} />
        <Wire d="M246 440V270H314" on={Boolean(y[2])} />
        <CompactOrGate x={306} y={260} on={Boolean(valid)} />

        <Wire d="M234 340H314" on={Boolean(y[1])} />
        <Wire d="M246 360H314" on={Boolean(y[2])} />
        <CompactOrGate x={306} y={350} on={Boolean(x1)} />

        <Wire d="M222 430H314" on={Boolean(y[0])} />
        <Wire d="M246 450H314" on={Boolean(y[2])} />
        <CompactOrGate x={306} y={440} on={Boolean(x0)} />
        <text x="353" y="264" className="compact-output">
          V
        </text>
        <text x="353" y="354" className="compact-output">
          X1
        </text>
        <text x="353" y="444" className="compact-output">
          X0
        </text>

        {/* All one-hot outputs and VALID terminate at the display header. */}
        <Wire d="M222 260V341Q230 350 222 359V431Q230 440 222 449V486H92V514" on={Boolean(y[0])} />
        <Wire d="M234 350V431Q242 440 234 449V478H138V514" on={Boolean(y[1])} />
        <Wire d="M246 440V470H184V514" on={Boolean(y[2])} />
        <Wire d="M350 260H376V462H270V514" on={Boolean(valid)} />
        <Wire d="M350 350H366V478H306V514" on={Boolean(x1)} />
        <Wire d="M350 440H356V494H326V514" on={Boolean(x0)} />
        {(
          [
            [222, 260, y[0]],
            [222, 430, y[0]],
            [234, 350, y[1]],
            [234, 340, y[1]],
            [246, 440, y[2]],
            [246, 360, y[2]],
            [246, 450, y[2]],
          ] as const
        ).map(([x, branchY, bit]) => (
          <Dot key={`encoder-${x}-${branchY}`} x={x} y={branchY} on={Boolean(bit)} />
        ))}
        {[92, 138, 184, 270].map((x, index) => (
          <Dot key={x} x={x} y={514} on={Boolean(index < 3 ? y[index] : valid)} />
        ))}

        <CompactMonitor
          y={y}
          valid={valid}
          x1={x1}
          x0={x0}
          slot={activeIndex >= 0 ? slots[activeIndex] : null}
          conflict={count > 1}
          reset={reset}
        />
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
      <CompactSchematic sw={sw} y={y} valid={valid} x1={x1} x0={x0} toggle={toggle} reset={reset} />
    </div>
  );
}

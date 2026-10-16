import { useMemo, useState, type CSSProperties } from "react";
import { skills } from "../../data/skills";
import type { SkillCategory, SkillItem } from "../../types";
import "./skillsChip.css";

interface PinnedSkill extends SkillItem {
  pin: number;
  category: SkillCategory;
}

interface CategoryRange {
  category: SkillCategory;
  start: number;
  end: number;
}

function pinText(pin: number): string {
  return pin.toString().padStart(2, "0");
}

function categoryVar(color: string): CSSProperties {
  return { "--category": color } as CSSProperties;
}

function PinRow({
  skill,
  side,
  selected,
  onSelect,
}: {
  skill: PinnedSkill;
  side: "left" | "right";
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`pin-row pin-row--${side}${selected ? " is-selected" : ""}`}
      style={categoryVar(skill.category.color)}
      onClick={onSelect}
      onMouseEnter={onSelect}
      aria-pressed={selected}
      aria-label={`Pin ${pinText(skill.pin)}, ${skill.name}`}
    >
      {side === "left" ? (
        <>
          <span className="pin-label">
            <b>{skill.name}</b>
            <i />
          </span>
          <span className="pin-number">{pinText(skill.pin)}</span>
          <span className="pin-lead" />
        </>
      ) : (
        <>
          <span className="pin-lead" />
          <span className="pin-number">{pinText(skill.pin)}</span>
          <span className="pin-label">
            <i />
            <b>{skill.name}</b>
          </span>
        </>
      )}
    </button>
  );
}

function Chip({
  skill,
  categoryRanges,
  pinCount,
}: {
  skill: PinnedSkill;
  categoryRanges: CategoryRange[];
  pinCount: number;
}) {
  const now = new Date();
  return (
    <article className="chip">
      <picture className="chip-outline">
        <source media="(max-width: 767px)" srcSet="/skills-chip/ic-outline-mobile.svg" />
        <source media="(max-width: 1000px)" srcSet="/skills-chip/ic-outline-tablet.svg" />
        <img src="/skills-chip/ic-outline-desktop.svg" alt="" />
      </picture>
      <div className="chip-top">
        <picture className="index-dot">
          <source media="(max-width: 767px)" srcSet="/skills-chip/pin-dot-mobile.svg" />
          <img src="/skills-chip/pin-dot.svg" alt="" />
        </picture>
        <div className="chip-meta">
          <span>M. Machaidze</span>
          <span>
            rev. {now.getFullYear()}.{(now.getMonth() + 1).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="top-rail" />
      <div className="texture-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="chip-content">
        <div className="detail-frame" aria-live="polite">
          <div className="active-pin">
            <i style={{ backgroundColor: skill.category.light }} />
            Pin {pinText(skill.pin)} &middot; {skill.category.title}
          </div>
          <h2>{skill.name}</h2>
          {skill.usage && (
            <div className="usage">
              <h3>Where I used it</h3>
              <p>{skill.usage}</p>
            </div>
          )}
        </div>
        <div className="legend">
          {categoryRanges.map(({ category, start, end }) => (
            <div className="legend-row" key={category.id}>
              <span>
                <i style={{ backgroundColor: category.light }} />
                {category.title}
              </span>
              <span>
                {pinText(start)}&ndash;{pinText(end)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-rail" />
      <div className="chip-bottom">&#9670; SKILLS IC &mdash; {pinCount}-PIN DIP</div>
      <picture className="notch">
        <source media="(max-width: 767px)" srcSet="/skills-chip/notch-mobile.svg" />
        <img src="/skills-chip/notch.svg" alt="" />
      </picture>
    </article>
  );
}

function PinIndex({
  categoryRanges,
  pinnedSkills,
  selectedPin,
  onSelect,
}: {
  categoryRanges: CategoryRange[];
  pinnedSkills: PinnedSkill[];
  selectedPin: number;
  onSelect: (pin: number) => void;
}) {
  return (
    <div className="pin-index">
      {categoryRanges.map(({ category, start, end }) => (
        <section className="index-card" key={category.id}>
          <h3>
            <i style={{ backgroundColor: category.color }} />
            {category.title} &middot; {pinText(start)}&ndash;{pinText(end)}
          </h3>
          <div className="index-grid">
            {pinnedSkills
              .filter((skill) => skill.pin >= start && skill.pin <= end)
              .map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => onSelect(skill.pin)}
                  className={selectedPin === skill.pin ? "is-selected" : ""}
                  style={categoryVar(category.color)}
                  aria-pressed={selectedPin === skill.pin}
                >
                  <span>{pinText(skill.pin)}</span>
                  <strong>{skill.name}</strong>
                  <i />
                </button>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Skills() {
  const pinnedSkills = useMemo<PinnedSkill[]>(
    () =>
      skills.categories.flatMap((category, categoryIndex) => {
        const priorCount = skills.categories.slice(0, categoryIndex).reduce((sum, c) => sum + c.items.length, 0);
        return category.items.map((item, itemIndex) => ({ ...item, pin: priorCount + itemIndex + 1, category }));
      }),
    [],
  );

  const categoryRanges = useMemo<CategoryRange[]>(
    () =>
      skills.categories
        .map((category, categoryIndex) => {
          const priorCount = skills.categories.slice(0, categoryIndex).reduce((sum, c) => sum + c.items.length, 0);
          return { category, start: priorCount + 1, end: priorCount + category.items.length };
        })
        .filter((range) => range.category.items.length > 0),
    [],
  );

  const [selectedPin, setSelectedPin] = useState(1);
  const selectedSkill = pinnedSkills.find((s) => s.pin === selectedPin) ?? pinnedSkills[0];

  if (!selectedSkill) return null;

  const mid = Math.ceil(pinnedSkills.length / 2);
  const leftPins = pinnedSkills.slice(0, mid);
  const rightPins = [...pinnedSkills.slice(mid)].reverse();

  return (
    <section id="skills" className="skills-chip scroll-mt-16">
      <header>
        <p>What I work with</p>
        <h1>Skills</h1>
        <div>A snapshot of the languages, frameworks, and tools I reach for most.</div>
      </header>

      <div className="caption">
        <span>Fig. 6</span>
        <strong>Pinout, {pinnedSkills.length} pins</strong>
      </div>

      <section className="board" aria-label="Interactive skills pinout">
        <div className="pins pins--left">
          {leftPins.map((skill) => (
            <PinRow
              key={skill.id}
              skill={skill}
              side="left"
              selected={skill.pin === selectedPin}
              onSelect={() => setSelectedPin(skill.pin)}
            />
          ))}
        </div>
        <Chip skill={selectedSkill} categoryRanges={categoryRanges} pinCount={pinnedSkills.length} />
        <div className="pins pins--right">
          {rightPins.map((skill) => (
            <PinRow
              key={skill.id}
              skill={skill}
              side="right"
              selected={skill.pin === selectedPin}
              onSelect={() => setSelectedPin(skill.pin)}
            />
          ))}
        </div>
      </section>

      <PinIndex
        categoryRanges={categoryRanges}
        pinnedSkills={pinnedSkills}
        selectedPin={selectedPin}
        onSelect={setSelectedPin}
      />

      {skills.additionalTools && (
        <footer>
          <strong>Additional tools</strong>
          <p>{skills.additionalTools}</p>
        </footer>
      )}
    </section>
  );
}

interface ProjectCoverPlaceholderProps {
  seed: string;
  title: string;
  className?: string;
}

const PALETTES = [
  ["#146B5D", "#E8873A"],
  ["#C1443C", "#146B5D"],
  ["#0E4F44", "#F2A65A"],
  ["#8A8578", "#146B5D"],
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Deterministic gradient + shape cover art, generated from `seed` — swap for a real image later. */
export function ProjectCoverPlaceholder({ seed, title, className = "" }: ProjectCoverPlaceholderProps) {
  const hash = hashSeed(seed);
  const [colorA, colorB] = PALETTES[hash % PALETTES.length];
  const gradientId = `cover-gradient-${seed}`;
  const cx = 20 + (hash % 60);
  const cy = 20 + ((hash >> 4) % 60);
  const r = 30 + ((hash >> 8) % 40);

  return (
    <svg
      viewBox="0 0 400 240"
      role="img"
      aria-label={`Placeholder cover art for ${title}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorA} />
          <stop offset="100%" stopColor={colorB} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${gradientId})`} />
      <circle cx={cx * 4} cy={cy * 2.4} r={r} fill="white" fillOpacity="0.12" />
      <circle cx={400 - cx * 3} cy={240 - cy} r={r * 0.6} fill="white" fillOpacity="0.1" />
      <text
        x="24"
        y="200"
        fontFamily="var(--font-heading)"
        fontSize="28"
        fontWeight="600"
        fill="white"
        fillOpacity="0.95"
      >
        {title}
      </text>
    </svg>
  );
}

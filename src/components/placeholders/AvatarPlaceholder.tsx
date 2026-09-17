interface AvatarPlaceholderProps {
  name: string;
  className?: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Circular initials avatar used until a real profile photo is added. */
export function AvatarPlaceholder({ name, className = "" }: AvatarPlaceholderProps) {
  const initials = getInitials(name);

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`Placeholder avatar for ${name}`} className={className}>
      <defs>
        <linearGradient id="avatar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="100" fill="url(#avatar-gradient)" />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-heading)"
        fontSize="72"
        fontWeight="600"
        fill="white"
      >
        {initials}
      </text>
    </svg>
  );
}

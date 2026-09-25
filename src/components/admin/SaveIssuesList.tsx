interface ZodIssueLike {
  path: (string | number)[];
  message: string;
}

function isZodIssueArray(value: unknown): value is ZodIssueLike[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => item && typeof item === "object" && "path" in item && "message" in item)
  );
}

/** Renders the field-level validation errors the server sends back alongside a generic "Invalid content" message. */
export function SaveIssuesList({ issues }: { issues: unknown }) {
  if (!isZodIssueArray(issues)) return null;

  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-accent-2">
      {issues.map((issue, i) => (
        <li key={i}>
          {issue.path.length > 0 && <span className="font-mono">{issue.path.join(".")}: </span>}
          {issue.message}
        </li>
      ))}
    </ul>
  );
}

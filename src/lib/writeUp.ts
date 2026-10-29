/**
 * A small subset of Markdown for project write-ups, so they stay editable as plain text in the
 * admin panel: "## " and "### " headings, "- " list items, and blank lines between paragraphs.
 * Lines inside a paragraph (or continuing a list item) are joined with spaces. Inline formatting
 * is handled when rendering (components/projects/WriteUp.tsx).
 */
export type WriteUpBlock =
  | { type: "h2" | "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "section"
  );
}

export function parseWriteUp(source: string): WriteUpBlock[] {
  const blocks: WriteUpBlock[] = [];
  const usedIds = new Map<string, number>();
  let paragraph: string[] = [];
  let list: string[] | null = null;

  const flush = () => {
    if (paragraph.length) blocks.push({ type: "p", text: paragraph.join(" ") });
    if (list) blocks.push({ type: "ul", items: list });
    paragraph = [];
    list = null;
  };

  for (const raw of source.split("\n")) {
    const line = raw.trim();
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (!line) {
      flush();
    } else if (heading) {
      flush();
      const text = heading[2].trim();
      const base = slugify(text);
      const seen = usedIds.get(base) ?? 0;
      usedIds.set(base, seen + 1);
      blocks.push({ type: heading[1].length === 3 ? "h3" : "h2", text, id: seen ? `${base}-${seen + 1}` : base });
    } else if (/^[-*]\s+/.test(line)) {
      if (paragraph.length) flush();
      list = [...(list ?? []), line.replace(/^[-*]\s+/, "")];
    } else if (list) {
      list[list.length - 1] += ` ${line}`;
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

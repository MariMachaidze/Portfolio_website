import type { ReactNode } from "react";
import type { WriteUpBlock } from "../../lib/writeUp";

/** **bold**, `code` and [text](https://...) links. Builds elements, never HTML strings. */
function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(/\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    if (match[1] !== undefined) parts.push(<strong key={index}>{match[1]}</strong>);
    else if (match[2] !== undefined) parts.push(<code key={index}>{match[2]}</code>);
    else
      parts.push(
        <a key={index} href={match[4]} target="_blank" rel="noreferrer">
          {match[3]}
        </a>,
      );
    last = index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function WriteUp({ blocks }: { blocks: WriteUpBlock[] }) {
  return (
    <div className="write-up">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} id={block.id}>
                {inline(block.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} id={block.id}>
                {inline(block.text)}
              </h3>
            );
          case "ul":
            return (
              <ul key={index}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{inline(item)}</li>
                ))}
              </ul>
            );
          default:
            return <p key={index}>{inline(block.text)}</p>;
        }
      })}
    </div>
  );
}

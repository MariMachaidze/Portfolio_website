import { ExternalLink } from "lucide-react";
import type { ProjectShowcase, ShowcaseWidget } from "../../types";
import { BUILTIN_STICKERS } from "../../data/stickers";
import { GithubIcon } from "../icons/GithubIcon";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const GRID_COLUMNS = 6;

function WidgetContent({ widget }: { widget: ShowcaseWidget }) {
  switch (widget.type) {
    case "text":
      return (
        <div className="flex h-full flex-col justify-center p-4">
          {widget.heading && <h3 className="mb-1.5 font-heading text-lg font-semibold text-text">{widget.heading}</h3>}
          <p className="text-sm text-muted">{widget.body}</p>
        </div>
      );
    case "image":
      return <img src={widget.src} alt={widget.alt} className="h-full w-full object-cover" />;
    case "video":
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={widget.src} poster={widget.poster} controls className="h-full w-full object-cover" />
      );
    case "youtube":
      return (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${widget.ytId}`}
          title={widget.caption ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    case "vimeo":
      return (
        <iframe
          className="h-full w-full"
          src={`https://player.vimeo.com/video/${widget.vimeoId}`}
          title={widget.caption ?? "Vimeo video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
    case "highlights":
      return (
        <div className="h-full overflow-auto p-4">
          <h3 className="mb-3 text-lg font-semibold text-text">{widget.heading ?? "Key Highlights"}</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
            {widget.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "tech":
      return (
        <div className="h-full overflow-auto p-4">
          <h3 className="mb-3 text-lg font-semibold text-text">{widget.heading ?? "Built With"}</h3>
          <div className="flex flex-wrap gap-2">
            {widget.items.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
        </div>
      );
    case "links":
      return (
        <div className="flex h-full flex-wrap items-center gap-3 p-4">
          {widget.demoUrl && (
            <Button as="a" href={widget.demoUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} /> Live Demo
            </Button>
          )}
          {widget.codeUrl && (
            <Button as="a" href={widget.codeUrl} target="_blank" rel="noreferrer" variant="secondary">
              <GithubIcon size={16} /> View Code
            </Button>
          )}
        </div>
      );
  }
}

export function ShowcaseGrid({ showcase }: { showcase: ProjectShowcase }) {
  const { widgets, stickers } = showcase;
  if (widgets.length === 0 && stickers.length === 0) return null;

  const sortedForMobile = [...widgets].sort((a, b) => a.y - b.y || a.x - b.x);

  return (
    <div>
      {/* Narrow screens: a simple stacked list — the authored x/y/w/h bento
          layout assumes a wide grid, so we don't try to preserve it below
          the sm breakpoint, we just show every widget full-width in order. */}
      <div className="grid gap-4 sm:hidden">
        {sortedForMobile.map((widget) => (
          <div key={widget.id} className="overflow-hidden rounded-2xl border border-border bg-surface-alt">
            <div className="aspect-[4/3]">
              <WidgetContent widget={widget} />
            </div>
          </div>
        ))}
      </div>

      {/* sm and up: the real bento grid, with stickers overlaid on top. */}
      <div
        className="relative hidden gap-4 sm:grid"
        style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`, gridAutoRows: "110px" }}
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface-alt"
            style={{ gridColumn: `${widget.x + 1} / span ${widget.w}`, gridRow: `${widget.y + 1} / span ${widget.h}` }}
          >
            <WidgetContent widget={widget} />
          </div>
        ))}

        {stickers.map((sticker) => {
          const builtin = BUILTIN_STICKERS.find((s) => s.key === sticker.stickerKey);
          return (
            <div
              key={sticker.id}
              className="pointer-events-none z-10 flex items-center justify-center text-3xl"
              style={{ gridColumn: `${sticker.x + 1} / span 1`, gridRow: `${sticker.y + 1} / span 1` }}
            >
              {sticker.stickerKey === "custom" && sticker.customSrc ? (
                <img src={sticker.customSrc} alt="" className="h-10 w-10 object-contain drop-shadow" />
              ) : (
                <span className="drop-shadow">{builtin?.emoji ?? "✨"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

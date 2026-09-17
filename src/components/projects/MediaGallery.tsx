import { useState } from "react";
import type { MediaItem } from "../../types";

function MediaFrame({ item }: { item: MediaItem }) {
  switch (item.type) {
    case "image":
      return <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />;
    case "video":
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={item.src}
          poster={item.poster}
          controls
          className="h-full w-full object-cover"
        />
      );
    case "youtube":
      return (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${item.id}`}
          title={item.caption ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    case "vimeo":
      return (
        <iframe
          className="h-full w-full"
          src={`https://player.vimeo.com/video/${item.id}`}
          title={item.caption ?? "Vimeo video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
  }
}

function mediaLabel(item: MediaItem, index: number) {
  if (item.type === "image") return item.alt || `Image ${index + 1}`;
  return item.caption || `${item.type} ${index + 1}`;
}

export function MediaGallery({ items }: { items: MediaItem[] }) {
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;
  const current = items[active];

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-surface-alt">
        <MediaFrame item={current} />
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {items.map((item, index) => (
            <button
              key={`${item.type}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                index === active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted hover:text-primary"
              }`}
            >
              {mediaLabel(item, index)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

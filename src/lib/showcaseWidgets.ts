import type { ShowcaseWidget } from "../types";

export type WidgetKind = ShowcaseWidget["type"];

export const WIDGET_TYPES: WidgetKind[] = [
  "text",
  "image",
  "video",
  "youtube",
  "vimeo",
  "highlights",
  "tech",
  "links",
];

export function emptyWidget(type: WidgetKind, y: number): ShowcaseWidget {
  const base = { id: crypto.randomUUID(), x: 0, y, w: 2, h: 2 };
  switch (type) {
    case "text":
      return { ...base, type: "text", body: "" };
    case "image":
      return { ...base, type: "image", src: "", alt: "" };
    case "video":
      return { ...base, type: "video", src: "" };
    case "youtube":
      return { ...base, type: "youtube", ytId: "" };
    case "vimeo":
      return { ...base, type: "vimeo", vimeoId: "" };
    case "highlights":
      return { ...base, type: "highlights", items: [] };
    case "tech":
      return { ...base, type: "tech", items: [] };
    case "links":
      return { ...base, type: "links" };
  }
}

export function bottomOf(items: { y: number; h: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.y + item.h), 0);
}

export function widgetPreviewText(widget: ShowcaseWidget): string {
  switch (widget.type) {
    case "text":
      return widget.body || "Text block";
    case "highlights":
    case "tech":
      return widget.items.length > 0 ? widget.items.join(", ") : `${widget.type} (empty)`;
    default:
      return `${widget.type} preview`;
  }
}

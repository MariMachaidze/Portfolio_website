import { useMemo } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { ReactGridLayout as GridLayoutBase, WidthProvider, type Layout } from "react-grid-layout/legacy";
import type { ProjectShowcase, ShowcaseWidget } from "../../types";
import { BUILTIN_STICKERS } from "../../data/stickers";
import { ImagePickerField } from "./ImagePickerField";
import { Button } from "../ui/Button";
import { TextField, TextAreaField } from "./forms/fields";

const GridLayout = WidthProvider(GridLayoutBase);
const GRID_COLUMNS = 6;
const ROW_HEIGHT = 90;

type WidgetKind = ShowcaseWidget["type"];
const WIDGET_TYPES: WidgetKind[] = ["text", "image", "video", "youtube", "vimeo"];

function emptyWidget(type: WidgetKind, y: number): ShowcaseWidget {
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
  }
}

function bottomOf(items: { y: number; h: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.y + item.h), 0);
}

interface ShowcaseGridEditorProps {
  showcase: ProjectShowcase;
  onChange: (showcase: ProjectShowcase) => void;
}

export function ShowcaseGridEditor({ showcase, onChange }: ShowcaseGridEditorProps) {
  const { widgets, stickers } = showcase;

  const layout: Layout = useMemo(
    () => [
      ...widgets.map((w) => ({ i: `widget:${w.id}`, x: w.x, y: w.y, w: w.w, h: w.h, minW: 1, minH: 1 })),
      ...stickers.map((s) => ({ i: `sticker:${s.id}`, x: s.x, y: s.y, w: 1, h: 1, isResizable: false })),
    ],
    [widgets, stickers],
  );

  function handleLayoutChange(nextLayout: Layout) {
    const byId = new Map(nextLayout.map((item) => [item.i, item]));
    onChange({
      widgets: widgets.map((w) => {
        const pos = byId.get(`widget:${w.id}`);
        return pos ? { ...w, x: pos.x, y: pos.y, w: pos.w, h: pos.h } : w;
      }),
      stickers: stickers.map((s) => {
        const pos = byId.get(`sticker:${s.id}`);
        return pos ? { ...s, x: pos.x, y: pos.y } : s;
      }),
    });
  }

  function addWidget(type: WidgetKind) {
    onChange({ widgets: [...widgets, emptyWidget(type, bottomOf(widgets))], stickers });
  }

  function removeWidget(id: string) {
    onChange({ widgets: widgets.filter((w) => w.id !== id), stickers });
  }

  function replaceWidget(id: string, next: ShowcaseWidget) {
    onChange({ widgets: widgets.map((w) => (w.id === id ? next : w)), stickers });
  }

  function changeWidgetType(id: string, type: WidgetKind) {
    const existing = widgets.find((w) => w.id === id);
    if (!existing) return;
    const fresh = emptyWidget(type, existing.y);
    replaceWidget(id, { ...fresh, id, x: existing.x, y: existing.y, w: existing.w, h: existing.h });
  }

  function addSticker(stickerKey: string) {
    onChange({
      widgets,
      stickers: [...stickers, { id: crypto.randomUUID(), x: 0, y: bottomOf(widgets), stickerKey }],
    });
  }

  function removeSticker(id: string) {
    onChange({ widgets, stickers: stickers.filter((s) => s.id !== id) });
  }

  return (
    <div>
      <p className="mb-2 text-xs text-muted">
        Drag to move, drag the bottom-right corner to resize. Widget content (text/images/captions) is edited in the
        list below the grid.
      </p>

      <div className="mb-4 rounded-xl border border-border bg-bg p-2">
        <GridLayout
          cols={GRID_COLUMNS}
          rowHeight={ROW_HEIGHT}
          margin={[8, 8]}
          layout={layout}
          onLayoutChange={handleLayoutChange}
          compactType={null}
          preventCollision={false}
          allowOverlap
        >
          {widgets.map((widget) => (
            <div
              key={`widget:${widget.id}`}
              className="overflow-hidden rounded-lg border border-primary/40 bg-surface"
            >
              <div className="flex items-center justify-between bg-primary/10 px-2 py-1">
                <span className="text-xs font-medium text-primary">{widget.type}</span>
                <button
                  type="button"
                  onClick={() => removeWidget(widget.id)}
                  className="text-xs text-muted hover:text-accent-2"
                  aria-label="Remove widget"
                >
                  ✕
                </button>
              </div>
              <div className="flex h-[calc(100%-24px)] items-center justify-center overflow-hidden p-2 text-center text-xs text-muted">
                {widget.type === "text" ? widget.body || "Text block" : `${widget.type} preview`}
              </div>
            </div>
          ))}

          {stickers.map((sticker) => {
            const builtin = BUILTIN_STICKERS.find((s) => s.key === sticker.stickerKey);
            return (
              <div
                key={`sticker:${sticker.id}`}
                className="group relative flex items-center justify-center rounded-full border border-border bg-surface text-xl"
              >
                {sticker.stickerKey === "custom" && sticker.customSrc ? (
                  <img src={sticker.customSrc} alt="" className="h-6 w-6 object-contain" />
                ) : (
                  <span>{builtin?.emoji ?? "✨"}</span>
                )}
                <button
                  type="button"
                  onClick={() => removeSticker(sticker.id)}
                  className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-accent-2 text-[10px] text-white group-hover:flex"
                  aria-label="Remove sticker"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </GridLayout>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted">Add widget:</span>
        {WIDGET_TYPES.map((type) => (
          <Button key={type} type="button" variant="secondary" onClick={() => addWidget(type)}>
            + {type}
          </Button>
        ))}
        <span className="ml-3 text-xs font-medium text-muted">Add sticker:</span>
        {BUILTIN_STICKERS.map((sticker) => (
          <button
            key={sticker.key}
            type="button"
            onClick={() => addSticker(sticker.key)}
            className="rounded-full border border-border bg-surface px-2.5 py-1.5 text-lg transition-colors duration-200 hover:border-primary"
            title={sticker.label}
          >
            {sticker.emoji}
          </button>
        ))}
      </div>

      {widgets.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-text">Widget content</h4>
          {widgets.map((widget) => (
            <div key={widget.id} className="rounded-lg border border-border bg-surface p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <select
                  value={widget.type}
                  onChange={(e) => changeWidgetType(widget.id, e.target.value as WidgetKind)}
                  className="rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-primary"
                >
                  {WIDGET_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-muted">
                  {widget.w}×{widget.h} grid cells
                </span>
              </div>

              {widget.type === "text" && (
                <>
                  <TextField
                    label="Heading"
                    htmlFor={`showcase-heading-${widget.id}`}
                    value={widget.heading ?? ""}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, heading: e.target.value || undefined })}
                  />
                  <TextAreaField
                    label="Body"
                    htmlFor={`showcase-body-${widget.id}`}
                    rows={3}
                    value={widget.body}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, body: e.target.value })}
                  />
                </>
              )}

              {widget.type === "image" && (
                <>
                  <ImagePickerField
                    label="Image"
                    value={widget.src}
                    onChange={(url) => replaceWidget(widget.id, { ...widget, src: url })}
                  />
                  <TextField
                    label="Alt text"
                    htmlFor={`showcase-alt-${widget.id}`}
                    value={widget.alt}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, alt: e.target.value })}
                  />
                  <TextField
                    label="Caption"
                    htmlFor={`showcase-caption-${widget.id}`}
                    value={widget.caption ?? ""}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, caption: e.target.value || undefined })}
                  />
                </>
              )}

              {widget.type === "video" && (
                <>
                  <TextField
                    label="Video URL"
                    htmlFor={`showcase-src-${widget.id}`}
                    value={widget.src}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, src: e.target.value })}
                  />
                  <TextField
                    label="Caption"
                    htmlFor={`showcase-caption-${widget.id}`}
                    value={widget.caption ?? ""}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, caption: e.target.value || undefined })}
                  />
                </>
              )}

              {widget.type === "youtube" && (
                <>
                  <TextField
                    label="YouTube video ID"
                    htmlFor={`showcase-id-${widget.id}`}
                    value={widget.ytId}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, ytId: e.target.value })}
                  />
                  <TextField
                    label="Caption"
                    htmlFor={`showcase-caption-${widget.id}`}
                    value={widget.caption ?? ""}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, caption: e.target.value || undefined })}
                  />
                </>
              )}

              {widget.type === "vimeo" && (
                <>
                  <TextField
                    label="Vimeo video ID"
                    htmlFor={`showcase-id-${widget.id}`}
                    value={widget.vimeoId}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, vimeoId: e.target.value })}
                  />
                  <TextField
                    label="Caption"
                    htmlFor={`showcase-caption-${widget.id}`}
                    value={widget.caption ?? ""}
                    onChange={(e) => replaceWidget(widget.id, { ...widget, caption: e.target.value || undefined })}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useMemo } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { ReactGridLayout as GridLayoutBase, WidthProvider, type Layout } from "react-grid-layout/legacy";
import type { ProjectShowcase, ShowcaseWidget } from "../../types";
import { BUILTIN_STICKERS } from "../../data/stickers";
import { GRID_COLUMNS, GRID_GAP_PX, ROW_HEIGHT_PX } from "../../lib/showcaseGridGeometry";
import { WIDGET_TYPES, bottomOf, emptyWidget, widgetPreviewText, type WidgetKind } from "../../lib/showcaseWidgets";
import { ShowcaseWidgetEditor } from "./ShowcaseWidgetEditor";
import { Button } from "../ui/Button";

const GridLayout = WidthProvider(GridLayoutBase);

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
        list below the grid. The grid below is sized to match the live project page, so proportions here are what
        visitors will actually see.
      </p>

      {/* Matches ProjectDetailPage's <Container className="max-w-4xl"> content width exactly
          (see src/lib/showcaseGridGeometry.ts), so drag/resize here maps 1:1 to the live page.
          The border uses `ring` (box-shadow) instead of `border`/padding so it doesn't eat into
          that width budget. */}
      <div className="mx-auto mb-4 max-w-4xl px-6">
        <GridLayout
          className="rounded-xl bg-bg ring-1 ring-inset ring-border"
          cols={GRID_COLUMNS}
          rowHeight={ROW_HEIGHT_PX}
          margin={[GRID_GAP_PX, GRID_GAP_PX]}
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
                {widgetPreviewText(widget)}
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
            <ShowcaseWidgetEditor
              key={widget.id}
              widget={widget}
              onChange={(next) => replaceWidget(widget.id, next)}
              onTypeChange={(type) => changeWidgetType(widget.id, type)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

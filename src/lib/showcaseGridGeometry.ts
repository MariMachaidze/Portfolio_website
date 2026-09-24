// Single source of truth for the showcase grid's geometry, shared by the
// public renderer (ShowcaseGrid) and the admin editor (ShowcaseGridEditor),
// so the editor can be sized to match the live page exactly and so image/
// video size suggestions are computed against real on-page proportions.

export const GRID_COLUMNS = 6;
export const GRID_GAP_PX = 16; // matches ShowcaseGrid.tsx's `gap-4`
export const ROW_HEIGHT_PX = 110;

// ProjectDetailPage renders the grid inside <Container className="max-w-4xl">
// (56rem = 896px), whose own px-6 padding (24px each side) leaves this much
// width for the grid itself.
export const CONTENT_WIDTH_PX = 896 - 24 * 2;

export function estimateColumnWidthPx(containerWidthPx: number = CONTENT_WIDTH_PX): number {
  return (containerWidthPx - GRID_GAP_PX * (GRID_COLUMNS - 1) - GRID_GAP_PX * 2) / GRID_COLUMNS;
}

/** Suggests a widget footprint (in grid cells) that best matches an image/video's aspect ratio. */
export function suggestGridSize(naturalWidth: number, naturalHeight: number): { w: number; h: number } {
  const aspect = naturalWidth / naturalHeight;
  const colWidthPx = estimateColumnWidthPx();

  let best = { w: 2, h: 2 };
  let bestError = Infinity;
  for (let w = 2; w <= GRID_COLUMNS; w++) {
    for (let h = 1; h <= 6; h++) {
      const boxAspect = (w * colWidthPx) / (h * ROW_HEIGHT_PX);
      const error = Math.abs(Math.log(boxAspect / aspect));
      if (error < bestError) {
        bestError = error;
        best = { w, h };
      }
    }
  }
  return best;
}

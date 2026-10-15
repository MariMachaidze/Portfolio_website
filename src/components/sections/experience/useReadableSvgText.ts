import { useLayoutEffect, type RefObject } from "react";

/** Minimum on-screen font sizes, in real CSS pixels. */
const MIN_SCREEN_PX = 12; // the OLED display's job details
const MIN_LABEL_PX = 11; // every other functional label
const MIN_FINE_PX = 10; // purely decorative PCB silkscreen

const FINE_TEXT = [
  ".component-id",
  ".component-ref",
  ".encoder-refs text",
  ".fabrication-note",
  ".smd-part text",
  ".component-pin text",
  ".compact-id",
  ".compact-module-label",
  ".compact-display-title",
].join(",");

function overlaps(a: DOMRect, b: DOMRect) {
  return Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
}

function ownsText(el: Element) {
  return [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
}

/**
 * SVG text is sized in viewBox units, so it shrinks with the drawing: the same
 * label is 12px on a wide monitor and 4px on a phone. This measures how much
 * each visible SVG is actually scaled and enlarges any text that would render
 * below a readable minimum, so labels stay legible at every screen size.
 */
export function useReadableSvgText(rootRef: RefObject<HTMLElement | null>, contentKey: unknown) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = () => {
      const jobs: { el: HTMLElement | SVGElement; minUnits: number }[] = [];

      for (const svg of root.querySelectorAll("svg")) {
        const box = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;
        if (box.width === 0 || !viewBox?.width) continue;
        // Text distorts with non-uniform scaling; the smaller axis decides legibility.
        const scale = Math.min(box.width / viewBox.width, box.height / viewBox.height);

        for (const el of svg.querySelectorAll<HTMLElement | SVGElement>("text, foreignObject *")) {
          if (el.tagName.toLowerCase() !== "text" && !ownsText(el)) continue;
          el.style.removeProperty("font-size");
          el.style.removeProperty("visibility");
          const minPx = el.closest("foreignObject") ? MIN_SCREEN_PX : el.matches(FINE_TEXT) ? MIN_FINE_PX : MIN_LABEL_PX;
          jobs.push({ el, minUnits: minPx / scale });
        }
      }

      // Read every size before writing any, so the browser lays out once.
      const designUnits = jobs.map(({ el }) => parseFloat(getComputedStyle(el).fontSize));
      jobs.forEach(({ el, minUnits }, i) => {
        if (designUnits[i] < minUnits) el.style.setProperty("font-size", `${minUnits.toFixed(2)}px`, "important");
      });

      // Enlarged decorative labels can run into real ones; decoration gives way.
      const labels = jobs.map(({ el }) => el).filter((el) => el.tagName.toLowerCase() === "text");
      const boxes = labels.map((el) => el.getBoundingClientRect());
      const kept: DOMRect[] = [];
      labels.forEach((el, i) => {
        if (el.matches(FINE_TEXT)) return;
        if (boxes[i].width) kept.push(boxes[i]);
      });
      labels.forEach((el, i) => {
        if (!el.matches(FINE_TEXT) || !boxes[i].width) return;
        if (kept.some((box) => overlaps(box, boxes[i]))) el.style.setProperty("visibility", "hidden");
        else kept.push(boxes[i]);
      });
    };

    apply();
    const observer = new ResizeObserver(apply);
    for (const svg of root.querySelectorAll("svg")) observer.observe(svg);
    return () => observer.disconnect();
  }, [rootRef, contentKey]);
}

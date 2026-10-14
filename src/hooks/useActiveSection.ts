import { useEffect, useState } from "react";

/**
 * Tracks which of the given section ids currently sits "under" the given
 * offset (e.g. a sticky navbar's height) — the standard scrollspy behavior:
 * a section becomes active once you've scrolled past its top edge, and stays
 * active until the next section's top edge also passes that line.
 *
 * Returns null when disabled, when none of the ids exist in the DOM (e.g. on
 * a route that doesn't render these sections), or before the first scroll
 * has resolved an active section.
 */
export function useActiveSection(ids: string[], offsetPx: number, enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || ids.length === 0) return;

    let ticking = false;

    function update() {
      ticking = false;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offsetPx + 1) {
          current = id;
        }
      }
      setActive(current);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled, offsetPx, ids]);

  return enabled ? active : null;
}

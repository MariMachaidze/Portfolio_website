import { useEffect, useRef, useState } from "react";

/**
 * Steps an animated figure through `length` states on a timer, only while it's on screen. With
 * reduced motion it stays on the last state, so the figure shows its finished picture.
 */
export function useFigureTicker(length: number, intervalMs: number) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [tick, setTick] = useState(reduced ? length - 1 : 0);

  useEffect(() => {
    const root = rootRef.current;
    if (reduced || !root) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setTick((t) => (t + 1) % length), intervalMs);
    });
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [reduced, length, intervalMs]);

  return { rootRef, tick };
}

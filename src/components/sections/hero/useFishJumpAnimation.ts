import { useLayoutEffect, type RefObject } from "react";

const VARIANT_SELECTOR = ".mobile-design, .tablet-design, .desktop-design";
const STAGE_SELECTORS = [
  "[data-name='Fish leap — waterline stage']",
  "[data-name='Fish leap — opposite direction 2']",
  "[data-name='Fish leap — opposite direction 3']",
];
const ANIMATED_SELECTOR = [
  "[data-name='Doodle fish — jumping out and diving under']",
  "[data-name='Doodle fish 2 — jumping left']",
  "[data-name='Doodle fish 3 — jumping left']",
  "[data-name='Water splash — launch droplets']",
  "[data-name='Water splash — landing droplets']",
  "[data-name='Landing ripple — expanding ring']",
].join(",");

/**
 * Randomly re-triggers the hero landscape's "fish leap" easter egg at each of
 * its three stages, restarting the (run-once) CSS animation via the classic
 * animation:none -> reflow -> removeProperty trick. Scoped to a container
 * ref (rather than the whole document) since this hero illustration is one
 * section on a larger page, not a full-page app.
 */
export function useFishJumpAnimation(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let resizeTimer = 0;
    const jumpTimers = new Set<number>();

    const clearJumpTimers = () => {
      jumpTimers.forEach((timer) => window.clearTimeout(timer));
      jumpTimers.clear();
    };

    const startRandomFish = () => {
      clearJumpTimers();

      const variant = [...container.querySelectorAll<HTMLElement>(VARIANT_SELECTOR)].find(
        (element) => window.getComputedStyle(element).display !== "none",
      );

      if (!variant) return;

      const stages = STAGE_SELECTORS.map((selector) => variant.querySelector<HTMLElement>(selector)).filter(
        (stage): stage is HTMLElement => stage !== null,
      );

      stages.forEach((stage, index) => {
        stage.querySelectorAll<HTMLElement>(ANIMATED_SELECTOR).forEach((part) => {
          part.style.animation = "none";
        });

        const scheduleJump = (callback: () => void, delay: number) => {
          const timer = window.setTimeout(() => {
            jumpTimers.delete(timer);
            callback();
          }, delay);
          jumpTimers.add(timer);
        };

        const jump = () => {
          if (cancelled) return;

          const landscape = stage.closest<HTMLElement>(
            "[data-name='Doodle landscape — hills, waves and sunshine']",
          );
          const movableStage = index === 0 ? stage : (stage.parentElement?.parentElement as HTMLElement | null);

          if (landscape && movableStage) {
            const maximumLeft = Math.max(0, landscape.clientWidth - 190);
            movableStage.style.left = `${Math.round(Math.random() * maximumLeft)}px`;
          }

          const animatedParts = stage.querySelectorAll<HTMLElement>(ANIMATED_SELECTOR);

          animatedParts.forEach((part) => {
            part.style.animation = "none";
          });
          void stage.offsetWidth;
          animatedParts.forEach((part) => {
            part.style.removeProperty("animation");
          });

          scheduleJump(jump, 5200 + Math.random() * 3000);
        };

        scheduleJump(jump, index * 350 + Math.random() * 300);
      });
    };

    startRandomFish();

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(startRandomFish, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      clearJumpTimers();
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRef]);
}

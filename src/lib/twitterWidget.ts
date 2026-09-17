declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (el?: HTMLElement) => void;
      };
    };
  }
}

const SCRIPT_ID = "twitter-wjs";

/** Lazily injects platform.twitter.com/widgets.js once, resolving when window.twttr is ready. */
export function loadTwitterWidget(): Promise<void> {
  return new Promise((resolve) => {
    if (window.twttr?.widgets) {
      resolve();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = "https://platform.twitter.com/widgets.js";
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

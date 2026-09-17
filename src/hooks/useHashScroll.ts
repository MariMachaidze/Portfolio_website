import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element matching `location.hash` on mount/navigation.
 * Needed only for links arriving from another route (e.g. "/projects/foo" ->
 * "/#projects"); in-page anchor clicks on "/" are plain <a href="#..."> tags
 * handled entirely by CSS `scroll-behavior: smooth`, no router involved.
 */
export function useHashScroll() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);
}

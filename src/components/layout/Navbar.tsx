import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "../../data/profile";
import { useActiveSection } from "../../hooks/useActiveSection";
import { Container } from "../ui/Container";

const NAV_ITEMS = [
  { label: "Home", id: "hero" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

// Each homepage section's own background color, so the sticky navbar can
// match whatever's currently scrolled underneath it. Keep this in sync with
// each section's actual background (Hero/Experience/Contact share the
// site's default --color-bg; Skills has its own fixed chip color; Projects
// uses --color-surface-alt). Baked in at 90% alpha to match the navbar's
// previous `bg-bg/90` look.
const SECTION_BG: Record<string, string> = {
  hero: "rgba(250, 246, 239, 0.9)",
  skills: "rgba(168, 192, 219, 0.9)",
  experience: "rgba(250, 246, 239, 0.9)",
  projects: "rgba(242, 236, 224, 0.9)",
  contact: "rgba(250, 246, 239, 0.9)",
};
const DEFAULT_BG = "rgba(250, 246, 239, 0.9)";
const NAVBAR_HEIGHT_PX = 64;

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS, NAVBAR_HEIGHT_PX, isHome);
  const navbarBg = isHome ? (activeSection ? SECTION_BG[activeSection] : DEFAULT_BG) : undefined;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur transition-colors duration-300 ${navbarBg ? "" : "bg-bg/90"}`}
      style={navbarBg ? { backgroundColor: navbarBg } : undefined}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="font-heading text-lg font-semibold text-text">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) =>
            isHome ? (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={`/#${item.id}`}
                className="text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text md:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav className="border-t border-border bg-bg md:hidden">
          <Container className="flex flex-col py-4">
            {NAV_ITEMS.map((item) =>
              isHome ? (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={`/#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-primary"
                >
                  {item.label}
                </Link>
              ),
            )}
          </Container>
        </nav>
      )}
    </header>
  );
}

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { profile } from "../../data/profile";
import { Container } from "../ui/Container";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { label: "Home", id: "hero" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur">
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
          <ThemeToggle />
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

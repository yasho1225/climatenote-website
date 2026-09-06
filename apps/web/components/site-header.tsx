"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NoteMark } from "@/components/note-mark";

const links = [
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/articles" ? pathname.startsWith("/articles") : pathname === href;

  // Only the homepage opens on a full-bleed dark hero, so only there does the
  // bar float over the media. Every other route keeps its solid header.
  const overlay = pathname === "/" && !scrolled && !menuOpen;

  return (
    <header
      className="site-header"
      data-scrolled={scrolled}
      data-menu-open={menuOpen}
      data-overlay={overlay}
    >
      <div className="site-header__bar">
        <Link className="wordmark" href="/" aria-label="The Climate Note, home">
          <NoteMark className="wordmark__mark" />
          <span className="wordmark__text">
            The Climate <em>Note</em>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-nav__link"
              data-active={isActive(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="site-nav__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="site-nav__toggle-label">{menuOpen ? "Close" : "Menu"}</span>
          <span className="site-nav__toggle-glyph" data-open={menuOpen} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div className="mobile-nav" id="mobile-nav" hidden={!menuOpen}>
        <nav aria-label="Primary, mobile">
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-nav__link"
              data-active={isActive(link.href)}
              onClick={() => setMenuOpen(false)}
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className="mobile-nav__index">{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

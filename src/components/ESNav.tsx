"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI, navReveal } from "@/context/UIContext";
import { useIndex, type HomeView } from "@/context/IndexContext";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Labelled with the mode it switches to. Hidden until mounted, since the
// resolved theme is only known on the client.
function ThemeToggle({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "default";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Only read the theme once mounted: next-themes already knows it on the
  // client's first render, which would make the label differ from the
  // server's and break hydration.
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="link"
      size={size}
      className={`${className ?? ""} ${mounted ? "" : "invisible"}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}

// The home page's views, switched in place (IndexContext): the mobile menu
// here, and on desktop the column at the top left of the home page
// (HomeLayoutClient).
export const VIEW_LINKS: { view: HomeView; label: string }[] = [
  { view: "works", label: "Works" },
  { view: "exhibitions", label: "Exhibitions" },
  { view: "info", label: "Info" },
];

export default function ESNav() {
  const {
    openDesktopNav: open,
    setOpenDesktopNav,
    setFilterOpen,
    introPhase,
    siteReveal,
    imageSize,
    setImageSize,
  } = useUI();
  const pathname = usePathname();
  // The home page's current view; switching it (in place on "/", or going
  // to "/?view=…" from another page).
  const { mode, setMode } = useIndex();
  const viewActive = (v: HomeView) => pathname === "/" && mode === v;
  const worksLayout = pathname === "/" && mode === "works";
  // Image size buttons (the site-wide setting) — shown with the works /
  // exhibitions lists.
  const showSizes =
    pathname === "/" && (mode === "works" || mode === "exhibitions");
  const sizeButtons = (className: string) => (
    <div
      className={`flex gap-3 font-gtAmericaCondensed font-black uppercase tracking-tight text-sm leading-none text-primary ${className}`}
    >
      {(["S", "M", "L"] as const).map((sz) => (
        <button
          key={sz}
          type="button"
          onClick={() => setImageSize(sz)}
          aria-pressed={imageSize === sz}
          aria-label={
            sz === "S"
              ? "Small images"
              : sz === "M"
                ? "Medium images"
                : "Large images"
          }
          className={`cursor-pointer ${imageSize === sz ? "" : "opacity-40 hover:opacity-100"}`}
        >
          {sz}
        </button>
      ))}
    </div>
  );
  // Home page: the nav fades in last, item by item (siteReveal "nav").
  const navShown =
    pathname !== "/" || (introPhase === "done" && siteReveal === "nav");
  const toggleOpen = () => {
    const next = !open;
    setOpenDesktopNav(next);
    if (next) setFilterOpen(false);
  };

  // Sanity Studio has its own UI — no site nav (or logo) on top of it.
  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      {/* Mobile nav: "Elinor Silow" and "MENU" fixed across the top. Hidden during the home page intro (backdrop, then media),
          then fades in. Stays visible above modals (z-80 > their z-70). */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-80 w-full ${navShown ? "" : "pointer-events-none"}`}
      >
        {/* Fixed across the top, a 2-col grid (like the mobile list rows):
            "Elinor Silow" (home) in col 1, "MENU" (opens the menu panel) in
            col 2. */}
        <nav
          className={`fixed inset-x-0 top-0 grid grid-cols-2 gap-x-2 items-center h-9 px-3 bg-linear-to-b from-background to-transparent whitespace-nowrap text-sm font-gtAmericaCondensed uppercase font-normal tracking-normal leading-none text-foreground`}
        >
          <Link
            href="/"
            className={`col-start-1 row-start-1 justify-self-start ${navReveal(navShown, 0).className}`}
            style={navReveal(navShown, 0).style}
          >
            Elinor Silow
          </Link>
          <button
            type="button"
            style={navReveal(navShown, 1).style}
            className={`col-start-2 row-start-1 justify-self-start text-left uppercase cursor-pointer ${navReveal(navShown, 1).className}`}
            onClick={toggleOpen}
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>
      {/* Desktop nav, fixed at the top on every page: "Elinor Silow" top
          left, the links always visible in the grid (no MENU on desktop).
          Same intro fade and stacking above modals as the mobile nav. */}
      <nav
        className={`hidden lg:grid fixed inset-x-0 top-0 z-80 grid-cols-12 gap-x-4 px-4 h-9 bg-linear-to-b from-background to-transparent items-center ${navShown ? "" : "pointer-events-none"}`}
      >
        {/* Image size S / M / L: top right (col 12, right edge). */}
        {showSizes &&
          sizeButtons(
            `col-start-12 row-start-1 justify-self-end py-1 ${navReveal(navShown, 0).className}`,
          )}
        {/* "Elinor Silow" (home), top left (cols 1–2). */}
        <Link
          href="/"
          className={`col-start-1 col-span-2 row-start-1 justify-self-start py-1 whitespace-nowrap text-sm uppercase leading-none font-gtAmericaCondensed  text-foreground ${navReveal(navShown, 0).className}`}
        >
          Elinor Silow
        </Link>
      </nav>
      {/* Mobile menu — a full-height overlay (h-dvh, page background) with the links
          stacked. Sits under the "Elinor Silow, CLOSE" line (z-80) so that
          stays visible to close it. Picking a link closes the menu. */}
      {open && (
        <nav className="lg:hidden fixed inset-x-0 top-0 h-dvh z-[75] flex flex-col items-start justify-center  gap-0 p-3 pb-16 bg-background text-foreground font-gtAmericaCondensed text-3xl leading-tight uppercase">
          <div className="relative flex flex-col items-start px-0 py-8">
            {VIEW_LINKS.map(({ view, label }) => (
              <button
                key={view}
                type="button"
                aria-current={viewActive(view) ? "page" : undefined}
                className="uppercase cursor-pointer"
                onClick={() => {
                  setMode(view);
                  setOpenDesktopNav(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}

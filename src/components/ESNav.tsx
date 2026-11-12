"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUI, navReveal } from "@/context/UIContext";
import { useIndex, isIndexPath, type HomeView } from "@/context/IndexContext";
import FilterSettings from "./FilterMenu";
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

// The index section's views, in the menu.
export const VIEW_LINKS: { view: HomeView; label: string; href: string }[] = [
  { view: "works", label: "Works", href: "/works" },
  { view: "exhibitions", label: "Exhibitions", href: "/exhibitions" },
  { view: "info", label: "Info", href: "/info" },
];

export default function ESNav() {
  const {
    openDesktopNav: open,
    setOpenDesktopNav,
    filterOpen,
    setFilterOpen,
  } = useUI();
  const pathname = usePathname();
  const { mode, search, setSearch } = useIndex();
  const onIndex = isIndexPath(pathname);
  // List settings — shown with the works / exhibitions lists: the Filter menu
  // on desktop, S / M / L in the mobile menu.
  const showSizes = onIndex && mode !== "info";
  // Works and exhibitions: the List / Image view toggle.
  const { worksLayout, setWorksLayout } = useIndex();
  const layoutButtons = (className: string, afterPick?: () => void) => (
    // One toggle: shows the current view and switches to the other.
    <button
      type="button"
      onClick={() => {
        setWorksLayout(worksLayout === "grid" ? "list" : "grid");
        afterPick?.();
      }}
      aria-label={`Switch to ${worksLayout === "grid" ? "image" : "list"} view`}
      className={`cursor-pointer normal-case ${className}`}
    >
      {worksLayout === "grid" ? "List" : "Image"}
    </button>
  );
  // The nav shows right away on every page (it used to fade in last on the
  // home and index pages).
  const navShown = true;
  // An exhibition's or a work's own page: BACK, to where the visitor came
  // from on the site (else the list it belongs to).
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const exhibitionPage = segments[0] === "exhibitions" && segments.length === 2;
  const workPage =
    segments.length === 1 &&
    !["works", "exhibitions", "info", "privacy-policy", "studio"].includes(
      segments[0],
    );
  const showBack = exhibitionPage || workPage;
  const goBack = () => {
    if (document.referrer.startsWith(window.location.origin)) router.back();
    else router.push(exhibitionPage ? "/exhibitions" : "/works");
  };
  const toggleOpen = () => {
    const next = !open;
    setOpenDesktopNav(next);
    if (next) setFilterOpen(false);
  };

  // Sanity Studio has its own UI — no site nav (or logo) on top of it.
  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      {/* Back (an exhibition's or work's own page), fixed top right — the
          only nav there. */}
      {showBack && (
        <button
          type="button"
          onClick={goBack}
          className="fixed top-3 lg:top-6 right-3 lg:right-6 z-80 font-gensco text-[18px] lg:text-[21px] leading-tight text-neutral-800 cursor-pointer"
        >
          Back
        </button>
      )}
      {/* The nav, a bar fixed across the top (mobile and desktop alike):
          "Elinor Silow" (home) and Menu at the top left. Desktop: Menu opens
          to "Menu:" with Works, Exhibitions and Info beside it; mobile: it
          opens the overlay below. Stays above modals (z-80 > their z-70). */}
      <nav
        className={`fixed inset-x-0 top-0 z-80 ${showBack ? "hidden" : "flex"} items-baseline justify-between gap-x-3 lg:gap-x-6 h-6 px-1 lg:px-1 lg:h-6 pt-0 pb-0 bg-background lg:bg-background ${navShown ? "" : "pointer-events-none"}`}
      >
        <span className="flex flex-wrap items-baseline gap-x-4 font-gensco text-[18px] lg:text-[21px] leading-tight whitespace-nowrap text-neutral-800">
          <Link
            href="/"
            style={navReveal(navShown, 0).style}
            className={navReveal(navShown, 0).className}
          >
            Elinor Silow
          </Link>
          {/* Menu (and, open, ": Works Exhibitions Info"), next to the logo
              at the left; normal case. */}
          <span className="flex font-gensco font-normal text-[18px] lg:text-[21px]  items-baseline gap-x-4 justify-between normal-case lg:justify-start">
            <button
              type="button"
              style={navReveal(navShown, 1).style}
              // Mobile, on the works / exhibitions lists: at the right instead,
              // next to the List / Image toggle.
              className={`cursor-pointer normal-case ${showSizes ? "hidden lg:inline" : ""} ${navReveal(navShown, 1).className}`}
              onClick={toggleOpen}
              aria-expanded={open}
            >
              {open ? "Menu" : "Menu"}
            </button>
            <span className="hidden lg:flex items-baseline gap-x-4 font-gensco text-[18px] lg:text-[21px] font-normal normal-case">
              <span className=" ">:</span>
              {open &&
                VIEW_LINKS.map(({ view, label, href }, i) => (
                  <Link
                    key={view}
                    href={href}
                    scroll={false}
                    onClick={() => {
                      setSearch("");
                      // Desktop: the menu stays open.
                      if (!window.matchMedia("(min-width: 1024px)").matches)
                        setOpenDesktopNav(false);
                    }}
                    aria-current={pathname === href ? "page" : undefined}
                    className={pathname === href ? "" : "opacity-50  "}
                  >
                    {label}
                  </Link>
                ))}
            </span>
          </span>
        </span>
        {/* The works / exhibitions lists: Filter (opens the Filter overlay;
            the button stays above it to close it) — at the right, on the
            same baseline as the name and Menu. Mobile: just Filter (search
            and Vertical / Grid are in the Filter menu there). */}
        {showSizes && (
          <div className="flex items-baseline gap-x-4 font-gensco text-[18px] lg:text-[21px] font-normal tracking-wide leading-tight whitespace-nowrap text-neutral-800">
            {/* Search (the shared index search: filters the list), left of
                Vertical / Grid. */}
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              aria-label={`Search ${mode}`}
              style={navReveal(navShown, 2).style}
              className={`hidden lg:block w-32 p-0 border-0 bg-transparent outline-none normal-case placeholder:text-neutral-400 ${navReveal(navShown, 2).className}`}
            />
            {/* List / Image toggle: works and exhibitions — at the right
                of the bar, mobile and desktop. */}
            {layoutButtons(`flex ${navReveal(navShown, 3).className}`)}
            {/* Mobile: Menu, next to the toggle (at the left on desktop). */}
            <button
              type="button"
              className="lg:hidden cursor-pointer normal-case"
              onClick={toggleOpen}
              aria-expanded={open}
            >
              Menu
            </button>
            <button
              type="button"
              aria-expanded={filterOpen}
              data-filter-toggle
              onClick={() => {
                setFilterOpen(!filterOpen);
                // Mobile: the menu closes (desktop keeps it open).
                if (!window.matchMedia("(min-width: 1024px)").matches)
                  setOpenDesktopNav(false);
              }}
              style={navReveal(navShown, 2).style}
              // Hidden for now: the category is toggled from the list's
              // heading instead.
              className={`hidden cursor-pointer   ${navReveal(navShown, 2).className}`}
            >
              {filterOpen ? "Filter-" : "Filter+"}
            </button>
          </div>
        )}
      </nav>
      {/* Mobile: Menu opens a full-screen overlay (page background, under the
          bar so Menu stays on top to close it) with Works, Exhibitions and
          Info stacked; picking one closes it. */}
      {open && !showBack && (
        <nav className="lg:hidden fixed inset-0 bottom-0 left-0 z-[75] flex flex-col items-start gap-y-0 px-2 pt-6 pb-0 bg-background font-alteHaas font-bold uppercase text-[48px] leading-none text-neutral-800">
          {VIEW_LINKS.map(({ view, label, href }) => (
            <Link
              key={view}
              href={href}
              scroll={false}
              onClick={() => {
                setSearch("");
                setOpenDesktopNav(false);
              }}
              aria-current={pathname === href ? "page" : undefined}
              className={
                pathname === href ? "text-purple-950" : "text-purple-200"
              }
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
      {/* Filter overlay: full height, under the nav (like the menu). */}
      {showSizes && filterOpen && (
        <FilterSettings onClose={() => setFilterOpen(false)} />
      )}
    </>
  );
}

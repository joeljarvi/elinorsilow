"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUI, navReveal } from "@/context/UIContext";
import {
  useIndex,
  isIndexPath,
  type HomeView,
  type WorksLayout,
} from "@/context/IndexContext";
import FilterSettings from "./FilterMenu";
import ActiveFilters from "./ActiveFilters";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useCssHeightVar } from "@/lib/useCssHeightVar";

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

const LAYOUT_LABEL: Record<WorksLayout, string> = {
  list: "List",
  image: "Image",
  grid: "Grid",
};

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
  // Works: Index. Off, the image feed; clicking it shows the list, with
  // List / Grid beside it to switch between the index's two views.
  const { worksLayout, setWorksLayout } = useIndex();
  const indexOn = worksLayout !== "image";
  // The active filters: works and exhibitions, hidden in the index.
  const showFilters = showSizes && !(mode === "works" && indexOn);
  const indexViews: WorksLayout[] = ["list", "grid"];
  const layoutButtons = (className: string) => (
    <span className={`items-baseline gap-x-3 normal-case ${className}`}>
      <button
        type="button"
        onClick={() => setWorksLayout(indexOn ? "image" : "list")}
        aria-pressed={indexOn}
        className="cursor-pointer normal-case"
      >
        Index
      </button>
      {indexOn && (
        <>
          <span>:</span>
          {indexViews.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setWorksLayout(v)}
              aria-pressed={worksLayout === v}
              className={`cursor-pointer normal-case ${worksLayout === v ? "" : "opacity-50"}`}
            >
              {LAYOUT_LABEL[v]}
            </button>
          ))}
        </>
      )}
    </span>
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

  // The exhibitions list: the bar keeps its background, with the fade under
  // it, on desktop too.
  const onExhibitions = pathname === "/exhibitions";

  // Sanity Studio has its own UI — no site nav (or logo) on top of it.
  // The bar's height, as --nav-h (exhibition images fit between it and the
  // title block).
  const navRef = useRef<HTMLElement>(null);
  useCssHeightVar(navRef, "--nav-h", !showBack);

  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      {/* Back (an exhibition's or work's own page), fixed top right — the
          only nav there. */}
      {showBack && (
        <button
          type="button"
          onClick={goBack}
          className="fixed top-3 lg:top-6 right-3 lg:right-6 z-80 font-gensco text-[18px] lg:text-[18px] leading-tight text-neutral-800 cursor-pointer"
        >
          Back
        </button>
      )}
      {/* The nav, a bar fixed across the bottom (mobile and desktop alike):
          "Elinor Silow" (home) and Menu at the bottom left. Desktop: Menu opens
          to "Menu:" with Works, Exhibitions and Info beside it; mobile: it
          opens the overlay below. Stays above modals (z-80 > their z-70). */}
      <nav
        ref={navRef}
        className={`fixed inset-x-0 bottom-0 z-80 ${showBack ? "hidden" : "flex"} items-end justify-between gap-x-3 lg:gap-x-6 h-12 lg:h-16 px-3 lg:px-6 pt-0 pb-3 lg:pb-6 bg-background ${onExhibitions ? "" : "lg:bg-background"} ${navShown ? "" : "pointer-events-none"}`}
      >
        <span className="flex flex-wrap items-baseline gap-x-4 font-gensco text-[18px] leading-tight whitespace-nowrap text-neutral-800">
          <Link
            href="/works"
            style={navReveal(navShown, 0).style}
            className={navReveal(navShown, 0).className}
          >
            Elinor Silow
          </Link>
          {/* Menu (and, open, ": Works Exhibitions Info"), normal case —
              next to the logo at the left (desktop). */}
          <span className="flex font-gensco font-normal text-[18px]  items-baseline gap-x-3 justify-between normal-case lg:justify-start">
            <button
              type="button"
              style={navReveal(navShown, 1).style}
              className={`cursor-pointer normal-case ${navReveal(navShown, 1).className}`}
              onClick={toggleOpen}
              aria-expanded={open}
            >
              {open ? "Menu" : "Menu"}
            </button>
            <span className="hidden lg:flex items-baseline gap-x-3 font-gensco text-[18px] font-normal normal-case">
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
        {/* Right side (works / exhibitions): search, List / Image and
            Filter. */}
        <div className="flex items-baseline gap-x-12 font-gensco text-[18px] font-normal tracking-wide leading-tight whitespace-nowrap text-neutral-800">
          {showSizes && (
            <>
              {/* Search (the shared index search: filters the list) —
                hidden for now, mobile and desktop. */}
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                aria-label={`Search ${mode}`}
                style={navReveal(navShown, 2).style}
                className={`hidden w-32 p-0 border-0 bg-transparent outline-none normal-case placeholder:text-neutral-400 ${navReveal(navShown, 2).className}`}
              />
              {/* Index (and, on, List / Grid): works only — at the right
                of the bar, mobile and desktop. */}
              {mode === "works" &&
                layoutButtons(`flex ${navReveal(navShown, 3).className}`)}
            </>
          )}
          {/* Info: Instagram, at the right of the bar ("IG" on mobile). */}
          {pathname === "/info" && (
            <a
              href="https://www.instagram.com/elinorsilow"
              target="_blank"
              rel="noopener noreferrer"
              style={navReveal(navShown, 2).style}
              aria-label="Instagram"
              className={`normal-case ${navReveal(navShown, 2).className}`}
            >
              <span className="lg:hidden">IG</span>
              <span className="hidden lg:inline">Instagram</span>
            </a>
          )}
          {showSizes && (
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
          )}
        </div>
      </nav>
      {/* Mobile: Menu opens a full-screen overlay (page background, under the
          bar so Menu stays on top to close it) with Works, Exhibitions and
          Info stacked, then Email; picking a link closes it. */}
      {open && !showBack && (
        <nav className="lg:hidden fixed  bottom-0 left-0 z-[75] flex flex-col items-start justify-end gap-y-0 px-3 pt-10 pb-3 bg-background font-gensco text-[36px] leading-none text-neutral-800 w-full h-full">
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
                pathname === href ? "text-neutral-800" : "text-neutral-300"
              }
            >
              {label}
            </Link>
          ))}
          {/* Email, after the links. */}
          <a
            href="mailto:elinor.silow@gmail.com"
            className="mt-6 text-neutral-300"
          >
            Email
          </a>
        </nav>
      )}
      {/* The active filters (category cycling), fixed at the top right —
          mobile and desktop; hidden in the index (List / Grid). z-71: above
          the feed's title block (z-70), under the mobile menu (z-75). */}
      {showFilters && !showBack && (
        <ActiveFilters className="fixed top-3 right-3 lg:top-6 lg:right-6 z-[71] flex font-gensco text-[18px] leading-tight text-neutral-800" />
      )}
      {/* Filter overlay: full height, under the nav (like the menu). */}
      {showSizes && filterOpen && (
        <FilterSettings onClose={() => setFilterOpen(false)} />
      )}
    </>
  );
}

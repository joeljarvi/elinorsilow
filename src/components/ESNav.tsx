"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUI, navReveal } from "@/context/UIContext";
import {
  useIndex,
  isIndexPath,
  type HomeView,
} from "@/context/IndexContext";
import FilterSettings from "./FilterMenu";
import FadeEdge from "./FadeEdge";
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
    siteReveal,
  } = useUI();
  const pathname = usePathname();
  const { mode, setSearch } = useIndex();
  const onIndex = isIndexPath(pathname);
  // List settings — shown with the works / exhibitions lists: the Filter menu
  // on desktop, S / M / L in the mobile menu.
  const showSizes = onIndex && mode !== "info";
  // Works: "Vertical, Grid" — like the Filter menu's options (the current
  // one solid, the other faded).
  const { worksLayout, setWorksLayout } = useIndex();
  const layoutButtons = (className: string, afterPick?: () => void) => (
    <div className={`flex gap-x-1 ${className}`}>
      {(
        [
          ["list", "Vertical,"],
          ["grid", "Grid"],
        ] as const
      ).map(([l, label]) => (
        <button
          key={l}
          type="button"
          aria-pressed={worksLayout === l}
          onClick={() => {
            setWorksLayout(l);
            afterPick?.();
          }}
          className={`cursor-pointer ${worksLayout === l ? "" : "opacity-40 hover:opacity-100"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
  // Home and index pages: the nav fades in last, item by item (siteReveal
  // "nav").
  const navShown = !(pathname === "/" || onIndex) || siteReveal === "nav";
  // An exhibition's or a work's own page: BACK, to where the visitor came
  // from on the site (else the list it belongs to).
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const exhibitionPage = segments[0] === "exhibitions" && segments.length === 2;
  const workPage =
    segments.length === 1 &&
    ![
      "works",
      "exhibitions",
      "info",
      "privacy-policy",
      "studio",
    ].includes(segments[0]);
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

  // Works in Vertical mode: the bar is transparent, with no fade under it.
  const vertical = onIndex && mode === "works" && worksLayout === "list";

  // Sanity Studio has its own UI — no site nav (or logo) on top of it.
  // The home page has its own links — no nav there either.
  if (pathname.startsWith("/studio") || pathname === "/") return null;

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
      {/* The nav, a bar fixed across the top (purple-400): "Elinor Silow"
          (home) and Menu together at the top left. Menu opens to "Menu:"
          with Works, Exhibitions and Info beside it; the current one
          underlined. Stays above modals (z-80 > their z-70). */}
      <nav
        className={`fixed inset-x-0 top-0 z-80 ${showBack ? "hidden" : "flex"} items-baseline justify-between gap-x-3 lg:gap-x-6 h-9 pt-3 lg:h-16 px-3 lg:px-6 lg:pt-6 pb-0 ${vertical ? "bg-transparent" : "bg-background"} ${navShown ? "" : "pointer-events-none"}`}
      >
        {/* The page background fading out just below the bar, so the page
            fades as it scrolls under it. */}
        {!vertical && <FadeEdge />}
        <span className="flex flex-wrap items-baseline gap-x-6 font-gensco text-[18px] lg:text-[21px] leading-tight whitespace-nowrap text-neutral-800">
          <Link
            href="/"
            style={navReveal(navShown, 0).style}
            className={navReveal(navShown, 0).className}
          >
            Elinor Silow
          </Link>
          <span className="flex  items-baseline gap-x-6 justify-between lg:justify-start ">
            <button
              type="button"
              style={navReveal(navShown, 1).style}
              className={`cursor-pointer ${navReveal(navShown, 1).className}`}
              onClick={toggleOpen}
              aria-expanded={open}
            >
              {open ? "Menu:" : "Menu"}
            </button>
            <span className="flex gap-x-1">
              {open &&
                VIEW_LINKS.map(({ view, label, href }, i) => (
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
                      pathname === href
                        ? "underline underline-offset-4 decoration-1"
                        : "opacity-50"
                    }
                  >
                    {label}
                    {i < VIEW_LINKS.length - 1 && ","}
                  </Link>
                ))}
            </span>
          </span>
        </span>
        {/* The works / exhibitions lists: Filter (opens the Filter overlay;
            the button stays above it to close it) — at the right, on the
            same baseline as the name and Menu; mobile: the bottom right. */}
        {showSizes && (
          <div className="flex items-baseline gap-x-6 max-lg:fixed max-lg:bottom-6 max-lg:right-3 font-gensco text-[18px] lg:text-[21px] leading-tight  text-neutral-800">
            <button
              type="button"
              aria-expanded={filterOpen}
              data-filter-toggle
              onClick={() => {
                setFilterOpen(!filterOpen);
                setOpenDesktopNav(false);
              }}
              style={navReveal(navShown, 2).style}
              className={`cursor-pointer  ${navReveal(navShown, 2).className}`}
            >
              {filterOpen ? "Close" : "Filter+"}
            </button>
          </div>
        )}
      </nav>
      {/* Works: Vertical / Grid, fixed in the bottom right corner (mobile:
          top right, in the nav bar's line). */}
      {showSizes &&
        !showBack &&
        mode === "works" &&
        layoutButtons(
          `fixed top-3 right-3 lg:top-auto lg:right-6 lg:bottom-6 z-80 font-gensco text-[18px] lg:text-[21px] leading-tight text-neutral-800 ${navShown ? "" : "pointer-events-none"} ${navReveal(navShown, 3).className}`,
        )}
      {/* Filter overlay: full height, under the nav (like the menu). */}
      {showSizes && filterOpen && (
        <FilterSettings onClose={() => setFilterOpen(false)} />
      )}
    </>
  );
}

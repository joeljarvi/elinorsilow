"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUI, navReveal } from "@/context/UIContext";
import { useIndex, type HomeView } from "@/context/IndexContext";
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
  { view: "works", label: "Works", href: "/index/works" },
  { view: "exhibitions", label: "Exhibitions", href: "/index/exhibitions" },
  { view: "info", label: "Info", href: "/index/info" },
];

export default function ESNav() {
  const {
    openDesktopNav: open,
    setOpenDesktopNav,
    filterOpen,
    setFilterOpen,
    siteReveal,
    imageSize,
    setImageSize,
  } = useUI();
  const pathname = usePathname();
  const { mode, search, setSearch } = useIndex();
  const onIndex = pathname.startsWith("/index");
  // List settings — shown with the works / exhibitions lists: the Filter menu
  // on desktop, S / M / L in the mobile menu.
  const showSizes = onIndex && mode !== "info";
  // afterPick: also run on a pick (the mobile menu closes itself).
  const sizeButtons = (className: string, afterPick?: () => void) => (
    <div
      className={`flex gap-3 font-gtAmericaCondensed font-black uppercase tracking-tight text-sm leading-none text-primary ${className}`}
    >
      {(["S", "M", "L"] as const).map((sz) => (
        <button
          key={sz}
          type="button"
          onClick={() => {
            setImageSize(sz);
            afterPick?.();
          }}
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
    !["index", "privacy-policy", "studio"].includes(segments[0]);
  const showBack = exhibitionPage || workPage;
  const goBack = () => {
    if (document.referrer.startsWith(window.location.origin)) router.back();
    else router.push(exhibitionPage ? "/index/exhibitions" : "/index/works");
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
      {/* Mobile nav: "Elinor Silow" and "MENU" fixed across the top. Stays
          visible above modals (z-80 > their z-70). */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-80 w-full ${navShown ? "" : "pointer-events-none"}`}
      >
        {/* Fixed across the top, a 2-col grid (like the mobile list rows):
            "Elinor Silow" (home) in col 1, "MENU" (opens the menu panel) top
            right. */}
        <nav
          className={`fixed inset-x-0 top-0 grid grid-cols-2 gap-x-2 items-center h-12 lg:h-9 px-3 bg-linear-to-b from-background to-transparent whitespace-nowrap text-2xl   font-normal tracking-normal leading-none text-background`}
        >
          <Link
            href="/"
            className={`col-start-1 row-start-1 justify-self-start text-neutral-800 font-gensco ${navReveal(navShown, 0).className}`}
            style={navReveal(navShown, 0).style}
          >
            Elinor Silow
          </Link>
          {showBack && (
            <button
              type="button"
              onClick={goBack}
              className="col-start-2 row-start-1 justify-self-start text-xl font-areal font-medium text-neutral-800 uppercase cursor-pointer"
            >
              Back
            </button>
          )}
          <button
            type="button"
            style={navReveal(navShown, 1).style}
            className={`col-start-2 row-start-1 justify-self-end text-xl font-areal font-medium text-right text-neutral-800 uppercase cursor-pointer ${navReveal(navShown, 1).className}`}
            onClick={toggleOpen}
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </div>
      {/* Desktop nav, fixed at the top on every page: "Elinor Silow" and
          "Menu" (opens the menu panel) top left. Same stacking above modals
          as the mobile nav. */}
      <nav
        className={`hidden lg:grid fixed inset-x-0 top-0 z-80 grid-cols-12 h-9 gap-x-4 px-2 bg-background items-center ${navShown ? "" : "pointer-events-none"}`}
      >
        {/* Solid bar; only its bottom edge fades to transparent. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-full h-3 bg-linear-to-b from-background to-transparent pointer-events-none"
        />
        {/* Filter: top center of the screen, with the works / exhibitions
            lists. Opens the Filter panel (FilterSettings), top right. */}
        {showSizes && (
          <button
            type="button"
            aria-expanded={filterOpen}
            data-filter-toggle
            onClick={() => {
              setFilterOpen(!filterOpen);
              setOpenDesktopNav(false);
            }}
            style={navReveal(navShown, 2).style}
            className={`absolute top-0 left-1/2 -translate-x-1/2 h-9 cursor-pointer font-areal font-medium text-xl uppercase text-neutral-800 ${navReveal(navShown, 2).className}`}
          >
            {filterOpen ? "Close" : "Filter"}
          </button>
        )}
        {/* BACK (an exhibition's or work's own page): top right, on the same
            baseline as Menu — in a line box like the one Menu sits in (a
            zero-width Gensco character sets it). */}
        {showBack && (
          <div className="col-start-12 row-start-1 justify-self-end flex items-baseline py-1 whitespace-nowrap font-gensco text-2xl text-neutral-800">
            <span aria-hidden>{"\u200b"}</span>
            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer font-areal font-medium text-xl uppercase"
            >
              Back
            </button>
          </div>
        )}
        {/* "Elinor Silow" (home) and "Menu", top left (cols 1–2). */}
        <div className="col-start-1 col-span-2 row-start-1 flex items-baseline gap-x-2 py-1 whitespace-nowrap font-gensco text-2xl text-neutral-800">
          <Link href="/" className={navReveal(navShown, 0).className}>
            Elinor Silow,
          </Link>
          <button
            type="button"
            style={navReveal(navShown, 1).style}
            className={`cursor-pointer font-areal font-medium text-xl uppercase ${navReveal(navShown, 1).className}`}
            onClick={toggleOpen}
            aria-expanded={open}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {/* Filter panel (desktop): fixed top right, under the nav. */}
      {showSizes && filterOpen && (
        <FilterSettings onClose={() => setFilterOpen(false)} />
      )}
      {/* Menu — a full-height overlay (h-dvh, page background) with the links
          stacked, then search, then email and Instagram. Sits under the
          "Elinor Silow, CLOSE" line (z-80) so that stays visible to close
          it. Picking a link (or submitting a search) closes the menu. */}
      {open && (
        <nav className="fixed inset-x-0 top-0 h-dvh z-[75] flex flex-col items-start justify-start   gap-0 p-3 lg:px-4 lg:pt-8 pb-16 bg-background text-neutral-800 font-areal text-xl uppercase font-medium leading-tight ">
          <div className="relative flex flex-col items-start px-0 py-8">
            {VIEW_LINKS.map(({ view, label, href }) => (
              <Link
                key={view}
                href={href}
                scroll={false}
                aria-current={pathname === href ? "page" : undefined}
                className="uppercase cursor-pointer"
                onClick={() => {
                  setSearch("");
                  setOpenDesktopNav(false);
                }}
              >
                {label}
              </Link>
            ))}
            {/* Search (the shared index search, index views only): filters
                the current view's list; Enter closes the menu to show the
                results. */}
            {onIndex && (
              <form
                className="mt-[1.25em] w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpenDesktopNav(false);
                }}
              >
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  aria-label="Search"
                  className="w-full p-0 m-0 border-0 bg-transparent outline-none uppercase text-foreground placeholder:text-primary/50"
                />
              </form>
            )}
            {/* Contact. */}
            <a href="mailto:elinor.silow@gmail.com" className="mt-[1.25em]">
              Email
            </a>
            <a
              href="https://www.instagram.com/elinorsilow"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
          {/* Mobile, image size S / M / L (works / exhibitions views): along
              the bottom of the menu, spread across its width. Desktop has
              them in the top bar. */}
          {showSizes &&
            sizeButtons(
              "lg:hidden absolute inset-x-3 bottom-3 justify-between text-3xl!",
              () => setOpenDesktopNav(false),
            )}
        </nav>
      )}
    </>
  );
}

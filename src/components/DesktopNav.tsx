"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useIndex, IndexSort, IndexMode } from "@/context/IndexContext";
import { useWorks, CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, ExCategory } from "@/context/ExhibitionsContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import WigglyButton from "./WigglyButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// The default Button variant already carries the nav look — a full 0.5px box on
// all four sides. The active page is marked by weight alone; the fill stays
// bg-background so only hover tints a button.
//
// Buttons keep every edge; the containers collapse the shared ones (see
// COLLAPSE_X below) so a seam between two boxes still renders at 0.5px rather
// than stacking to 1px.
const navLinkClass = (active: boolean) => cn(active && "font-bold");

// Pull each cell over its neighbour so touching strokes collapse into one
// hairline. A full pixel, not 0.5 — browsers round a 0.5px border up to one
// device pixel, so half a pixel of pull leaves the two strokes stacked.
const COLLAPSE_X = "lg:[&>*+*]:-ml-px";

// One column each, cols 4-9 — straight after the logo and up to the search.
// Pinned individually rather than letting the grid auto-place them: an auto
// column fills the earliest free slot in the row, which would drop the run into
// cols 1-3 under the logo.
const NAV_LINK_COLS = [
  "lg:col-start-4",
  "lg:col-start-5",
  "lg:col-start-6",
  "lg:col-start-7",
  "lg:col-start-8",
  "lg:col-start-9",
];

// Search closes out row 1, cols 10-12.
const SEARCH_COL = "lg:col-start-10 lg:col-span-3";

// Row 2's filter run, from col 6 — lined up under the nav links rather than
// the logo. Seven slots: the longest run is 4 categories + 3 sorts.
const FILTER_COLS = [
  "lg:col-start-6",
  "lg:col-start-7",
  "lg:col-start-8",
  "lg:col-start-9",
  "lg:col-start-10",
  "lg:col-start-11",
  "lg:col-start-12",
];

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/index/works", label: "works" },
  { href: "/index/exhibitions", label: "exhibitions" },
  { href: "/info", label: "info" },
  { href: "mailto:elinor.silow@gmail.com", label: "contact" },
  {
    href: "https://www.instagram.com/elinorsilow",
    label: "instagram",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

const INDEX_SORTS: IndexSort[] = ["latest", "title", "random"];
const INDEX_MODES: { label: string; value: IndexMode }[] = [
  { label: "all", value: "works" },
  { label: "all", value: "exhibitions" },
];

const WORK_FILTERS: { label: string; value: CategoryFilter }[] = [
  { label: "all", value: "all" },
  { label: "paintings", value: "painting" },
  { label: "sculptures", value: "sculpture" },
  { label: "drawings", value: "drawing" },
];

const EX_CATS: { label: string; value: ExCategory }[] = [
  { label: "all", value: "all" },
  { label: "group", value: "group" },
  { label: "solo", value: "solo" },
];

const INFO_SECTIONS = ["bio", "exhibitions", "education", "grants", "press"];

// Zoom in / zoom out / tidy up — hidden for now. Flip to true to bring them back.
const SHOW_INDEX_SETTINGS = false;

// The letters for a nav Button. `active` keeps the wiggle on permanently —
// that's how the current page/filter reads — otherwise it only fires on hover.
// Sized to fill its Button (which drops its own padding) so hovering anywhere
// on the box wiggles, not just over the glyphs.
function WigglyLabel({
  text,
  active = false,
  size = "text-base",
  className,
}: {
  text: string;
  active?: boolean;
  size?: string;
  className?: string;
}) {
  return (
    <WigglyButton
      asSpan
      text={text}
      size={size}
      active={active}
      bold={active}
      anchorFill="currentColor"
      forceBaseline
      className={cn("px-4 justify-center items-center", className)}
    />
  );
}

// The Button's own padding moves onto WigglyLabel, so the letters can fill the
// whole box.
const WIGGLY_BOX = "p-0";

// A mobile overlay cell: a real Button for the box, border and grid behaviour,
// with WigglyButton's letters inside as a plain span. The Button drops its own
// padding so the span can fill it — that way hovering/pressing anywhere on the
// cell wiggles, not just the text. Transparent fill so the overlay colour shows
// through and only the hairline reads.
function WigglyCell({
  text,
  href,
  target,
  rel,
  onClick,
  active = false,
  disabled = false,
  centered = false,
  className,
}: {
  text: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  centered?: boolean;
  className?: string;
}) {
  const letters = (
    <WigglyLabel
      text={text}
      active={active}
      size="text-base"
      className={cn(
        "px-2 text-neutral-600",
        centered ? "justify-center" : "justify-start",
      )}
    />
  );

  return (
    <Button
      asChild={!!href}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-0 w-full px-6 bg-transparent h-12 hover:bg-foreground/10    border-[0.5px] border-transparent",
        centered ? "justify-center" : "justify-start",
        active && "font-bold",
        className,
      )}
    >
      {href ? (
        <Link href={href} target={target} rel={rel}>
          {letters}
        </Link>
      ) : (
        letters
      )}
    </Button>
  );
}

// Stacked cells share their touching strokes rather than doubling them.
const STACK = "flex flex-col w-full [&>*+*]:-mt-px";

function NewNavOverlay({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();
  const {
    mode,
    setMode,
    sort,
    setSort,
    zoom,
    setZoom,
    tidy,
    setTidy,
    search,
    setSearch,
  } = useIndex();

  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  const onInfo = pathname === "/info";
  const onIndexAny = pathname.startsWith("/index");
  const onIndexRoot = pathname === "/index";
  const onIndexWorks = pathname === "/index/works";
  const onIndexExhibitions = pathname === "/index/exhibitions";

  useEffect(() => {
    if (onIndexRoot) searchRef.current?.focus();
  }, [onIndexRoot]);

  useEffect(() => {
    if (!onInfo) return;
    const ids = INFO_SECTIONS.map((s) => s.replace(/\s+/g, "-"));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [onInfo]);

  const renderSubmenu = () => {
    if (onInfo) {
      return INFO_SECTIONS.map((s) => {
        const id = s.replace(/\s+/g, "-");
        return (
          <WigglyCell
            key={s}
            text={s}
            href={`#${id}`}
            active={activeSection === id}
            onClick={onClose}
          />
        );
      });
    }
    if (onIndexAny) {
      return (
        <>
          {onIndexRoot && (
            <div className={STACK}>
              {INDEX_MODES.map(({ label, value }) => (
                <WigglyCell
                  key={value}
                  text={label}
                  active={mode === value}
                  onClick={() => setMode(value)}
                />
              ))}
            </div>
          )}
          <div className={STACK}>
            {INDEX_SORTS.map((s) => (
              <WigglyCell
                key={s}
                text={s}
                active={sort === s}
                onClick={() => setSort(s)}
              />
            ))}
          </div>
          {SHOW_INDEX_SETTINGS && (
            <div className={STACK}>
              <WigglyCell
                text="settings"
                active={showSettings}
                onClick={() => setShowSettings((v) => !v)}
              />
              {showSettings && (
                <div className={STACK}>
                  <WigglyCell
                    text="zoom in"
                    onClick={() => setZoom(Math.max(0, zoom - 1))}
                  />
                  <WigglyCell
                    text="zoom out"
                    onClick={() => setZoom(Math.min(4, zoom + 1))}
                  />
                  <WigglyCell
                    text="tidy up"
                    active={tidy}
                    onClick={() => setTidy(!tidy)}
                  />
                </div>
              )}
            </div>
          )}
          {onIndexWorks && (
            <div className={STACK}>
              {WORK_FILTERS.map((f) => (
                <WigglyCell
                  key={f.value}
                  text={f.label}
                  active={categoryFilter === f.value}
                  disabled={f.value === "drawing"}
                  onClick={() => setCategoryFilter(f.value)}
                />
              ))}
            </div>
          )}
          {onIndexExhibitions && (
            <div className={STACK}>
              {EX_CATS.map((c) => (
                <WigglyCell
                  key={c.value}
                  text={c.label}
                  active={exCat === c.value}
                  onClick={() => setExCat(c.value)}
                />
              ))}
            </div>
          )}
        </>
      );
    }
    return null;
  };

  // With no page-specific submenu the second column is empty, so the cells stop
  // reading as a left-hand list and centre their labels instead.
  const hasSubmenu = onInfo || onIndexAny;

  return (
    <div
      className={`lg:hidden fixed inset-0 z-[125] ${pathname === "/info" ? "bg-blue-600 dark:bg-blue-950" : "bg-background dark:bg-orange-950"} px-0  pb-0 pointer-events-auto grid ${hasSubmenu ? "grid-cols-2" : "grid-cols-1"} gap-0 items-start justify-start  h-auto`}
    >
      {/* Row 1, Col 1: spacer — logo+menu floats here at z-[131] */}

      {/* Row 1, Col 2: nav links */}
      <div className={cn("col-start-1 col-span-1 row-start-1", STACK)}>
        {NAV_LINKS.map(({ href, label, target, rel }) => (
          <WigglyCell
            key={href}
            text={label}
            href={href}
            target={target}
            rel={rel}
            active={pathname === href}
            centered={!hasSubmenu}
            onClick={onClose}
          />
        ))}
      </div>
      {/* Col 2: page-specific submenu. Closing is the nav's own button, which
          floats above this overlay and reads "close" while it is open. */}
      {hasSubmenu && (
        <div className="col-start-2 col-span-1 mt-0 flex flex-col items-start text-left gap-y-0 w-full pb-0 [&>*+*]:-mt-px">
          {renderSubmenu()}
        </div>
      )}
      {/* Row 3, Col 2: search */}
      {onIndexRoot && (
        <div className="col-start-2 col-span-1 row-start-3 flex flex-col items-start text-left gap-y-0 w-full">
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search..."
            className="bg-transparent border-none outline-none justify-start w-full font-timesNewRoman text-lg lowercase font-bold placeholder:text-foreground text-foreground pl-2"
          />
        </div>
      )}
    </div>
  );
}

export default function DesktopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { sans, openDesktopNav, setOpenDesktopNav, filterOpen, setFilterOpen } =
    useUI();
  const {
    mode,
    setMode,
    sort,
    setSort,
    tidy,
    setTidy,
    zoom,
    setZoom,
    search,
    setSearch,
  } = useIndex();

  const [activeSection, setActiveSection] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  const onIndexAny = pathname.startsWith("/index");
  const onIndexRoot = pathname === "/index";
  const onIndexWorks = pathname === "/index/works";
  const onIndexExhibitions = pathname === "/index/exhibitions";
  const onInfo = pathname === "/info";

  // The three pages that carry the filter row. It is always open there — there
  // is no toggle.
  const onIndexPage = onIndexRoot || onIndexWorks || onIndexExhibitions;

  // Row 2 only exists while the menu is open. Closed, the nav collapses to a
  // single button-height row — half its open height.
  const showSecondRow =
    openDesktopNav && (onIndexPage || onInfo || (SHOW_INDEX_SETTINGS && onIndexAny));

  // Row 2 runs the categories then the 3 sorts, one column each. Only the
  // category count varies.
  const categoryCount = onIndexWorks ? WORK_FILTERS.length : 3;

  // Index into FILTER_COLS for the first button. Exhibitions starts a column
  // later than the rest, at col 7, so its shorter run ends flush at col 12.
  const filterStart = onIndexExhibitions ? 1 : 0;

  // The search lives in row 1 on every page, but it only filters the index. Typing
  // from anywhere else sends you there — once, on the first keystroke, since
  // onIndexAny is true from then on.
  const handleSearch = (value: string) => {
    setSearch(value);
    if (value && !onIndexAny) router.push("/index");
  };

  useEffect(() => {
    if (onIndexAny && openDesktopNav) searchRef.current?.focus();
  }, [onIndexAny, openDesktopNav]);

  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();

  useEffect(() => {
    if (!onIndexAny) return;
    function handleScroll() {
      if (window.innerWidth < 1024) setOpenDesktopNav(false);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onIndexAny]);

  useEffect(() => {
    if (!onInfo) return;
    const ids = INFO_SECTIONS.map((s) => s.replace(/\s+/g, "-"));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [onInfo]);

  return (
    <>
      {/* Main nav — z-[131], always above NewNavOverlay */}
      <div
        aria-label="Main navigation"
        id="main-nav"
        className="fixed top-0 left-0 right-0  z-[131] grid grid-cols-2 gap-0 lg:gap-x-0 lg:gap-y-0 lg:px-0 lg:grid-cols-12 items-center lg:items-start p-0 pointer-events-none w-full mx-0 lg:mx-auto h-auto lg:h-auto"
      >
        {/* Row 1. On mobile this is its own 2-col grid; at lg it dissolves into
            the nav's 12-col grid so each button can own a single column. */}
        <div
          tabIndex={0}
          className="grid grid-cols-2 lg:contents items-baseline pointer-events-auto px-0  gap-x-0 w-full col-span-2"
        >
          {/* cols 1-3 of row 1: logo */}
          <div className="flex flex-wrap items-baseline gap-x-0 gap-0 shrink-0 col-start-1 col-span-2 lg:col-start-1 lg:col-span-3 lg:row-start-1">
            <Button
              className={cn(
                "w-full tracking-wide  justify-center lg:justify-start font-normal",
                WIGGLY_BOX,
              )}
              asChild
            >
              <Link href="/">
                <WigglyLabel
                  text="Elinor Silow"
                  className="px-4 justify-center lowercase lg:justify-start font-normal"
                  active
                />
              </Link>
            </Button>
          </div>

          {/* "menu" — pinned to the bottom edge on mobile (still at z-[131], so
              it sits above the overlay and can toggle it shut from the same
              spot); at lg it rejoins row 1 in col 4, and hides once open. */}
          <div
            className={cn(
              "fixed bottom-0 left-0 right-0 flex justify-center pointer-events-auto",
              "lg:static lg:items-baseline lg:col-start-4 lg:col-span-3 lg:row-start-1 lg:justify-start",
              openDesktopNav && "lg:hidden",
            )}
          >
            <Button
              className={cn(
                "w-full tracking-wide lowercase justify-center lg:justify-start",
                // shadow-md's own offsets, negated: the button sits on the
                // bottom edge, so the shadow has to fall up over the page.
                "shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.1),0_-2px_4px_-2px_rgb(0_0_0_/_0.1)] lg:shadow-none",
                WIGGLY_BOX,
              )}
              onClick={() => {
                const next = !openDesktopNav;
                setOpenDesktopNav(next);
                if (next) setFilterOpen(false);
              }}
            >
              {/* Only mobile ever sees this open — desktop hides the button
                  the moment the menu is, so the label needs no breakpoint. */}
              <WigglyLabel
                text={openDesktopNav ? "close" : "menu"}
                active={openDesktopNav}
                className="px-4 justify-center lg:justify-start"
              />
            </Button>
          </div>

          {/* nav links — cols 7-12 of row 1, one column each. Desktop only,
              NewNavOverlay handles mobile. */}
          {openDesktopNav && (
            <div className={cn("hidden lg:contents", COLLAPSE_X)}>
              {NAV_LINKS.map(({ href, label, target, rel }, idx) => (
                <Button
                  key={href}
                  asChild
                  className={cn(
                    navLinkClass(pathname === href),
                    WIGGLY_BOX,
                    "lg:row-start-1",
                    NAV_LINK_COLS[idx],
                  )}
                >
                  <Link href={href} target={target} rel={rel}>
                    <WigglyLabel text={label} active={pathname === href} />
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {/* Search — cols 10-12 of row 1, on every page, but only while the
              menu is open: closed, row 1 is just the logo and "menu". The
              wrapper carries the grid placement so the clear X can sit against
              the input's box. Desktop only; NewNavOverlay has its own field. */}
          {openDesktopNav && (
            <div
              className={cn(
                "hidden lg:flex relative min-w-0 lg:row-start-1",
                SEARCH_COL,
                // Pulls onto the last nav link's stroke.
                "lg:-ml-px",
              )}
            >
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearch("")}
                placeholder="search..."
                className={cn(
                  // Same box as a default Button — height, padding, border, type.
                  buttonVariants(),
                  "w-full min-w-0 pointer-events-auto",
                  // Col 12 is flush with the nav's right edge, so drop that stroke.
                  "border-r-0",
                  // Input-specific: don't bold on hover, and match the placeholder
                  // to the button's resting weight.
                  "hover:font-normal placeholder:text-foreground/60 placeholder:lowercase",
                  // No focus ring — text inputs always match :focus-visible, so
                  // the variant's ring would fire the moment you start typing.
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                )}
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer p-1 font-timesNewRoman text-xs leading-none text-foreground/60 hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Row 2 — categories then sorts, from col 6. A real box rather than
            lg:contents, so it can carry px-4: it spans the nav's full width and
            repeats the 12-col grid inside, which keeps FILTER_COLS honest while
            insetting the whole run. */}
        {onIndexPage && openDesktopNav && (
          <div
            id="nav-filter-submenu"
            className={cn(
              "hidden lg:grid lg:grid-cols-12 lg:col-start-1 lg:col-span-12 lg:row-start-2 px-0 pointer-events-auto",
              COLLAPSE_X,
            )}
          >
            {onIndexRoot &&
              INDEX_MODES.map(({ label, value }, idx) => (
                <Button
                  key={value}
                  size="sm"
                  className={cn(
                    navLinkClass(mode === value),
                    FILTER_COLS[filterStart + idx],
                    WIGGLY_BOX,
                  )}
                  onClick={() => setMode(value)}
                >
                  <WigglyLabel text={label} active={mode === value} />
                </Button>
              ))}
            {onIndexWorks &&
              WORK_FILTERS.map((f, idx) => {
                const disabled = f.value === "drawing";
                return (
                  <Button
                    key={f.value}
                    size="sm"
                    className={cn(
                      navLinkClass(categoryFilter === f.value),
                      WIGGLY_BOX,
                      FILTER_COLS[filterStart + idx],
                    )}
                    onClick={() => setCategoryFilter(f.value)}
                    disabled={disabled}
                  >
                    <WigglyLabel
                      text={f.label}
                      active={categoryFilter === f.value}
                    />
                  </Button>
                );
              })}
            {onIndexExhibitions &&
              EX_CATS.map((c, idx) => (
                <Button
                  key={c.value}
                  size="sm"
                  className={cn(
                    navLinkClass(exCat === c.value),
                    WIGGLY_BOX,
                    FILTER_COLS[filterStart + idx],
                  )}
                  onClick={() => setExCat(c.value)}
                >
                  <WigglyLabel text={c.label} active={exCat === c.value} />
                </Button>
              ))}
            {INDEX_SORTS.map((s, idx) => (
              <Button
                key={s}
                size="sm"
                className={cn(
                  navLinkClass(sort === s),
                  WIGGLY_BOX,
                  // Sorts continue the same run, straight after the categories.
                  FILTER_COLS[filterStart + categoryCount + idx],
                )}
                onClick={() => setSort(s)}
              >
                <WigglyLabel text={s} active={sort === s} />
              </Button>
            ))}
          </div>
        )}

        {/* Index: zoom + tidy controls — row 2 */}
        {SHOW_INDEX_SETTINGS && onIndexAny && openDesktopNav && (
          <div className="hidden lg:grid lg:grid-cols-12 gap-x-0 items-baseline pointer-events-auto w-full px-2 lg:col-start-1 lg:col-span-12 lg:row-start-2">
            <div className="col-start-7 col-span-6 flex flex-wrap gap-x-0 items-baseline justify-end">
              <WigglyButton
                text="zoom in"
                size="text-lg"
                className=" px-0 lg:ml-2 "
                onClick={() => setZoom(Math.max(0, zoom - 1))}
                anchorFill="currentColor"
                forceBaseline
              />
              <span className="font-timesNewRoman text-lg select-none leading-tight">
                ,
              </span>
              <WigglyButton
                text="zoom out"
                size="text-lg"
                className="tracking-wide leading-tight px-0 lg:ml-2 "
                onClick={() => setZoom(Math.min(4, zoom + 1))}
                anchorFill="currentColor"
                forceBaseline
              />
              <span className="font-timesNewRoman text-lg select-none leading-tight ">
                ,
              </span>
              <WigglyButton
                text="tidy up"
                size="text-lg"
                className={`tracking-wide leading-tight px-0 lg:ml-2 `}
                onClick={() => setTidy(!tidy)}
                anchorFill="currentColor"
                forceBaseline
                bold={tidy}
                active={tidy}
              />
            </div>
          </div>
        )}

        {/* Info: section links — row 2, so they only show with the menu open. */}
        {onInfo && openDesktopNav && (
          <div className="hidden lg:grid lg:grid-cols-12 gap-x-0 items-baseline pointer-events-auto w-full px-2 lg:col-start-1 lg:col-span-12 lg:row-start-2">
            <div className="col-start-7 col-span-6 flex flex-wrap gap-x-0 items-baseline justify-end">
              {INFO_SECTIONS.map((s, i) => {
                const active = activeSection === s.replace(/\s+/g, "-");
                return (
                  <Fragment key={s}>
                    <WigglyButton
                      text={s}
                      size="text-lg"
                      className={`tracking-wide leading-tight px-0 lg:ml-2 `}
                      href={`#${s.replace(/\s+/g, "-")}`}
                      bold={active}
                      active={active}
                      anchorFill="currentColor"
                      forceBaseline
                      onClick={() => setOpenDesktopNav(false)}
                    />
                    {i < INFO_SECTIONS.length - 1 && (
                      <span className="font-timesNewRoman text-lg select-none  leading-tight ">
                        ,
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay — z-[125], behind logo/menu */}
      {openDesktopNav && (
        <NewNavOverlay onClose={() => setOpenDesktopNav(false)} pathname={pathname} />
      )}
    </>
  );
}

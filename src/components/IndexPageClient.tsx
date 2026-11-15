"use client";

import { useState, useEffect, useRef, ViewTransition } from "react";
import { vtName } from "@/lib/viewTransition";
import {
  useFirstLoad,
  REVEAL_IMAGES,
  REVEAL_TITLE,
  REVEAL_NAV,
} from "@/lib/firstLoad";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useIndex } from "@/context/IndexContext";
import { Work, Exhibition } from "../../lib/sanity";
import LenisScroll from "@/components/LenisScroll";
import IndexNav from "@/components/IndexNav";
import TitleBlock from "@/components/TitleBlock";
import ActiveFilters from "@/components/ActiveFilters";
import { useCssHeightVar } from "@/lib/useCssHeightVar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { workSize } from "@/lib/workSize";
import { useUI, type ImageSize } from "@/context/UIContext";

const BATCH = 24;

// image_1 … image_10 of an exhibition, in order, skipping empty slots.
function exhibitionImageUrls(ex: Exhibition): string[] {
  const acf = ex.acf as Record<string, unknown>;
  return Array.from({ length: 10 }, (_, i) => acf[`image_${i + 1}`])
    .map((img) => (img as { url?: string } | undefined)?.url)
    .filter((url): url is string => Boolean(url));
}

// One entry in a feed (see Feed): a work or an exhibition.
type FeedItem = {
  id: string;
  title: string;
  // "year, materials, dimensions" (works) / "year, venue, city, type"
  // (exhibitions).
  metadata: string;
  href: string;
  images: string[];
};

function workFeedItem(w: Work): FeedItem {
  return {
    id: w.id,
    title: w.title.rendered,
    metadata: [w.acf.year, w.acf.materials, w.acf.dimensions]
      .filter(Boolean)
      .join(", "),
    href: `/${w.slug}`,
    images: w.image_url ? [w.image_url] : [],
  };
}

function exhibitionFeedItem(ex: Exhibition): FeedItem {
  return {
    id: ex.id,
    title: ex.title.rendered,
    metadata: [
      ex.acf.year,
      ex.acf.location,
      ex.acf.city,
      ex.acf.exhibition_type && `${ex.acf.exhibition_type} Exhibition`,
    ]
      .filter(Boolean)
      .join(", "),
    href: `/exhibitions/${ex.slug}`,
    // The first four only (the rest are on its page).
    images: exhibitionImageUrls(ex).slice(0, 4),
  };
}

// The works grid (desktop, 32 columns): where each of the 6 works in a row
// starts — each 2 columns wide with 4 empty columns between (cols 1–2, 7–8,
// 13–14, 19–20, 25–26, 31–32).
// Mobile (4 columns): 2 works per row, each 1 column wide with 1 empty
// column between (cols 1 and 3).
const GRID_START_MOBILE = ["col-start-1", "col-start-3"];
const GRID_START = [
  "lg:col-start-1",
  "lg:col-start-7",
  "lg:col-start-13",
  "lg:col-start-19",
  "lg:col-start-25",
  "lg:col-start-31",
];

// The List view's titles (works and exhibitions alike): stacked, centered,
// Gensco 36px, normal case (as the mobile menu); each a link (TITLE_LINK).
const TITLE_LIST =
  "flex min-h-dvh flex-col items-start justify-start gap-y-0 px-3 lg:px-6 pt-3 lg:pt-6 pb-0 font-gensco text-[24px] leading-[1.3] lg:text-[28px] lg:leading-tight normal-case text-left text-neutral-800 ";
const TITLE_LINK = "hover:text-purple-300 transition-all";

// Works / exhibitions as a feed: one item under another, at least a screen
// tall, its images centered in a column (a work has one, an exhibition all
// of its own); clicking one opens its page. The title and metadata of the
// item in view (the one crossing the middle of the screen) are fixed at the
// bottom left and change as the page scrolls.
function Feed({
  items,
  hidden,
  size,
  maxW = "max-w-1/2 lg:max-w-1/6",
  sameWidth = false,
  align = "center",
  gap = "",
  top = "",
  titleClassName = "",
  totalItems,
}: {
  items: FeedItem[];
  // How many items match the filters (items may be only the first page).
  totalItems: number;
  hidden: boolean;
  // The images' width limit (a static Tailwind class).
  maxW?: string;
  // Every image the same width (maxW wide, at most the screen height less
  // 4rem).
  sameWidth?: boolean;
  // Where each item's images sit: centered (works) or at the left
  // (exhibitions).
  align?: "center" | "left";
  // The space between one item and the next (a static Tailwind class).
  gap?: string;
  // The space above the first item (a static Tailwind class).
  top?: string;
  // Extra classes for the fixed title block (a static Tailwind class).
  titleClassName?: string;
  // The image size setting: the images' height limit.
  size: ImageSize;
}) {
  const [active, setActive] = useState(0);
  // The load reveal, on the site's first load only: images, then the
  // title, then the filters (with the nav bar).
  const firstLoad = useFirstLoad();
  const refs = useRef<(HTMLElement | null)[]>([]);
  const router = useRouter();
  // The title block's height, as --title-h (exhibition images fit between
  // it and the nav bar).
  const titleRef = useRef<HTMLDivElement>(null);
  useCssHeightVar(titleRef, "--title-h", Boolean(items[active]));
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.index));
      },
      // A line across the middle of the screen.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items]);
  const current = items[active];
  const imageClass = sameWidth
    ? // Capped at two-thirds of the screen height (a tall work keeps its
      // proportions inside the same-width box).
      `block w-full h-auto ${maxW} max-h-[66.6vh] object-contain ${align === "left" ? "object-left" : ""} transition-opacity duration-200 hover:opacity-50`
    : // Exhibitions: each image at most the screen's height less the
      // title block (top) and the nav bar (bottom) — their measured heights.
      `block w-auto h-auto ${maxW} max-h-[calc(100dvh-var(--title-h,0px)-var(--nav-h,0px))] object-contain ${align === "left" ? "object-left" : ""}`;
  return (
    <>
      {/* Fixed across the top (Image mode): the current item's title and
          metadata at the left, the active filters at the right — one row,
          on the same baseline (items-baseline). Shown even with no items,
          so the filters can still be changed. */}
      <div
        ref={titleRef}
        className={`fixed top-0 left-0  z-70 w-full bg-background   text-neutral-800 pointer-events-none flex items-baseline justify-between gap-x-6 pb-3 px-3 pt-3 lg:px-6 lg:pt-6 lg:pb-6 lg:min-h-20 transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}
      >
        {current ? (
          <TitleBlock
            title={current.title}
            metadata={current.metadata}
            href={current.href}
            textWidth="max-w-full pr-1 lg:max-w-xl"
            className={`${titleClassName} ${firstLoad ? REVEAL_TITLE : ""}`}
          />
        ) : (
          <span />
        )}
        <ActiveFilters
          className={`hidden lg:flex shrink-0 pointer-events-auto font-gensco text-[18px] leading-tight text-neutral-800 ${firstLoad ? REVEAL_NAV : ""}`}
        />
      </div>
      <div
        className={`flex flex-col ${gap} ${top} transition-opacity duration-1000 ${hidden ? "opacity-0" : "opacity-100"} ${firstLoad ? REVEAL_IMAGES : ""}`}
      >
        {items.map((item, i) => (
          // Not a real link (no address shown in the browser's corner on
          // hover): clicking (or Enter) opens the item's page.
          <div
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            role="link"
            tabIndex={0}
            onClick={() => router.push(item.href)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(item.href);
            }}
            aria-label={item.title}
            className={`min-h-dvh flex flex-col ${align === "left" ? "items-start" : "items-center"} justify-center gap-y-3 lg:gap-y-6 px-3 lg:px-6 cursor-pointer ${item.images.length > 1 ? "py-6" : ""}`}
          >
            {item.images.map((src, j) => {
              // eslint-disable-next-line @next/next/no-img-element
              const img = (
                <img
                  key={src}
                  src={`${src}?h=1600&auto=format`}
                  alt={j === 0 ? item.title : ""}
                  loading={i < 2 && j === 0 ? "eager" : "lazy"}
                  draggable={false}
                  className={imageClass}
                />
              );
              // The first image zooms into (and back out of) the page.
              return j === 0 ? (
                <ViewTransition key={src} name={vtName(item.href)}>
                  {img}
                </ViewTransition>
              ) : (
                img
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default function IndexPageClient() {
  const router = useRouter();
  const {
    mode,
    sort,
    search,
    worksLayout,
    yearFilter,
    sizeFilter,
    shuffleSeed,
  } = useIndex();
  // Image size (S / M / L): a site-wide setting, kept in UIContext. Each
  // view starts at L.
  const { imageSize, setImageSize, siteReveal } = useUI();
  useEffect(() => {
    setImageSize("L");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { filteredWorks } = useWorks();
  const { filteredExhibitions } = useExhibitions();

  function applySort<T>(
    arr: T[],
    byDate: (t: T) => string,
    byTitle: (t: T) => string,
    byYear: (t: T) => number,
  ): T[] {
    const copy = [...arr];
    // Random: a stable shuffle (each item's place from a hash of it and the
    // seed), so the order only changes on Randomize.
    if (sort === "random") {
      const rank = (t: T) => {
        let h = shuffleSeed;
        for (const c of byTitle(t) + byDate(t))
          h = Math.imul(h ^ c.charCodeAt(0), 2654435761);
        return h >>> 0;
      };
      return copy.sort((a, b) => rank(a) - rank(b));
    }
    if (sort === "title")
      return copy.sort((a, b) => byTitle(a).localeCompare(byTitle(b)));
    if (sort === "year") return copy.sort((a, b) => byYear(b) - byYear(a));
    return copy.sort((a, b) => byDate(b).localeCompare(byDate(a)));
  }

  const sortedWorks = applySort(
    filteredWorks,
    (w) => w.date,
    (w) => w.title.rendered,
    (w) => w.acf.year ?? 0,
  );

  const sortedExhibitions = applySort(
    filteredExhibitions,
    (e) => e.date,
    (e) => e.title.rendered,
    (e) => parseInt(e.acf.year) || 0,
  );

  const q = search.toLowerCase();
  function applyFilters<T>(arr: T[], getTitle: (t: T) => string): T[] {
    return arr.filter((t) => !q || getTitle(t).toLowerCase().includes(q));
  }

  const visibleWorks = applyFilters(
    sortedWorks.filter(
      (w) =>
        (yearFilter === "all" || String(w.acf.year) === yearFilter) &&
        (sizeFilter === "all" || workSize(w.acf.dimensions) === sizeFilter),
    ),
    (w) => w.title.rendered,
  );
  const visibleExhibitions = applyFilters(
    sortedExhibitions.filter(
      (e) => yearFilter === "all" || String(e.acf.year) === yearFilter,
    ),
    (e) => e.title.rendered,
  );
  useEffect(() => {
    setVisibleCount(BATCH);
  }, [mode, sort, visibleWorks.length, visibleExhibitions.length]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((c) => c + BATCH);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* /index: plain background. Works and exhibitions: the purple image
          as a fixed backdrop (purple-100 shows while it loads), with the
          works grid as a rounded bg-background panel on it. `isolate` keeps
          the -z-10 backdrop above this div's background. */}
      <div
        // Every view starts at the top (List at its own pt-6; Image with the
        // first image centered in the screen).
        className="relative isolate min-h-dvh lg:grid lg:grid-cols-12 lg:gap-2 lg:items-start"
      >
        {/* Page is a 4-col grid (lines up with the nav's 4 columns). Filter
            sidebar: col 1. Works: all 4 columns (one work per column);
            "all": cols 2–3; exhibitions: cols 2–4. */}
        <div className="lg:col-start-1 lg:col-span-12 lg:row-start-1 flex flex-col lg:px-0">
          <div>
            {/* Works as a list (List): every work's title, a link to its
                page, one under another, centered. */}
            {mode === "works" && worksLayout === "list" && (
              <ul className={TITLE_LIST}>
                {visibleWorks.map((w) => (
                  <li key={w.id}>
                    <Link
                      href={`/${w.slug}`}
                      prefetch={false}
                      className={TITLE_LINK}
                    >
                      {w.title.rendered}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {/* Works as a grid (Grid): desktop 6 per row with 4 empty
                columns between, mobile 2 per row (4 columns, 1 empty
                between) — every work the same width.
                Clicking one opens its page. */}
            {mode === "works" && worksLayout === "grid" && (
              <div
                // Desktop: 32 columns, 6 works per row, each 2 columns wide
                // with 4 empty columns between (see GRID_START) — all the
                // same width, the first and last at the edges.
                className="relative grid grid-cols-4 lg:grid-cols-32 gap-x-0 gap-y-36 lg:gap-y-36 px-3 lg:px-6 pt-3 lg:pt-6  pb-24 items-start"
              >
                {/* About the archive — absolute at the top left (scrolls
                    away with the page); in the title block's type. */}

                {visibleWorks.slice(0, visibleCount).map((w, i) => (
                  // Not a real link (no address shown on hover): clicking
                  // (or Enter) opens the work's page.
                  <div
                    key={w.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/${w.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") router.push(`/${w.slug}`);
                    }}
                    aria-label={w.title.rendered}
                    className={`col-span-1 lg:col-span-2 ${GRID_START_MOBILE[i % 2]} ${GRID_START[i % 6]} flex flex-col items-center justify-start`}
                  >
                    {w.image_url && (
                      // Zooms into (and back out of) the work's page.
                      <ViewTransition name={vtName(`/${w.slug}`)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${w.image_url}?w=1000&auto=format`}
                          alt={w.title.rendered}
                          loading="lazy"
                          className="block w-full h-auto transition-opacity duration-200 hover:opacity-50"
                        />
                      </ViewTransition>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Works as a feed (Image). */}
            {mode === "works" && worksLayout === "image" && (
              <Feed
                items={visibleWorks.slice(0, visibleCount).map(workFeedItem)}
                totalItems={visibleWorks.length}
                // Works: all the same width — two-thirds of the screen on
                // mobile, a sixth on desktop.
                maxW="max-w-full lg:max-w-1/6"
                sameWidth
                // The title block at most 2/3 of the screen on mobile (clear of
                // the filters, top right), max-w-5xl on desktop (! beats its
                // max-w-6xl).
                titleClassName="max-w-full lg:max-w-5xl!"
                hidden={siteReveal === "covered"}
                size={imageSize}
              />
            )}
            {/* Exhibitions as a feed (always — no index view). */}
            {mode === "exhibitions" && (
              <Feed
                items={visibleExhibitions
                  .slice(0, visibleCount)
                  .map(exhibitionFeedItem)}
                totalItems={visibleExhibitions.length}
                maxW="max-w-full lg:max-w-2/3"
                gap="gap-y-30"
                // Mobile: a third of the screen above the first exhibition.
                top="pt-[33.3dvh] lg:pt-0"
                // The title block at most 2/3 of the screen on mobile (clear of
                // the filters, top right), max-w-5xl on desktop (! beats its
                // max-w-6xl).
                titleClassName="max-w-full lg:max-w-5xl!"
                hidden={siteReveal === "covered"}
                size={imageSize}
              />
            )}

            <div ref={sentinelRef} className="h-1" />
          </div>
        </div>
      </div>

      {(mode === "works" || mode === "exhibitions") && (
        <>
          <LenisScroll />
          {/* Column labels for the list, fixed across the top. */}
          <IndexNav mode={mode} />
        </>
      )}
    </>
  );
}

"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  AcfImage,
  ActivityEntry,
  MediaItem,
  News,
  NewsItem,
  Press,
} from "../../lib/sanity";
import { useUI, navReveal } from "@/context/UIContext";
import HeroText from "./HeroText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import PurpleBackdrop, { BACKDROP_FADE_MS } from "./PurpleBackdrop";
import TrumpetNav from "./TrumpetNav";
import { motion, AnimatePresence } from "framer-motion";
// Static import: Next knows its size and serves optimized versions.
import heroImage from "../../public/20260212_richter holtermann_0010.jpg";
import InfoBox from "./InfoBox";
import HistoryClient from "./HistoryClient";
import Link from "next/link";
import IndexPageClient from "./IndexPageClient";
import InfoPageClient from "@/app/info/InfoPageClient";
import { useIndex } from "@/context/IndexContext";
import { VIEW_LINKS } from "./ESNav";

// The card's padding, shared with the rule overlays: an overlay's inset-0 covers
// the padding box, so it only lines up with the grid tracks if it repeats the

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE");
}

// "2026-09-21" → "09-21-2026". Parsed by hand so no timezone can shift the day.
function formatNewsDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${m}-${d}-${y}`;
}

// Date, name (linked when a link is set) and location of one news entry.
function NewsEntry({ item, className }: { item: NewsItem; className: string }) {
  return (
    <div className={className}>
      {item.date && <span>{formatNewsDate(item.date)}</span>}
      {item.name &&
        (item.link ? (
          <Link href={item.link}>{item.name}</Link>
        ) : (
          <span>{item.name}</span>
        ))}
      {item.location && <span>{item.location}</span>}
    </div>
  );
}

const INTRO_TEXT =
  "This is the website and growing archive of Malmö-born artist Elinor Silow. This is not a web shop, if you are interested in buying a work or make business inquires or business proposals contact the artist via email or send message on social media.";
// Pause between the hero media starting to rise in and the nav + news
// appearing (the rise takes 0.9s).
const MEDIA_TO_NAV_MS = 1100;
// Delay between each news block fading in.
const NEWS_STAGGER_MS = 300;
// Move on anyway if the backdrop hasn't loaded by then.
const BACKDROP_FALLBACK_MS = 3000;

function formatNow(d: Date) {
  return (
    d.toLocaleDateString("sv-SE") +
    " " +
    d.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );
}

// Punches 4 round holes through the element's own background (same diameter as
// the dots in the h3's dotted underline, decoration-4 = 4px) so whatever sits
// behind it in the stacking context — here, the hero image — shows through.
// Each gradient paints one hole; "intersect" keeps a pixel opaque only where
// every layer agrees, so a hole in any one layer punches through all of them.
const CORNER_HOLE_RADIUS = "2px";
const CORNER_HOLE_INSET = "6px";
const cornerHoleMask: CSSProperties = {
  maskImage: [
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at ${CORNER_HOLE_INSET} ${CORNER_HOLE_INSET}, transparent 99%, black 100%)`,
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at calc(100% - ${CORNER_HOLE_INSET}) ${CORNER_HOLE_INSET}, transparent 99%, black 100%)`,
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at ${CORNER_HOLE_INSET} calc(100% - ${CORNER_HOLE_INSET}), transparent 99%, black 100%)`,
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at calc(100% - ${CORNER_HOLE_INSET}) calc(100% - ${CORNER_HOLE_INSET}), transparent 99%, black 100%)`,
  ].join(", "),
  maskComposite: "intersect, intersect, intersect, intersect",
  WebkitMaskImage: [
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at ${CORNER_HOLE_INSET} ${CORNER_HOLE_INSET}, transparent 99%, black 100%)`,
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at calc(100% - ${CORNER_HOLE_INSET}) ${CORNER_HOLE_INSET}, transparent 99%, black 100%)`,
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at ${CORNER_HOLE_INSET} calc(100% - ${CORNER_HOLE_INSET}), transparent 99%, black 100%)`,
    `radial-gradient(circle ${CORNER_HOLE_RADIUS} at calc(100% - ${CORNER_HOLE_INSET}) calc(100% - ${CORNER_HOLE_INSET}), transparent 99%, black 100%)`,
  ].join(", "),
  WebkitMaskComposite: "source-in, source-in, source-in",
} as CSSProperties;

// A hero image filling the width of its column at its own aspect ratio (no
// cropping); on desktop hover the bg-purple-600 block and the metadata
// cover exactly the image.
function HeroImage({
  src,
  alt,
  filled,
}: {
  src: string;
  alt: string;
  // While the menu is open: the image is replaced by a bg-primary block of
  // the same size.
  filled: boolean;
}) {
  return (
    <div className="relative w-fit max-w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`block w-auto h-auto max-w-full max-h-[70vh] transition-opacity duration-300 ${filled ? "opacity-0" : "opacity-100"}`}
      />
      <div
        aria-hidden
        className={`absolute inset-0 bg-primary transition-opacity duration-300 ${filled ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

// Trumpet frames (0-based) in click order: 1, 2, 3, 2, then repeats.
const TRUMPET_PINGPONG = [0, 1, 2, 1];

export default function HomeLayoutClient({
  heroTitle,
  updates,
  news,
  latestMedia,
  bio,
  press,
}: {
  heroImages: AcfImage[];
  heroTitle: string;
  updates: ActivityEntry[];
  news: News;
  latestMedia: MediaItem[];
  // For the info view.
  bio: string;
  press: Press[];
}) {
  // The home page's view: exhibitions, works or info (IndexContext).
  const { mode: view, setMode, search, setSearch } = useIndex();
  const {
    setHomeBg,
    introPhase,
    setIntroPhase,
    siteReveal,
    openDesktopNav: menuOpen,
  } = useUI();
  // The links column fades in last, item by item, after the top bar
  // (ESNav, step 0) — see navReveal.
  const navShown = siteReveal === "nav";
  const reveal = (step: number) => navReveal(navShown, step);
  // The purple backdrop fades in first; the intro waits until that fade is
  // done (or BACKDROP_FALLBACK_MS passes without the image loading).
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [backdropShown, setBackdropShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(
      () => setBackdropShown(true),
      backdropLoaded ? BACKDROP_FADE_MS : BACKDROP_FALLBACK_MS,
    );
    return () => clearTimeout(t);
  }, [backdropLoaded]);

  // Intro: backdrop → hero media → nav + news. Skips straight to the end if
  // it already ran this visit or the user prefers reduced motion.
  useEffect(() => {
    if (introPhase !== "backdrop") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroPhase("done");
      return;
    }
    if (!backdropShown) return;
    setIntroPhase("media");
    const t = setTimeout(() => setIntroPhase("done"), MEDIA_TO_NAV_MS);
    return () => clearTimeout(t);
    // Runs once the backdrop is shown; later phase changes come from this
    // effect itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropShown]);
  const mediaIn = introPhase !== "backdrop";

  // Hero content (see the section below): the latest exhibition's first
  // image and its metadata. The fixed /public image stands in if the
  // exhibition has no images.
  // Which exhibition is shown (latestMedia: one image per exhibition, the
  // latest first). Each trumpet click shows the next exhibition and steps
  // the trumpet back and forth through its frames: 1 → 2 → 3 → 2 → 1 → …
  const [mediaIndex, setMediaIndex] = useState(0);
  const [trumpetStep, setTrumpetStep] = useState(0);
  const trumpetFrame = TRUMPET_PINGPONG[trumpetStep];
  const media = latestMedia[mediaIndex] ?? null;
  const nextExhibition = () => {
    setMediaIndex((i) =>
      latestMedia.length ? (i + 1) % latestMedia.length : 0,
    );
    setTrumpetStep((t) => (t + 1) % TRUMPET_PINGPONG.length);
  };

  // News blocks fade in one at a time once the intro is done.
  const newsBlocks = [news.current, news.upcoming, news.past];
  const revealNews = (item: unknown) => {
    const order = newsBlocks.filter(Boolean).indexOf(item);
    return {
      className: `transition-opacity duration-700 ${introPhase === "done" ? "opacity-100" : "opacity-0"}`,
      style: { transitionDelay: `${order * NEWS_STAGGER_MS}ms` },
    };
  };

  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(formatNow(new Date()));
    const id = setInterval(() => setNow(formatNow(new Date())), 1_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return () => setHomeBg(null);
  }, [setHomeBg]);

  return (
    <>
      <div className="hidden  lg:hidden absolute top-0 left-0 z-10 w-full flex-col  grid-cols-12 items-center font-areal font-medium text-lg leading-tight h-screen pointer-events-none">
        <div className="col-start-1 col-span-3 relative  p-4 text-base leading-tight  items-start pt-6 justify-center text-left lg:items-start h-full lg:mt-[25vh]  flex">
          <p className="text-sm lg:text-base  leading-tight font-arialRoundedMT tracking-wide">
            {INTRO_TEXT}
          </p>
        </div>
      </div>
      {/* Trumpet — hidden for now (change `hidden` to `flex` to bring it back). Mobile: horizontally centered, its top at 62.5% of the
          screen height; desktop: fixed bottom right. Click → the next
          exhibition, and the trumpet steps to its next frame. Shows with
          the hero. */}
      {latestMedia.length > 1 && (
        <div
          className={`hidden fixed inset-x-0 top-[62.5%] lg:top-auto lg:bottom-8 lg:right-8 lg:left-auto z-10 justify-center pointer-events-none transition-opacity duration-700 ${mediaIn ? "opacity-100" : "opacity-0"}`}
        >
          <button
            type="button"
            aria-label="Next exhibition"
            className="h-16 w-16 text-foreground cursor-pointer pointer-events-auto"
            onClick={nextExhibition}
          >
            <TrumpetNav frame={trumpetFrame} className="h-full w-full" />
          </button>
        </div>
      )}
      {/* Home is the index: the exhibitions, works or info view (switched
          from the nav). Shown with the intro's media step. */}
      <div
        className={`transition-opacity duration-700 ${mediaIn ? "opacity-100" : "opacity-0"}`}
      >
        {/* Desktop: the views — Works, Exhibitions, Info — then Email and
            Instagram, stacked in cols
            1–2, a quarter of the screen down (top-[25vh]), on the rows'
            grid, inset, font, size and line height. Fixed, so they stay
            while the list scrolls. Outside the
            view's animation, so they stay put while it switches. The
            current view's link is in GT America Condensed. */}
        <div className="hidden lg:grid fixed inset-0 z-10 grid-cols-12 gap-x-4 px-4 pointer-events-none">
          {/* Cols 1–2, the full screen height, in the page background —
              solid except a fade to transparent along the right edge of col
              2 (the last 20%);
              the links start a quarter of the way down. Only the links
              catch clicks. */}
          <nav className="col-start-1 col-span-2 h-full -ml-4 pl-4 pt-54 flex flex-col items-start font-stix text-sm leading-none text-foreground [&>*]:pointer-events-auto">
            {VIEW_LINKS.map(({ view: v, label }) => (
              <button
                key={v}
                type="button"
                onClick={() => setMode(v)}
                aria-current={view === v ? "page" : undefined}
                style={reveal(1 + VIEW_LINKS.findIndex((l) => l.view === v)).style}
                className={`${reveal(1 + VIEW_LINKS.findIndex((l) => l.view === v)).className} h-9 flex items-center text-left cursor-pointer ${view === v ? "font-gtAmericaCondensed uppercase" : ""}`}
              >
                {label}
              </button>
            ))}
            {/* Search, email and Instagram: right after the views (a line's
                gap). Search filters the works / exhibitions list (by title)
                or the info view's lists. */}
            <div className="mt-9 flex flex-col items-start w-full">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                aria-label={
                  view === "works"
                    ? "Search works"
                    : view === "info"
                      ? "Search info"
                      : "Search exhibitions"
                }
                style={reveal(VIEW_LINKS.length + 1).style}
                className={`${reveal(VIEW_LINKS.length + 1).className} h-9 w-full p-0 m-0 border-0 bg-transparent outline-none font-stix text-sm leading-none text-foreground placeholder:text-primary/50`}
              />
              {/* Contact, after the search (a line's gap). */}
              <a
                href="mailto:elinor.silow@gmail.com"
                style={reveal(VIEW_LINKS.length + 2).style}
                className={`${reveal(VIEW_LINKS.length + 2).className} mt-9 h-9 flex items-center`}
              >
                Email
              </a>
              <a
                href="https://www.instagram.com/elinorsilow"
                target="_blank"
                rel="noopener noreferrer"
                style={reveal(VIEW_LINKS.length + 3).style}
                className={`${reveal(VIEW_LINKS.length + 3).className} h-9 flex items-center`}
              >
                Instagram
              </a>
            </div>
          </nav>
        </div>
        {/* Bottom edge: the page background fading up to transparent,
            fixed over the content (lets clicks through). */}
        <div
          aria-hidden
          className="fixed inset-x-0 bottom-0 z-[5] h-9 bg-linear-to-t from-background to-transparent pointer-events-none"
        />
        {/* Switching views: the old one fades out and slides up, the new
            one fades in from below (AnimatePresence, mode "wait"). */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "info" ? (
              <InfoPageClient bio={bio} press={press} />
            ) : (
              <IndexPageClient />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Current / Upcoming / Past — from the "news" document in Sanity. */}
      <div className="hidden fixed text-9xl font-caslonIonic bottom-2 left-4  items-center justify-center w-full ">
        ELINOR SILOW
      </div>
      <div
        className={`fixed bottom-0 hidden left-0 right-0 z-10 ${introPhase === "done" ? "" : "pointer-events-none"} grid w-full grid-cols-2 lg:grid-cols-12 items-end font-areal font-medium  leading-tight p-4 lg:p-4 gap-4`}
      >
        {news.current && (
          <div
            className={`relative col-start-1   lg:col-span-2  flex-col items-start justify-end gap-4 flex ${revealNews(news.current).className}`}
            style={revealNews(news.current).style}
          >
            <h3 className="font-areal font-medium uppercase tracking-wide text-sm lg:text-xs  w-full">
              Current
            </h3>
            <NewsEntry
              item={news.current}
              className="font-arialRoundedMT font-medium  text-sm lg:text-base flex flex-col gap-y-0 leading-tight tracking-wide"
            />
          </div>
        )}
        {news.upcoming && (
          <div
            className={`relative col-start-2 lg:col-start-10   lg:col-span-4  flex-col justify-end gap-4 flex text-sm lg:text-base ${revealNews(news.upcoming).className}`}
            style={revealNews(news.upcoming).style}
          >
            <h3 className="font-areal font-medium uppercase tracking-wide text-sm lg:text-xs   w-full">
              Upcoming
            </h3>
            <NewsEntry
              item={news.upcoming}
              className="font-arialRoundedMT tracking-wide font-medium  text-sm lg:text-base flex flex-col gap-y-0 leading-tight"
            />
          </div>
        )}
        {news.past && (
          <div
            className={`relative   lg:col-span-3 col-start-11  flex-col justify-end gap-4 hidden  ${revealNews(news.past).className}`}
            style={revealNews(news.past).style}
          >
            <h3 className="font-areal font-medium uppercase tracking-wide text-xs  w-full">
              Past
            </h3>
            <NewsEntry
              item={news.past}
              className="font-arialRoundedMT font-medium  text-base flex flex-col gap-y-0 leading-tight"
            />
          </div>
        )}
      </div>
    </>
  );
}

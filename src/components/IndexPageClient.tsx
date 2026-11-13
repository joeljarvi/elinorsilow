"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useIndex } from "@/context/IndexContext";
import { Work, Exhibition } from "../../lib/sanity";
import WorkModal from "./WorkModal";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import Image from "next/image";
import PurpleBackdrop from "@/components/PurpleBackdrop";
import MetaLine from "@/components/MetaLine";
import LenisScroll from "@/components/LenisScroll";
import ESTitle from "@/components/ESTitle";
import IndexNav from "@/components/IndexNav";
import TitleBlock from "@/components/TitleBlock";
import FadeEdge from "@/components/FadeEdge";
import { useCssHeightVar } from "@/lib/useCssHeightVar";
import { useLenis } from "lenis/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { workMeasurements, workSize } from "@/lib/workSize";
import Ticker from "@/components/Ticker";
import {
  useUI,
  type ImageSize,
  REVEAL_STAGGER,
  REVEAL_ROWS,
  REVEAL_TEXT_AFTER,
  REVEAL_FADE,
} from "@/context/UIContext";

const BATCH = 24;

// A list row's stable key: its view and item id.
const rowKey = (mode: string, id: number | string) => `${mode}-${id}`;

// Opening a row (seconds), top to bottom: the row grows, then its text
// line (INFO_AT), the description / credits (DETAILS_AT), then the media —
// on exhibitions the title (ESTitle, TITLE_AT: fades in 0.4s, spreads
// 0.8s), then the images (IMAGES_AT).
const ROW_S = 0.5;
const INFO_AT = ROW_S;
const DETAILS_AT = INFO_AT + 0.3;
const TITLE_AT = DETAILS_AT + 0.3;
const IMAGES_AT = TITLE_AT + 1.2;

// window.innerHeight, kept up to date (0 on the server / first render).
function useViewportHeight() {
  const [vh, setVh] = useState(0);
  useEffect(() => {
    const sync = () => setVh(window.innerHeight);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return vh;
}

// What a list row shows, so exhibitions and works share ListRow:
// title; place (exhibition venue / work materials, col 7); kind (exhibition
// type / work dimensions, col 10, open only); year; description and credits
// (open row); images (one shown at a time).
type RowItem = {
  // "work" rows lay out a little differently when open (see ListRow).
  variant: "exhibition" | "work";
  title: string;
  // Its own page, opened by clicking the row.
  href?: string;
  place?: string;
  kind?: string;
  year?: string | number;
  description?: string;
  credits?: string;
  // Works only: shown last (cols 11–12).
  category?: string;
  images: string[];
};

function exhibitionRowItem(ex: Exhibition): RowItem {
  return {
    variant: "exhibition",
    title: ex.title.rendered,
    href: `/exhibitions/${ex.slug}`,
    place: [ex.acf.location, ex.acf.city].filter(Boolean).join(", "),
    kind: ex.acf.exhibition_type
      ? `${ex.acf.exhibition_type} Exhibition`
      : undefined,
    year: ex.acf.year,
    description: ex.acf.description,
    credits: ex.acf.credits,
    images: exhibitionImageUrls(ex),
  };
}

function workRowItem(work: Work): RowItem {
  return {
    variant: "work",
    title: work.title.rendered,
    href: `/${work.slug}`,
    place: work.acf.materials,
    category: work.acf.category,
    kind: work.acf.dimensions,
    year: work.acf.year,
    images: work.image_url ? [work.image_url] : [],
  };
}

// The scale reference next to a work: a Solstickan matchbox, 7.3 cm tall. The
// picture is on a 440 × 440 file with empty margins; its box is `CROP` (px).
const MATCHBOX_CM = 7.3;
const MATCHBOX_FILE = 440;
const MATCHBOX_CROP = { x: 80, y: 7, w: 280, h: 426 };
// The space between a work's picture and the matchbox beside it.
const MATCHBOX_GAP = 16;
// CSS pixels per real centimetre on screen (96 per inch), for the scale label.
const SCREEN_PX_PER_CM = 96 / 2.54;

// One row of the exhibitions / works list (see RowItem) — a drop-down: a text row on a
// 12-col grid (title col 4, venue col 8, year col 11). It opens when it
// scrolls into view (crosses a band near the top of the screen) or is
// clicked, showing the description under the title and the exhibition's
// images below (cols 3–10), one at a time: clicking the image shows the
// next one. The open row is text-primary, the rest text-primary/50.
function ListRow({
  item,
  open: openProp,
  tall,
  size: sizeSetting,
  rowRef,
  onToggle,
  reveal,
}: {
  item: RowItem;
  open: boolean;
  // Desktop: this row is a screen tall — the open one and every row above
  // it (see openRows in IndexPageClient).
  tall: boolean;
  // The open row's image size (S / M / L) — chosen by the buttons the page
  // renders fixed in the top-right corner (see ImageSize).
  size: ImageSize;
  rowRef: (el: HTMLDivElement | null) => void;
  onToggle: () => void;
  // The site's reveal (siteReveal): "hidden" — no background or text yet;
  // a number — its background fades in after that many seconds, then its
  // text; undefined — shown.
  reveal?: "hidden" | number;
}) {
  const images = item.images;
  // The counter (and click-for-next) only when there's more than one.
  const multi = images.length > 1;
  // Rows without images (e.g. archive-only exhibitions) never open: they
  // stay closed and text-primary/50 even when selected.
  const open = openProp && images.length > 0;
  const isWork = item.variant === "work";
  const router = useRouter();
  // Image size: the site-wide setting (S / M / L buttons, top right).
  const size: ImageSize = sizeSetting;
  const fullscreen = size === "L";
  // S / M / L set the image's height limit (a share of the screen); open rows
  // are as tall as their content.
  const workMaxH = { S: 0.333, M: 0.5, L: 0.8 }[size];
  // Mobile: images at most 50dvh, the open row as tall as its content.
  const desktop = useIsDesktop();
  const description = item.description;
  const [imageIndex, setImageIndex] = useState(0);

  // Pointer position over the image (desktop), for the counter cursor.
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  // Exhibitions: the title (ESTitle) shows over the image at first; the
  // first click on the image brings the image on top of it.
  // Start from the first image, the title on top, each time it opens.
  useEffect(() => {
    if (open) {
      setImageIndex(0);
    }
  }, [open]);
  // Opening, in steps (see ROW_S…): the text line fades in once the row
  // has grown.
  const [infoShown, setInfoShown] = useState(true);
  // Layout effect: hidden before the opening row is painted (no flash).
  useLayoutEffect(() => {
    if (!open) return;
    setInfoShown(false);
    const t = setTimeout(() => setInfoShown(true), INFO_AT * 1000);
    return () => clearTimeout(t);
  }, [open]);
  // Open: the title (row 1) and its metadata on one line (year, then materials
  // and dimensions, or venue, city and type) — works: under the image (rows
  // 2–3); exhibitions: above it (rows 2–3); closed: just the title.
  const stacked = open;
  // The title (desktop): its whole text, wrapping onto more lines if it needs
  // to (not cut off), at least a row tall.
  const titleFade = `h-12 leading-12 lg:h-auto lg:min-h-9 lg:py-2 lg:leading-tight self-stretch text-left lg:self-center transition-opacity duration-500 ${infoShown || !open ? "opacity-100" : "opacity-0"}`;
  const infoFade = `h-12 leading-12 lg:h-9 lg:leading-9 self-stretch text-left lg:self-center transition-opacity duration-500 ${infoShown || !open ? "opacity-100" : "opacity-0"}`;
  // The open row's height (the screen minus 6rem), in px so it can animate
  // from the closed row's 36px.
  const vh = useViewportHeight();
  const image = images[imageIndex];
  // Open work: the image and matchbox on the same scale (px per cm), as large
  // as fits. The image's longest side is taken as the work's longest
  // measurement, whichever way round its dimensions are written.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  useEffect(() => {
    const box = imageBox.current;
    if (!open || !isWork || !box) return;
    const observer = new ResizeObserver(() => setBoxWidth(box.clientWidth));
    observer.observe(box);
    return () => observer.disconnect();
  }, [open, isWork]);
  // The metadata line under the image starts where the picture does: its left
  // padding, measured from the picture (object-contain: centered in the img on
  // desktop, at its left on mobile) once laid out, and on every resize.
  const imgRef = useRef<HTMLImageElement>(null);
  // An image from the cache can finish loading before its onLoad is attached:
  // take its size from it directly then.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (open && img?.complete && img.naturalWidth)
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
  }, [open, imageIndex]);
  const metaRef = useRef<HTMLSpanElement>(null);
  const [metaInset, setMetaInset] = useState<number | null>(null);
  // The picture's bottom right corner, relative to the row (for the matchbox).
  const [picCorner, setPicCorner] = useState<{
    right: number;
    bottom: number;
  } | null>(null);
  useLayoutEffect(() => {
    const img = imgRef.current;
    const meta = metaRef.current;
    if (!open || !img || !meta) return;
    const measure = () => {
      const r = img.getBoundingClientRect();
      if (!img.naturalWidth || !r.width || !r.height) return;
      const fit = Math.min(
        r.width / img.naturalWidth,
        r.height / img.naturalHeight,
      );
      const picWidth = img.naturalWidth * fit;
      const left = desktop ? r.left + (r.width - picWidth) / 2 : r.left;
      // object-bottom: the picture sits at the bottom of the img box.
      const bottom = r.bottom;
      setMetaInset(Math.max(0, left - meta.getBoundingClientRect().left));
      const row = (
        meta.offsetParent as HTMLElement | null
      )?.getBoundingClientRect();
      if (row)
        setPicCorner({
          right: left + picWidth - row.left,
          bottom: bottom - row.top,
        });
    };
    measure();
    // Re-measured whenever something that can move the picture changes size:
    // the picture, the metadata line, the image area (the window's width) and
    // the row (its height animates as it opens, moving the picture without
    // resizing it) — and once the fonts have loaded (the text lines above it).
    const observer = new ResizeObserver(measure);
    observer.observe(img);
    observer.observe(meta);
    if (imageBox.current) observer.observe(imageBox.current);
    if (meta.offsetParent) observer.observe(meta.offsetParent);
    let live = true;
    document.fonts?.ready.then(() => live && measure());
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [open, imageIndex, natural, desktop]);
  // The Filter panel's "Show scale" setting.
  const { showScale } = useIndex();
  const scaled = (() => {
    const longest = workMeasurements(item.kind)[0];
    if (!isWork || !open || !natural || !boxWidth || !vh || !longest)
      return null;
    const cm = longest / Math.max(natural.w, natural.h);
    const workW = natural.w * cm;
    const workH = natural.h * cm;
    // The size's share of the screen.
    const maxH = vh * workMaxH;
    // Width: room for the matchbox (and its 16px gap) beside the picture — on
    // both sides, as the picture is centered on desktop.
    const matchW = (MATCHBOX_CM * MATCHBOX_CROP.w) / MATCHBOX_CROP.h;
    const px = Math.min(
      maxH / Math.max(workH, MATCHBOX_CM),
      (boxWidth - 2 * MATCHBOX_GAP) / (workW + 2 * matchW),
    );
    // "1:13" (shown smaller than life), or "1.5:1" (larger).
    const ratio = SCREEN_PX_PER_CM / px;
    const label =
      ratio >= 1
        ? `1:${Math.round(ratio)}`
        : `${(1 / ratio).toFixed(1).replace(/\.0$/, "")}:1`;
    return { px, workW, workH, label };
  })();
  // Fullscreen: the image box becomes a screen tall with py-4, in the page
  // (the row grows to fit), brought into view once the row has grown.
  const imageBox = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    if (!open) setIsFullscreen(false);
  }, [open]);
  useEffect(() => {
    if (!isFullscreen) return;
    const t = setTimeout(
      () => imageBox.current?.scrollIntoView({ block: "center" }),
      ROW_S * 1000 + 50,
    );
    return () => clearTimeout(t);
  }, [isFullscreen]);
  return (
    <motion.div
      // Desktop: rows at and above the open one are a screen tall (h-dvh),
      // the rest just their text — so rows only ever change height below
      // the reading line, and scrolling never jumps. Mobile: a closed row
      // is a 4-col grid (title cols 1–2, location col 3, year col 4); an
      // open one a 2-col grid (image and title full width, then venue /
      // type / year two per line, description and credits full width).
      ref={rowRef}
      // The open row is the anchor: the picker (and the mobile follow)
      // center the whole row — image and text together — in the viewport.
      data-picker-anchor={open ? "" : undefined}
      // A row is clickable anywhere: it goes straight to the item's own page.
      onClick={() => {
        if (item.href) router.push(item.href);
      }}
      // Reveal: background, then text, each fading in after its delay.
      style={
        typeof reveal === "number"
          ? {
              transitionProperty: "background-color, color",
              transitionDuration: `${REVEAL_FADE}s`,
              transitionDelay: `${reveal}s, ${reveal + REVEAL_TEXT_AFTER}s`,
            }
          : undefined
      }
      initial={false}
      // Open: as tall as its content (its image limited by S / M / L).
      animate={{
        // As tall as its content.
        height: "auto",
      }}
      transition={{ duration: ROW_S, ease: [0.22, 1, 0.36, 1] }}
      className={`group/row relative      ${reveal === "hidden" ? "bg-transparent! text-transparent!" : ""} bg-background ${open ? "" : ""} ${open ? ` overflow-hidden grid-rows-[3rem] ${isWork ? "lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-y-0" : `lg:grid-rows-[auto_auto_minmax(0,1fr)_minmax(4.5rem,max-content)_auto] lg:gap-y-0 ${isFullscreen ? "" : "lg:max-h-dvh"}`}` : "cursor-pointer h-auto overflow-hidden"} ${tall ? "lg:min-h-dvh" : ""} lg:content-center flex flex-col ${open ? "" : "justify-center"} lg:gap-3 px-0 lg:px-0 lg:grid lg:grid-cols-12  lg:gap-x-4 font-stix leading-[1] text-sm transition-colors duration-300 hover:text-primary  ${open ? "text-primary" : "text-primary/50"}`}
    >
      <div
        // A div, not a <button>: Safari doesn't apply display: contents to
        // buttons, which then lay out (and center) the text as one box.
        // Closed: the click bubbles to the row (above), which opens it — so
        // do nothing here, or it would toggle twice. Open: toggles (mobile
        // closes it; the desktop picker is already there).
        role="button"
        onClick={() => {
          if (open) onToggle();
        }}
        aria-expanded={open}
        className="contents cursor-pointer text-left"
      >
        {/* Title: cols 1–6, open and closed. */}
        <motion.span
          className={
            // Mobile: the title's first line indented a third of the width.
            // Mobile: open (2-col grid) one column; closed (4-col) two.
            `col-span-1 ${open ? "indent-0" : "indent-0 lg:group-hover/row:indent-2"} font-areal text-2xl  group/title flex text-neutral-800 items-center min-w-0 overflow-hidden  tracking-wide lg:col-start-1 px-2 lg:col-span-6 lg:row-start-1 ${titleFade}`
          }
        >
          {/* Mobile: a ticker when it doesn't fit. Desktop: wraps. */}
          <Ticker className="w-full lg:hidden">{item.title}</Ticker>
          <span className="hidden lg:block min-w-0 transition-[text-indent] duration-300">
            {item.title}
          </span>
        </motion.span>
        <motion.span
          // Venue / materials: cols 5–7 (the title 1–4); materials only
          // when open,
          // always one line (a ticker when it doesn't fit).
          ref={metaRef}
          // Starts under the picture's left edge (see metaInset).
          style={
            // Works only: exhibitions keep it top left, above the image.
            isWork && open && metaInset !== null
              ? { paddingLeft: metaInset, textIndent: 0 }
              : undefined
          }
          className={`${isWork ? "order-3 mt-12 lg:mt-4" : "order-1"} font-areal font-medium text-2xl text-neutral-800 lg:order-none col-span-1 ${open ? "block indent-4" : "hidden"} ${stacked ? `lg:col-start-1 lg:col-span-12 lg:px-4 ${isWork ? "lg:row-start-3" : "lg:row-start-2"}` : "lg:col-start-5 lg:col-span-3 lg:row-start-1"} min-w-0 max-w-full truncate ${infoFade}`}
        >
          <Ticker>
            {stacked
              ? [item.year, item.place, item.kind].filter(Boolean).join(", ")
              : item.place}
          </Ticker>
        </motion.span>
        {/* Open row: the description on row 4 (cols 1–5), fading in. */}
        {open && description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: isWork ? DETAILS_AT : IMAGES_AT + 0.5,
            }}
            data-lenis-prevent
            className="order-4 mt-12 lg:mt-0 col-span-2 px-4 lg:order-none lg:col-start-1 lg:col-span-5 lg:row-start-4 lg:py-3 min-h-12 lg:min-h-9 max-h-[20dvh] lg:max-h-none font-areal text-xl font-medium tracking-normal text-neutral-800 overflow-y-auto scrollbar-hide whitespace-pre-line leading-snug"
          >
            {description}
          </motion.p>
        )}
        {/* Open row: the credits on row 4, beside the description (cols 7–10), fading in with the
            description. */}
        {open && item.credits && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: isWork ? DETAILS_AT : IMAGES_AT + 0.5,
            }}
            data-lenis-prevent
            className={`order-4 col-span-2 px-4 lg:order-none font-areal font-medium text-sm tracking-normal text-neutral-800 lg:col-start-7 lg:col-span-4 lg:row-start-4 ${description ? "mt-12 lg:mt-0" : ""} lg:py-4 min-h-12 lg:min-h-9 max-h-[20dvh] lg:max-h-none overflow-y-auto scrollbar-hide whitespace-pre-line leading-snug`}
          >
            {item.credits}
          </motion.p>
        )}
        {/* Works: the category, last — cols 11–12. Hidden for now (add
            lg:block to bring it back). */}
        {item.category && (
          <motion.span
            className={`order-1 lg:order-none col-span-1 hidden capitalize lg:col-start-11 lg:col-span-2 lg:row-start-1 ${stacked ? "lg:text-right lg:px-4" : ""} truncate ${infoFade}`}
          >
            <Ticker>{item.category}</Ticker>
          </motion.span>
        )}
      </div>
      {/* The images, taking the height left. Works: on row 2 (under the
          title), the metadata under them (row 3). Exhibitions: on row 3, under
          the title and metadata, then the description / credits (rows 4–5). */}
      <AnimatePresence initial={false}>
        {open && image && (
          <motion.div
            key="details"
            // The image area is laid out at once (the row is a fixed
            // height); the image fades in inside it — on exhibitions after
            // the title (ESTitle) — and the title stays on top of it.
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            }}
            // A grid (one cell on mobile): the title shares the image's
            // cell, vertically centered on it.
            // Pulled up over the row gap above it, so it meets the text
            // line (works, desktop: two gaps — the empty row 2 between).
            // Exhibitions: right after the text line (row 2), the
            // description / credits below it.
            className={`order-2 mt-12 ${isWork ? "lg:mt-0 lg:row-start-2" : "lg:mt-4 lg:row-start-3"} -mx-3 lg:mx-0 ${isWork ? "pl-2 pr-4 lg:px-4" : "pl-2 pr-3 lg:px-0"} relative overflow-hidden min-h-0 col-span-2 lg:order-none lg:col-span-12 grid grid-cols-1 grid-rows-[minmax(0,1fr)] lg:grid-cols-12 lg:gap-x-4`}
          >
            {image && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: isWork ? TITLE_AT : IMAGES_AT,
                }}
                className={`col-start-1 bg-background row-start-1 min-h-0 h-full w-full flex flex-col items-start lg:items-center gap-12 lg:gap-2 ${fullscreen ? "lg:col-start-1 lg:col-span-12" : "lg:col-start-1 lg:col-span-12"}`}
              >
                {/* The image (click → next), centered in the space the row
                    has left for it and never taller than that; S / M at
                    most a fixed share of the screen, L as big as fits. */}
                <div
                  ref={imageBox}
                  className={`relative w-full bg-background ${isFullscreen ? "h-dvh py-4 flex-none" : "flex-1 min-h-0"}`}
                >
                  <button
                    type="button"
                    // Several images: next one.
                    onClick={() => {
                      if (multi) setImageIndex((i) => (i + 1) % images.length);
                    }}
                    aria-label={
                      multi
                        ? `Next image (${imageIndex + 1} of ${images.length})`
                        : undefined
                    }
                    // Desktop: the counter replaces the mouse cursor here.
                    onMouseMove={(e) => {
                      const box = e.currentTarget.getBoundingClientRect();
                      setCursor({
                        x: e.clientX - box.left,
                        y: e.clientY - box.top,
                      });
                    }}
                    onMouseLeave={() => setCursor(null)}
                    className={`flex items-end justify-start lg:justify-center w-full h-full ${multi ? "lg:cursor-none" : "cursor-default"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={image}
                      ref={imgRef}
                      // The row's drag, not the browser's image drag.
                      draggable={false}
                      onLoad={(e) =>
                        setNatural({
                          w: e.currentTarget.naturalWidth,
                          h: e.currentTarget.naturalHeight,
                        })
                      }
                      style={
                        scaled
                          ? {
                              width: scaled.workW * scaled.px,
                              height: scaled.workH * scaled.px,
                            }
                          : undefined
                      }
                      src={`${image}?w=2000&auto=format`}
                      alt={`${item.title} — image ${imageIndex + 1}`}
                      className={`block object-contain object-left-bottom lg:object-bottom ${isFullscreen ? "w-full h-full" : `w-full lg:w-auto h-auto max-w-full ${size === "S" ? "max-h-[33.3vh]" : size === "M" ? "max-h-[50vh]" : "max-h-[80vh]"} ${isWork ? "" : size === "S" ? "lg:max-h-[min(33.3vh,100%)]" : size === "M" ? "lg:max-h-[min(50vh,100%)]" : "lg:max-h-[min(80vh,100%)]"}`}`}
                    />
                  </button>
                  {multi && cursor && (
                    <span
                      aria-hidden
                      className="hidden lg:block absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 whitespace-nowrap tabular-nums text-primary"
                      style={{ left: cursor.x, top: cursor.y }}
                    >
                      {imageIndex + 1} of {images.length}
                    </span>
                  )}
                </div>
                {/* Counter: the mouse cursor over the image on desktop
                    ("1 of 5"); on mobile "5 / 7", left-aligned under the
                    image. */}
                <span
                  className={`${multi ? "flex lg:hidden" : "hidden"} min-h-12 items-center tabular-nums`}
                >
                  {imageIndex + 1} / {images.length}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Open exhibition (desktop): Prev / Next (images, when several) and
          Fullscreen, at the right of the ListRow on the picture's bottom line
          (in fullscreen: the bottom right of the screen, so they stay in
          view). */}
      {open && !isWork && image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: IMAGES_AT + 0.5,
          }}
          // Their bottom on the picture's bottom (see picCorner).
          style={
            !isFullscreen && picCorner
              ? { top: picCorner.bottom, bottom: "auto" }
              : undefined
          }
          className={`${isFullscreen ? "fixed bottom-4" : `absolute bottom-4 ${picCorner ? "-translate-y-full" : ""}`} right-4 z-30 hidden lg:flex flex-row justify-end gap-x-3 text-xl font-areal font-medium uppercase text-neutral-800`}
        >
          {multi && (
            <>
              <button
                type="button"
                onClick={() =>
                  setImageIndex((i) => (i - 1 + images.length) % images.length)
                }
                className="cursor-pointer"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                className="cursor-pointer"
              >
                Next
              </button>
            </>
          )}
          <button
            type="button"
            aria-pressed={isFullscreen}
            onClick={() => setIsFullscreen((v) => !v)}
            className="cursor-pointer"
          >
            {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          </button>
        </motion.div>
      )}
      {/* Open work: its scale and the matchbox at that scale, beside the
          picture on its right, its bottom on the picture's bottom. */}
      {scaled && showScale && picCorner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: TITLE_AT }}
          style={{
            left: picCorner.right + MATCHBOX_GAP,
            // Bottom-aligned with the picture.
            top: picCorner.bottom - MATCHBOX_CM * scaled.px,
          }}
          className="absolute z-10 flex items-start gap-x-4 pointer-events-none font-areal font-medium text-xl uppercase leading-none text-neutral-800"
        >
          {/* The scale ("1:14"), hidden for now. */}
          <span className="hidden whitespace-nowrap">
            Scale: {scaled.label}
          </span>
          <span
            className="relative block shrink-0 overflow-hidden"
            style={{
              width:
                (MATCHBOX_CM * scaled.px * MATCHBOX_CROP.w) / MATCHBOX_CROP.h,
              height: MATCHBOX_CM * scaled.px,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              draggable={false}
              src="/solstickan-440.png"
              alt="Solstickan matchbox, for scale"
              className="absolute max-w-none"
              style={(() => {
                const k = (MATCHBOX_CM * scaled.px) / MATCHBOX_CROP.h;
                return {
                  width: MATCHBOX_FILE * k,
                  height: MATCHBOX_FILE * k,
                  left: -MATCHBOX_CROP.x * k,
                  top: -MATCHBOX_CROP.y * k,
                };
              })()}
            />
          </span>
        </motion.div>
      )}
      {/* Open row: the close cross, at the far right of the text line (row 1,
          h-9), centered on it like the text. */}
      {open && (
        <div
          className={`absolute top-0 right-0 px-3 lg:px-4 h-12 lg:h-9  z-20 hidden lg:flex items-center gap-3 text-neutral-800`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close"
            // Desktop only (mobile closes by tapping the row's title line).
            className="hidden lg:block cursor-pointer"
          >
            {/* A cross, about 2px strokes. */}
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              className="block size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
            >
              <line x1="1" y1="1" x2="19" y2="19" />
              <line x1="19" y1="1" x2="1" y2="19" />
            </svg>
          </button>
        </div>
      )}
    </motion.div>
  );
}

// image_1 … image_10 of an exhibition, in order, skipping empty slots.
function exhibitionImageUrls(ex: Exhibition): string[] {
  const acf = ex.acf as Record<string, unknown>;
  return Array.from({ length: 10 }, (_, i) => acf[`image_${i + 1}`])
    .map((img) => (img as { url?: string } | undefined)?.url)
    .filter((url): url is string => Boolean(url));
}

// lg+ (Tailwind's 1024px), tracked live. False on the server and first
// render.
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
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
  // Extra classes for the fixed title block (a static Tailwind class).
  titleClassName?: string;
  // The image size setting: the images' height limit.
  size: ImageSize;
}) {
  const [active, setActive] = useState(0);
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
      {current && (
        <div
          ref={titleRef}
          // Fixed at the top left (Image mode).
          className={`fixed top-0 left-0  z-70 w-full bg-background   text-neutral-800 pointer-events-none flex flex-col gap-y-0 pb-3 px-3 pt-3 lg:p-6 transition-opacity duration-500 ${hidden ? "opacity-0" : "opacity-100"}`}
        >
          <TitleBlock
            title={current.title}
            metadata={current.metadata}
            href={current.href}
            textWidth="max-w-full pr-1 lg:max-w-xl"
            className={titleClassName}
          />
          {/* Mobile: the page background fading out above it. */}
          <FadeEdge className="hidden" />
        </div>
      )}
      <div
        className={`flex flex-col ${gap} transition-opacity duration-1000 ${hidden ? "opacity-0" : "opacity-100"}`}
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
            {item.images.map((src, j) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={`${src}?h=1600&auto=format`}
                alt={j === 0 ? item.title : ""}
                loading={i < 2 && j === 0 ? "eager" : "lazy"}
                draggable={false}
                className={imageClass}
              />
            ))}
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
    closeRowsSignal,
    shuffleSeed,
  } = useIndex();
  // Desktop (lg+), tracked live: the lists use the picker there.
  const desktop = useIsDesktop();
  // Exhibitions and works lists: the open rows (several can be open at
  // once; each click toggles one), and the one opened last.
  // Keyed by the row's item (rowKey).
  const [openRows, setOpenRows] = useState<Set<string>>(() => new Set());
  const lastOpened = useRef<string | null>(null);
  const openOnly = (key: string | null) => {
    setOpenRows(new Set(key === null ? [] : [key]));
    lastOpened.current = key;
  };
  // Image size (S / M / L): a site-wide setting, kept in UIContext. Each
  // view starts at L, and the S / M / L buttons change it from there.
  const { imageSize, setImageSize, siteReveal, filterOpen } = useUI();
  useEffect(() => {
    setImageSize("L");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const exRowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Reset (the Filter row): nothing open.
  useEffect(() => {
    if (closeRowsSignal > 0) openOnly(null);
  }, [closeRowsSignal]);
  // A new search: nothing open (the old index would point at another item).
  const firstSearch = useRef(true);
  useEffect(() => {
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }
    openOnly(null);
  }, [search]);

  // Keep the open row (image + text) centered in the viewport (its
  // top at the top if it's taller than the screen) for `ms` — every frame, easing the
  // page toward it — so the view sticks to the row while it opens, the row
  // above closes, or the image changes size.
  const stickRef = useRef(0);
  const lenis = useLenis();
  const stickToRow = (key: string, ms = 1200) => {
    cancelAnimationFrame(stickRef.current);
    const until = performance.now() + ms;
    const step = () => {
      const row = exRowRefs.current[key];
      // Not rendered yet (e.g. just loaded further down the list): try
      // again next frame.
      if (!row) {
        if (performance.now() < until)
          stickRef.current = requestAnimationFrame(step);
        return;
      }
      // Center the row (image + text); if it's taller than the screen, put
      // its top at the top instead so the start of it is visible.
      const box = row.getBoundingClientRect();
      const vh = window.innerHeight;
      // Mobile: its top just under the top bar (36px, ESNav h-9).
      const delta = !desktop
        ? box.top - 36
        : box.height < vh
          ? box.top + box.height / 2 - vh / 2
          : box.top;
      // Ease most of the way each frame; the last frames land exactly.
      const last = performance.now() >= until;
      const by = last ? delta : delta * 0.25;
      if (lenis) lenis.scrollTo(window.scrollY + by, { immediate: true });
      else window.scrollBy(0, by);
      if (!last) stickRef.current = requestAnimationFrame(step);
    };
    stickRef.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(stickRef.current), []);

  // Clicking a row toggles it (desktop: the others stay as they are); an opening
  // row is followed (stickToRow) through its reveal.
  const toggleRow = (key: string) => {
    const opening = !openRows.has(key);
    setOpenRows((prev) => {
      // Mobile: one open row at a time (opening one closes the others).
      const next = new Set(desktop ? prev : []);
      if (opening) next.add(key);
      else next.delete(key);
      return next;
    });
    if (opening) {
      lastOpened.current = key;
      stickToRow(key);
    }
  };
  // Re-center the last opened row when the image size (S / M / L) changes.
  useEffect(() => {
    const key = lastOpened.current;
    if (key !== null && openRows.has(key)) stickToRow(key, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSize]);
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${w.image_url}?w=1000&auto=format`}
                        alt={w.title.rendered}
                        loading="lazy"
                        className="block w-full h-auto transition-opacity duration-200 hover:opacity-50"
                      />
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
                maxW="max-w-2/3 lg:max-w-1/6"
                sameWidth
                // The title block at most 2/3 of the screen on mobile (clear of
                // the filters, top right), max-w-2xl on desktop (! beats its
                // max-w-6xl).
                titleClassName="max-w-2/3! lg:max-w-2xl!"
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
                // The title block at most 2/3 of the screen on mobile (clear of
                // the filters, top right), max-w-2xl on desktop (! beats its
                // max-w-6xl).
                titleClassName="max-w-2/3! lg:max-w-2xl!"
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

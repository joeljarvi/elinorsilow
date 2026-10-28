"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useIndex } from "@/context/IndexContext";
import { Work, Exhibition } from "../../lib/sanity";
import WorkModal from "./WorkModal";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { ArrowLeft, ArrowRight, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import PurpleBackdrop from "@/components/PurpleBackdrop";
import MetaLine from "@/components/MetaLine";
import LenisScroll from "@/components/LenisScroll";
import ESTitle from "@/components/ESTitle";
import IndexNav from "@/components/IndexNav";
import BackToTop from "@/components/BackToTop";
import { useUI, type ImageSize } from "@/context/UIContext";

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
    place: ex.acf.location,
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
    place: work.acf.materials,
    category: work.acf.category,
    kind: work.acf.dimensions,
    year: work.acf.year,
    images: work.image_url ? [work.image_url] : [],
  };
}

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
  striped,
  size: sizeSetting,
  rowRef,
  onToggle,
  onDragStart,
  moved,
}: {
  item: RowItem;
  open: boolean;
  // Desktop: this row is a screen tall — the open one and every row above
  // it (see openRows in IndexPageClient).
  tall: boolean;
  // Every second row: a purple background while closed.
  striped?: boolean;
  // The open row's image size (S / M / L) — chosen by the buttons the page
  // renders fixed in the top-right corner (see ImageSize).
  size: ImageSize;
  rowRef: (el: HTMLDivElement | null) => void;
  onToggle: () => void;
  // Desktop: pressing the ⇕ handle (next to ×) starts dragging the row to
  // another place in the list (see DraggableRow).
  onDragStart?: (e: ReactPointerEvent) => void;
  // Being / having been dragged: the page background, never striped.
  moved?: boolean;
}) {
  const images = item.images;
  // The counter (and click-for-next) only when there's more than one.
  const multi = images.length > 1;
  // Rows without images (e.g. archive-only exhibitions) never open: they
  // stay closed and text-primary/50 even when selected.
  const open = openProp && images.length > 0;
  const isWork = item.variant === "work";
  // Image size: the site-wide setting (S / M / L buttons, top right).
  const size: ImageSize = sizeSetting;
  const fullscreen = size === "L";
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
  // Mobile: when the description or credits run over more than one line
  // (taller than a row), a row's gap (mt-9) between the two.
  const descRef = useRef<HTMLParagraphElement>(null);
  const creditsRef = useRef<HTMLParagraphElement>(null);
  const [detailsTall, setDetailsTall] = useState(false);
  useLayoutEffect(() => {
    if (!open) return;
    // More than one line: content (minus py-3) over 1.5 line heights.
    const multiline = (el: HTMLElement | null) => {
      if (!el) return false;
      const line = parseFloat(getComputedStyle(el).lineHeight) || 20;
      return el.scrollHeight - 24 > line * 1.5;
    };
    setDetailsTall(multiline(descRef.current) || multiline(creditsRef.current));
  }, [open, description, item.credits]);
  // Layout effect: hidden before the opening row is painted (no flash).
  useLayoutEffect(() => {
    if (!open) return;
    setInfoShown(false);
    const t = setTimeout(() => setInfoShown(true), INFO_AT * 1000);
    return () => clearTimeout(t);
  }, [open]);
  const infoFade = `h-9 leading-9 self-center transition-opacity duration-500 ${infoShown || !open ? "opacity-100" : "opacity-0"}`;
  // The open row's height (the screen minus 6rem), in px so it can animate
  // from the closed row's 36px.
  const vh = useViewportHeight();
  const image = images[imageIndex];
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
      // A closed row is clickable anywhere (not just on its text) to view
      // it. On the open row only the title line toggles (below), so clicks
      // on its image / full-screen button don't.
      onClick={() => {
        if (!open) onToggle();
      }}
      initial={false}
      // L: the screen minus 6rem, the image filling what the text leaves;
      // S / M: as tall as the image and text (at most that).
      animate={{
        height: open
          ? fullscreen && desktop
            ? vh
              ? vh - 96
              : "calc(100vh - 6rem)"
            : "auto"
          : 36,
      }}
      transition={{ duration: ROW_S, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${moved ? "bg-background" : ""} ${striped && !open ? "bg-purple-100" : ""} ${open ? "" : striped ? "hover:bg-purple-200" : "hover:bg-purple-100"} ${open ? `${fullscreen ? "lg:h-[calc(100vh-6rem)]" : "lg:max-h-[calc(100vh-6rem)]"} overflow-hidden grid-rows-[2.25rem] ${isWork ? "lg:grid-rows-[2.25rem_minmax(0,max-content)_minmax(0,1fr)]" : "lg:grid-rows-[2.25rem_minmax(0,1fr)_minmax(4.5rem,max-content)]"}` : "cursor-pointer h-9 overflow-hidden content-center"} ${tall ? "lg:min-h-dvh" : ""} lg:content-center ${open ? "grid grid-cols-2 gap-x-2 gap-y-0" : "grid grid-cols-2 gap-x-2"} lg:gap-3 px-3 lg:px-0 lg:grid lg:grid-cols-12  lg:gap-x-4 font-stix leading-[1] text-sm transition-colors duration-300 hover:text-primary  ${open ? "text-primary pb-9 lg:pb-0" : "text-primary/50"}`}
    >
      {/* Open purple row (desktop): its text keeps the purple background
          — the text line, and on exhibitions the description / credits
          row under the image (min 4.5rem) — the image the page's. */}
      {open && striped && (
        <div
          aria-hidden
          className="hidden lg:block lg:col-start-1 lg:col-span-12 lg:row-start-1 bg-purple-100"
        />
      )}
      {open && striped && !isWork && (
        <div
          aria-hidden
          className="hidden lg:block lg:col-start-1 lg:col-span-12 lg:row-start-3 bg-purple-100"
        />
      )}
      <button
        type="button"
        // Closed: the click bubbles to the row (above), which opens it — so
        // do nothing here, or it would toggle twice. Open: toggles (mobile
        // closes it; the desktop picker is already there).
        onClick={() => {
          if (open) onToggle();
        }}
        aria-expanded={open}
        className="contents cursor-pointer text-left"
      >
        {/* Title: cols 3–5 (works: cols 3–4), open and closed. */}
        <motion.span
          className={
            // Mobile: the title's first line indented a third of the width.
            // Mobile: open (2-col grid) one column; closed (4-col) two.
            `col-span-1 ${open ? "italic font-bold" : ""} font-normal truncate lg:col-start-3 ${isWork ? "lg:col-span-2 font-bold" : "lg:col-span-3"} lg:row-start-1 ${infoFade}`
          }
        >
          {item.title}
        </motion.span>
        <motion.span
          // Venue: cols 6–7. Materials (works): cols 5–7 (the title 3–4),
          // always one line, cut off with "…". Mobile, open: it ends at
          // the controls (× — and ← → on exhibitions) with a gap-x-3
          // (the controls' width + 12px of right padding).
          className={`order-1 lg:order-none col-span-1 ${open ? "block" : "hidden lg:block"} ${isWork ? "lg:col-start-5 lg:col-span-3" : "lg:col-start-6 lg:col-span-2"} ${open ? (!isWork && multi ? "pr-[5.25rem]" : "pr-7") : ""} lg:pr-0 min-w-0 max-w-full truncate lg:row-start-1 ${infoFade}`}
        >
          {item.place}
        </motion.span>
        {/* Open row: the description on row 3, in the title's column (3),
            (cols 3–5), fading in. */}
        {open && description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: isWork ? DETAILS_AT : IMAGES_AT + 0.5,
            }}
            ref={descRef}
            data-lenis-prevent
            className="order-3 col-span-2 lg:order-none lg:col-start-3 lg:col-span-4 lg:row-start-3 py-3 min-h-9 max-h-[20dvh] lg:max-h-none overflow-y-auto scrollbar-hide whitespace-pre-line leading-snug"
          >
            {description}
          </motion.p>
        )}
        {/* Open row: the credits on row 3, below the venue (cols
            6–9), fading in with the description. */}
        {open && item.credits && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: isWork ? DETAILS_AT : IMAGES_AT + 0.5,
            }}
            ref={creditsRef}
            data-lenis-prevent
            className={`order-3 col-span-2 lg:order-none lg:col-start-9 lg:col-span-3 lg:row-start-3 ${description && detailsTall ? "mt-9 lg:mt-0" : ""} py-3 min-h-9 max-h-[20dvh] lg:max-h-none overflow-y-auto scrollbar-hide whitespace-pre-line leading-snug`}
          >
            {item.credits}
          </motion.p>
        )}
        {/* Type (exhibitions) / dimensions (works): cols 8–9, always. */}
        {item.kind && (
          <motion.span
            className={`order-1 lg:order-none col-span-1 ${isWork ? "lg:col-start-8" : "lg:col-start-9"} lg:col-span-2 truncate lg:row-start-1 ${infoFade}`}
          >
            {item.kind}
          </motion.span>
        )}
        <motion.span
          className={`order-1 lg:order-none col-span-1 ${open ? "flex" : "hidden lg:flex"} items-center w-full ${isWork ? "lg:col-start-10" : "lg:col-start-11"} lg:col-span-1 min-w-0 truncate lg:row-start-1 ${infoFade}`}
        >
          {item.year}
        </motion.span>
        {/* Works: the category, last — cols 11–12, always. */}
        {item.category && (
          <motion.span
            className={`order-1 lg:order-none col-span-1 hidden lg:block capitalize lg:col-start-11 lg:col-span-2 truncate lg:row-start-1 ${infoFade}`}
          >
            {item.category}
          </motion.span>
        )}
      </button>
      {/* The images, below the row's text line (title / venue / type /
          year, row 1), taking the height left: works on row 3, exhibitions
          on row 2 with the description / credits under them (row 3). */}
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
            className={`${isWork ? "order-3 mt-9 lg:-mt-6 lg:row-start-3" : "order-2 mt-9 lg:-my-3 lg:row-start-2"} -mx-3 px-3 lg:mx-0 lg:px-0 relative overflow-hidden min-h-0 col-span-2 lg:order-none lg:col-span-12 grid grid-cols-1 grid-rows-[minmax(0,1fr)] lg:grid-cols-12 lg:gap-x-4`}
          >
            {/* Open exhibition: its title on top of the image, vertically
                centered on it (both centered in the image area), desktop
                cols 2–11 (ESTitle). */}
            {!isWork && (
              <ESTitle
                title={item.title}
                delay={TITLE_AT}
                className="col-start-1 row-start-1 self-center lg:col-start-2 lg:col-span-10"
              />
            )}
            {image && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: isWork ? TITLE_AT : IMAGES_AT,
                }}
                className={`col-start-1 bg-background row-start-1 min-h-0 h-full w-full flex flex-col items-start lg:items-center gap-2 ${fullscreen ? "lg:col-start-1 lg:col-span-12" : "lg:col-start-1 lg:col-span-12"}`}
              >
                {/* The image (click → next), centered in the space the row
                    has left for it and never taller than that; S / M at
                    most a fixed share of the screen, L as big as fits. */}
                <div className="relative flex-1 min-h-0 w-full ">
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
                    className={`flex items-center justify-start lg:justify-center w-full h-full ${multi ? "lg:cursor-none" : "cursor-default"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={image}
                      src={`${image}?w=2000&auto=format`}
                      alt={`${item.title} — image ${imageIndex + 1}`}
                      className={`block object-contain object-left lg:object-center ${size === "L" ? "w-full h-auto max-h-[50dvh] lg:h-full lg:max-h-none" : size === "S" ? "w-full lg:w-auto h-auto max-w-full max-h-[50dvh] lg:max-h-[20dvh]" : "w-full lg:w-auto h-auto max-w-full max-h-[50dvh] lg:max-h-[45dvh]"}`}
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
                  className={`${multi ? "flex lg:hidden" : "hidden"} min-h-9 items-center tabular-nums`}
                >
                  {imageIndex + 1} / {images.length}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Open row: ← / → (images, exhibitions with several) and ×
          (close) — at the right end of the text line
          (row 1, h-9), centered on it like the text. */}
      {open && (
        <div
          className="absolute top-0 right-0 px-3 lg:px-4 h-9  z-20 flex items-center gap-3 text-primary/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Exhibitions with several images: ← / → (previous / next
                image), before the row arrows. */}
          {!isWork && multi && (
            <>
              <button
                type="button"
                onClick={() =>
                  setImageIndex((i) => (i - 1 + images.length) % images.length)
                }
                aria-label="Previous image"
                className="cursor-pointer"
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                aria-label="Next image"
                className="cursor-pointer"
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </>
          )}
          {/* Desktop: drag to move the row up / down the list. */}
          {onDragStart && (
            <button
              type="button"
              onPointerDown={onDragStart}
              aria-label="Drag to move"
              className="hidden lg:block cursor-grab active:cursor-grabbing touch-none"
            >
              <ChevronsUpDown className="size-4" strokeWidth={1.5} />
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            aria-label="Close"
            className="cursor-pointer"
          >
            <X className="size-4" strokeWidth={1.5} />
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

// A list row that can be dragged to another place in the list (a
// Reorder.Item), only from its handle: `children` gets the function that
// starts the drag (ListRow's onDragStart).
function DraggableRow({
  value,
  children,
}: {
  value: string;
  children: (startDrag: (e: ReactPointerEvent) => void) => ReactNode;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      as="div"
      value={value}
      dragListener={false}
      dragControls={controls}
      className="relative"
    >
      {children((e) => controls.start(e))}
    </Reorder.Item>
  );
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

export default function IndexPageClient() {
  const { mode, sort, search } = useIndex();
  // Desktop (lg+), tracked live: the lists use the picker there.
  const desktop = useIsDesktop();
  // Exhibitions and works lists: the open rows (several can be open at
  // once; each click toggles one), and the one opened last.
  // Keyed by the row's item (rowKey), so they stay open when rows are
  // dragged to other places.
  const [openRows, setOpenRows] = useState<Set<string>>(() => new Set());
  const lastOpened = useRef<string | null>(null);
  // The order rows have been dragged into (keys; see DraggableRow). Reset
  // when switching between works and exhibitions.
  const [rowOrder, setRowOrder] = useState<string[]>([]);
  // The rows that have been dragged: the page background from then on.
  const [movedRows, setMovedRows] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    setRowOrder([]);
    setMovedRows(new Set());
  }, [mode]);
  const openOnly = (key: string | null) => {
    setOpenRows(new Set(key === null ? [] : [key]));
    lastOpened.current = key;
  };
  // Image size (S / M / L): a site-wide setting, kept in UIContext. Each
  // view starts at its default — works M, exhibitions L — and the S / M / L
  // buttons change it from there.
  const { imageSize, setImageSize } = useUI();
  useEffect(() => {
    setImageSize(mode === "works" ? "M" : "L");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const exRowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Entering a list (the page's first load, or switching between works and
  // exhibitions) opens a row — see the effect after visibleExhibitions.
  const openOnEnter = useRef(true);
  useEffect(() => {
    openOnEnter.current = true;
  }, [mode]);
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
  const stickToRow = (key: string, ms = 1200) => {
    cancelAnimationFrame(stickRef.current);
    const until = performance.now() + ms;
    const step = () => {
      const row = exRowRefs.current[key];
      if (!row) return;
      // Center the row (image + text); if it's taller than the screen, put
      // its top at the top instead so the start of it is visible.
      const box = row.getBoundingClientRect();
      const vh = window.innerHeight;
      const delta =
        box.height < vh ? box.top + box.height / 2 - vh / 2 : box.top;
      // Ease most of the way each frame; the last frames land exactly.
      const last = performance.now() >= until;
      window.scrollBy(0, last ? delta : delta * 0.25);
      if (!last) stickRef.current = requestAnimationFrame(step);
    };
    stickRef.current = requestAnimationFrame(step);
  };
  useEffect(() => () => cancelAnimationFrame(stickRef.current), []);

  // Clicking a row toggles it (the others stay as they are); an opening
  // row is followed (stickToRow) through its reveal.
  const toggleRow = (key: string) => {
    const opening = !openRows.has(key);
    setOpenRows((prev) => {
      const next = new Set(prev);
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

  const visibleWorks = applyFilters(sortedWorks, (w) => w.title.rendered);
  const visibleExhibitions = applyFilters(
    sortedExhibitions,
    (e) => e.title.rendered,
  );
  useEffect(() => {
    setVisibleCount(BATCH);
  }, [mode, sort, visibleWorks.length, visibleExhibitions.length]);

  // Entering the works list opens a row, once its items have loaded — a
  // random featured work (else the latest); exhibitions start all closed.
  // Loads enough rows to include it and brings it into view. (After the
  // visibleCount reset above, which would otherwise undo the extra rows.)
  useEffect(() => {
    if (!openOnEnter.current) return;
    if (mode === "works") {
      if (visibleWorks.length === 0) return;
      openOnEnter.current = false;
      // A random one of the works marked "Featured on home page"; if
      // none are, the latest work (newest year, then most recently added).
      const featured = visibleWorks
        .map((w, i) => (w.featured ? i : -1))
        .filter((i) => i >= 0);
      let pick = 0;
      if (featured.length) {
        pick = featured[Math.floor(Math.random() * featured.length)];
      } else {
        visibleWorks.forEach((w, i) => {
          const p = visibleWorks[pick];
          const dy = (w.acf.year ?? 0) - (p.acf.year ?? 0);
          if (dy > 0 || (dy === 0 && w.date > p.date)) pick = i;
        });
      }
      setVisibleCount((c) => Math.max(c, pick + 1));
      const key = rowKey("works", visibleWorks[pick].id);
      openOnly(key);
      stickToRow(key);
      return;
    }
    // Exhibitions: all rows start closed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, visibleWorks.length]);

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
      <div className="relative isolate min-h-dvh lg:grid lg:grid-cols-12 lg:gap-2 lg:items-start">
        {/* Page is a 4-col grid (lines up with the nav's 4 columns). Filter
            sidebar: col 1. Works: all 4 columns (one work per column);
            "all": cols 2–3; exhibitions: cols 2–4. */}
        <div className="lg:col-start-1 lg:col-span-12 lg:row-start-1 flex flex-col mt-24 lg:mt-0 lg:px-0">
          <div>
            {(mode === "works" || mode === "exhibitions") &&
              (() => {
                // Works and exhibitions share the list (see ListRow): a
                // plain drop-down on a normally scrolling page (desktop and
                // mobile) — click a row to open it; the page then follows it
                // to the middle of the screen (stickToRow).
                // In the order the visitor has dragged them into
                // (rowOrder), then the rest in the list's own order.
                const byKey = new Map<string, RowItem>(
                  mode === "works"
                    ? visibleWorks
                        .slice(0, visibleCount)
                        .map((w) => [rowKey("works", w.id), workRowItem(w)])
                    : visibleExhibitions
                        .slice(0, visibleCount)
                        .map((ex) => [
                          rowKey("exhibitions", ex.id),
                          exhibitionRowItem(ex),
                        ]),
                );
                const keys = [
                  ...rowOrder.filter((k) => byKey.has(k)),
                  ...[...byKey.keys()].filter((k) => !rowOrder.includes(k)),
                ];
                return (
                  <Reorder.Group
                    as="div"
                    axis="y"
                    values={keys}
                    onReorder={setRowOrder}
                    className="relative flex flex-col pb-24"
                  >
                    {keys.map((key, i) => (
                      <DraggableRow key={key} value={key}>
                        {(startDrag) => (
                          <ListRow
                            item={byKey.get(key)!}
                            open={openRows.has(key)}
                            tall={false}
                            striped={i % 2 === 1 && !movedRows.has(key)}
                            moved={movedRows.has(key)}
                            size={imageSize}
                            rowRef={(el) => {
                              exRowRefs.current[key] = el;
                            }}
                            onToggle={() => toggleRow(key)}
                            // Works only: rows can be dragged around.
                            onDragStart={
                              mode === "works"
                                ? (e) => {
                                    setMovedRows((prev) =>
                                      new Set(prev).add(key),
                                    );
                                    startDrag(e);
                                  }
                                : undefined
                            }
                          />
                        )}
                      </DraggableRow>
                    ))}
                  </Reorder.Group>
                );
              })()}

            <div ref={sentinelRef} className="h-1" />
            <BackToTop />
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

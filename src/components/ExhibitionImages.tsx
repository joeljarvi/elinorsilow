"use client";

import {
  useEffect,
  useRef,
  useState,
  ViewTransition,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { PAGE_TOP } from "@/lib/layout";

// An exhibition's images, one under another, each with its caption below:
// the first fitting the first screen under the intro, the rest each as big
// as in the lightbox.
// Clicking one opens it in a lightbox: the image as tall as the screen
// (minus py-6) on the page background, with Close at the top right; Esc or a
// click outside the image closes it too.
// The view-transition name the page image and the lightbox image share.
const LIGHTBOX_VT = "es-lightbox";

export default function ExhibitionImages({
  images,
  title,
  intro,
  outro,
  transitionName,
}: {
  images: { url: string; alt?: string; caption?: string }[];
  title: string;
  // Above the first image, in the first screen (the description).
  intro?: ReactNode;
  // After the last image, at its left edge on desktop (the credits).
  outro?: ReactNode;
  // The first image's view-transition name (vtName of the page's href): it
  // zooms in from the exhibitions feed, and back out.
  transitionName?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  // The page's images, for the lightbox's morph.
  const pageImgs = useRef<(HTMLImageElement | null)[]>([]);
  // Opening / closing the lightbox morphs the clicked image between its
  // place on the page and the full screen (View Transitions: it lifts above
  // everything and grows into the viewport; closing reverses it). The page
  // image and the lightbox image share one name — the page image only
  // around the swap, so the two never hold it at once.
  const openAt = (i: number) => {
    const el = pageImgs.current[i];
    if (!document.startViewTransition || !el) return setOpen(i);
    el.style.viewTransitionName = LIGHTBOX_VT;
    document.startViewTransition(() => {
      flushSync(() => setOpen(i));
      el.style.viewTransitionName = "";
    });
  };
  const close = () => {
    const el = open === null ? null : pageImgs.current[open];
    if (!document.startViewTransition || !el) return setOpen(null);
    const t = document.startViewTransition(() => {
      flushSync(() => setOpen(null));
      el.style.viewTransitionName = LIGHTBOX_VT;
    });
    t.finished.finally(() => {
      el.style.viewTransitionName = "";
    });
  };
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  // The lightbox's ← / → keys: the previous / next image, wrapping around.
  const step = (by: number) =>
    setOpen((i) => (i === null ? i : (i + by + images.length) % images.length));
  const alt = (i: number) => images[i].alt || (i === 0 ? title : "");
  // An image's caption (from Sanity), under it.
  const caption = (i: number) =>
    images[i].caption ? (
      <figcaption className="shrink-0 w-full max-w-full lg:max-w-xl mx-auto pt-1 font-gensco text-[14px] lg:text-[16px] leading-tight text-neutral-800">
        {images[i].caption}
      </figcaption>
    ) : null;

  return (
    <>
      {/* The intro (description) at PAGE_TOP (a third of the way down; a
          quarter on desktop), then the first image — as big as the rest
          (at most the screen less 6rem, as on a work's page). Desktop: the
          two share a box as wide as the image (w-fit, centered), so the
          intro starts at the image's left edge; the intro (and the caption)
          take that width without widening it (w-0 min-w-full). */}
      <div className={`w-full flex flex-col items-center ${PAGE_TOP}`}>
        <div className="w-full lg:w-fit flex flex-col gap-y-3">
          {intro && <div className="lg:w-0 lg:min-w-full">{intro}</div>}
          {images[0] && (
            <figure className="w-full flex flex-col">
              <button
                type="button"
                onClick={() => openAt(0)}
                className="w-full flex justify-center cursor-zoom-in"
              >
                <ViewTransition name={transitionName}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={(el) => {
                      pageImgs.current[0] = el;
                    }}
                    src={`${images[0].url}?w=2000&auto=format`}
                    alt={alt(0)}
                    loading="eager"
                    className="block w-auto h-auto max-w-full max-h-[calc(100vh-6rem)] object-contain"
                  />
                </ViewTransition>
              </button>
              <div className="lg:w-0 lg:min-w-full">{caption(0)}</div>
            </figure>
          )}
          {/* Only one image: the outro after it. */}
          {outro && images.length <= 1 && (
            <div className="lg:w-0 lg:min-w-full">{outro}</div>
          )}
        </div>
      </div>
      {/* The rest, one under another, gap-y-3 apart (mobile and
          desktop) — each at most the screen less 6rem, with its caption;
          after the last, the outro. Desktop: each in a box as wide as the
          image (as the first), so the caption / outro start at its left
          edge. */}
      <div className="flex flex-col gap-y-3 w-full pt-3">
        {images.slice(1).map((img, k) => {
          const i = k + 1;
          return (
            <figure
              key={img.url}
              className="w-full lg:w-fit lg:mx-auto flex flex-col"
            >
              <button
                type="button"
                onClick={() => openAt(i)}
                className="flex justify-center w-full cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={(el) => {
                    pageImgs.current[i] = el;
                  }}
                  src={`${img.url}?w=2000&auto=format`}
                  alt={alt(i)}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="block w-auto h-auto max-w-full max-h-[calc(100vh-6rem)] object-contain"
                />
              </button>
              <div className="lg:w-0 lg:min-w-full">{caption(i)}</div>
              {outro && i === images.length - 1 && (
                <div className="lg:w-0 lg:min-w-full pt-3">{outro}</div>
              )}
            </figure>
          );
        })}
      </div>
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt(open) || title}
          onClick={close}
          // The page background: during the morph the page (title,
          // text) fades out under it (and back in on close).
          className="fixed inset-0 z-[90] flex items-center justify-center px-3 lg:px-6 py-3 bg-background"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            // The same file as on the page (already loaded), so the morph
            // has it at once.
            src={`${images[open].url}?w=2000&auto=format`}
            style={{ viewTransitionName: LIGHTBOX_VT }}
            alt={alt(open)}
            // As tall as the screen less py-3 (12px top and bottom).
            // Clicking it closes the lightbox, as clicking around it does.
            className="relative z-10 cursor-zoom-out block w-auto h-auto max-w-full max-h-[calc(100dvh-1.5rem)] object-contain"
          />
          <button
            type="button"
            onClick={close}
            className="fixed top-3 right-3 z-20 font-gensco text-[18px] leading-tight text-neutral-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

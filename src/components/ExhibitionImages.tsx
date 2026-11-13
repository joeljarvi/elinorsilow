"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PAGE_TOP } from "@/lib/layout";

// An exhibition's images, one under another, each with its caption below:
// the first fitting the first screen under the intro, the rest each as big
// as in the lightbox.
// Clicking one opens it in a lightbox: the image as tall as the screen
// (minus py-6) on the page background, with Close at the top right; Esc or a
// click outside the image closes it too.
export default function ExhibitionImages({
  images,
  title,
  intro,
  outro,
}: {
  images: { url: string; alt?: string; caption?: string }[];
  title: string;
  // Above the first image, in the first screen (the description).
  intro?: ReactNode;
  // After the last image, at its left edge on desktop (the credits).
  outro?: ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
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
      <div className={`w-full flex flex-col items-center ${PAGE_TOP} px-1`}>
        <div className="w-full lg:w-fit flex flex-col gap-y-2">
          {intro && <div className="lg:w-0 lg:min-w-full">{intro}</div>}
          {images[0] && (
            <figure className="w-full flex flex-col">
              <button
                type="button"
                onClick={() => setOpen(0)}
                className="w-full flex justify-center cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${images[0].url}?w=2000&auto=format`}
                  alt={alt(0)}
                  loading="eager"
                  className="block w-auto h-auto max-w-full max-h-[calc(100vh-6rem)] object-contain"
                />
              </button>
              <div className="lg:w-0 lg:min-w-full">{caption(0)}</div>
            </figure>
          )}
          {/* Only one image: the outro after it. */}
          {outro && images.length <= 1 && (
            <div className="lg:w-0 lg:min-w-full pt-6">{outro}</div>
          )}
        </div>
      </div>
      {/* The rest, one under another, gap-y-3 apart on mobile, gap-y-6 on
          desktop — each at most the screen less 6rem, with its caption;
          after the last, the outro. Desktop: each in a box as wide as the
          image (as the first), so the caption / outro start at its left
          edge. */}
      <div className="flex flex-col gap-y-3 lg:gap-y-6 w-full px-1 pt-3 lg:pt-6">
        {images.slice(1).map((img, k) => {
          const i = k + 1;
          return (
            <figure
              key={img.url}
              className="w-full lg:w-fit lg:mx-auto flex flex-col"
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="flex justify-center w-full cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${img.url}?w=2000&auto=format`}
                  alt={alt(i)}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="block w-auto h-auto max-w-full max-h-[calc(100vh-6rem)] object-contain"
                />
              </button>
              <div className="lg:w-0 lg:min-w-full">{caption(i)}</div>
              {outro && i === images.length - 1 && (
                <div className="lg:w-0 lg:min-w-full pt-6">{outro}</div>
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
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 lg:px-6 lg:py-6  bg-background"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${images[open].url}?h=2400&auto=format`}
            alt={alt(open)}
            onClick={(e) => e.stopPropagation()}
            className="block w-auto h-auto max-w-full max-h-full object-contain"
          />
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="fixed top-0 lg:top-6 right-1 lg:right-6 font-gensco text-[18px] lg:text-[21px] leading-tight text-neutral-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

// The images' height limits, in turn down the page, so the column varies
// rather than every image being the same size.
const HEIGHTS = [
  "max-h-[80dvh]",
  "max-h-[50dvh]",
  "max-h-[66dvh]",
  "max-h-[40dvh]",
  "max-h-[90dvh]",
  "max-h-[60dvh]",
];

// An exhibition's images, one under another (centered, at most 2/3 wide).
// Clicking one opens it in a lightbox: the image as tall as the screen
// (minus py-6) on the page background, with Close at the top right; Esc or a
// click outside the image closes it too.
export default function ExhibitionImages({
  images,
  title,
}: {
  images: { url: string; alt?: string }[];
  title: string;
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

  return (
    <>
      {images.map((img, i) => (
        <button
          key={img.url}
          type="button"
          onClick={() => setOpen(i)}
          className="flex justify-center w-full cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${img.url}?w=2000&auto=format`}
            alt={alt(i)}
            loading={i < 2 ? "eager" : "lazy"}
            className={`block w-auto h-auto max-w-full lg:max-w-2/3 ${HEIGHTS[i % HEIGHTS.length]}`}
          />
        </button>
      ))}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt(open) || title}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center px-6 py-6 bg-background"
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
            className="fixed top-6 right-3 lg:right-6 font-gensco text-[21px] leading-tight text-neutral-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}

"use client";

import type { Work } from "../../lib/sanity";
import Link from "next/link";
import { useUI, navReveal } from "@/context/UIContext";
import { VIEW_LINKS } from "./ESNav";

// The home page: the nav (ESNav), the view links across the middle, and one
// featured work (hidden for now: change `hidden` on <main> to `flex`) filling the screen
// under it, laid out like an open work in /index/works: its title, the image,
// then "year, materials, dimensions" under the image (wrapping to its width),
// starting at its left
// edge. It doesn't scroll. The image is centered.
export default function HomeLayoutClient({ work }: { work: Work | null }) {
  const { siteReveal } = useUI();
  // Hidden behind the "under construction" overlay; fades in when it closes.
  const fade = `transition-opacity duration-1000 ${siteReveal === "covered" ? "opacity-0" : "opacity-100"}`;
  if (!work) return null;
  const metadata = [work.acf.year, work.acf.materials, work.acf.dimensions]
    .filter(Boolean)
    .join(", ");
  return (
    <>
      {/* The views, Works / Exhibitions / Info, spread across the middle of the
          screen (over the work), fading in with the nav. */}
      <nav className="fixed inset-x-0 top-1/2 -translate-y-1/2 z-10 flex justify-between px-3 lg:px-4 font-areal font-medium text-xl uppercase text-neutral-800 pointer-events-none">
        {VIEW_LINKS.map(({ view, label, href }, i) => {
          const reveal = navReveal(siteReveal === "nav", i + 1);
          return (
            <Link
              key={view}
              href={href}
              style={reveal.style}
              // Clickable once shown (hidden, navReveal makes them inert).
              className={`${siteReveal === "nav" ? "pointer-events-auto" : ""} ${reveal.className}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <main
        className={`${fade} hidden h-dvh flex-col pt-12 px-3 lg:pt-9 lg:px-4 pb-4 text-neutral-800`}
      >
        <h1 className="h-12 lg:h-9 shrink-0 flex items-center min-w-0 font-medium font-areal text-xl uppercase tracking-wide">
          <span className="truncate">{work.title.rendered}</span>
        </h1>
        {work.image_url && (
          <div className="flex-1 min-h-0 mt-4 flex items-center justify-center">
            {/* Sized to the picture, so its caption starts at the picture's
              left edge. The image leaves room for the lines above and below
              it. */}
            <figure className="inline-flex flex-col max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${work.image_url}?w=2000&auto=format`}
                alt={work.title.rendered}
                className="block w-auto h-auto max-w-full max-h-[calc(100dvh-11rem)] lg:max-h-[calc(100dvh-9rem)]"
              />
              {metadata && (
                // w-0 min-w-full: as wide as the picture (wrapping), not the text.
                <figcaption className="w-0 min-w-full mt-4 font-gensco font-normal text-2xl leading-tight">
                  {metadata}
                </figcaption>
              )}
            </figure>
          </div>
        )}
      </main>
    </>
  );
}

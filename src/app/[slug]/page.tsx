import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllWorks, getWorkBySlug } from "../../../lib/sanity";
import TitleBlock from "@/components/TitleBlock";
import BackdropClose from "@/components/BackdropClose";
import { ViewTransition } from "react";
import { vtName } from "@/lib/viewTransition";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await getWorkBySlug((await params).slug);
  return {
    title: work ? `${work.title.rendered} — elinorsilow.com` : undefined,
  };
}

// A work's own page: the title and "year, materials, dimensions" at the top
// left, the work centered in the viewport. Clicking anywhere but the image
// goes back to the list. Prev / Next at the bottom right.
export default async function WorkPage({ params }: Props) {
  const [work, all] = await Promise.all([
    getWorkBySlug((await params).slug),
    getAllWorks(),
  ]);
  if (!work) notFound();
  // Prev / Next: the works in the feed's default order (latest first),
  // wrapping around at either end.
  const works = [...all].sort((a, b) => b.date.localeCompare(a.date));
  const at = works.findIndex((w) => w.id === work.id);
  const step = (by: number) =>
    works.length > 1 && at !== -1
      ? works[(at + by + works.length) % works.length]
      : null;
  const prev = step(-1);
  const next = step(1);
  const metadata = [work.acf.year, work.acf.materials, work.acf.dimensions]
    .filter(Boolean)
    .join(", ");
  return (
    <BackdropClose
      fallback="/works"
      className="relative h-dvh flex items-center justify-center px-3 lg:px-6 text-neutral-800 cursor-pointer"
    >
      {/* Title and metadata at the top left, out of the way of the image. */}
      <TitleBlock
        heading
        stacked
        title={work.title.rendered}
        metadata={metadata}
        className="absolute top-0 left-0 h-12 lg:h-18 flex justify-center text-[18px]! px-3 lg:px-6 pt-3 lg:pt-6 pr-20 lg:pr-0 min-w-0 max-w-sm"
      />
      {/* Prev / Next, fixed at the bottom right (as on an exhibition's
          page). */}
      {(prev || next) && (
        <nav className="fixed bottom-3 right-3 lg:bottom-6 lg:right-6 z-80 flex items-baseline gap-x-3 font-gensco text-[18px] leading-tight text-neutral-800 cursor-default">
          {prev && (
            <Link
              href={`/${prev.slug}`}
              aria-label={`Previous: ${prev.title.rendered}`}
            >
              Prev
            </Link>
          )}
          {next && (
            <Link
              href={`/${next.slug}`}
              aria-label={`Next: ${next.title.rendered}`}
            >
              Next
            </Link>
          )}
        </nav>
      )}
      {/* The work, centered in the viewport. */}
      {work.image_url && (
        // The same image as in the feed / grid (by name): it zooms in from
        // there, and back out on the way back.
        <ViewTransition name={vtName(`/${work.slug}`)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${work.image_url}?h=2000&auto=format`}
            alt={work.title.rendered}
            className="block w-auto h-auto max-w-full max-h-[75dvh] lg:max-h-[calc(100vh-4rem)] object-contain cursor-default"
          />
        </ViewTransition>
      )}
    </BackdropClose>
  );
}

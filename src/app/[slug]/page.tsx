import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkBySlug } from "../../../lib/sanity";
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
// goes back to the list.
export default async function WorkPage({ params }: Props) {
  const work = await getWorkBySlug((await params).slug);
  if (!work) notFound();
  const metadata = [work.acf.year, work.acf.materials, work.acf.dimensions]
    .filter(Boolean)
    .join(", ");
  return (
    <BackdropClose
      fallback="/works"
      // The image centered in the screen.
      className="relative h-dvh flex items-center justify-center px-3 lg:px-3 text-neutral-800 cursor-pointer"
    >
      {/* Title and metadata at the top left, out of the way of the image
          (desktop only). */}
      <TitleBlock
        heading
        stacked
        title={work.title.rendered}
        metadata={metadata}
        className="absolute top-0 left-0 z-10 h-auto pb-3 lg:h-18 hidden lg:flex justify-center text-[18px]! bg-background px-3 lg:px-3 pt-3 lg:pt-3 pr-20 lg:pr-0 min-w-0 max-w-sm"
      />
      {/* The work, centered in the viewport. */}
      {work.image_url && (
        // The same image as in the feed / grid (by name): it zooms in from
        // there, and back out on the way back.
        <ViewTransition name={vtName(`/${work.slug}`)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${work.image_url}?h=2000&auto=format`}
            alt={work.title.rendered}
            className="block w-auto h-auto max-w-full max-h-[calc(100dvh-1.5rem)] object-contain cursor-default"
          />
        </ViewTransition>
      )}
    </BackdropClose>
  );
}

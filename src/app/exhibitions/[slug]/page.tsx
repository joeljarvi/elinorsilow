import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllExhibitions,
  getExhibitionBySlug,
  type Exhibition,
} from "../../../../lib/sanity";
import TitleBlock from "@/components/TitleBlock";
import ExhibitionImages from "@/components/ExhibitionImages";
import ScrollToTop from "@/components/ScrollToTop";
import ShowAtBottom from "@/components/ShowAtBottom";
import { vtName } from "@/lib/viewTransition";

// An exhibition's images, in order — all of them.
function exhibitionImages(ex: Exhibition) {
  return ex.images;
}

// "year, venue, city, type".
function exhibitionMetadata(ex: Exhibition) {
  return [
    ex.acf.year,
    ex.acf.location,
    ex.acf.city,
    ex.acf.exhibition_type && `${ex.acf.exhibition_type} Exhibition`,
  ]
    .filter(Boolean)
    .join(", ");
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ex = await getExhibitionBySlug((await params).slug);
  return {
    title: ex ? `${ex.title.rendered} — elinorsilow.com` : undefined,
  };
}

// An exhibition's own page: the title and "year, venue, city, type" fixed
// at the top left (like a work's page), then, centered, the description, all
// its images one under another and the credits; Prev / Next to the
// neighbouring exhibitions.
export default async function ExhibitionPage({ params }: Props) {
  const [ex, all] = await Promise.all([
    getExhibitionBySlug((await params).slug),
    getAllExhibitions(),
  ]);
  if (!ex) notFound();
  const metadata = exhibitionMetadata(ex);
  const images = exhibitionImages(ex);
  // Prev / Next: the exhibitions in the list's order (newest first),
  // wrapping around at either end.
  const at = all.findIndex((other) => other.id === ex.id);
  const step = (by: number) =>
    all.length > 1 && at !== -1
      ? all[(at + by + all.length) % all.length]
      : null;
  const prev = step(-1);
  const next = step(1);
  const prevNext = (
    <>
      {prev && (
        <Link
          href={`/exhibitions/${prev.slug}`}
          aria-label={`Previous: ${prev.title.rendered}`}
        >
          Prev
        </Link>
      )}
      {next && (
        <Link
          href={`/exhibitions/${next.slug}`}
          aria-label={`Next: ${next.title.rendered}`}
        >
          Next exhibition
        </Link>
      )}
    </>
  );
  return (
    <main className="flex flex-col px-3 pb-3 text-neutral-800">
      {/* The title, fixed at the top left while the page scrolls, on the
          page background fading out at its bottom edge (as on the lists).
          Clear of Back at the top right. */}
      <div className="fixed inset-x-0 top-0 pt-3 lg:pt-3 z-70 px-3 pb-3 bg-background lg:px-3 pointer-events-none">
        <TitleBlock
          heading
          title={ex.title.rendered}
          metadata={metadata}
          className="text-[18px]! max-w-1/3 mb-3 lg:mb-0 "
        />
      </div>
      {/* Back to top, fixed at the bottom left — desktop. */}
      <ScrollToTop className="hidden lg:block fixed bottom-3 left-3 z-80 font-gensco text-[18px] leading-tight text-neutral-800" />
      {/* Prev / Next, fixed at the bottom right — desktop, once scrolled
          to the end of the page. */}
      <ShowAtBottom className="hidden lg:flex fixed bottom-3 right-3 z-80 items-baseline gap-x-3 font-gensco text-[18px] leading-tight text-neutral-800">
        {prevNext}
      </ShowAtBottom>
      {/* The description, then all the images, one under another — centered,
          starting below the fixed title. */}
      <div className="flex flex-col items-center gap-y-3">
        {/* The description and the first image share the first screen. */}
        <ExhibitionImages
          images={images}
          title={ex.title.rendered}
          transitionName={vtName(`/exhibitions/${ex.slug}`)}
          intro={
            ex.acf.description && (
              <p className="w-full max-w-full lg:max-w-xl whitespace-pre-line lg:text-justify font-gensco text-[18px] lg:text-[18px] leading-tight">
                {ex.acf.description}
              </p>
            )
          }
          // The credits, after the last image, at its left edge (desktop)
          // — styled as the description.
          outro={
            ex.acf.credits && (
              <p className="w-full max-w-xl whitespace-pre-line text-justify font-gensco text-[18px] lg:text-[18px] leading-tight">
                {ex.acf.credits}
              </p>
            )
          }
        />
      </div>
      {/* Mobile: Back to top (left) and Prev / Next (right), at the bottom
          of the page, below the credits. */}
      <div className="lg:hidden flex items-baseline justify-between pt-12 pb-3 font-gensco text-[18px] leading-tight text-neutral-800">
        <ScrollToTop always />
        <span className="flex items-baseline gap-x-3">{prevNext}</span>
      </div>
    </main>
  );
}

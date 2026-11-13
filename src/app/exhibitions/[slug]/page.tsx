import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllExhibitions,
  getExhibitionBySlug,
  type Exhibition,
} from "../../../../lib/sanity";
import TitleBlock from "@/components/TitleBlock";
import FadeEdge from "@/components/FadeEdge";
import ExhibitionImages from "@/components/ExhibitionImages";

// An exhibition's images (image_1 … image_10), in order.
function exhibitionImages(ex: Exhibition) {
  const acf = ex.acf as Record<string, unknown>;
  return Array.from({ length: 10 }, (_, i) => acf[`image_${i + 1}`])
    .map(
      (img) =>
        img as { url?: string; alt?: string; caption?: string } | undefined,
    )
    .filter((img): img is { url: string; alt?: string; caption?: string } =>
      Boolean(img?.url),
    );
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

// Three other exhibitions to show as related: the closest in year (those
// with images first; the same type wins a tie).
function relatedExhibitions(ex: Exhibition, all: Exhibition[]) {
  const year = Number(ex.acf.year) || 0;
  return all
    .filter((other) => other.id !== ex.id)
    .map((other) => ({
      other,
      score:
        (exhibitionImages(other).length ? 0 : 1000) +
        Math.abs((Number(other.acf.year) || 0) - year) * 2 +
        (other.acf.exhibition_type === ex.acf.exhibition_type ? 0 : 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ other }) => other);
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
// its images one under another and the credits; then three related
// exhibitions.
export default async function ExhibitionPage({ params }: Props) {
  const [ex, all] = await Promise.all([
    getExhibitionBySlug((await params).slug),
    getAllExhibitions(),
  ]);
  if (!ex) notFound();
  const metadata = exhibitionMetadata(ex);
  const images = exhibitionImages(ex);
  const related = relatedExhibitions(ex, all);
  return (
    <main className="flex flex-col px-0 lg:px-6 pb-6 text-neutral-800">
      {/* The title, fixed at the top left while the page scrolls, on the
          page background fading out at its bottom edge (as on the lists).
          Clear of Back at the top right. */}
      <div className="fixed inset-x-0 top-4 z-70  px-4     bg-background lg:bg-transparent pointer-events-none">
        <TitleBlock heading title={ex.title.rendered} metadata={metadata} />
      </div>
      {/* The description, then all the images, one under another — centered,
          starting below the fixed title. */}
      <div className="flex flex-col items-center gap-y-2">
        {/* The description and the first image share the first screen. */}
        <ExhibitionImages
          images={images}
          title={ex.title.rendered}
          intro={
            ex.acf.description && (
              <p className="w-full max-w-full lg:max-w-xl whitespace-pre-line text-justify font-gensco text-[18px] lg:text-[21px] leading-tight">
                {ex.acf.description}
              </p>
            )
          }
        />
        {/* The credits, after the images — styled as the description. */}
        {ex.acf.credits && (
          <p className="w-full max-w-xl whitespace-pre-line text-justify font-gensco text-[18px] lg:text-[21px] leading-tight">
            {ex.acf.credits}
          </p>
        )}
      </div>
      {/* Related: three other exhibitions, side by side — each its first
          image, its title and metadata showing on hover; clicking one opens
          it. */}
    </main>
  );
}

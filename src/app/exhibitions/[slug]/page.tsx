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
    .map((img) => img as { url?: string; alt?: string } | undefined)
    .filter((img): img is { url: string; alt?: string } => Boolean(img?.url));
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
    <main className="flex flex-col px-3 lg:px-6 pb-6 text-neutral-800">
      {/* The title, fixed at the top left while the page scrolls, on the
          page background fading out at its bottom edge (as on the lists).
          Clear of Back at the top right. */}
      <div className="fixed inset-x-0 top-0 z-70 px-3 lg:px-6 pt-3 pb-3 lg:pt-6 lg:pb-6 pr-20 lg:pr-24 bg-background pointer-events-none">
        <TitleBlock heading title={ex.title.rendered} metadata={metadata} />
        <FadeEdge />
      </div>
      {/* The description, then all the images, one under another — centered,
          starting below the fixed title. */}
      <div className="flex flex-col items-center gap-y-6 pt-36 lg:pt-36">
        {ex.acf.description && (
          <p className="w-full max-w-full lg:max-w-xl whitespace-pre-line text-justify font-gensco text-[18px] lg:text-[21px] leading-tight">
            {ex.acf.description}
          </p>
        )}
        <ExhibitionImages images={images} title={ex.title.rendered} />
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
      {related.length > 0 && (
        <section className="flex flex-col gap-y-6 lg:max-w-2/3 mx-auto  min-h-dvh items-center justify-center">
          <h2 className="font-gensco text-[18px] lg:text-[21px] leading-tight">
            Related
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-12 gap-y-12">
            {related.map((other, i) => {
              const cover = exhibitionImages(other)[0];
              return (
                <Link
                  key={other.id}
                  href={`/exhibitions/${other.slug}`}
                  aria-label={other.title.rendered}
                  // Mobile: only the first two.
                  className={`group relative self-start ${i > 1 ? "hidden lg:block" : ""}`}
                >
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${cover.url}?w=1000&auto=format`}
                      alt={other.title.rendered}
                      loading="lazy"
                      className="block w-auto h-auto max-w-full max-h-[40dvh] object-contain object-left-top"
                    />
                  )}
                  {/* Its title and metadata, only on hover: the page
                      background over the image, as in the works grid. */}
                  <div
                    className={`${cover ? "absolute inset-0 opacity-0 group-hover:opacity-100" : ""} bg-background transition-opacity duration-200 pointer-events-none`}
                  >
                    <TitleBlock
                      title={other.title.rendered}
                      metadata={exhibitionMetadata(other)}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkBySlug } from "../../../lib/sanity";
import TitleBlock from "@/components/TitleBlock";

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
// left, the work centered in the viewport.
export default async function WorkPage({ params }: Props) {
  const work = await getWorkBySlug((await params).slug);
  if (!work) notFound();
  const metadata = [work.acf.year, work.acf.materials, work.acf.dimensions]
    .filter(Boolean)
    .join(", ");
  return (
    <main className="relative h-dvh flex items-center justify-center px-3 lg:px-6 text-neutral-800">
      {/* Title and metadata at the top left, out of the way of the image. */}
      <TitleBlock
        heading
        title={work.title.rendered}
        metadata={metadata}
        className="absolute top-0 left-0 px-3 lg:px-6 pt-3 lg:pt-6 pr-20 lg:pr-0 min-w-0"
      />
      {/* The work, centered in the viewport. */}
      {work.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${work.image_url}?h=2000&auto=format`}
          alt={work.title.rendered}
          className="block w-auto h-auto max-w-full max-h-[75dvh] object-contain"
        />
      )}
    </main>
  );
}

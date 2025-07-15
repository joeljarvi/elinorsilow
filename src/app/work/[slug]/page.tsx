import { getWorkBySlug, getAllWorks } from "../../../../lib/wordpress";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Params = {
  slug: string;
};

type WorkPageProps = {
  params: Params;
};

export async function generateStaticParams(): Promise<Params[]> {
  const works = await getAllWorks();
  return works.map((work) => ({
    slug: work.slug,
  }));
}

export default async function WorkPage({ params }: WorkPageProps) {
  const work = await getWorkBySlug(params.slug);
  if (!work) return notFound();

  const imageUrl = work._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const alt = work._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? "";

  return (
    <article className="flex flex-col lg:flex-row justify-center items-center mx-auto p-6 h-screen gap-3">
      <div className="flex flex-col w-full items-center justify-center">
        <h1
          className="font-sans uppercase"
          dangerouslySetInnerHTML={{ __html: work.title.rendered }}
        />

        <ul className="flex flex-wrap gap-x-1 items-center justify-center font-serif text-sm text-gray-700">
          <li>
            <span className="font-serif-bold">Year:</span> {work.acf.year},
          </li>
          <li>
            <span className="font-serif-bold">Medium:</span> {work.acf.medium},
          </li>
          <li>
            <span className="font-serif-bold">Materials:</span>{" "}
            {work.acf.materials},
          </li>
          <li>
            <span className="font-serif-bold">Dimensions:</span>{" "}
            {work.acf.dimensions}
          </li>
        </ul>
      </div>

      {imageUrl && (
        <Image
          src={imageUrl}
          alt={alt}
          width={1600}
          height={1200}
          className="h-screen p-24 object-contain"
        />
      )}

      <section
        className="work-content"
        dangerouslySetInnerHTML={{ __html: work.content.rendered }}
      />

      <Link href="/">
        <Button variant="link" className="font-sans absolute top-0 left-0 z-10">
          Back to works
        </Button>
      </Link>
    </article>
  );
}

import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

interface ExhibitionPageProps {
  params: { slug: string };
}

export default function ExhibitionPage({ params }: ExhibitionPageProps) {
  return (
    <div className="min-h-screen grid grid-cols-6 max-w-7xl">
      <ExhibitionSlugModalClient slug={params.slug} />
    </div>
  );
}

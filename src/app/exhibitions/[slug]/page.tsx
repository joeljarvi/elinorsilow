import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ExhibitionPage({ params }: PageProps) {
  return (
    <div className="min-h-screen grid grid-cols-6 max-w-7xl">
      <ExhibitionSlugModalClient slug={params.slug} />
    </div>
  );
}

// src/app/exhibitions/[slug]/page.tsx

import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

export default function ExhibitionPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div className="min-h-screen grid grid-cols-6 max-w-7xl">
      <ExhibitionSlugModalClient slug={params.slug} />
    </div>
  );
}

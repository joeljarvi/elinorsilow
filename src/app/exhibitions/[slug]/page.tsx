"use client";

import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

type Params = {
  slug: string;
};

interface Props {
  params: Params;
}

export default function ExhibitionPage({ params }: Props) {
  return (
    <div className="min-h-screen grid grid-cols-6 max-w-7xl">
      <ExhibitionSlugModalClient slug={params.slug} />
    </div>
  );
}

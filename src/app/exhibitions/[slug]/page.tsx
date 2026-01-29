import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

export default async function ExhibitionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExhibitionSlugModalClient slug={slug} />;
}

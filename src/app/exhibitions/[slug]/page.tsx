import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

type Props = {
  params: { slug: string };
};

export default async function ExhibitionPage({ params }: Props) {
  const { slug } = params;

  return (
    <div className="min-h-screen grid grid-cols-6 lg:grid-cols-4 w-full max-w-7xl ">
      <ExhibitionSlugModalClient slug={slug} />
    </div>
  );
}

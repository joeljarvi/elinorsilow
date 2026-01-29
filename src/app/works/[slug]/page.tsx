import WorkSlugModalClient from "../WorkSlugModalClient";

type Props = {
  params: { slug: string };
};

export default async function WorkPage({ params }: Props) {
  const { slug } = params;

  return (
    <div className="min-h-screen grid grid-cols-6 max-w-7xl ">
      <WorkSlugModalClient slug={slug} />
    </div>
  );
}

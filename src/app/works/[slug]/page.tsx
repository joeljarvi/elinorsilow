import WorkSlugModalClient from "../WorkSlugModalClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  return (
    <div className="min-h-screen grid grid-cols-6 lg:grid-cols-4 w-full max-w-7xl ">
      <WorkSlugModalClient slug={slug} />
    </div>
  );
}

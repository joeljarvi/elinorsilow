import WorkSlugModalClient from "@/app/works/WorkSlugModalClient";
import WorkModal from "../../../works/WorkModal";

export default async function WorkModalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="overflow-hidden">
      <WorkSlugModalClient slug={slug} />
    </div>
  );
}

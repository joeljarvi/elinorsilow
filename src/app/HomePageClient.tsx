"use client";

import MainContent from "../components/MainContent";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";

function HomePageContent({}) {
  const { activeWorkSlug, setActiveWorkSlug } = useWorks();
  const { activeExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-4 w-full gap-0 pt-0 lg:pt-4   ">
        <MainContent />

        {activeWorkSlug && (
          <WorkModal
            slug={activeWorkSlug}
            onClose={() => setActiveWorkSlug(null)}
          />
        )}
        {activeExhibitionSlug && (
          <ExhibitionModal
            slug={activeExhibitionSlug}
            onClose={() => setActiveExhibitionSlug(null)}
          />
        )}
      </div>
    </>
  );
}

export default function HomePageClient() {
  const { loading: exhibitionsLoading } = useExhibitions();
  const { loading: worksLoading } = useWorks();
  const loading = exhibitionsLoading || worksLoading;

  if (loading) return <div></div>;

  return <HomePageContent />;
}

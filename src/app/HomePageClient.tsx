"use client";

import { useEffect, useState, useMemo } from "react";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { useNav } from "@/context/NavContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import type {
  Work,
  Exhibition,
  Biography,
  Education,
  Grant,
  Exhibition_list,
} from "../../lib/wordpress";
import HDivider from "@/components/HDivider";
import Staggered from "@/components/Staggered";

type Props = {
  showInfo?: boolean;
  setShowInfo?: (v: boolean) => void;
  view?: "works" | "exhibitions" | "info";
  setView?: (v: "works" | "exhibitions" | "info") => void;
};

type BaseGridItem = {
  id: number;
  slug: string;
  title: string;
  image?: string;
};

type GridItem =
  | (BaseGridItem & {
      type: "work";
      meta: Work;
    })
  | (BaseGridItem & {
      type: "exhibition";
      meta: Exhibition;
    })
  | (BaseGridItem & {
      type: "biography";
      meta: Biography;
    })
  | (BaseGridItem & {
      type: "education";
      meta: Education;
    })
  | (BaseGridItem & {
      type: "grant";
      meta: Grant;
    })
  | (BaseGridItem & {
      type: "exhibition_list";
      meta: Exhibition_list;
    });

function MainContent({}: Props) {
  const ITEMS_PER_BATCH = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { view, setOpen, viewLoading } = useNav();
  const {
    filteredWorks,
    showInfo,
    setActiveWorkSlug,
    activeWorkSlug,
    workLoading,
  } = useWorks();
  const {
    filteredExhibitions,
    activeExhibitionSlug,
    setActiveExhibitionSlug,
    exLoading,
  } = useExhibitions();

  const { biography, educations, grants, exhibitionList, infoLoading } =
    useInfo();

  const router = useRouter();

  const items: GridItem[] = useMemo(() => {
    if (view === "works") {
      return filteredWorks.map((work) => ({
        type: "work",
        id: work.id,
        slug: work.slug,
        title: work.title.rendered,
        image: work.image_url,
        meta: work,
      }));
    }

    if (view === "exhibitions") {
      // reactively sort and filter via context
      return filteredExhibitions.map((ex) => ({
        type: "exhibition",
        id: ex.id,
        slug: ex.slug,
        title: ex.title.rendered,
        image: ex.acf.image_1?.url,
        meta: ex,
      }));
    }

    // INFO section remains the same
    if (view === "info") {
      const bioItem: GridItem[] = biography
        ? [
            {
              type: "biography",
              id: biography.id,
              slug: biography.slug,
              title: biography.title?.rendered ?? "Biography",
              meta: biography,
            },
          ]
        : [];

      const educationItems: GridItem[] = educations.map((edu) => ({
        type: "education",
        id: edu.id,
        slug: edu.slug,
        title: edu.title?.rendered ?? edu.acf.school,
        meta: edu,
      }));

      const grantItems: GridItem[] = grants.map((grant) => ({
        type: "grant",
        id: grant.id,
        slug: grant.slug,
        title: grant.acf.title,
        meta: grant,
      }));

      const exhibitionListItems: GridItem[] = exhibitionList.map((ex) => ({
        type: "exhibition_list",
        id: ex.id,
        slug: ex.slug,
        title: ex.title.rendered,
        meta: ex,
      }));

      return [
        ...bioItem,
        ...educationItems,
        ...grantItems,
        ...exhibitionListItems,
      ];
    }

    return [];
  }, [
    view,
    filteredWorks, // updates when work filters change
    filteredExhibitions, // updates when exhibition filters change
    biography,
    educations,
    grants,
    exhibitionList,
  ]);

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  useEffect(() => {
    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  const initialAppLoading = !initialLoaded;
  const showGlobalLoader = initialAppLoading || viewLoading;

  const loadingStaggered = workLoading || exLoading || infoLoading;

  if (showGlobalLoader) {
    return null;
  }

  return (
    <>
      <section
        className="max-w-7xl
      col-start-1 col-span-12
      lg:col-start-2 lg:col-span-9 flex flex-col items-center justify-center gap-y-4 p-2 lg:p-4   bg-background"
      >
        {view !== "info" && (
          <Staggered
            loading={loadingStaggered}
            items={items}
            getKey={(item) => item.id} // proper type
            className={` grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3
    gap-y-16 `}
            renderItem={(item: GridItem) => (
              <div
                className="h-full flex flex-col cursor-pointer"
                onClick={() => {
                  if (item.type === "work") {
                    setActiveWorkSlug(item.slug);
                    setOpen(false);
                    router.push(`/?work=${item.slug}`);
                  } else {
                    setActiveExhibitionSlug(item.slug);
                    setOpen(false);
                    router.push(`/?exhibition=${item.slug}`);
                  }
                }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={1200}
                    height={1600}
                    loading="eager"
                    className="w-1/2 h-auto object-contain object-left"
                  />
                )}

                {showInfo && (
                  <div className="p-2 text-xs font-EBGaramond flex flex-wrap max-w-xs items-baseline justify-start">
                    <span className="font-EBGaramondItalic mr-1">
                      {item.title}
                    </span>

                    {item.type === "work" && (
                      <>
                        {item.meta.acf.materials && (
                          <span className="mr-1">
                            {item.meta.acf.materials},
                          </span>
                        )}
                        {item.meta.acf.dimensions && (
                          <span className="mr-1">
                            {item.meta.acf.dimensions},
                          </span>
                        )}
                        {item.meta.acf.year && (
                          <span>{item.meta.acf.year}</span>
                        )}
                      </>
                    )}
                    {item.type === "exhibition" && (
                      <span>
                        {item.meta.acf.location}, {item.meta.acf.city}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          />
        )}

        {view === "info" && (
          <div className=" mt-0  w-full flex flex-col ">
            {/* BIOGRAPHY */}

            {exhibitionList.length > 0 && (
              <section className="flex flex-col items-start justify-start w-full">
                <h2 className=" font-gintoBlack text-base  leading-relaxed">
                  Exhibitions
                </h2>
                <HDivider />
                <Staggered
                  loading={loadingStaggered}
                  items={exhibitionList}
                  className="w-full columns-1   space-y-0  py-2  "
                  renderItem={(ex) => (
                    <>
                      <li
                        key={ex.id}
                        className="text-sm font-EBGaramond  flex flex-wrap items-baseline"
                      >
                        <span className="font-gintoMedium text-xs">
                          {ex.title.rendered}
                        </span>
                        , {ex.acf.venue}, {ex.acf.city} ({ex.acf.year})
                      </li>
                    </>
                  )}
                />
              </section>
            )}

            {/* EDUCATION */}
            {educations.length > 0 && (
              <section className="flex flex-col items-start justify-start w-full">
                <h2 className="font-gintoBlack text-base leading-relaxed ">
                  Education
                </h2>
                <HDivider />
                <Staggered
                  loading={loadingStaggered}
                  items={educations}
                  className="columns-1   space-y-0  w-full py-2 "
                  renderItem={(edu) => (
                    <>
                      <li key={edu.id} className="text-sm font-EBGaramond ">
                        <span className="font-gintoMedium text-xs">
                          {edu.acf.school}
                        </span>
                        , {edu.acf.city} ({edu.acf.start_year}–
                        {edu.acf.end_year})
                      </li>
                    </>
                  )}
                />
              </section>
            )}

            {/* GRANTS */}
            {grants.length > 0 && (
              <section className="flex flex-col items-start justify-start w-full">
                <h2 className="font-gintoBlack text-base  leading-relaxed">
                  Grants
                </h2>
                <HDivider />
                <Staggered
                  loading={loadingStaggered}
                  items={grants}
                  className="columns-1   space-y-0  w-full py-2"
                  renderItem={(grant) => (
                    <>
                      <li key={grant.id} className="text-sm font-EBGaramond ">
                        <span className="font-gintoMedium text-xs">
                          {grant.acf.title}
                        </span>{" "}
                        ({grant.acf.year})
                      </li>
                    </>
                  )}
                />
              </section>
            )}
          </div>
        )}
      </section>

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
    </>
  );
}

export default function HomePageClient() {
  return (
    <div className="w-full grid grid-cols-12 lg:grid-cols-4 ">
      <MainContent />
      <Footer />
    </div>
  );
}

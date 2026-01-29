"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Work,
  Exhibition,
  Biography,
  Education,
  Grant,
  Exhibition_list,
} from "../../lib/wordpress";
import { useNav } from "@/context/NavContext";
import { useEffect } from "react";
import Staggered from "@/components/Staggered";
import { useInfo } from "@/context/InfoContext";
import HDivider from "@/components/HDivider";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";

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

export default function MainContent({}: Props) {
  const { view, setOpen } = useNav();
  const { filteredWorks, showInfo, setActiveWorkSlug } = useWorks();
  const {
    filteredExhibitions,

    setActiveExhibitionSlug,
  } = useExhibitions();

  const { biography, educations, grants, exhibitionList } = useInfo();

  const ITEMS_PER_BATCH = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);

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

  const visibleItems = items.slice(0, visibleCount);

  useEffect(() => {
    if (view !== "info") {
      setVisibleCount(ITEMS_PER_BATCH);
    }
  }, [view]);

  return (
    <>
      <section
        className="max-w-7xl
      col-start-1 col-span-12
      lg:col-start-2 lg:col-span-9 flex flex-col items-start justify-start gap-y-4 px-2 pt-2 lg:px-4 lg:pt-4 pb-8   bg-background"
      >
        {view !== "info" && (
          <Staggered
            items={visibleItems}
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

        {view !== "info" && visibleCount < items.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_BATCH)}
            className="text-sm font-gintoBlack underline underline-offset-4 px-4"
          >
            {view === "works" ? "Load more works" : "Load more exhibitions"}
          </button>
        )}

        {view === "info" && (
          <div className="grid grid-cols-3 gap-x-4 gap-y-8 mt-0 p-6 lg:p-0 lg:mt-[25vh] w-full col-span-3 bg-blue-300">
            {/* BIOGRAPHY */}

            {biography && (
              <section className="col-span-3 pt-4 block   lg:hidden">
                <h2 className="font-gintoBlack text-base lg:text-sm mb-1">
                  Bio
                </h2>
                <HDivider />
                <div className="flex flex-col gap-y-2 mt-2">
                  <p className="whitespace-pre-line font-EBGaramond  max-w-xs">
                    (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                    explores raw emotion through painting, sculpture and
                    textile.{" "}
                  </p>
                </div>
              </section>
            )}

            {exhibitionList.length > 0 && (
              <section className="col-span-3">
                <h2 className=" font-gintoBlack text-base lg:text-sm mb-1">
                  Exhibitions
                </h2>
                <HDivider />
                <ul className="space-y-0 mt-2">
                  {exhibitionList.map((ex) => (
                    <li key={ex.id} className="text-sm font-EBGaramond">
                      <span className="font-gintoMedium text-xs">
                        {ex.title.rendered}
                      </span>
                      , {ex.acf.venue}, {ex.acf.city} ({ex.acf.year})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* EDUCATION */}
            {educations.length > 0 && (
              <section className="col-span-3">
                <h2 className="font-gintoBlack text-base lg:text-sm mb-1">
                  Education
                </h2>
                <HDivider />
                <ul className="space-y-0 mt-2">
                  {educations.map((edu) => (
                    <li key={edu.id} className="text-sm font-EBGaramond">
                      <span className="font-gintoMedium text-xs">
                        {edu.acf.school}
                      </span>
                      , {edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* GRANTS */}
            {grants.length > 0 && (
              <section className="col-span-3">
                <h2 className="font-gintoBlack text-base lg:text-sm mb-1">
                  Grants
                </h2>
                <HDivider />
                <ul className="space-y-0 mt-2">
                  {grants.map((grant) => (
                    <li key={grant.id} className="text-sm font-EBGaramond">
                      <span className="font-gintoMedium text-xs">
                        {grant.acf.title}
                      </span>{" "}
                      ({grant.acf.year})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* EXHIBITION LIST */}
          </div>
        )}
      </section>
    </>
  );
}

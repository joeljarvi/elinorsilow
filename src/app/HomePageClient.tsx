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
import VDivider from "@/components/VDivider";
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
import Link from "next/link";

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

  const soloExhibitions = exhibitionList.filter(
    (ex) => ex.acf.exhibition_type === "Solo Exhibition"
  );

  const groupExhibitions = exhibitionList.filter(
    (ex) => ex.acf.exhibition_type === "Group Exhibition"
  );

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

  const findExhibitionSlug = (title: string) => {
    const match = filteredExhibitions.find((ex) => ex.title.rendered === title);
    return match?.slug;
  };

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
      lg:col-start-2 lg:col-span-9 flex flex-col items-start justify-start w-full pb-2 lg:pb-0  "
      >
        {view !== "info" && (
          <Staggered
            loading={loadingStaggered}
            items={items}
            getKey={(item) => item.id} // proper type
            className={` p-2 lg:p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 
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
                  <div className="flex  p-2 text-sm  font-EBGaramond  flex-wrap max-w-sm items-baseline justify-start">
                    <span className="font-EBGaramondItalic mr-2">
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
                          <span className="">{item.meta.acf.year}</span>
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
          <div className="lg:border-l lg:border-foreground mt-0  w-full flex flex-col lg:grid lg:grid-cols-3    ">
            <div className=" w-full flex flex-col lg:col-start-1 lg:col-span-3 items-start justify-start  ">
              <h3 className="font-gintoBlack text-base leading-relaxed pl-2 pt-2 pr-0 lg:pr-4  lg:pl-4 lg:pt-2  ">
                About
              </h3>
              <HDivider className="" />
              <p className="font-EBGaramond mt-2 max-w-sm  pl-2 pr-0 pt-0 lg:pl-4  lg:pr-4 ">
                Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based
                artist who explores raw emotion through painting, sculpture and
                textile.
              </p>
              <div className="flex flex-col items-start justify-center mt-2 font-EBGaramond pl-2 lg:pl-4 pr-0 lg:pr-4">
                <p className=" ">
                  Gösta Ekmans väg 10 <br />
                  129 35 Hägersten
                </p>
                <Link
                  href="mailto:elinor.silow@gmail.com"
                  className=" mb-4 lg:mb-2  text-blue-600"
                >
                  elinor.silow@gmail.com
                </Link>
              </div>
            </div>
            <HDivider className="hidden lg:block lg:col-span-3" />

            {soloExhibitions.length > 0 && (
              <section className="flex flex-col lg:col-span-3 items-start justify-start w-full">
                <h2 className=" pl-2 pt-0 lg:pl-4 lg:pt-2 font-gintoBlack text-base leading-relaxed">
                  Solo Exhibitions
                </h2>
                <HDivider />

                <Staggered
                  loading={loadingStaggered}
                  items={soloExhibitions}
                  className="w-full columns-1 space-y-0 py-2 pl-2 lg:pl-4 pr-0 lg:pr-4"
                  renderItem={(ex) => {
                    const slug = findExhibitionSlug(ex.title.rendered);

                    return (
                      <div
                        key={ex.id}
                        className="text-base font-EBGaramond flex flex-wrap"
                      >
                        {slug ? (
                          <Link
                            href={`/?exhibition=${slug}`}
                            className="font-EBGaramondItalic hover:underline text-blue-600 mr-2"
                            onClick={() => {
                              setActiveExhibitionSlug(slug);
                              setOpen(false);
                            }}
                          >
                            {ex.title.rendered}
                          </Link>
                        ) : (
                          <span className="font-EBGaramondItalic mr-2">
                            {ex.title.rendered}
                          </span>
                        )}
                        {ex.acf.venue}, {ex.acf.city} ({ex.acf.year})
                      </div>
                    );
                  }}
                />
              </section>
            )}
            <HDivider className="hidden lg:block lg:col-span-3" />
            {groupExhibitions.length > 0 && (
              <section className="flex flex-col lg:col-span-2 items-start justify-start w-full ">
                <h2 className="font-gintoBlack text-base leading-relaxed pl-2 pt-0 lg:pl-4 lg:pt-2">
                  All Exhibitions
                </h2>
                <HDivider />

                <Staggered
                  loading={loadingStaggered}
                  items={groupExhibitions}
                  className="w-full columns-1 space-y-0 py-2 pr-2 lg:pr-4 pl-2  lg:pl-4"
                  renderItem={(ex) => {
                    const slug = findExhibitionSlug(ex.title.rendered);

                    return (
                      <div
                        key={ex.id}
                        className="text-base font-EBGaramond flex flex-wrap"
                      >
                        {slug ? (
                          <Link
                            href={`/?exhibition=${slug}`}
                            className="font-EBGaramondItalic hover:underline text-blue-600 mr-2"
                            onClick={() => {
                              setActiveExhibitionSlug(slug);
                              setOpen(false);
                            }}
                          >
                            {ex.title.rendered}
                          </Link>
                        ) : (
                          <span className="font-EBGaramondItalic mr-2">
                            {ex.title.rendered}
                          </span>
                        )}
                        {ex.acf.venue}, {ex.acf.city} ({ex.acf.year})
                      </div>
                    );
                  }}
                />
              </section>
            )}
            {/* GRANTS */}
            {grants.length > 0 && (
              <section className=" flex items-start justify-start ">
                <VDivider className="hidden lg:block" />
                <div className="flex flex-col items-start justify-start w-full ">
                  <h2 className="font-gintoBlack text-base  leading-relaxed pl-2  pt-0 lg:pl-4 lg:pt-2">
                    Grants
                  </h2>
                  <HDivider />
                  <Staggered
                    loading={loadingStaggered}
                    items={grants}
                    className="columns-1   space-y-0  w-full py-2 pr-2 pl-2 lg:pr-4 lg:pl-4"
                    renderItem={(grant) => (
                      <>
                        <div
                          key={grant.id}
                          className="text-base font-EBGaramond  "
                        >
                          <span className="font-EBGaramondItalic mr-1  ">
                            {grant.acf.title}
                          </span>{" "}
                          ({grant.acf.year})
                        </div>
                      </>
                    )}
                  />
                </div>
              </section>
            )}
            <HDivider className="hidden lg:block lg:col-span-3" />
            {/* EDUCATION */}
            {educations.length > 0 && (
              <section className="flex flex-col items-start justify-start lg:col-span-1 w-full ">
                <h2 className=" pl-2 pt-0 lg:pl-4 lg:pt-2 font-gintoBlack text-base leading-relaxed  ">
                  Education
                </h2>
                <HDivider />
                <Staggered
                  loading={loadingStaggered}
                  items={educations}
                  className=" pl-2 pr-0 lg:pl-4 lg:pr-4 columns-1   space-y-0  w-full py-2 "
                  renderItem={(edu) => (
                    <>
                      <div
                        key={edu.id}
                        className="text-base font-EBGaramond flex-wrap items-baseline justify-start "
                      >
                        <span className="font-EBGaramondItalic mr-2">
                          {edu.acf.school}
                        </span>
                        {edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year})
                      </div>
                    </>
                  )}
                />
              </section>
            )}
            <div className="   flex  items-start justify-start font-EBGaramond   lg:col-span-2  ">
              <VDivider className="hidden lg:block " />
              <div className="flex flex-col items-start justify-start  ">
                <h3 className="font-gintoBlack text-base leading-relaxed pl-2 pt-0 pr-0 lg:pr-4 lg:pl-4 lg:pt-2">
                  Press
                </h3>
                <HDivider className="" />
                <div className="columns-1   space-y-0  w-full pt-1.5  pr-0 pl-2 lg:pr-4 lg:pl-4 pb-1.5">
                  <div className="flex flex-wrap items-baseline justify-start font-EBGaramond text-base gap-x-1  ">
                    <Button
                      className="items-baseline  font-EBGaramondItalic text-base mr-1"
                      variant="link"
                      size="linkSize"
                    >
                      Hjärtat
                    </Button>
                    <p className="text-base ">Lappalainen Hjertström, L-E</p>
                    <p>(2022)</p>
                    <p className="font-EBGaramondItalic">Kunstkritikk</p>
                    <p className=" ">Availible at:</p>
                    <Link
                      className="text-blue-600"
                      href="https://kunstkritikk.se/hjartats-energi/"
                    >
                      https://kunstkritikk.se/hjartats-energi/
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-start font-EBGaramond gap-x-1 ">
                    <Button
                      className="  items-baseline  font-EBGaramondItalic text-base mr-1"
                      variant="link"
                      size="linkSize"
                    >
                      Gameplay
                    </Button>
                    <p className="text-base ">Slöör, S</p>
                    <p>(2025)</p>
                    <p className="font-EBGaramondItalic">Omkonst</p>
                    <p className=" ">Availible at:</p>
                    <Link
                      className="text-blue-600"
                      href="https://omkonst.se/25-gameplay.shtml"
                    >
                      https://omkonst.se/25-gameplay.shtml
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <HDivider className="hidden lg:block lg:col-span-3" />
            <div className=" w-full flex flex-col items-start justify-start lg:col-span-3  font-EBGaramond">
              <h3 className="font-gintoBlack text-base leading-relaxed pt-0 pl-2 pr-0 lg:pr-4 lg:pl-4 lg:pt-2">
                Colophon
              </h3>
              <HDivider className="" />

              <span className=" flex flex-wrap items-baseline justify-start gap-x-1 mt-2 pl-2 lg:pl-4 pr-0 lg:pr-4">
                Design & code:
                <Link className="font-EBGaramondItalic text-blue-600" href="/">
                  Joel Järvi
                </Link>
              </span>

              <div className="  flex flex-wrap items-baseline justify-start gap-x-1 mb-0 pl-2 pt-0 pr-0 lg:pr-4 lg:pl-4 ">
                Fonts: <span className="font-EBGaramondItalic">Ginto</span> by
                Dinamo Typefaces and
                <span className="font-EBGaramondItalic">EB Garamond</span>
                (12)
              </div>
            </div>
            <HDivider className=" lg:col-span-3 mt-2" />
            <div className="lg:col-start-1 lg:col-span-2 pl-2 pt-4 pr-0 lg:pr-4 lg:pl-4  lg:pt-4 pb-2 lg:pb-4    leading-snug ">
              <p className=" border-1 p-2 border-foreground font-gintoRegular text-xs max-w-xs lg:max-w-full ">
                All content on this site, including images, text, and design, is
                the intellectual property of{" "}
                <span className=" font-gintoBlack">Elinor Silow</span> unless
                otherwise stated. No part of this website may be copied,
                reproduced, distributed, or used without explicit written
                permission from the copyright holder. Unauthorized use,
                including downloading, publishing, or sharing, may constitute
                copyright infringement and is subject to legal action.
              </p>
            </div>
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

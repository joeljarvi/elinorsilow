"use client";

import { useEffect, useState, useMemo } from "react";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { useNav } from "@/context/NavContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import VDivider from "@/components/VDivider";
import { AnimatePresence, motion } from "framer-motion";
import Loader from "@/components/Loader";
import NewNav from "@/components/NewNav";

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
import { useLenis } from "lenis/react";

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
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const lenis = useLenis();

  const { view } = useNav();
  const { setOpen, showInfo } = useUI();
  const {
    filteredWorks,
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

  const { educations, grants, exhibitionList, infoLoading } = useInfo();

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

      return [...educationItems, ...grantItems, ...exhibitionListItems];
    }

    return [];
  }, [
    view,
    filteredWorks, // updates when work filters change
    filteredExhibitions, // updates when exhibition filters change

    educations,
    grants,
    exhibitionList,
  ]);

  const findExhibitionSlug = (title: string) => {
    const match = filteredExhibitions.find((ex) => ex.title.rendered === title);
    return match?.slug;
  };

  const getWorkSizeClass = (dimensions?: string) => {
    if (!dimensions) return "w-[calc(100vw-2rem)] lg:w-[calc(25vw-2rem)]";

    const nums = dimensions.match(/\d+/g);
    if (!nums || nums.length < 2)
      return "w-[calc(100vw-2rem)] lg:w-[calc(25vw-2rem)]";

    const [w] = nums.map(Number);
    const area = w;

    // tweak threshold to taste
    if (area > 120) return "w-[calc(100vw-2rem)] lg:w-[calc(25vw-2rem)]";
    if (area > 30 && area < 120)
      return "w-[calc(66.6vw-2rem)] lg:w-[calc(12.5vw-2rem)]";
    return "w-[calc(33.3vw-2rem)] lg:w-[calc(8.3vw-2rem)]";
  };

  // Start loader animation immediately
  useEffect(() => {
    // Immediately mark animation done if data is ready
    if (!workLoading && !exLoading && !infoLoading) {
      setInitialAnimDone(true);
      setDataLoaded(true);
    }

    // Optional: fallback in case something hangs
    const fallback = setTimeout(() => {
      setInitialAnimDone(true);
      setDataLoaded(true);
    }, 1000); // 1s max wait for slow connections

    return () => clearTimeout(fallback);
  }, [workLoading, exLoading, infoLoading]);

  const showLoader = !(initialAnimDone && dataLoaded);
  const showGlobalLoader = workLoading || exLoading || infoLoading;

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader && (
          <Loader
            key={view}
            text={
              view === "works"
                ? "Works"
                : view === "exhibitions"
                ? "Exhibitions"
                : "Info"
            }
          />
        )}
      </AnimatePresence>

      <motion.section
        key={view}
        initial={{ opacity: 0 }}
        animate={{ opacity: showGlobalLoader ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-0
      flex flex-col items-start justify-start w-full pt-24   "
      >
        {view !== "info" && (
          <Staggered
            loading={showGlobalLoader}
            items={items}
            getKey={(item) => item.id} // proper type
            className={`  w-full px-2 pb-2 pt-24 lg:p-4 flex flex-col  items-center justify-center lg:grid lg:grid-cols-2 gap-x-4 lg:justify-start lg:items-start  
    gap-y-16 `}
            renderItem={(item: GridItem, index: number) => (
              <div
                className="  flex flex-col  cursor-pointer pointer-events-auto gap-y-1 "
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
                {" "}
                {showInfo && (
                  <div className="flex   text-xs  text-center lg:text-left  font-gintoRegular flex-wrap items-center   lg:items-baseline justify-center lg:justify-start leading-loose  tracking-wide  px-1 text-foreground/30 ">
                    <span className="font-gintoRegularItalic  text-center lg:text-left  ">
                      {item.title}
                    </span>
                    ,
                    {item.type === "work" && (
                      <>
                        {item.meta.acf.year && (
                          <span className="ml-1">{item.meta.acf.year}, </span>
                        )}
                        {item.meta.acf.materials && (
                          <span className="ml-1 ">
                            {item.meta.acf.materials},
                          </span>
                        )}
                        {item.meta.acf.dimensions && (
                          <span className="ml-1 ">
                            {item.meta.acf.dimensions}
                          </span>
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
                <div
                  className={`
    relative  h-[66.6vh] lg:h-[50vh] mx-auto lg:mx-0
    ${
      item.type === "work"
        ? getWorkSizeClass(item.meta.acf.dimensions)
        : "w-[calc(100vw-2rem)] lg:w-[calc(16.6vw-2rem)]"
    }
    flex flex-col items-start justify-start
  `}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority={index < 6}
                      loading={index < 6 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className=" h-auto object-contain object-top lg:object-top-left cursor-pointer "
                    />
                  )}
                </div>
              </div>
            )}
          />
        )}
        {view === "info" && (
          <div className="w-full flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-12 items-start justify-start px-4">
            {/* LEFT COLUMN */}
            <div className="flex flex-col items-start justify-start w-full">
              {/* About Section */}
              <div className="w-full flex flex-col items-start justify-start mb-12">
                <h2 className="h3 font-gintoBlack mb-2">About</h2>
                <p className="p max-w-xs text-left mb-4">
                  Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based
                  artist who explores raw emotion through painting, sculpture and
                  textile.
                </p>
                <div className="p text-left">
                  <p>
                    Gösta Ekmans väg 10 <br />
                    129 35 Hägersten
                  </p>
                  <Link
                    href="mailto:elinor.silow@gmail.com"
                    className="text-blue-600"
                  >
                    elinor.silow@gmail.com
                  </Link>
                </div>
              </div>

              {/* Solo Exhibitions */}
              {soloExhibitions.length > 0 && (
                <section className="flex flex-col items-start justify-start w-full mb-12">
                  <h3 className="h3 mb-4">Solo Exhibitions</h3>
                  <Staggered
                    loading={showGlobalLoader}
                    items={soloExhibitions}
                    className="w-full flex flex-col items-stretch justify-start space-y-1"
                    renderItem={(ex) => {
                      const slug = findExhibitionSlug(ex.title.rendered);
                      return (
                        <div
                          key={ex.id}
                          className="text-xs font-gintoRegular leading-loose flex flex-wrap items-center justify-start"
                        >
                          {slug ? (
                            <Button
                              onClick={() => {
                                setActiveExhibitionSlug(slug);
                                setOpen(false);
                              }}
                              className="font-gintoRegularItalic text-blue-600 text-xs tracking-wide mr-1"
                              variant="link"
                              size="listSize"
                            >
                              {ex.title.rendered},
                            </Button>
                          ) : (
                            <span className="font-gintoRegular text-xs tracking-wide mr-1">
                              {ex.title.rendered},
                            </span>
                          )}
                          {ex.acf.year}, {ex.acf.venue}, {ex.acf.city}
                        </div>
                      );
                    }}
                  />
                </section>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col items-start justify-start w-full">
              {/* Group Exhibitions */}
              {groupExhibitions.length > 0 && (
                <section className="flex flex-col items-start justify-start w-full mb-12">
                  <h3 className="h3 mb-4">All exhibitions</h3>
                  <Staggered
                    loading={showGlobalLoader}
                    items={groupExhibitions}
                    className="w-full flex flex-col items-stretch justify-start space-y-1"
                    renderItem={(ex) => {
                      const slug = findExhibitionSlug(ex.title.rendered);
                      return (
                        <div
                          key={ex.id}
                          className="flex flex-wrap justify-start items-center text-xs leading-loose font-gintoRegular"
                        >
                          {slug ? (
                            <Button
                              variant="link"
                              size="listSize"
                              className="font-gintoRegularItalic text-blue-600 mr-2 text-xs tracking-wide leading-loose"
                              onClick={() => {
                                setActiveExhibitionSlug(slug);
                                setOpen(false);
                              }}
                            >
                              {ex.title.rendered}
                            </Button>
                          ) : (
                            <span className="mr-2 text-xs tracking-wide leading-loose">
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

              {/* Achievements (Grants & Education) */}
              <div className="w-full space-y-12">
                {/* GRANTS */}
                {grants.length > 0 && (
                  <section className="flex flex-col items-start justify-start w-full">
                    <h3 className="h3 font-gintoBlack mb-4">Grants</h3>
                    <Staggered
                      loading={showGlobalLoader}
                      items={grants}
                      className="flex flex-col items-stretch justify-start w-full space-y-1"
                      renderItem={(grant) => (
                        <div
                          key={grant.id}
                          className="text-xs font-gintoRegular flex flex-wrap items-center justify-start"
                        >
                          <span className="font-EBGaramondItalic mr-1">
                            {grant.acf.title}
                          </span>{" "}
                          ({grant.acf.year})
                        </div>
                      )}
                    />
                  </section>
                )}

                {/* EDUCATION */}
                {educations.length > 0 && (
                  <section className="flex flex-col items-start justify-start w-full">
                    <h3 className="h3 font-gintoBlack mb-4">Education</h3>
                    <Staggered
                      loading={showGlobalLoader}
                      items={educations}
                      className="flex flex-col items-stretch justify-start w-full space-y-1"
                      renderItem={(edu) => (
                        <div
                          key={edu.id}
                          className="text-xs font-gintoRegular flex flex-wrap items-center justify-start"
                        >
                          <span className="font-EBGaramondItalic mr-2">
                            {edu.acf.school}
                          </span>
                          {edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year}
                          )
                        </div>
                      )}
                    />
                  </section>
                )}
              </div>

              {/* Press */}
              <div className="w-full mt-12">
                <h3 className="h3 font-gintoBlack mb-4">Press</h3>
                <div className="flex flex-col items-stretch justify-start w-full space-y-4">
                  <div className="flex flex-wrap items-center justify-start text-xs gap-x-1">
                    <span className="font-EBGaramondItalic mr-1">Hjärtat</span>
                    <p>Lappalainen Hjertström, L-E (2022)</p>
                    <p className="font-EBGaramondItalic">Kunstkritikk</p>
                    <Link
                      className="text-blue-600 ml-1"
                      href="https://kunstkritikk.se/hjartats-energi/"
                    >
                      Link
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center justify-start text-xs gap-x-1">
                    <span className="font-EBGaramondItalic mr-1">Gameplay</span>
                    <p>Slöör, S (2025)</p>
                    <p className="font-EBGaramondItalic">Omkonst</p>
                    <Link
                      className="text-blue-600 ml-1"
                      href="https://omkonst.se/25-gameplay.shtml"
                    >
                      Link
                    </Link>
                  </div>
                </div>
              </div>

              {/* Colophon */}
              <div className="w-full mt-12 pt-8 border-t border-foreground/10">
                <h3 className="h3 font-gintoBlack mb-4">Colophon</h3>
                <div className="text-xs space-y-2">
                  <p>
                    Design & code:{" "}
                    <Link
                      className="font-EBGaramondItalic text-blue-600"
                      href="/"
                    >
                      Joel Järvi
                    </Link>
                  </p>
                  <p>
                    Fonts: <span className="font-EBGaramondItalic">Ginto</span>{" "}
                    by Dinamo Typefaces and{" "}
                    <span className="font-EBGaramondItalic">EB Garamond</span>{" "}
                    (12)
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright Full Width Footer inside Info */}
            <div className="col-span-full mt-12 pt-8 border-t border-foreground/10">
              <p className="font-gintoRegular text-[10px] opacity-40 max-w-2xl text-center lg:text-left">
                All content on this site, including images, text, and design, is
                the intellectual property of{" "}
                <span className="font-gintoBlack">Elinor Silow</span> unless
                otherwise stated. No part of this website may be copied,
                reproduced, distributed, or used without explicit written
                permission from the copyright holder.
              </p>
            </div>
          </div>
        )}
        <div className="w-full flex justify-center py-8">
          <Button
            variant="link"
            size="sm"
            className="p text-foreground hover:text-foreground/70"
            onClick={() => lenis?.scrollTo(0)}
          >
            Back to Top
          </Button>
        </div>
      </motion.section>

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
    <div className="min-h-full w-full   ">
      <MainContent />
      <Footer />
    </div>
  );
}

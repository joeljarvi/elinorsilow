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
import { AnimatePresence, motion } from "framer-motion";
import Loader from "@/components/Loader";

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

  const { view, setOpen } = useNav();
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
        className="max-w-7xl mx-auto
      col-start-1 col-span-12
      lg:col-start-2 lg:col-span-9 flex flex-col items-start justify-start w-full pb-2 lg:pb-0   "
      >
        {view !== "info" && (
          <Staggered
            loading={showGlobalLoader}
            items={items}
            getKey={(item) => item.id} // proper type
            className={` w-full p-2 lg:p-4 flex flex-col  items-center justify-center lg:grid lg:grid-cols-3 gap-x-4 lg:justify-start lg:items-start  
    gap-y-16 `}
            renderItem={(item: GridItem, index: number) => (
              <div
                className="  flex flex-col  cursor-pointer pointer-events-auto "
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
                  <div className="flex  p-2 text-sm text-center lg:text-left  font-EBGaramond flex-wrap items-center   lg:items-baseline justify-center lg:justify-start ">
                    <span className="font-EBGaramondItalic mr-2 text-center lg:text-left ">
                      {item.title}
                    </span>

                    {item.type === "work" && (
                      <>
                        <div className="flex flex-wrap items-baseline justify-center">
                          {item.meta.acf.materials && (
                            <span className="mr-1">
                              {item.meta.acf.materials},
                            </span>
                          )}
                          {item.meta.acf.dimensions && (
                            <span className="mr-1 ">
                              {item.meta.acf.dimensions}
                            </span>
                          )}

                          {item.meta.acf.year && (
                            <span className="">({item.meta.acf.year})</span>
                          )}
                        </div>
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
          <div className="lg:border-l lg:border-foreground mt-0  w-full flex flex-col lg:grid lg:grid-cols-3    ">
            <div className=" w-full flex flex-col lg:col-start-1 lg:col-span-3 items-start justify-start  ">
              <h3 className="h3 pl-2 pt-2 pr-0 lg:pr-4  lg:pl-4 lg:pt-2  ">
                About
              </h3>
              <HDivider className="" />
              <p className="p mt-2 max-w-sm  pl-2 pr-0 pt-0 lg:pl-4  lg:pr-4 ">
                Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based
                artist who explores raw emotion through painting, sculpture and
                textile.
              </p>
              <div className="flex flex-col items-start justify-center mt-2 p pl-2 lg:pl-4 pr-0 lg:pr-4">
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
                <h2 className=" pl-2 pt-0 lg:pl-4 lg:pt-2 h2">
                  Solo Exhibitions
                </h2>
                <HDivider />

                <Staggered
                  loading={showGlobalLoader}
                  items={soloExhibitions}
                  className="w-full columns-1 space-y-0 py-0 pl-0 pr-0"
                  renderItem={(ex) => {
                    const slug = findExhibitionSlug(ex.title.rendered);

                    return (
                      <>
                        <div
                          key={ex.id}
                          className="p flex flex-wrap pl-2 lg:pl-4 pr-0 lg:pr-4 py-1"
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
                        <HDivider
                          color={slug ? "border-blue-600" : "border-foreground"}
                        />
                      </>
                    );
                  }}
                />
              </section>
            )}
            <HDivider className="hidden lg:block lg:col-span-3" />
            {groupExhibitions.length > 0 && (
              <section className="flex flex-col lg:col-span-2 items-start justify-start w-full ">
                <h2 className="h2 pl-2 pt-0 lg:pl-4 lg:pt-2">
                  All Exhibitions
                </h2>
                <HDivider />

                <Staggered
                  loading={showGlobalLoader}
                  items={groupExhibitions}
                  className="w-full columns-1 space-y-0 py-0 pr-0 pl-0"
                  renderItem={(ex) => {
                    const slug = findExhibitionSlug(ex.title.rendered);

                    return (
                      <>
                        <div
                          key={ex.id}
                          className="p flex flex-wrap pl-2 lg:pl-4 pr-2 lg:pr-4 py-1"
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
                        <HDivider
                          color={slug ? "border-blue-600" : "border-foreground"}
                        />
                      </>
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
                  <h2 className="h2 pl-2  pt-0 lg:pl-4 lg:pt-2">Grants</h2>
                  <HDivider />
                  <Staggered
                    loading={showGlobalLoader}
                    items={grants}
                    className="columns-1   space-y-0  w-full py-0 pr-0 pl-0"
                    renderItem={(grant) => (
                      <>
                        <div
                          key={grant.id}
                          className="p pl-2 lg:pl-4 pr-2 lg:pr-4 py-1"
                        >
                          <span className="font-EBGaramondItalic mr-1  ">
                            {grant.acf.title}
                          </span>{" "}
                          ({grant.acf.year})
                        </div>
                        <HDivider />
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
                <h2 className=" pl-2 pt-0 lg:pl-4 lg:pt-2 h2  ">Education</h2>
                <HDivider />
                <Staggered
                  loading={showGlobalLoader}
                  items={educations}
                  className=" pl-0 pr-0 columns-1   space-y-0  w-full py-0 "
                  renderItem={(edu) => (
                    <>
                      <div
                        key={edu.id}
                        className="p flex-wrap items-baseline justify-start pl-2 lg:pl-4 pr-2 lg:pr-4 py-1"
                      >
                        <span className="font-EBGaramondItalic mr-2">
                          {edu.acf.school}
                        </span>
                        {edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year})
                      </div>
                      <HDivider />
                    </>
                  )}
                />
              </section>
            )}
            <div className="   flex  items-start justify-start p   lg:col-span-2  ">
              <VDivider className="hidden lg:block " />
              <div className="flex flex-col items-start justify-start w-full ">
                <h3 className="h3 pl-2 pt-0 pr-0 lg:pr-4 lg:pl-4 lg:pt-2">
                  Press
                </h3>
                <HDivider className="" />
                <div className="columns-1   space-y-0  w-full pt-0  pr-0 pl-0 pb-0">
                  <div className="flex flex-wrap items-baseline justify-start p gap-x-1 pl-2 lg:pl-4 pr-2 lg:pr-4 py-1 ">
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
                  <HDivider color="border-blue-600" />
                  <div className="flex flex-wrap items-baseline justify-start p gap-x-1 pl-2 lg:pl-4 pr-2 lg:pr-4 py-1">
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
                  <HDivider color="border-blue-600" />
                </div>
              </div>
            </div>

            <HDivider className="hidden lg:block lg:col-span-3" />
            <div className=" w-full flex flex-col items-start justify-start lg:col-span-3  p">
              <h3 className="h3 pt-0 pl-2 pr-0 lg:pr-4 lg:pl-4 lg:pt-2">
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
    <div className="min-h-full w-full grid grid-cols-12 lg:grid-cols-4   ">
      <MainContent />
      <Footer />
    </div>
  );
}

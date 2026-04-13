"use client";

import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef, useCallback } from "react";
import BlurredWorkBg from "@/components/BlurredWorkBg";
import { usePathname } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion } from "framer-motion";
import WorkModal from "@/app/works/WorkModal";
import InfoBox from "@/components/InfoBox";
import { OGubbeText } from "@/components/OGubbeText";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import PageLoader from "@/components/PageLoader";
import WigglyButton from "@/components/WigglyButton";
import NavSearch from "@/components/NavSearch";

function WorkCard({
  work,
  onOpen,
  revealIndex = 0,
  objectPosition = "center",
  showTitles = false,
  imageClassName = "max-h-dvh",
}: {
  work: Work;
  onOpen: () => void;
  revealIndex?: number;
  objectPosition?: string;
  showTitles?: boolean;
  imageClassName?: string;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const transition = { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const };

  return (
    <div className="w-full">
      <div className="w-full relative overflow-hidden min-h-[280px] lg:min-h-[200px]">
        {/* InfoBox: slides up from the bottom */}
        <motion.div
          className="absolute inset-0 z-20 cursor-pointer bg-transparent"
          animate={{ y: infoOpen ? "0%" : "100%" }}
          transition={transition}
          initial={false}
          onClick={() => onOpen()}
        >
          <InfoBox work={work} />
        </motion.div>

        {/* Image: scaleY collapses toward the top as InfoBox rises */}
        <motion.button
          className="relative z-10 flex justify-center w-full"
          animate={{ scaleY: infoOpen ? 0.05 : 1 }}
          style={{ transformOrigin: "top center" }}
          transition={transition}
          onClick={() => setInfoOpen((v) => !v)}
          aria-label={`Show info: ${work.title.rendered}`}
        >
          {work.image_url && (
            <ProportionalWorkImage
              src={work.image_url}
              alt={work.title.rendered}
              revealIndex={revealIndex}
              noScaleY
              dimensions={work.acf.dimensions}
              objectPosition={objectPosition}
              className={imageClassName}
            />
          )}
        </motion.button>
      </div>

      {showTitles && (
        <div className="flex justify-center pt-[9px]">
          <OGubbeText
            text={work.title.rendered}
            lettersOnly
            wrap
            className="text-[15px] lg:text-[18px]"
            sizes="18px"
          />
        </div>
      )}
    </div>
  );
}

function WorkTitleListItems({
  works,
  isActive,
  onOpen,
  listItemRefs,
  showSearch = true,
}: {
  works: Work[];
  isActive: (i: number) => boolean;
  onOpen: (work: Work) => void;
  listItemRefs?: React.RefObject<(HTMLSpanElement | null)[]>;
  showSearch?: boolean;
}) {
  return (
    <>
      <div className="sticky top-0 left-0 right-0 h-[48px] w-full shrink-0 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      {showSearch && (
        <NavSearch open={true} onClose={() => {}} inline filterType="work" />
      )}
      {works.map((work, i) => (
        <span
          key={work.id}
          ref={
            listItemRefs
              ? (el) => {
                  listItemRefs.current[i] = el;
                }
              : undefined
          }
        >
          <WigglyButton
            text={work.title.rendered}
            size="text-[18px]"
            revealAnimation={false}
            onClick={() => onOpen(work)}
            className={`transition-colors duration-300 ${
              isActive(i) ? "text-foreground" : "text-muted-foreground"
            }`}
          />
        </span>
      ))}
      <div className="sticky bottom-0 left-0 right-0 h-[48px] w-full shrink-0 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-[48px] z-10" />
    </>
  );
}

export default function WorksPageClient() {
  const pathname = usePathname();
  const { filteredWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();
  const {
    showAsList,
    setShowAsList,
    gridCols,
    setGridCols,
    showTitles,
    showColorBg,
  } = useUI();

  const works = filteredWorks;

  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [mobileHeaderIndex, setMobileHeaderIndex] = useState(0);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observersRef = useRef<IntersectionObserver[]>([]);
  const headerObserversRef = useRef<IntersectionObserver[]>([]);

  const setMobileCardRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      mobileCardRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    headerObserversRef.current.forEach((o) => o.disconnect());
    headerObserversRef.current = [];
    mobileCardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setMobileHeaderIndex(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      obs.observe(el);
      headerObserversRef.current.push(obs);
    });
    return () => headerObserversRef.current.forEach((o) => o.disconnect());
  }, [works]);

  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0);
  const desktopRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopObserversRef = useRef<IntersectionObserver[]>([]);
  const desktopListItemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const firstInRow = desktopActiveIndex * gridCols;
    desktopListItemRefs.current[firstInRow]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [desktopActiveIndex, gridCols]);

  const setDesktopRowRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      desktopRowRefs.current[i] = el;
    },
    [],
  );

  useEffect(() => {
    desktopObserversRef.current.forEach((o) => o.disconnect());
    desktopObserversRef.current = [];
    desktopRowRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setDesktopActiveIndex(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      obs.observe(el);
      desktopObserversRef.current.push(obs);
    });
    return () => desktopObserversRef.current.forEach((o) => o.disconnect());
  }, [works]);

  useEffect(() => {
    if (!showColorBg) return;
    observersRef.current.forEach((o) => o.disconnect());
    observersRef.current = [];
    mobileCardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveMobileIndex(i);
        },
        { threshold: 0.6 },
      );
      obs.observe(el);
      observersRef.current.push(obs);
    });
    return () => {
      observersRef.current.forEach((o) => o.disconnect());
    };
  }, [showColorBg, works]);

  useEffect(() => {
    if (!workLoading) setDataLoaded(true);
  }, [workLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => setInitialAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  const loading = !initialAnimDone || !dataLoaded;

  function openWork(work: Work) {
    setActiveWorkSlug(work.slug);
    window.history.pushState(null, "", `/works?work=${work.slug}`);
  }

  const isHomePage = pathname === "/";
  const loaderText = "elinor silow / works";

  return (
    <section className="relative w-full">
      {!isHomePage && <PageLoader text={loaderText} loading={loading} />}

      {/* Desktop header — top left */}
      {!isHomePage && (
        <div className="hidden lg:flex fixed top-0 left-0 z-[60] pt-[18px] px-[18px] items-center pointer-events-none">
          <WigglyButton
            text="works"
            size="text-[18px]"
            revealAnimation={false}
            onClick={() => {}}
            className="pointer-events-none"
          />
          <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-bold text-[18px] select-none mx-[4px]">
            /
          </span>
          <WigglyButton
            text={showAsList ? "hide list" : "show list"}
            size="text-[18px]"
            revealAnimation={false}
            onClick={() => setShowAsList(!showAsList)}
            className="pointer-events-auto"
          />
        </div>
      )}

      {/* Mobile header — top center */}
      {!isHomePage && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] flex justify-center items-center pointer-events-none pt-[9px]">
          <div className="flex items-center pointer-events-auto">
            <WigglyButton
              text="works"
              size="text-[18px]"
              revealAnimation={false}
              onClick={() => {}}
            />
            <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-bold text-[18px] select-none">
              /
            </span>
            {works[mobileHeaderIndex] && (
              <button
                className="no-hide-text cursor-pointer px-[12px] py-[0px]"
                onClick={() => openWork(works[mobileHeaderIndex])}
              >
                <OGubbeText
                  text={works[mobileHeaderIndex].title.rendered}
                  lettersOnly
                  vertical={false}
                  className="text-[18px] font-timesNewRoman font-bold"
                  sizes="18px"
                  revealAnimation={false}
                  wrap
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Works grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <>
          {/* Desktop — row-based snap scroll, snaps to top-left card of each row */}
          <div className="hidden lg:block relative h-dvh">
            {/* Title list */}
            {showAsList && (
              <div className="absolute inset-y-0 left-0 z-[40] flex flex-col justify-start items-start px-[18px] gap-y-[9px] overflow-y-auto pointer-events-auto">
                <WorkTitleListItems
                  works={works}
                  isActive={(i) =>
                    Math.floor(i / gridCols) === desktopActiveIndex
                  }
                  onOpen={openWork}
                  listItemRefs={desktopListItemRefs}
                />
              </div>
            )}
            <div className="h-dvh overflow-y-scroll snap-y snap-mandatory px-[32px] w-full">
              {Array.from(
                { length: Math.ceil(works.length / gridCols) },
                (_, rowIndex) => {
                  const rowWorks = works.slice(
                    rowIndex * gridCols,
                    (rowIndex + 1) * gridCols,
                  );
                  return (
                    <div
                      ref={(el) => setDesktopRowRef(el, rowIndex)}
                      key={rowIndex}
                      className="snap-start h-dvh flex items-center gap-x-[18px] px-[18px] py-[32px]"
                    >
                      {rowWorks.map((work, i) => (
                        <div
                          key={work.id}
                          className="flex justify-center items-center"
                          style={{ flex: `1 1 ${100 / gridCols}%` }}
                        >
                          <WorkCard
                            work={work}
                            objectPosition="center"
                            imageClassName={
                              gridCols === 1
                                ? "max-h-[calc(100dvh-64px)]"
                                : "max-h-dvh"
                            }
                            revealIndex={rowIndex * gridCols + i}
                            onOpen={() => openWork(work)}
                            showTitles={showTitles}
                          />
                        </div>
                      ))}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* Mobile — snap scroll, each card fills viewport */}
          <div className="lg:hidden relative z-[10] h-dvh overflow-y-scroll snap-y snap-mandatory">
            {/* Blurred color background */}
            {showColorBg && (
              <div className="fixed inset-0 z-0 lg:hidden pointer-events-none">
                {works.map((work, i) =>
                  work.image_url ? (
                    <div
                      key={work.id}
                      className={`absolute inset-0 transition-opacity duration-700 ${i === activeMobileIndex ? "opacity-100" : "opacity-0"}`}
                    >
                      <BlurredWorkBg imageUrl={work.image_url} />
                    </div>
                  ) : null,
                )}
              </div>
            )}
            {works.map((work, i) => (
              <div
                key={work.id}
                ref={(el) => setMobileCardRef(el, i)}
                className="h-dvh snap-start flex items-center justify-center px-[18px]"
              >
                <WorkCard
                  work={work}
                  revealIndex={i}
                  objectPosition="center"
                  onOpen={() => openWork(work)}
                  showTitles={showTitles}
                />
              </div>
            ))}
          </div>

          {/* Mobile — fixed centered title list (behind works) */}
          {showAsList && (
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[5] h-dvh overflow-y-auto flex flex-col items-center gap-y-[9px] pt-[0px] pb-[0px] pointer-events-auto">
              <WorkTitleListItems
                works={works}
                isActive={(i) => i === mobileHeaderIndex}
                onOpen={openWork}
                showSearch={false}
              />
            </div>
          )}
        </>
      </motion.div>

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => {
            setActiveWorkSlug(null);
          }}
        />
      )}
    </section>
  );
}

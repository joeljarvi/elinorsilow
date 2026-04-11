"use client";

import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef, useCallback } from "react";
import BlurredWorkBg from "@/components/BlurredWorkBg";
import { usePathname } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WorkModal from "@/app/works/WorkModal";
import InfoBox from "@/components/InfoBox";
import { OGubbeText } from "@/components/OGubbeText";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import PageLoader from "@/components/PageLoader";
import RowSlide from "@/components/RowSlide";

import WigglyButton from "@/components/WigglyButton";

function WorkCard({
  work,
  onOpen,
  revealIndex = 0,
  objectPosition = "center",
  showTitles = false,
  imageClassName = "max-h-[100vh]",
}: {
  work: Work;
  onOpen: () => void;
  revealIndex?: number;
  objectPosition?: string;
  showTitles?: boolean;
  imageClassName?: string;
}) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { showColorBg } = useUI();
  const transition = { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const };

  return (
    <div className="w-full">
      <div className="w-full relative overflow-hidden min-h-[280px] lg:min-h-[200px]">
        {/* InfoBox: slides in from the right, leaving the 5% image sliver visible */}
        <motion.div
          className={`absolute top-0 bottom-0 right-0 z-20 cursor-pointer ${showColorBg ? "bg-transparent" : "bg-background"}`}
          style={{ width: "95%" }}
          animate={{ x: infoOpen ? "0%" : "100%" }}
          transition={transition}
          initial={false}
          onClick={() => onOpen()}
        >
          <InfoBox work={work} />
        </motion.div>

        {/* Image: scaleX collapses toward the left, InfoBox slides in from right */}
        <motion.button
          className="relative z-10 flex justify-center w-full"
          animate={{ scaleX: infoOpen ? 0.05 : 1 }}
          style={{ transformOrigin: "left center" }}
          transition={transition}
          onClick={() => setInfoOpen((v) => !v)}
          aria-label={`Show info: ${work.title.rendered}`}
        >
          {work.image_url && (
            <ProportionalWorkImage
              src={work.image_url}
              alt={work.title.rendered}
              revealIndex={revealIndex}
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

export default function WorksPageClient() {
  const pathname = usePathname();
  const { filteredWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();
  const { showAsList, gridCols, setGridCols, showTitles, showColorBg } =
    useUI();

  const works = filteredWorks;

  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observersRef = useRef<IntersectionObserver[]>([]);

  const setMobileCardRef = useCallback(
    (el: HTMLDivElement | null, i: number) => {
      mobileCardRefs.current[i] = el;
    },
    [],
  );

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

      {/* Hero section */}

      {/* Works grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {showAsList ? (
          <div className="flex flex-col ">
            {works.map((work) => (
              <RowSlide key={work.id}>
                <Button
                  variant="ghost"
                  size="controls"
                  onClick={() => openWork(work)}
                  className="w-full rounded-none justify-center font-universNextProExt font-extrabold text-[14px] lg:text-[18px]"
                >
                  {work.title.rendered}
                </Button>
              </RowSlide>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop — row-based snap scroll, snaps to top-left card of each row */}
            <WigglyButton
              text="–"
              className="hidden fixed left-[9px] top-1/2 -translate-y-1/2 z-40 uppercase text-[24px] lg:text-[32px]  opacity-10 font-bold text-muted-foreground"
              onClick={() => setGridCols(Math.max(1, gridCols - 1))}
            />

            <WigglyButton
              text="+"
              className="hidden  fixed right-[9px] top-1/2 -translate-y-1/2 z-40  uppercase text-[24px] lg:text-[32px]  opacity-10 font-bold text-muted-foreground"
              onClick={() => setGridCols(Math.min(8, gridCols + 1))}
            />

            <div className="hidden lg:block h-dvh overflow-y-scroll snap-y snap-mandatory px-[32px] w-full">
              {Array.from(
                { length: Math.ceil(works.length / gridCols) },
                (_, rowIndex) => {
                  const rowWorks = works.slice(
                    rowIndex * gridCols,
                    (rowIndex + 1) * gridCols,
                  );
                  return (
                    <div
                      key={rowIndex}
                      className="snap-start h-dvh flex items-center gap-x-[18px] px-[18px]"
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
                            imageClassName="max-h-dvh"
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

            {/* Mobile — snap scroll, each card fills viewport */}
            <div className="lg:hidden relative h-dvh overflow-y-scroll snap-y snap-mandatory">
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
                    objectPosition="top"
                    onOpen={() => openWork(work)}
                    showTitles={showTitles}
                  />
                </div>
              ))}
            </div>
          </>
        )}
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

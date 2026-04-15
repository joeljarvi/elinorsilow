"use client";

import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import BlurredWorkBg from "@/components/BlurredWorkBg";
import { Work } from "../../lib/sanity";
import { motion } from "framer-motion";
import WorkModal from "@/components/WorkModal";
import InfoBox from "@/components/InfoBox";
import { OGubbeText } from "@/components/OGubbeText";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import PageLoader from "@/components/PageLoader";
import WigglyButton from "@/components/WigglyButton";
import FixedCookieAccept from "@/components/FixedCookieAccept";
import CopyrightFooter from "@/components/CopyrightFooter";
import DynamicGrid from "@/components/DynamicGrid";

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
  const { setHoveredItemTitle } = useUI();
  const transition = { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const };

  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      onMouseEnter={() => setHoveredItemTitle(work.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      {/* Image */}
      <button
        className={`flex justify-center w-full lg:min-h-[200px] ${infoOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
        onClick={() => infoOpen ? onOpen() : setInfoOpen(true)}
        aria-label={infoOpen ? `Open ${work.title.rendered}` : `Show info: ${work.title.rendered}`}
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
      </button>

      {/* InfoBox: slides down from top, below the image */}
      <div className="w-full overflow-hidden">
        <motion.div
          animate={{ y: infoOpen ? "0%" : "-100%" }}
          initial={{ y: "-100%" }}
          transition={transition}
          className="cursor-zoom-in"
          onClick={() => onOpen()}
        >
          <InfoBox work={work} onClose={() => setInfoOpen(false)} />
        </motion.div>
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
  const { filteredWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();
  const {
    gridCols,
    gridRows,
    showTitles,
    showColorBg,
    showAsList,
    setActivePage,
    setVisibleWorkIndex,
    visibleWorkIndex,
    hoveredItemTitle,
  } = useUI();

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActivePage("works");
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setActivePage]);

  // ── Loading ────────────────────────────────────────────────────────────────
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  // Desktop: hovered work; mobile: topmost visible work
  const desktopBgIndex = hoveredItemTitle
    ? filteredWorks.findIndex((w) => w.title.rendered === hoveredItemTitle)
    : -1;
  const activeBgIndex = desktopBgIndex >= 0 ? desktopBgIndex : visibleWorkIndex;

  const gridItems = filteredWorks.map((work, i) => ({
    id: work.id,
    node: (
      <WorkCard
        work={work}
        revealIndex={i}
        objectPosition="center"
        imageClassName="max-h-[100dvh] lg:max-h-[calc(100dvh-64px)]"
        onOpen={() => openWork(work)}
        showTitles={showTitles}
      />
    ),
  }));

  return (
    <section ref={sectionRef} className="relative w-full">
      <PageLoader text="elinor silow" loading={loading} />
      <FixedCookieAccept />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Color bg layer */}
        {showColorBg && (
          <div className="fixed inset-0 z-[5] pointer-events-none">
            {filteredWorks.map((work, i) =>
              work.image_url ? (
                <div
                  key={work.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === activeBgIndex ? "opacity-100" : "opacity-0"}`}
                >
                  <BlurredWorkBg imageUrl={work.image_url} />
                </div>
              ) : null,
            )}
          </div>
        )}

        {/* Title list — behind cards, z-[5] */}
        {showAsList && (
          <div className="fixed top-[0px] left-0 right-0 -z-[10]  h-dvh overflow-y-auto flex flex-col items-center gap-y-[0px] pt-[32px] pb-[18px] pointer-events-auto">
            {filteredWorks.map((work, i) => (
              <button key={work.id} onClick={() => openWork(work)}>
                <OGubbeText
                  text={work.title.rendered}
                  revealAnimation={false}
                  sizes="16px"
                  lettersOnly
                  className={`font-timesNewRoman font-normal text-[16px] tracking-wide transition-colors duration-300 py-0 ${
                    i === visibleWorkIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
            <div className="sticky bottom-0 h-[48px] w-full shrink-0 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-[48px] z-10" />
          </div>
        )}

        <DynamicGrid
          items={gridItems}
          onTopVisibleChange={setVisibleWorkIndex}
          gridCols={Math.min(4, Math.max(1, gridCols))}
          gridRows={Math.min(4, Math.max(1, gridRows))}
        />
      </motion.div>

      <CopyrightFooter />
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

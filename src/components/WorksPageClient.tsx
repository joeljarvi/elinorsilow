"use client";

import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import BlurredWorkBg from "@/components/BlurredWorkBg";
import { Work } from "../../lib/sanity";
import { motion } from "framer-motion";
import WorkModal from "@/components/WorkModal";
import { OGubbeText } from "@/components/OGubbeText";
import PageLoader from "@/components/PageLoader";
import FixedCookieAccept from "@/components/FixedCookieAccept";
import CopyrightFooter from "@/components/CopyrightFooter";
import DynamicGrid from "@/components/DynamicGrid";
import WorkCard from "@/components/WorkCard";

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

  return (
    <section ref={sectionRef} className="relative w-full  ">
      <FixedCookieAccept />

      {/* Color bg layer — outside motion.div to avoid stacking context issues */}
      {showColorBg && (
        <div className="fixed inset-0 z-0 pointer-events-none">
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title list — behind cards, z-[5] */}
        {showAsList && (
          <div className="fixed top-[0px] left-0 right-0 z-[5] h-dvh overflow-y-auto pointer-events-auto">
            <div className="flex flex-col items-center min-h-dvh pt-[9px] pb-[18px]">
              {filteredWorks.map((work, i) => (
                <button key={work.id} onClick={() => openWork(work)}>
                  <OGubbeText
                    text={work.title.rendered}
                    revealAnimation={false}
                    sizes="16px"
                    lettersOnly
                    className={`font-timesNewRoman font-normal text-[16px] tracking-wide w-min transition-colors duration-300 py-0 ${
                      i === visibleWorkIndex
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="sticky bottom-0 h-[48px] w-full shrink-0 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-[48px] z-10" />
          </div>
        )}

        <DynamicGrid
          items={filteredWorks}
          renderItem={(work, i) => (
            <WorkCard
              work={work}
              revealIndex={i}
              imageClassName=""
              onOpen={() => openWork(work)}
              showTitles={showTitles}
            />
          )}
          onTopVisibleChange={setVisibleWorkIndex}
          gridCols={Math.min(4, Math.max(1, gridCols))}
          gridRows={Math.min(4, Math.max(1, gridRows))}
        />
      </motion.div>

      <CopyrightFooter />
      {activeWorkSlug && (
        <WorkModal
          showInfo
          slug={activeWorkSlug}
          onClose={() => {
            setActiveWorkSlug(null);
          }}
        />
      )}
    </section>
  );
}

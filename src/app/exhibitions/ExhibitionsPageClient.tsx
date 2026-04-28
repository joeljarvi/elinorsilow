"use client";

import { useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import WorkModal from "@/components/WorkModal";
import { motion } from "framer-motion";
import PageLoader from "@/components/PageLoader";
import DynamicGrid from "@/components/DynamicGrid";
import ExhibitionCard from "@/components/ExhibitionCard";
import { OGubbeText } from "@/components/OGubbeText";
import { Work } from "../../../lib/sanity";
import { useWorks } from "@/context/WorksContext";

export default function ExhibitionsPageClient() {
  const sectionRef = useRef<HTMLElement>(null);
  const {
    filteredExhibitions,
    exAsList,
    setActiveExhibitionSlug,
    activeExhibitionSlug,
    exLoading,
  } = useExhibitions();
  const {
    setOpen,
    setActivePage,
    exGridCols,
    exGridRows,
    setVisibleExhibitionIndex,
    visibleExhibitionIndex,
  } = useUI();
  const { allWorks } = useWorks();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActivePage("exhibitions");
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setActivePage]);

  const [activeWork, setActiveWork] = useState<Work | null>(null);

  const handleWorkSelect = (title: string) => {
    const work = allWorks.find((w) => w.title.rendered === title);
    if (!work) return;

    setActiveWork(work);
  };

  const [activeInfoId, setActiveInfoId] = useState<string | null>(null);
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    if (!exLoading) setDataLoaded(true);
  }, [exLoading]);
  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => setInitialAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [dataLoaded]);
  const loading = !initialAnimDone || !dataLoaded;

  function openExhibition(ex: { slug: string }) {
    setActiveExhibitionSlug(ex.slug);
    setOpen(false);
    window.history.pushState(null, "", `/exhibitions?exhibition=${ex.slug}`);
  }

  return (
    <section ref={sectionRef} className="relative w-full   ">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Title list — behind cards */}
        {exAsList && (
          <div className="fixed top-0 left-0 right-0 -z-[5] h-auto overflow-y-auto flex flex-col items-center gap-y-[0px] pt-[32px] pb-[18px] pointer-events-auto">
            {filteredExhibitions.map((ex, i) => (
              <button key={ex.id} onClick={() => openExhibition(ex)}>
                <OGubbeText
                  text={ex.title.rendered}
                  revealAnimation={false}
                  sizes="16px"
                  className={`font-timesNewRoman font-normal text-[16px] tracking-wide transition-colors duration-300 py-0 ${
                    i === visibleExhibitionIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        )}

        <DynamicGrid
          items={filteredExhibitions}
          renderItem={(ex, i) => (
            <ExhibitionCard
              ex={ex}
              index={i}
              onOpenWorkByTitle={handleWorkSelect}
              onOpen={() => openExhibition(ex)}
              activeInfoId={activeInfoId}
              onInfoOpen={(id) => setActiveInfoId(id)}
            />
          )}
          onTopVisibleChange={setVisibleExhibitionIndex}
          gridCols={Math.min(4, Math.max(1, exGridCols))}
          gridRows={Math.min(4, Math.max(1, exGridRows))}
          gapY="gap-y-[72px]"
        />
      </motion.div>

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => {
            setActiveExhibitionSlug(null);
          }}
        />
      )}

      {activeWork && (
        <WorkModal
          slug={activeWork.slug}
          onClose={() => setActiveWork(null)}
          showInfo
        />
      )}
    </section>
  );
}

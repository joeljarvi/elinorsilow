"use client";

import { useEffect, useRef } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { RevealImage } from "@/components/RevealImage";
import PageLoader from "@/components/PageLoader";
import WigglyButton from "@/components/WigglyButton";
import DynamicGrid from "@/components/DynamicGrid";
import { useState } from "react";
import { OGubbeText } from "@/components/OGubbeText";

function ExhibitionCard({
  ex,
  index,
  onOpen,
}: {
  ex: Exhibition;
  index: number;
  onOpen: () => void;
}) {
  const { setHoveredItemTitle } = useUI();
  return (
    <button
      className="block w-full text-left cursor-pointer"
      onClick={onOpen}
      onMouseEnter={() => setHoveredItemTitle(ex.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
      aria-label={`Open exhibition: ${ex.title.rendered}`}
    >
      {ex.acf.image_1 && (
        <RevealImage
          src={ex.acf.image_1.url}
          alt={ex.title.rendered}
          width={1200}
          height={900}
          revealIndex={index}
          className="w-full h-auto object-centered mx-auto"
        />
      )}
    </button>
  );
}

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

  function openExhibition(ex: Exhibition) {
    setActiveExhibitionSlug(ex.slug);
    setOpen(false);
    window.history.pushState(null, "", `/exhibitions?exhibition=${ex.slug}`);
  }

  const gridItems = filteredExhibitions.map((ex, i) => ({
    id: ex.id,
    node: (
      <ExhibitionCard ex={ex} index={i} onOpen={() => openExhibition(ex)} />
    ),
  }));

  return (
    <section ref={sectionRef} className="relative w-full">
      <PageLoader text="exhibitions" loading={loading} />

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
          items={gridItems}
          onTopVisibleChange={setVisibleExhibitionIndex}
          gridCols={Math.min(4, Math.max(1, exGridCols))}
          gridRows={Math.min(4, Math.max(1, exGridRows))}
          className="lg:max-w-4xl lg:mx-auto"
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
    </section>
  );
}

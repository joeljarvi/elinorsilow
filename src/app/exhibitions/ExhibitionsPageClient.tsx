"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { RevealImage } from "@/components/RevealImage";
import PageLoader from "@/components/PageLoader";
import WigglyButton from "@/components/WigglyButton";
import { OGubbeText } from "@/components/OGubbeText";
import NavSearch from "@/components/NavSearch";

function ExhibitionCard({
  ex,
  index,
  onOpen,
}: {
  ex: Exhibition;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      className="block w-full text-left cursor-pointer"
      onClick={onOpen}
      aria-label={`Open exhibition: ${ex.title.rendered}`}
    >
      {ex.acf.image_1 && (
        <RevealImage
          src={ex.acf.image_1.url}
          alt={ex.title.rendered}
          width={1200}
          height={900}
          revealIndex={index}
          className="w-full h-auto object-centered max-w-xl mx-auto"
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
  const { setOpen, setActivePage } = useUI();

  // Track centered card for mobile header
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observersRef = useRef<IntersectionObserver[]>([]);

  const setCardRef = useCallback((el: HTMLDivElement | null, i: number) => {
    cardRefs.current[i] = el;
  }, []);

  useEffect(() => {
    observersRef.current.forEach((o) => o.disconnect());
    observersRef.current = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      obs.observe(el);
      observersRef.current.push(obs);
    });
    return () => observersRef.current.forEach((o) => o.disconnect());
  }, [filteredExhibitions]);

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

  const centeredExhibition = filteredExhibitions[activeIndex];

  return (
    <section ref={sectionRef} className="relative w-full ">
      <PageLoader text="exhibitions" loading={loading} />

      {/* Desktop fixed header */}
      <div className="hidden lg:block fixed top-0 left-0 z-[70] pt-[9px] lg:pt-[18px] px-[18px] pointer-events-none">
        <WigglyButton
          text="exhibitions"
          size="text-[18px]"
          revealAnimation={false}
          onClick={() => {}}
          className="pointer-events-none"
        />
      </div>

      {/* Mobile fixed header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] flex justify-center items-center pointer-events-none pt-[9px] ">
        <div className="flex items-center pointer-events-auto">
          <WigglyButton
            text="exhibitions"
            size="text-[18px]"
            revealAnimation={false}
            className="text-muted-foreground "
            onClick={() => {}}
          />
          <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-bold text-[18px] select-none">
            /
          </span>
          {centeredExhibition && (
            <button
              className="no-hide-text cursor-pointer px-[9px]"
              onClick={() => openExhibition(centeredExhibition)}
            >
              <OGubbeText
                text={centeredExhibition.title.rendered}
                lettersOnly
                vertical={false}
                className="text-[18px] font-timesNewRoman font-bold "
                sizes="18px"
                revealAnimation={false}
              />
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative h-dvh">
          {/* Desktop: title list — absolute, centered vertically on left */}
          {exAsList && (
            <div className="hidden lg:flex absolute inset-y-0 left-0 z-[20] flex-col justify-start items-start px-[18px] gap-y-[9px] overflow-y-auto pointer-events-auto pt-[48px]">
              <div className="sticky top-0 left-0 right-0 h-[48px] w-full shrink-0 bg-gradient-to-b from-background to-transparent pointer-events-none -mb-[48px] z-10" />
              <NavSearch
                open={true}
                onClose={() => {}}
                inline
                filterType="exhibition"
              />
              {filteredExhibitions.map((ex, i) => (
                <WigglyButton
                  key={ex.id}
                  text={ex.title.rendered}
                  size="text-[18px]"
                  revealAnimation={false}
                  onClick={() => openExhibition(ex)}
                  className={`transition-colors duration-300 ${
                    i === activeIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
              <div className="sticky bottom-0 left-0 right-0 h-[48px] w-full shrink-0 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-[48px] z-10" />
            </div>
          )}

          {/* Cards scroll container — full width, centered */}
          <div className="relative z-[10] h-dvh overflow-y-scroll snap-y snap-mandatory px-[18px] pt-[50vh] space-y-[25vh] pb-[25vh]">
            {filteredExhibitions.map((ex, i) => (
              <div
                key={ex.id}
                ref={(el) => setCardRef(el, i)}
                className="snap-center py-[9px]"
              >
                <ExhibitionCard
                  ex={ex}
                  index={i}
                  onOpen={() => openExhibition(ex)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile — fixed centered title list */}
        {exAsList && (
          <div className="lg:hidden fixed top-0 left-0 right-0 z-[5] h-dvh overflow-y-auto flex flex-col items-center gap-y-[9px] pt-[48px] pb-[18px] pointer-events-auto">
            <div className="sticky top-0 h-[48px] w-full shrink-0 bg-gradient-to-b from-background to-transparent pointer-events-none -mb-[48px] z-10" />
            {filteredExhibitions.map((ex, i) => (
              <WigglyButton
                key={ex.id}
                text={ex.title.rendered}
                size="text-[18px]"
                revealAnimation={false}
                onClick={() => openExhibition(ex)}
                className={`transition-colors duration-300 ${
                  i === activeIndex
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <div className="sticky bottom-0 h-[48px] w-full shrink-0 bg-gradient-to-t from-background to-transparent pointer-events-none -mt-[48px] z-10" />
          </div>
        )}
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

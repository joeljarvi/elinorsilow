"use client";

import { useState, useEffect, useRef } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RevealImage } from "@/components/RevealImage";
import RowSlide from "@/components/RowSlide";
import PageLoader from "@/components/PageLoader";
import WigglyButton from "@/components/WigglyButton";

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
          sizes="(max-width: 1024px) 100vw, calc(100vw - 0)"
          revealIndex={index}
          className="w-full h-auto object-top"
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

  return (
    <section ref={sectionRef} className="relative w-full ">
      <PageLoader text="exhibitions" loading={loading} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {exAsList ? (
          <div className="flex flex-col">
            {filteredExhibitions.map((ex) => (
              <RowSlide key={ex.id}>
                <Button
                  variant="ghost"
                  size="controls"
                  onClick={() => openExhibition(ex)}
                  className="w-full rounded-none justify-center font-universNextProExt font-extrabold text-[14px] lg:text-[18px]"
                >
                  {ex.title.rendered}
                </Button>
              </RowSlide>
            ))}
          </div>
        ) : (
          <>
            {/* Single column, all screen sizes */}

            <div className="flex flex-col gap-y-[18px]  snap-start snap-mandatory px-[18px] pt-[18px]">
              {filteredExhibitions.map((ex, i) => (
                <ExhibitionCard
                  key={ex.id}
                  ex={ex}
                  index={i}
                  onOpen={() => openExhibition(ex)}
                />
              ))}
            </div>
          </>
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

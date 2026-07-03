"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";

import InfoBox from "@/components/InfoBox";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import WorkModal from "@/components/WorkModal";

export default function ExhibitionsPageClient() {
  const { filteredExhibitions, setActiveExhibitionSlug, activeExhibitionSlug } =
    useExhibitions();
  const { allWorks } = useWorks();
  const { moreFun, moreFunBg, refreshMoreFunBg } = useUI();
  const [index, setIndex] = useState(0);
  const [activeWorkSlug, setActiveWorkSlug] = useState<string | null>(null);

  const ex = filteredExhibitions[index] ?? null;
  const imageUrl = ex?.acf.image_1?.url ?? null;

  const handleClick = useCallback(() => {
    if (!filteredExhibitions.length) return;
    setIndex((i) => (i + 1) % filteredExhibitions.length);
    if (moreFun) refreshMoreFunBg();
  }, [filteredExhibitions.length, moreFun, refreshMoreFunBg]);

  useEffect(() => {
    const id = setInterval(handleClick, 5000);
    return () => clearInterval(id);
  }, [handleClick]);

  return (
    <div
      className="h-dvh w-full flex flex-col px-6 cursor-pointer transition-colors duration-300 "
      style={moreFun ? { backgroundColor: moreFunBg } : undefined}
      onClick={handleClick}
    >
      <div
        className="fixed top-0 left-0 flex items-start justify-start lg:justify-center w-full h-dvh pt-[var(--nav-height,0px)] pl-6 lg:pl-0"
        style={{ perspective: "800px" }}
      >
        {imageUrl && (
          <motion.img
            src={imageUrl}
            alt={ex!.title.rendered}
            className="max-h-[33.3dvh] lg:max-w-full lg:max-h-[50dvh] max-w-full object-contain object-top cursor-zoom-in pt-6 lg:pt-4"
            style={{}}
            onClick={(e) => {
              e.stopPropagation();
              setActiveExhibitionSlug(ex!.slug);
            }}
          />
        )}
      </div>

      {ex && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-start lg:justify-center px-4 lg:px-0 py-2"
          onClick={(e) => {
            e.stopPropagation();
            setActiveExhibitionSlug(ex.slug);
          }}
        >
          <InfoBox exhibition={ex} />
        </div>
      )}

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => setActiveExhibitionSlug(null)}
          onOpenWorkByTitle={(title) => {
            const work = allWorks.find((w) => w.title.rendered === title);
            if (work) setActiveWorkSlug(work.slug);
          }}
        />
      )}

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => setActiveWorkSlug(null)}
          showInfo
        />
      )}
    </div>
  );
}

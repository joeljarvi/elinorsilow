"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import InfoBox from "@/components/InfoBox";
import WorkModal from "@/components/WorkModal";

export default function WorksPageClient() {
  const { filteredWorks, setActiveWorkSlug, activeWorkSlug } = useWorks();
  const { moreFun, moreFunBg, refreshMoreFunBg } = useUI();
  const [index, setIndex] = useState(0);

  const work = filteredWorks[index] ?? null;

  const handleClick = useCallback(() => {
    if (!filteredWorks.length) return;
    setIndex((i) => (i + 1) % filteredWorks.length);
    if (moreFun) refreshMoreFunBg();
  }, [filteredWorks.length, moreFun, refreshMoreFunBg]);

  useEffect(() => {
    const id = setInterval(handleClick, 5000);
    return () => clearInterval(id);
  }, [handleClick]);

  return (
    <div
      className="h-dvh w-full flex flex-col px-[9px] cursor-pointer transition-colors duration-300"
      style={moreFun ? { backgroundColor: moreFunBg } : undefined}
      onClick={handleClick}
    >
      <div
        className="flex-1 flex items-center justify-center"
        style={{ perspective: "800px" }}
      >
        {work?.image_url && (
          <motion.img
            src={work.image_url}
            alt={work.title.rendered}
            className="max-h-[50dvh] lg:max-h-[50dvh] max-w-full object-contain cursor-zoom-in"
            style={{}}
            onClick={(e) => {
              e.stopPropagation();
              setActiveWorkSlug(work.slug);
            }}
          />
        )}
      </div>

      {work && (
        <div
          className="flex justify-center px-2 lg:px-0 py-2"
          onClick={(e) => {
            e.stopPropagation();
            setActiveWorkSlug(work.slug);
          }}
        >
          <InfoBox work={work} centered />
        </div>
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

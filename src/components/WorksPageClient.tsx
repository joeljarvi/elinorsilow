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
      className="h-dvh w-full flex flex-col px-6 cursor-pointer transition-colors duration-300 mx-auto"
      style={moreFun ? { backgroundColor: moreFunBg } : undefined}
      onClick={handleClick}
    >
      <div
        className="fixed top-0 flex items-center justify-center w-full h-dvh mx-auto"
        style={{ perspective: "800px" }}
      >
        {work?.image_url && (
          <motion.img
            src={work.image_url}
            alt={work.title.rendered}
            className="max-h-[45dvh] lg:max-h-[50dvh] max-w-full object-contain cursor-zoom-in"
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
          className="fixed bottom-0 left-0 right-0 flex justify-start w-full lg:justify-center px-6 lg:px-0 pb-2"
          onClick={(e) => {
            e.stopPropagation();
            setActiveWorkSlug(work.slug);
          }}
        >
          <InfoBox work={work} />
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

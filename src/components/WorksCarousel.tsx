"use client";

import React, { useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getAllWorks } from "../../lib/wordpress";
import { Work } from "../../lib/wordpress";
import Image from "next/image";

import { Toolbox } from "./Toolbox";
import { useAnimationContext } from "@/context/AnimationContext";
import { motion, AnimatePresence } from "framer-motion";

type WorksCarouselProps = {
  openTools: boolean;
};

export function WorksCarousel({ openTools }: WorksCarouselProps) {
  const [works, setWorks] = useState<Work[]>([]);

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [showInfoHint, setShowInfoHint] = useState(false);

  const { revealStep, startRevealSequence } = useAnimationContext();

  useEffect(() => {
    getAllWorks().then(setWorks);
  }, []);

  const filteredWorks = useMemo(() => {
    let result = [...works];

    if (selectedYear !== "all") {
      result = result.filter((w) => w.acf.year === Number(selectedYear)); // Ensure correct type
    }
    if (selectedCategory !== "all") {
      result = result.filter((w) => w.acf.medium?.includes(selectedCategory));
    }

    switch (sortBy) {
      case "az":
        return result.sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered)
        );
      case "random":
        return result.sort(() => Math.random() - 0.5);
      default:
        return result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  }, [works, selectedYear, selectedCategory, sortBy]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (filteredWorks.length > 0) {
      startRevealSequence();
    }
  }, [filteredWorks.length, startRevealSequence]);

  useEffect(() => {
    if (revealStep === 6) {
      setShowInfoHint(true);
      const timer = setTimeout(() => {
        setShowInfoHint(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [revealStep]);

  if (!filteredWorks.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <AnimatePresence>
          <motion.div
            key="loading-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.5 },
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
            }}
            className="w-fit"
          >
            <Image
              src="/ogubbe.jpg"
              alt="drawing by Elinor Silow"
              width={2124}
              height={2123}
              priority
              className="max-w-24  object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const visibleRange = 2;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealStep >= 3 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 left-0 flex flex-wrap items-center justify-center gap-x-3 w-full p-3 lg:justify-start lg:pb-3"
      >
        {filteredWorks.map((work, index) => (
          <button
            key={work.id}
            onClick={() => {
              setSelectedIndex(index);
              emblaApi?.scrollTo(index);
            }}
            className={`font-serif-italic transition-opacity cursor-pointer text-sm hover:opacity-30 ${
              index === selectedIndex ? "text-black opacity-30" : ""
            }`}
          >
            {work.title.rendered}
          </button>
        ))}
      </motion.div>

      <div
        className={` transition-all touch-pan-y `}
        ref={emblaRef}
        style={{ touchAction: "pan-y" }}
      >
        <div className="flex h-full">
          {filteredWorks.map((work, index) => {
            const isVisible = Math.abs(index - selectedIndex) <= visibleRange;
            if (!isVisible) {
              return <div key={work.id} className="flex-none w-full" />;
            }
            const media = work._embedded?.["wp:featuredmedia"]?.[0];
            const imageUrl = media?.source_url || "";
            const imageWidth = media?.media_details?.width || 1600;
            const imageHeight = media?.media_details?.height || 1200;

            return (
              <div
                key={work.id}
                className="flex-none w-full h-full flex flex-col items-center justify-center gap-3 px-4 md:px-32"
                style={{ userSelect: "none" }}
              >
                {imageUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={revealStep >= 2 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-h-[60vh] lg:max-h-[70vh] max-w-full flex items-center justify-center"
                  >
                    <Image
                      src={imageUrl}
                      alt={work.title.rendered}
                      width={imageWidth}
                      height={imageHeight}
                      className="object-contain h-auto w-auto max-h-[60vh] lg:max-h-[70vh] max-w-full"
                      loading="lazy"
                    />
                  </motion.div>
                )}
                {showDescription && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={revealStep >= 2 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex font-serif pb-12 text-center text-sm"
                  >
                    <li>
                      <span className="italic font-serif">
                        {work.acf.title},{" "}
                      </span>
                      {work.acf.year}, {work.acf.materials},{" "}
                      {work.acf.dimensions}
                    </li>
                  </motion.ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showInfoHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 right-0 px-6 pb-3 hidden lg:flex z-30 uppercase"
          >
            <h2 className="flex items-center gap-x-3 font-sans justify-end">
              **use arrow keys to navigate**
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={revealStep >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="absolute flex w-full h-full top-0 items-center justify-between z-20 pointer-events-none mix-blend-difference text-white"
      >
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className={`font-sans uppercase text-sm opacity-30 lg:text-lg hover:opacity-10 transition-opacity pointer-events-auto `}
        >
          Prev
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className={`font-sans uppercase text-sm opacity-30 lg:text-lg hover:opacity-10 transition-opacity pointer-events-auto`}
        >
          Next
        </button>
      </motion.div>
      <AnimatePresence>
        {openTools && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={revealStep >= 6 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            exit={{ opacity: 0 }}
          >
            <Toolbox
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              allWorks={works}
              showDescription={showDescription}
              setShowDescription={setShowDescription}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

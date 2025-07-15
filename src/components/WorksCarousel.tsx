"use client";

import React, { useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getAllWorks } from "../../lib/wordpress";
import { Work } from "../../lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import { Toolbox } from "./Toolbox";
import { useAnimationContext } from "@/context/AnimationContext";
import { motion, AnimatePresence } from "framer-motion";

type WorksCarouselProps = {
  openTools: boolean;
  setOpenTools: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export function WorksCarousel({
  openTools,
  setOpenTools,
  openMenu,
  setOpenMenu,
}: WorksCarouselProps) {
  const [works, setWorks] = useState<Work[]>([]);

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
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
    onSelect(); // set initial state

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]); // this is OK now

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
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [revealStep]);

  if (!filteredWorks.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <h2 className="font-sans uppercase">Loading works…</h2>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen flex flex-col overflow-hidden">
      {/* Titles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealStep >= 3 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="absolute bottom-0 top:0 lg:top-auto flex flex-wrap items-baseline justify-center lg:justify-start w-full p-3 gap-x-3 text-sm z-30"
      >
        {filteredWorks.map((work, index) => (
          <Link
            href={`/work/${work.slug}`}
            key={work.id}
            className={`font-serif-italic transition-opacity cursor-pointer ${
              index === selectedIndex ? "text-black opacity-30" : ""
            }`}
          >
            {work.title.rendered}
          </Link>
        ))}
      </motion.div>

      {/* Carousel */}
      <div
        className={`overflow-hidden w-full h-full transition-all ${
          openTools ? "blur-xl lg:blur-none" : ""
        }`}
        ref={emblaRef}
      >
        <div className="flex h-full">
          {filteredWorks.map((work) => {
            const media = work._embedded?.["wp:featuredmedia"]?.[0];
            const imageUrl = media?.source_url || "";
            const imageWidth = media?.media_details?.width || 1600;
            const imageHeight = media?.media_details?.height || 1200;

            return (
              <div
                key={work.id}
                className="flex-none w-full flex flex-col items-center justify-center gap-3 px-4 md:px-32"
                style={{ userSelect: "none" }}
              >
                {imageUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={revealStep >= 1 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-h-[60vh] lg:max-h-[70vh] max-w-full flex items-center justify-center"
                  >
                    <Image
                      src={imageUrl}
                      alt={work.title.rendered}
                      width={imageWidth}
                      height={imageHeight}
                      className="object-contain h-auto w-auto max-h-[60vh] lg:max-h-[70vh] max-w-full"
                      priority
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
            className="absolute bottom-0 right-0 p-3 hidden lg:flex"
          >
            <h2 className="font-sans justify-end">
              *use arrow keys to navigate
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealStep >= 5 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="absolute flex w-full h-full top-0 items-center justify-between z-50"
      >
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className={`font-sans uppercase text-sm lg:text-lg hover:opacity-30 transition-opacity ${
            openTools ? "blur-xl lg:blur-none" : ""
          }`}
        >
          Prev
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className={`font-sans uppercase text-sm lg:text-lg hover:opacity-30 transition-opacity ${
            openTools ? "blur-xl lg:blur-none" : ""
          }`}
        >
          Next
        </button>
      </motion.div>

      {/* Toolbox */}
      {openTools && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealStep >= 4 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
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
    </div>
  );
}

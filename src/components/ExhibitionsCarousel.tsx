"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { getAllExhibitions } from "../../lib/wordpress";
import { Exhibition } from "../../lib/wordpress";
import Image from "next/image";
import { useAnimationContext } from "@/context/AnimationContext";
import { motion } from "framer-motion";

export function ExhibitionCarousel() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const { revealStep, startRevealSequence } = useAnimationContext();

  useEffect(() => {
    getAllExhibitions().then(setExhibitions);
  }, []);

  useEffect(() => {
    if (!emblaApi || !emblaApi.on) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi?.off?.("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (exhibitions.length > 0) {
      startRevealSequence();
    }
  }, [exhibitions.length, startRevealSequence]);

  if (!exhibitions.length) {
    return <p>Loading exhibitions…</p>;
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden items-center justify-center">
      <div ref={emblaRef} className="overflow-hidden w-full h-full">
        <div className="flex w-full h-full">
          {exhibitions.map((exhibition, index) => {
            const acf = exhibition.acf;
            const galleryImages = Object.keys(acf)
              .filter((key) => key.startsWith("image_"))
              .map((key) => acf[key]?.url) // ✅ fixes missing image issue
              .filter(Boolean); // remove empty values

            return (
              <div
                key={exhibition.id}
                className="flex-none w-full h-full grid grid-cols-1 lg:grid-cols-2 items-start justify-center gap-3 overflow-y-auto"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={revealStep >= 2 ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6 }}
                  className="pb-6 px-6 pt-18 col-start-1 flex flex-col  font-serif"
                >
                  <h2 className="font-sans tracking-tight text-xl">
                    {acf.title}
                  </h2>
                  <p>
                    <strong className="font-sans font-normal tracking-tight">
                      {acf.venue}, {acf.city}
                    </strong>{" "}
                    <br />
                    {acf.start_date} – {acf.end_date} <br />
                    {acf.exhibition_type}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={revealStep >= 2 ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6 }}
                  className="flex lg:hidden col-start-1  flex-col items-start justify-center text-left text-sm font-serif pb-6 px-6 pt-18 pl-6 pr-12"
                >
                  {acf.description && <p className="">{acf.description}</p>}
                </motion.div>

                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={revealStep >= 2 ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6 }}
                    className="col-start-1 lg:col-start-2 flex flex-col gap-4 max-h-[100vh] overflow-y-auto"
                  >
                    {galleryImages.map((url, idx) => (
                      <div key={idx} className="flex justify-center">
                        <Image
                          src={url}
                          alt={`Image ${idx + 1}`}
                          width={1000}
                          height={750}
                          className="object-contain max-h-[80vh] w-full h-auto "
                        />
                      </div>
                    ))}
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={revealStep >= 2 ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6 }}
                  className="hidden lg:flex col-start-1  flex-col items-start justify-center text-left text-sm font-serif pb-6 px-6 "
                >
                  {acf.description && <p className="pt-2">{acf.description}</p>}
                  {acf.credits && (
                    <p className="pt-1 text-xs text-neutral-500 italic">
                      {acf.credits}
                    </p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={revealStep >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="absolute flex w-full h-full top-0 items-center justify-between z-20 pointer-events-none mix-blend-difference text-white"
      >
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="pointer-events-auto opacity-30 hover:opacity-10 uppercase text-sm lg:text-lg font-sans"
        >
          Prev
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="pointer-events-auto opacity-30 hover:opacity-10 uppercase text-sm lg:text-lg font-sans"
        >
          Next
        </button>
      </motion.div>
    </div>
  );
}

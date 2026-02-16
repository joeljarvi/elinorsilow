"use client";

import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Work } from "../../../lib/wordpress";
import { Button } from "@/components/ui/button";

export default function WorksPageClient() {
  const { filteredWorks, setActiveWorkSlug, getWorkSizeClass } = useWorks();
  const router = useRouter();
  const { setOpen } = useUI();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="relative flex flex-col items-center lg:items-start w-full mt-10 lg:mt-[25vh] ">
      <div className="snap-mandatory flex flex-col items-center lg:items-start lg:grid grid-cols-6 w-full px-4 gap-x-8 gap-y-60 mb-36">
        {filteredWorks.map((work: Work, idx: number) => {
          const ref = useRef<HTMLDivElement>(null);
          const inView = useInView(ref, { amount: 0.25 });

          // Update activeIndex when this work is more than 50% in view
          useEffect(() => {
            if (inView) setActiveIndex(idx);
          }, [inView, idx]);

          return (
            <motion.div
              key={work.id}
              ref={ref}
              className={`snap-start relative w-full h-screen lg:w-full lg:aspect-square lg:h-auto cursor-pointer overflow-hidden mx-auto lg:mx-0 lg:bg-background lg:bg-gradient-none lg:hover:bg-foreground/10 transition-all  `}
              onClick={() => {
                setActiveWorkSlug(work.slug);
                setOpen(false);
                router.push(`/?work=${work.slug}`);
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Work Image */}
              <div
                className={`relative  lg:mx-0  h-full ${getWorkSizeClass(
                  work.acf.dimensions
                )} flex `}
              >
                {work.image_url && (
                  <Image
                    src={work.image_url}
                    alt={work.title.rendered}
                    fill
                    className="object-contain object-top  lg:object-top-left "
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fixed Caption Bottom Left */}
      <div className="fixed lg:hidden bottom-0 left-0  z-0 pointer-events-none w-full px-4 pb-4 grid grid-cols-4 gap-4 ">
        {activeIndex !== null && filteredWorks[activeIndex] && (
          <motion.div
            key={filteredWorks[activeIndex].id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className=" bg-[rgb(0,255,0)]   font-directorMono text-sm flex flex-col w-full p-4 col-span-4 relative h3"
          >
            <span className=" h3">
              {filteredWorks[activeIndex].title.rendered}
            </span>
            {/* 
            {filteredWorks[activeIndex].acf.year && (
              <span>{filteredWorks[activeIndex].acf.year}</span>
            )}
            {filteredWorks[activeIndex].acf.materials && (
              <span className="max-w-sm">
                {filteredWorks[activeIndex].acf.materials}
              </span>
            )}
            {filteredWorks[activeIndex].acf.dimensions && (
              <span>{filteredWorks[activeIndex].acf.dimensions}</span>
            )}
            <Button
              variant="link"
              className="absolute bottom-0 right-0"
              onClick={() => {
                setActiveWorkSlug(filteredWorks[activeIndex].slug);
                setOpen(false);
                router.push(`/?work=${filteredWorks[activeIndex].slug}`);
              }}
            >
              Se verk
            </Button> */}
          </motion.div>
        )}
      </div>
    </section>
  );
}

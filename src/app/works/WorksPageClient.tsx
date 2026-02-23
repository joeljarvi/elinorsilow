"use client";

import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useState, useRef, useEffect } from "react";
import { Work } from "../../../lib/wordpress";
import { motion, useScroll, useTransform } from "framer-motion";
import HDivider from "@/components/HDivider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";
import Staggered from "@/components/Staggered";

export default function WorksPageClient() {
  const { filteredWorks, setActiveWorkSlug, getWorkSizeClass } = useWorks();
  const [initialAnimDone, setInitialAnimDone] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const { workLoading } = useWorks();
  const router = useRouter();
  const { setOpen, handleOpenWorksFilter, showWorksFilter } = useUI();
  const { showInfo } = useUI();
  useEffect(() => {
    if (!workLoading) {
      setDataLoaded(true);
    }
  }, [workLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => {
        setInitialAnimDone(true);
      }, 600); // length of your intro animation

      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  const loading = !initialAnimDone || !dataLoaded;

  return (
    <section className="relative w-full mt-[50vh] lg:mt-[50vh]   ">
      {/* Scroll container */}
      <div
        className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5 lg:justify-start 
 
    gap-x-4
 
  "
      >
        <span className=" px-4 lg:px-8 w-full lg:col-span-5 grid grid-cols-5 gap-x-8 bg-transparent items-start ">
          {/* Left title */}
          <Button
            variant="ghost"
            size="lg"
            className="flex col-span-5 lg:col-span-4 uppercase  hover:bg-transparent justify-start w-full border-b-1 border-foreground bg-transparent"
          >
            All works
          </Button>
        </span>
        {/* Right link */}

        {/* Divider left */}

        <Staggered
          items={filteredWorks}
          getKey={(w) => w.id}
          loading={loading}
          className="
    min-h-screen
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-4
    gap-x-8 
    
    col-span-4
  "
          renderItem={(work: Work) => (
            <motion.div
              key={work.id}
              className="h-screen lg:h-[75vh] flex flex-col   "
            >
              <div
                onClick={() => {
                  setActiveWorkSlug(work.slug);
                  setOpen(false);
                  router.push(`/?work=${work.slug}`);
                }}
                className="relative cursor-pointer w-full flex justify-center"
              >
                {/* Image box */}
                <div className={`relative mx-0 h-[80vh] lg:h-[50vh] w-full `}>
                  {work.image_url && (
                    <Image
                      src={work.image_url}
                      alt={work.title.rendered}
                      fill
                      className="object-contain object-left lg:object-top-left p-4 lg:pt-4 lg:px-8 lg:pb-4"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        />
        <div
          className="
  fixed z-40

  bottom-0 left-0 w-full

  lg:bottom-auto
  lg:left-auto
  lg:right-8
  lg:top-[50vh]
  lg:w-[240px]
"
        >
          {/* Button */}
          <Button
            className="
    w-full uppercase justify-between
    border-t border-foreground
    bg-background
hover:bg-background
    lg:border-t-0
    lg:border-b 
    "
            variant="ghost"
            size="lg"
            onClick={() => {
              handleOpenWorksFilter();
            }}
          >
            Filter <span>&gt;</span>
          </Button>

          {/* Panel */}
          {showWorksFilter && (
            <div className="bg-background border-t border-foreground py-4 px-4 lg:px-8">
              <WorksFilter />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import Staggered from "@/components/Staggered";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Work, Exhibition } from "../../../lib/wordpress";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";
import ExFilter from "@/components/ExFilter";
import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function ExhibitionsPageClient() {
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const {
    filteredExhibitions,
    setActiveExhibitionSlug,
    activeExhibitionSlug,
    exLoading,
  } = useExhibitions();

  const router = useRouter();
  const {
    showInfo,
    open,
    setOpen,
    showExhibitionsFilter,
    handleOpenExhibitionsFilter,
  } = useUI();

  useEffect(() => {
    if (!exLoading) {
      setDataLoaded(true);
    }
  }, [exLoading]);

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
    <section className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full  mt-[50vh] ">
      <div
        className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5 
 
    gap-x-4
 
  "
      >
        {" "}
        <span className="px-8 w-full lg:col-span-5 grid grid-cols-5 gap-x-8 bg-transparent">
          {/* Left title */}
          <Button
            variant="ghost"
            size="lg"
            className="hidden lg:flex lg:col-span-4 uppercase  hover:bg-transparent justify-start w-full lg:border-b-1 lg:border-foreground"
          >
            Selected Exhibitions
          </Button>
        </span>
        {/* Divider left */}
        <Staggered
          items={filteredExhibitions}
          getKey={(ex) => ex.id}
          loading={loading}
          className="
    min-h-screen
       col-span-5
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-5
    gap-x-8 
    
 
  "
          renderItem={(ex: Exhibition) => (
            <motion.div
              key={ex.id}
              className="lg:col-span-2 h-screen flex flex-col bg-background w-full  "
            >
              <div
                onClick={() => {
                  setActiveExhibitionSlug(ex.slug);
                  setOpen(false);
                  router.push(`/?exhibition=${ex.slug}`);
                }}
                className="relative cursor-pointer w-full flex justify-center"
              >
                {/* Image box */}
                <div className={`relative mx-0 h-[80vh] lg:h-[50vh] w-full `}>
                  {ex.acf.image_1 && (
                    <Image
                      src={ex.acf.image_1.url}
                      alt={ex.title.rendered}
                      fill
                      className="object-contain object-left lg:object-top-left p-4 lg:px-8"
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
              handleOpenExhibitionsFilter();
            }}
          >
            Filter <span>&gt;</span>
          </Button>

          {/* Panel */}
          {showExhibitionsFilter && (
            <div className="bg-background py-4 px-4 lg:px-8">
              <ExFilter />
            </div>
          )}
        </div>
        {/* Exhibitions */}
      </div>
    </section>
  );
}

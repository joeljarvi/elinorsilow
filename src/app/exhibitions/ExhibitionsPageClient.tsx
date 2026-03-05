"use client";

import Staggered from "@/components/Staggered";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useState } from "react";
import { Work, Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";
import ExFilter from "@/components/ExFilter";
import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import { useEffect } from "react";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
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
    <section className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full">
      <div className="relative w-full">
        <Staggered
          items={filteredExhibitions}
          getKey={(ex) => ex.id}
          loading={loading}
          className="w-full min-h-screen flex flex-col gap-4 lg:grid lg:grid-cols-2 gap-y-30 lg:gap-x-4 p-8 lg:p-4"
          renderItem={(ex: Exhibition) => (
            <motion.div key={ex.id} className="w-full lg:col-span-2">
              <button
                onClick={() => {
                  setActiveExhibitionSlug(ex.slug);
                  setOpen(false);
                  window.history.pushState(
                    null,
                    "",
                    `/exhibitions?exhibition=${ex.slug}`,
                  );
                }}
                className="relative cursor-pointer w-full flex flex-col "
                aria-label={`Show exhibition: ${ex.title.rendered}`}
              >
                {/* Image box */}
                <div className="relative w-full aspect-[3/4] lg:aspect-square  ">
                  {ex.acf.image_1 && (
                    <Image
                      src={ex.acf.image_1.url}
                      alt={ex.title.rendered}
                      fill
                      className="object-cover  "
                    />
                  )}
                </div>
                <div className="absolute top-0 left-0 flex flex-col justify-start text-2xl text-left lg:text-base items-start p-4 lg:p-8 w-full ">
                  <span className="text-foreground h3 text-2xl">
                    {ex.title.rendered}
                  </span>
                </div>
              </button>
            </motion.div>
          )}
        />
        <div
          className="
fixed z-20
  bottom-0 left-0 w-full
p-8
  lg:bottom-auto
  lg:left-auto
  lg:right-8
  lg:top-[0vh]
  lg:w-1/4
"
        >
          {/* Button */}
          <Button
            className={`    font-bookish ${showExhibitionsFilter ? "bg-background w-full justify-start" : "bg-transparent"}`}
            variant="link"
            size="lg"
            aria-expanded={showExhibitionsFilter}
            onClick={() => {
              handleOpenExhibitionsFilter();
            }}
          >
            Filter{" "}
          </Button>

          {/* Panel */}
          {showExhibitionsFilter && (
            <div className="bg-background ">
              <ExFilter />
            </div>
          )}
        </div>
        {/* Exhibitions */}
      </div>

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => setActiveExhibitionSlug(null)}
        />
      )}
    </section>
  );
}

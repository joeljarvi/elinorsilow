"use client";

import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useUI } from "@/context/UIContext";
import { useState, useRef, useEffect } from "react";
import { Work } from "../../../lib/sanity";
import { motion, useScroll, useTransform } from "framer-motion";
import HDivider from "@/components/HDivider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";
import Staggered from "@/components/Staggered";
import WorkModal from "@/app/works/WorkModal";

export default function WorksPageClient() {
  const { filteredWorks, setActiveWorkSlug, activeWorkSlug, getWorkSizeClass } =
    useWorks();
  const [initialAnimDone, setInitialAnimDone] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const { workLoading } = useWorks();
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
    <section className="relative w-full  mt-8 lg:mt-0">
      {/* Scroll container */}
      <div
        className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5 lg:justify-start 
 
    gap-x-4
 
  "
      >
        <Staggered
          items={filteredWorks}
          getKey={(w) => w.id}
          loading={loading}
          className="
    min-h-screen
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-4
    gap-x-30 
    
    col-span-5 lg:p-4
  "
          renderItem={(work: Work) => (
            <motion.div
              key={work.id}
              className="h-screen lg:h-[50vh] flex flex-col justify-start   "
            >
              <button
                onClick={() => {
                  setActiveWorkSlug(work.slug);
                  setOpen(false);
                  window.history.pushState(
                    null,
                    "",
                    `/works?work=${work.slug}`,
                  );
                }}
                className="relative cursor-pointer w-full flex flex-col  "
                aria-label={`Show work: ${work.title.rendered}`}
              >
                {/* Image box */}
                <div className={`relative mx-0 h-[50vh] lg:h-[25vh] w-full  `}>
                  {work.image_url && (
                    <Image
                      src={work.image_url}
                      alt={work.title.rendered}
                      fill
                      className="object-contain object-top  lg:object-top-left "
                    />
                  )}
                </div>
                <div className="flex flex-col justify-start h3 text-2xl lg:text-base items-start pt-4 px-8 lg:px-4  pb-16 ">
                  <span className=" ">{work.title.rendered}</span>
                  <span className=" whitespace-normal text-left">
                    {work.acf.materials}
                  </span>

                  <span className="">{work.acf.dimensions}</span>
                  <span className="">{work.acf.year}</span>
                </div>
              </button>
            </motion.div>
          )}
        />
        <div
          className="
  fixed z-20

  bottom-0 left-0 w-full
p-4
  lg:bottom-auto
  lg:left-auto
  lg:right-8
  lg:top-[0vh]
  lg:w-1/4
"
        >
          {/* Button */}
          <Button
            className={`    font-bookish ${showWorksFilter ? "bg-background w-full justify-start" : "bg-transparent"}`}
            variant="link"
            size="lg"
            aria-expanded={showWorksFilter}
            onClick={() => {
              handleOpenWorksFilter();
            }}
          >
            Filter{" "}
          </Button>

          {/* Panel */}
          {showWorksFilter && (
            <div className="bg-background    ">
              <WorksFilter />
            </div>
          )}
        </div>
      </div>

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => setActiveWorkSlug(null)}
        />
      )}
    </section>
  );
}

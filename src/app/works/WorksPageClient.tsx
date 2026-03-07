"use client";

import { useWorks } from "@/context/WorksContext";
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
import ProportionalWorkImage from "@/components/ProportionalWorkImage";

export default function WorksPageClient() {
  const { filteredWorks, setActiveWorkSlug, activeWorkSlug, getWorkSizeClass } =
    useWorks();
  const [initialAnimDone, setInitialAnimDone] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const { workLoading } = useWorks();
  const { setOpen, handleOpenWorksFilter, showWorksFilter } = useUI();
  const { showInfo } = useUI();
  const [proportionalImages, setProportionalImages] = useState(false);
  const [showAsList, setShowAsList] = useState(false);
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
        {showAsList ? (
          <div className="col-span-5 lg:p-4 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
              {[...filteredWorks]
                .sort((a, b) =>
                  a.title.rendered.localeCompare(b.title.rendered, "sv"),
                )
                .map((work: Work) => (
                  <Button
                    key={work.id}
                    variant="link"
                    size="lg"
                    onClick={() => {
                      setActiveWorkSlug(work.slug);
                      setOpen(false);
                      window.history.pushState(
                        null,
                        "",
                        `/works?work=${work.slug}`,
                      );
                    }}
                    className="justify-start"
                    aria-label={`Show work: ${work.title.rendered}`}
                  >
                    <span className="font-bookish text-2xl">
                      {work.title.rendered}
                    </span>
                  </Button>
                ))}
            </div>
          </div>
        ) : (
          <Staggered
            items={filteredWorks}
            getKey={(w) => w.id}
            loading={loading}
            className="
    min-h-screen
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-2 
    gap-x-30

    col-span-5 lg:p-4
  "
            renderItem={(work: Work) => (
              <motion.div
                key={work.id}
                className="h-screen lg:h-[100vh] flex flex-col justify-start   "
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
                  {work.image_url && (
                    <ProportionalWorkImage
                      src={work.image_url}
                      alt={work.title.rendered}
                      dimensions={work.acf.dimensions}
                      proportional={proportionalImages}
                    />
                  )}
                  {showInfo && (
                    <div className="flex flex-col justify-start h3 text-2xl lg:text-2xl items-start pt-4 px-8 lg:px-4  pb-16 ">
                      <span className=" ">{work.title.rendered}</span>
                      <span className=" whitespace-normal text-left">
                        {work.acf.materials}
                      </span>

                      <span className="">{work.acf.dimensions}</span>
                      <span className="">{work.acf.year}</span>
                    </div>
                  )}
                </button>
              </motion.div>
            )}
          />
        )}
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
          <div className="flex gap-2">
            <Button
              className={`font-bookish ${showWorksFilter ? "bg-background w-full justify-start" : "bg-transparent"}`}
              variant="link"
              size="lg"
              aria-expanded={showWorksFilter}
              onClick={() => {
                handleOpenWorksFilter();
              }}
            >
              Filter
            </Button>
            <Button
              className="font-bookish bg-transparent"
              variant="link"
              size="lg"
              aria-pressed={proportionalImages}
              onClick={() => setProportionalImages((prev) => !prev)}
            >
              {proportionalImages ? "Full width" : "Proportional"}
            </Button>
            <Button
              className="font-bookish bg-transparent"
              variant="link"
              size="lg"
              aria-pressed={showAsList}
              onClick={() => setShowAsList((prev) => !prev)}
            >
              {showAsList ? "Grid" : "List"}
            </Button>
          </div>

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
          onClose={() => {
            setActiveWorkSlug(null);
            setOpen(true);
          }}
        />
      )}
    </section>
  );
}

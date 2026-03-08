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
import { PageHeader } from "@/components/PageHeader";

export default function WorksPageClient() {
  const {
    filteredWorks,
    setActiveWorkSlug,
    activeWorkSlug,
    getWorkSizeClass,
    workSort,
    categoryFilter,
    selectedYear,
  } = useWorks();
  const [initialAnimDone, setInitialAnimDone] = useState(false);

  const [dataLoaded, setDataLoaded] = useState(false);
  const { workLoading } = useWorks();
  const {
    setOpen,
    handleOpenWorksFilter,
    showWorksFilter,
    proportionalImages,
    setProportionalImages,
    showAsList,
    setShowAsList,
  } = useUI();
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
    <section className="relative w-full  mt-24 lg:mt-0">
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
    mt-24 min-h-screen
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
                    <div className="flex flex-col justify-start h3 text-xl lg:text-2xl items-start pt-4 px-4  ">
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
      </div>
      <div
        className="
  fixed z-10
  top-0 left-0 w-full p-0 


"
      >
        {/* Button */}
        <div className=" flex justify-between lg:justify-start  items-baseline gap-2  w-full">
          <PageHeader
            title="Works"
            count={filteredWorks.length}
            sortLabel={
              workSort === "title"
                ? "a–ö"
                : workSort === "year-oldest"
                  ? "Oldest"
                  : "Latest"
            }
            onSortClick={handleOpenWorksFilter}
            filterLabel={
              [
                categoryFilter !== "all"
                  ? categoryFilter.charAt(0).toUpperCase() +
                    categoryFilter.slice(1)
                  : null,
                selectedYear ? String(selectedYear) : null,
              ]
                .filter(Boolean)
                .join(" · ") || undefined
            }
          />
          <Button
            className={`font-bookish hidden lg:flex ${showWorksFilter ? "bg-background w-full justify-start" : "bg-transparent"}`}
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
            className="font-bookish bg-transparent hidden lg:flex"
            variant="link"
            size="lg"
            aria-pressed={proportionalImages}
            onClick={() => setProportionalImages(!proportionalImages)}
          >
            {proportionalImages ? "Full width" : "Proportional"}
          </Button>
          <Button
            className="font-bookish bg-transparent hidden lg:flex"
            variant="link"
            size="lg"
            aria-pressed={showAsList}
            onClick={() => setShowAsList(!showAsList)}
          >
            {showAsList ? "Grid" : "List"}
          </Button>
        </div>

        {/* Panel */}
        {showWorksFilter && (
          <div className="bg-background hidden lg:block   ">
            <WorksFilter />
          </div>
        )}
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

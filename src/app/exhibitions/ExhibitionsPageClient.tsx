"use client";

import Staggered from "@/components/Staggered";
import Image from "next/image";
import { useState } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { Button } from "@/components/ui/button";
import ExFilter from "@/components/ExFilter";
import { useEffect } from "react";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";

export default function ExhibitionsPageClient() {
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAsList, setShowAsList] = useState(false);
  const {
    filteredExhibitions,
    setActiveExhibitionSlug,
    activeExhibitionSlug,
    exLoading,
    exhibitionSort,
    selectedType,
    debouncedSelectedYear,
  } = useExhibitions();

  const { setOpen, showExhibitionsFilter, handleOpenExhibitionsFilter } =
    useUI();

  useEffect(() => {
    if (!exLoading) {
      setDataLoaded(true);
    }
  }, [exLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => {
        setInitialAnimDone(true);
      }, 600);

      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  const loading = !initialAnimDone || !dataLoaded;

  return (
    <section className="relative w-full mt-24 lg:mt-0">
      <div className="relative w-full">
        {showAsList ? (
          <div className="w-full min-h-screen p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
              {[...filteredExhibitions]
                .sort((a, b) =>
                  a.title.rendered.localeCompare(b.title.rendered, "sv"),
                )
                .map((ex: Exhibition) => (
                  <Button
                    key={ex.id}
                    variant="link"
                    size="lg"
                    onClick={() => {
                      setActiveExhibitionSlug(ex.slug);
                      setOpen(false);
                      window.history.pushState(
                        null,
                        "",
                        `/exhibitions?exhibition=${ex.slug}`,
                      );
                    }}
                    className="justify-start"
                    aria-label={`Show exhibition: ${ex.title.rendered}`}
                  >
                    <span className="font-bookish text-2xl">
                      {ex.title.rendered}
                    </span>
                  </Button>
                ))}
            </div>
          </div>
        ) : (
          <Staggered
            items={filteredExhibitions}
            getKey={(ex) => ex.id}
            loading={loading}
            className="w-full min-h-screen flex flex-col gap-y-24 lg:grid lg:grid-cols-2 lg:gap-y-30 lg:gap-x-4 p-4 lg:p-8"
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
                  {ex.acf.image_1 && (
                    <Image
                      src={ex.acf.image_1.url}
                      alt={ex.title.rendered}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="max-h-screen max-w-full w-auto h-auto mx-auto block object-center"
                    />
                  )}
                  <div className="flex flex-col justify-start text-left items-start pt-4 px-4 ">
                    <span className="text-foreground h3 text-2xl leading-snug">
                      {ex.title.rendered}
                    </span>
                  </div>
                </button>
              </motion.div>
            )}
          />
        )}
      </div>

      {/* Fixed header — same pattern as WorksPage */}
      <div className="fixed z-10 top-0 left-0 w-full p-0">
        <div className="flex justify-between lg:justify-end items-baseline gap-2 w-full">
          {/* <PageHeader
            title="Exhibitions"
            count={filteredExhibitions.length}
            sortLabel={
              exhibitionSort === "title"
                ? "a–ö"
                : exhibitionSort === "type"
                  ? "Type"
                  : "Latest"
            }
            onSortClick={handleOpenExhibitionsFilter}
            filterLabel={
              [
                selectedType !== "all" ? selectedType : null,
                debouncedSelectedYear !== "all" ? debouncedSelectedYear : null,
              ]
                .filter(Boolean)
                .join(" · ") || undefined
            }
          /> */}
          <Button
            className={`font-bookish flex ${showExhibitionsFilter ? "bg-background" : "bg-transparent"}`}
            variant="link"
            size="lg"
            aria-expanded={showExhibitionsFilter}
            onClick={() => handleOpenExhibitionsFilter()}
          >
            Filter
          </Button>
          <Button
            className="font-bookish bg-transparent hidden lg:flex"
            variant="link"
            size="lg"
            aria-pressed={showAsList}
            onClick={() => setShowAsList((prev) => !prev)}
          >
            {showAsList ? "Grid" : "List"}
          </Button>
        </div>

        {showExhibitionsFilter && (
          <div className="bg-background">
            <ExFilter />
          </div>
        )}
      </div>

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => {
            setActiveExhibitionSlug(null);
            setOpen(true);
          }}
        />
      )}
    </section>
  );
}

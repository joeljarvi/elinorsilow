"use client";

import Hero from "@/components/Hero";
import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import { Cross1Icon, WidthIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import WorkModal from "@/app/works/WorkModal";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";
import WorksList from "@/components/WorksList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import HDivider from "@/components/HDivider";

type FilterKey =
  | "year-latest"
  | "year-oldest"
  | "title"
  | "painting"
  | "drawing"
  | "sculpture"
  | "textile";

const FILTER_OPTIONS: Record<
  FilterKey,
  { sort: WorkSort; filter: CategoryFilter; label: string }
> = {
  "year-latest": { sort: "year-latest", filter: "all", label: "Newest First" },
  "year-oldest": { sort: "year-oldest", filter: "all", label: "Oldest First" },
  title: { sort: "title", filter: "all", label: "Title A–Z" },
  painting: { sort: "year-latest", filter: "painting", label: "Painting" },
  drawing: { sort: "year-latest", filter: "drawing", label: "Drawing" },
  sculpture: { sort: "year-latest", filter: "sculpture", label: "Sculpture" },
  textile: { sort: "year-latest", filter: "textile", label: "Textile" },
};

export default function WorksPageClient() {
  const { allWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();

  const [filterKey, setFilterKey] = useState<FilterKey>("year-latest");
  const [showFilter, setShowFilter] = useState(false);
  const [col1AsList, setCol1AsList] = useState(false);
  const [col2AsList, setCol2AsList] = useState(false);
  const [col1Hidden, setCol1Hidden] = useState(false);
  const [col2Hidden, setCol2Hidden] = useState(false);

  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat in FILTER_OPTIONS) setFilterKey(cat as FilterKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const {
    setOpen,
    proportionalImages,
    setProportionalImages,
    showInfo,
    setShowInfo,
    navVisible,
  } = useUI();

  useEffect(() => {
    if (!workLoading) setDataLoaded(true);
  }, [workLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => setInitialAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  const loading = !initialAnimDone || !dataLoaded;

  const { sort, filter, label: activeLabel } = FILTER_OPTIONS[filterKey];

  const FILTER_KEYS = Object.keys(FILTER_OPTIONS) as FilterKey[];
  function cycleFilter() {
    const idx = FILTER_KEYS.indexOf(filterKey);
    setFilterKey(FILTER_KEYS[(idx + 1) % FILTER_KEYS.length]);
  }

  function getSortedWorks(): Work[] {
    const filtered =
      filter === "all"
        ? allWorks
        : allWorks.filter((w) => w.acf.category === filter);
    switch (sort) {
      case "year-latest":
        return [...filtered].sort((a, b) => b.acf.year - a.acf.year);
      case "year-oldest":
        return [...filtered].sort((a, b) => a.acf.year - b.acf.year);
      case "title":
        return [...filtered].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv"),
        );
      case "category":
        return [...filtered].sort((a, b) => {
          const cat = (a.acf.category ?? "").localeCompare(
            b.acf.category ?? "",
            "sv",
          );
          if (cat !== 0) return cat;
          return a.title.rendered.localeCompare(b.title.rendered, "sv");
        });
      default:
        return filtered;
    }
  }

  const works = getSortedWorks();
  const col1Works = works.filter((_, i) => i % 2 === 0);
  const col2Works = works.filter((_, i) => i % 2 === 1);

  function openWork(work: Work) {
    setActiveWorkSlug(work.slug);
    setOpen(false);
    window.history.pushState(null, "", `/works?work=${work.slug}`);
  }

  function renderWorkItem(work: Work) {
    return (
      <button
        onClick={() => openWork(work)}
        className="group relative cursor-pointer w-full flex flex-col gap-y-[18px] mb-[32px]"
        aria-label={`Show work: ${work.title.rendered}`}
      >
        <div className="relative h-[75vh]  w-full overflow-hidden">
          <CornerFrame />
          {work.image_url && (
            <div className="absolute inset-0 flex items-start lg:items-end">
              <ProportionalWorkImage
                src={work.image_url}
                alt={work.title.rendered}
                dimensions={work.acf.dimensions}
                proportional={proportionalImages}
              />
            </div>
          )}
        </div>
        {showInfo && <InfoBox work={work} />}
      </button>
    );
  }

  const filterSelect = (
    <Select
      value={filterKey}
      onValueChange={(v) => {
        setFilterKey(v as FilterKey);
        setShowFilter(false);
      }}
    >
      <SelectTrigger className="border-0 shadow-none bg-secondary text-neutral-600 dark:text-neutral-400 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="year-latest">Newest First</SelectItem>
        <SelectItem value="year-oldest">Oldest First</SelectItem>
        <SelectItem value="title">Title A–Z</SelectItem>
        <SelectItem value="painting">Painting</SelectItem>
        <SelectItem value="drawing">Drawing</SelectItem>
        <SelectItem value="sculpture">Sculpture</SelectItem>
        <SelectItem value="textile">Textile</SelectItem>
      </SelectContent>
    </Select>
  );

  const bothCols = !col1Hidden && !col2Hidden;

  return (
    <section
      className="relative w-full transition-[padding-top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{ paddingTop: navVisible ? "var(--nav-height, 0px)" : "0px" }}
    >
      {/* Mobile: Hero + divider + controls */}
      <div className="lg:hidden">
        <Hero />
        <HDivider />
        <div className="fixed bottom-0 left-0 z-20 flex items-center gap-x-8 px-[18px] py-[12px] bg-transparent">
          <Button
            variant="link"
            size="controls"
            className="px-0"
            onClick={() => setShowFilter((v) => !v)}
          >
            {showFilter ? (
              <>
                <Cross1Icon className="mr-1" />
                Filter
              </>
            ) : (
              "Filter"
            )}
          </Button>
          <Button
            variant="link"
            size="controls"
            className="px-0"
            onClick={() => {
              setCol1AsList((v) => !v);
              setCol2AsList((v) => !v);
            }}
          >
            {col1AsList ? "Back to Thumbnails" : "List"}
          </Button>
        </div>
      </div>

      <PageHeader
        title="Works"
        count={works.length}
        sortLabel={activeLabel}
        onSortClick={cycleFilter}
        loading={loading}
        controls={
          <div className="flex items-center gap-x-4 pr-[18px] w-full">
            <Button
              variant="link"
              size="controls"
              onClick={() => setShowFilter((v) => !v)}
            >
              {showFilter ? (
                <>
                  <Cross1Icon className="mr-1" />
                  Filter
                </>
              ) : (
                "Filter"
              )}
            </Button>
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden min-w-[180px]"
                >
                  {filterSelect}
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="link"
              size="controls"
              onClick={() => {
                setCol1AsList((v) => !v);
                setCol2AsList((v) => !v);
              }}
            >
              {col1AsList ? "Thumbnails" : "List"}
            </Button>
            <Button variant="link" onClick={() => setShowInfo(!showInfo)}>
              {showInfo ? "Hide text" : "Show text"}
            </Button>
            <Button
              variant="link"
              onClick={() => setProportionalImages(!proportionalImages)}
            >
              {proportionalImages ? "Full width" : "Proportional"}
            </Button>
          </div>
        }
      />

      {/* Columns */}
      <div
        className={`relative grid grid-cols-1 ${bothCols ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}
      >
        <div
          className={`px-[18px] pt-[18px] lg:px-[32px] lg:pt-[18px] ${col1Hidden ? "hidden" : ""}`}
        >
          {col1AsList ? (
            <WorksList works={col1Works} onSelect={openWork} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {col1Works.map((work) => (
                <div key={work.id}>{renderWorkItem(work)}</div>
              ))}
            </motion.div>
          )}
        </div>

        <div
          className={`px-[18px] pt-[18px] lg:px-[32px] lg:pt-[18px] ${col2Hidden ? "hidden" : "hidden lg:block"}`}
        >
          {col2AsList ? (
            <WorksList works={col2Works} onSelect={openWork} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="flex flex-col"
            >
              {col2Works.map((work) => (
                <div key={work.id}>{renderWorkItem(work)}</div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: filter select slide-up */}
      <AnimatePresence>
        {showFilter && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-[59]"
              onClick={() => setShowFilter(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] p-4 bg-background border-t border-foreground/[0.06] [&>*]:w-full"
            >
              {filterSelect}
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

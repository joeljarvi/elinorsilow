"use client";

import Hero from "@/components/Hero";
import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import WorkModal from "@/app/works/WorkModal";
import InfoBox from "@/components/InfoBox";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const WORKS_PER_SECTION = 8; // 4 cols × 2 rows

function getWorkWidth(dimensions?: string): string {
  if (!dimensions) return "100%";
  const match = dimensions.match(/(\d+(?:[.,]\d+)?)\s*[x×X]/);
  if (!match) return "100%";
  const w = parseFloat(match[1].replace(",", "."));
  return `${Math.max(0.2, Math.min(1.0, w / 200)) * 100}%`;
}

function WorkCard({ work, onOpen, isMobile }: { work: Work; onOpen: () => void; isMobile: boolean }) {
  const { proportionalImages } = useUI();
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showEnlarge, setShowEnlarge] = useState(false);
  const [mobileRevealed, setMobileRevealed] = useState(false);

  useEffect(() => {
    if (!hovered || proportionalImages) {
      setShowEnlarge(false);
      return;
    }
    const t = setTimeout(() => setShowEnlarge(true), 1500);
    return () => clearTimeout(t);
  }, [hovered, proportionalImages]);

  const cursorText =
    proportionalImages || showEnlarge ? "Click to enlarge" : "More info";
  const imageWidth = isMobile || proportionalImages
    ? "100%"
    : hovered
      ? "100%"
      : getWorkWidth(work.acf.dimensions);

  const handleClick = () => {
    if (window.innerWidth < 1024 && !mobileRevealed) {
      setMobileRevealed(true);
      return;
    }
    onOpen();
  };

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      onClick={handleClick}
      className="group block w-full lg:h-full cursor-none text-left"
      aria-label={`Show work: ${work.title.rendered}`}
    >
      <Card className="h-full rounded-none border-0 shadow-none flex flex-col bg-transparent gap-0">
        <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
          <div className="relative h-[75vh] lg:h-full w-full flex items-center justify-center lg:items-start lg:justify-start overflow-hidden">
            {work.image_url && (
              <div
                className="h-full transition-[width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ width: imageWidth }}
              >
                <ProportionalWorkImage
                  src={work.image_url}
                  alt={work.title.rendered}
                  dimensions={work.acf.dimensions}
                  proportional={false}
                />
              </div>
            )}
          </div>
        </CardContent>
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ease-out px-3 ${
            mobileRevealed ? "max-h-[120px]" : "max-h-0"
          } lg:max-h-0 lg:group-hover:max-h-[120px]`}
        >
          <InfoBox work={work} revealed={mobileRevealed} />
        </div>
      </Card>

      {/* Custom cursor — desktop only */}
      {hovered && (
        <div
          className="hidden lg:block fixed pointer-events-none z-[100] font-universNextPro text-[11px] tracking-wide"
          style={{
            left: mousePos.x + 14,
            top: mousePos.y,
            transform: "translateY(-50%)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={cursorText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {cursorText}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </button>
  );
}

export default function WorksPageClient() {
  const { allWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();
  const { setOpen, navVisible, proportionalImages, setProportionalImages } =
    useUI();

  const [filterKey, setFilterKey] = useState<FilterKey>("year-latest");
  const [showFilter, setShowFilter] = useState(false);
  const [atWorks, setAtWorks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () =>
      setAtWorks(window.scrollY >= window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat in FILTER_OPTIONS) setFilterKey(cat as FilterKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!workLoading) setDataLoaded(true);
  }, [workLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => setInitialAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  // Enable snap scrolling on desktop only
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.documentElement.style.scrollSnapType = "y mandatory";
      document.documentElement.style.scrollPaddingTop =
        "var(--nav-height, 64px)";
    }
    return () => {
      document.documentElement.style.scrollSnapType = "";
      document.documentElement.style.scrollPaddingTop = "";
    };
  }, []);

  const loading = !initialAnimDone || !dataLoaded;

  const { sort, filter } = FILTER_OPTIONS[filterKey];

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
      default:
        return filtered;
    }
  }

  const works = getSortedWorks();

  const CATEGORIES: CategoryFilter[] = ["all", "painting", "drawing", "sculpture", "textile"];
  const SORTS: WorkSort[] = ["year-latest", "year-oldest", "title"];
  const CATEGORY_LABELS: Record<string, string> = { all: "all works", painting: "painting", drawing: "drawing", sculpture: "sculpture", textile: "textile" };
  const SORT_LABELS: Record<string, string> = { "year-latest": "latest", "year-oldest": "oldest", title: "A–Z" };

  const currentCategory = filter;
  const currentSort = sort;

  const cycleCategory = () => {
    const next = CATEGORIES[(CATEGORIES.indexOf(currentCategory) + 1) % CATEGORIES.length];
    setFilterKey(next === "all" ? (currentSort as FilterKey) : (next as FilterKey));
  };

  const cycleSort = () => {
    const next = SORTS[(SORTS.indexOf(currentSort) + 1) % SORTS.length];
    setFilterKey(next as FilterKey);
  };

  const chunks: Work[][] = [];
  for (let i = 0; i < works.length; i += WORKS_PER_SECTION) {
    chunks.push(works.slice(i, i + WORKS_PER_SECTION));
  }

  function openWork(work: Work) {
    setActiveWorkSlug(work.slug);
    setOpen(false);
    window.history.pushState(null, "", `/works?work=${work.slug}`);
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

  return (
    <section
      className="relative w-full transition-[padding-top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{ paddingTop: navVisible ? "var(--nav-height, 0px)" : "0px" }}
    >
      {/* Page header — fixed below nav, visible in works section */}
      <AnimatePresence>
        {atWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[70] w-full pointer-events-none flex flex-col items-center lg:grid lg:grid-cols-4 lg:items-start px-[18px] lg:px-0 pt-[18px] lg:pt-[12px] gap-y-0.5 lg:gap-y-0"
            style={{ top: "var(--nav-height, 64px)" }}
          >
            {/* Col 1 — category + count */}
            <p className="lg:pl-[33px] text-[16px] font-timesNewRoman">
              <button
                className="font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
                onClick={cycleCategory}
              >
                {CATEGORY_LABELS[currentCategory]}
              </button>{" "}
              ({loading ? "—" : works.length})
            </p>

            {/* Col 3 — sort */}
            <p className="lg:col-start-3 lg:pl-[15px] text-[16px] font-timesNewRoman">
              Sorted by{" "}
              <button
                className="font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
                onClick={cycleSort}
              >
                {SORT_LABELS[currentSort]}
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero snap section */}
      <div className="lg:snap-start flex flex-col h-[calc(100svh-var(--nav-height,64px))]">
        <div className="flex-1 overflow-hidden">
          <Hero />
        </div>
        <AnimatePresence>
          {!atWorks && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center lg:items-start gap-1.5 pb-6 animate-pulse px-[32px]"
            >
              <span className="text-[18px] font-universNextProExt font-extrabold text-muted-foreground">
                scroll down
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Works grid — chunks of 8 (4 cols × 2 rows) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {chunks.map((chunk, chunkIndex) => (
          <div
            key={chunkIndex}
            className="lg:snap-start  lg:h-[calc(100svh-var(--nav-height,64px))] "
          >
            <div className="border-x border-foreground grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 lg:h-full px-[32px] gap-x-[32px] place-items-center lg:place-items-start">
              {chunk.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  isMobile={isMobile}
                  onOpen={() => openWork(work)}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filter — desktop (fixed bottom right) */}
      <AnimatePresence>
        {atWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex fixed bottom-4 right-6 z-20 items-center gap-x-3"
          >
            <Button
              variant="link"
              size="controls"
              onClick={() => setProportionalImages(!proportionalImages)}
            >
              {proportionalImages ? "Proportional" : "Full width"}
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
          </motion.div>
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

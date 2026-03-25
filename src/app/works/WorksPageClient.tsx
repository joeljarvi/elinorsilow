"use client";

import Hero from "@/components/Hero";
import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import WorkModal from "@/app/works/WorkModal";
import InfoBox from "@/components/InfoBox";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import { Card, CardContent } from "@/components/ui/card";

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

function WorkCard({
  work,
  onOpen,
  isMobile,
  revealIndex = 0,
}: {
  work: Work;
  onOpen: () => void;
  isMobile: boolean;
  revealIndex?: number;
}) {
  const { proportionalImages } = useUI();
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [infoOpen, setInfoOpen] = useState(false);

  const imageWidth =
    isMobile || proportionalImages
      ? "100%"
      : hovered
        ? "100%"
        : getWorkWidth(work.acf.dimensions);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      className="group block w-full lg:h-full text-left"
    >
      <Card className="h-full rounded-none border-0 shadow-none bg-transparent">
        <CardContent className="p-0 h-full">
          <div className="h-[75vh] lg:h-full w-full flex flex-col overflow-hidden p-8 pb-0">
            <button
              onClick={onOpen}
              className="flex-1 relative cursor-none"
              aria-label={`Show work: ${work.title.rendered}`}
            >
              <div
                className="h-full relative transition-[width] duration-700 ease-in-out"
                style={{ width: imageWidth }}
              >
                {work.image_url && (
                  <ProportionalWorkImage
                    src={work.image_url}
                    alt={work.title.rendered}
                    revealIndex={revealIndex}
                    dimensions={work.acf.dimensions}
                    proportional={false}
                  />
                )}
              </div>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-out px-3 ${
                infoOpen ? "max-h-[120px]" : "max-h-0"
              }`}
            >
              <InfoBox work={work} revealed={infoOpen} />
            </div>
            <div className="flex justify-center py-2">
              <button
                className={`font-timesNewRoman font-bold text-[16px] text-foreground transition-opacity duration-300 pointer-events-auto ${hovered || infoOpen ? "opacity-100" : "opacity-0"}`}
                onClick={() => setInfoOpen((v) => !v)}
              >
                {infoOpen ? "(less)" : "(more info)"}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom cursor — desktop only */}
      {hovered && (
        <div
          className="hidden lg:flex fixed pointer-events-none z-[100] font-timesNewRoman text-[16px] items-center"
          style={{
            left: mousePos.x + 14,
            top: mousePos.y,
            transform: "translateY(-50%)",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            Click to enlarge
          </motion.span>
        </div>
      )}
    </div>
  );
}

export default function WorksPageClient() {
  const { allWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();
  const { setOpen, navVisible, proportionalImages, showInfo, setShowInfo } =
    useUI();
  const [asList, setAsList] = useState(false);

  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const [filterKey, setFilterKey] = useState<FilterKey>("year-latest");
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

  // Track page header height as a CSS variable
  useEffect(() => {
    const el = pageHeaderRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--page-header-height", `${entry.contentRect.height}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  const CATEGORIES: CategoryFilter[] = [
    "all",
    "painting",
    "drawing",
    "sculpture",
    "textile",
  ];
  const SORTS: WorkSort[] = ["year-latest", "year-oldest", "title"];
  const CATEGORY_LABELS: Record<string, string> = {
    all: "all works",
    painting: "painting",
    drawing: "drawing",
    sculpture: "sculpture",
    textile: "textile",
  };
  const SORT_LABELS: Record<string, string> = {
    "year-latest": "latest",
    "year-oldest": "oldest",
    title: "A–Z",
  };

  const currentCategory = filter;
  const currentSort = sort;

  const cycleCategory = () => {
    const next =
      CATEGORIES[(CATEGORIES.indexOf(currentCategory) + 1) % CATEGORIES.length];
    setFilterKey(
      next === "all" ? (currentSort as FilterKey) : (next as FilterKey),
    );
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
            ref={pageHeaderRef}
            className="fixed z-[70] pointer-events-none flex flex-row items-end gap-x-4 px-[18px] w-full justify-center top-[var(--nav-height,64px)] pt-[18px] lg:top-auto lg:bottom-0 lg:left-0 lg:justify-start lg:pt-0 lg:pb-[18px] lg:w-auto"

          >
            {/* Category + count */}
            <p className="text-[16px] font-timesNewRoman">
              <button
                className="font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
                onClick={cycleCategory}
              >
                {CATEGORY_LABELS[currentCategory]}
              </button>{" "}
              ({loading ? "—" : works.length})
            </p>

            {/* Sort */}
            <p className="text-[16px] font-timesNewRoman">
              Sorted by{" "}
              <button
                className="font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
                onClick={cycleSort}
              >
                ({SORT_LABELS[currentSort]})
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero snap section */}
      <div className="lg:snap-start flex flex-col h-[75vh]">
        <div className="flex-1 overflow-hidden">
          <Hero />
        </div>
        <AnimatePresence>
          {!atWorks && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden lg:flex justify-start pb-6 animate-pulse px-[32px]"
            >
              <span className="font-timesNewRoman font-bold text-[18px] text-foreground">
                (scroll down)
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Works grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {asList ? (
          <div className="flex flex-col pt-4 px-[18px] lg:px-[32px]">
            {works.map((work) => (
              <Button key={work.id} variant="ghost" size="controls" onClick={() => openWork(work)} className="w-full rounded-none justify-start">
                {work.title.rendered}
              </Button>
            ))}
          </div>
        ) : (
          chunks.map((chunk, chunkIndex) => (
            <div
              key={chunkIndex}
              className="lg:snap-start"
              style={!isMobile ? { height: "150vh" } : undefined}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 lg:h-full place-items-center lg:place-items-start">
                {chunk.map((work, workIndex) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    isMobile={isMobile}
                    revealIndex={chunkIndex * 8 + workIndex}
                    onOpen={() => openWork(work)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </motion.div>


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

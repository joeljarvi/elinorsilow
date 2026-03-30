"use client";

import Hero from "@/components/Hero";
import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WorkModal from "@/app/works/WorkModal";
import InfoBox from "@/components/InfoBox";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import { Card, CardContent } from "@/components/ui/card";
import { OGubbeText } from "@/components/OGubbeText";
import RowSlide from "@/components/RowSlide";

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

function WorkCard({
  work,
  onOpen,
  isMobile,
  showInfo,
  revealIndex = 0,
  proportional = true,
}: {
  work: Work;
  onOpen: () => void;
  isMobile: boolean;
  showInfo: boolean;
  revealIndex?: number;
  proportional?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const cursor = hovered && !isMobile && (
    <div
      className="fixed pointer-events-none z-[100] font-universNextProExt font-extrabold text-[16px] flex items-center"
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
  );

  // Desktop + showInfo: InfoBox at top, proportional image below
  if (!isMobile && showInfo) {
    return (
      <div
        className="flex flex-col py-[18px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <div className="px-0 pb-[9px]">
          <InfoBox work={work} />
        </div>
        <button
          onClick={onOpen}
          className="block w-full cursor-none p-0 pt-0"
          aria-label={`Show work: ${work.title.rendered}`}
        >
          {work.image_url && (
            <ProportionalWorkImage
              src={work.image_url}
              alt={work.title.rendered}
              revealIndex={revealIndex}
              dimensions={work.acf.dimensions}
              proportional={true}
            />
          )}
        </button>
        {cursor}
      </div>
    );
  }

  // Desktop + no showInfo: proportional image, click to open
  if (!isMobile && !showInfo) {
    return (
      <div
        className="w-full p-3"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      >
        <button
          onClick={onOpen}
          className="block w-full cursor-none"
          aria-label={`Show work: ${work.title.rendered}`}
        >
          {work.image_url && (
            <ProportionalWorkImage
              src={work.image_url}
              alt={work.title.rendered}
              revealIndex={revealIndex}
              dimensions={work.acf.dimensions}
              proportional={proportional}
            />
          )}
        </button>
        {cursor}
      </div>
    );
  }

  // Mobile
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block w-full text-left"
    >
      <Card className="rounded-none border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="w-full flex flex-col  pb-0">
            {showInfo && (
              <div className="px-0 pb-[9px]">
                <InfoBox work={work} />
              </div>
            )}
            <button
              onClick={onOpen}
              className="h-[75vh] relative cursor-none"
              aria-label={`Show work: ${work.title.rendered}`}
            >
              <div className="h-full relative">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WorksPageClient() {
  const { allWorks, setActiveWorkSlug, activeWorkSlug, workLoading } =
    useWorks();
  const { setOpen, showInfo, setShowInfo } = useUI();
  const [asList, setAsList] = useState(false);
  const [gridCols, setGridCols] = useState(4);
  const [proportional, setProportional] = useState(true);
  const [showSettings, setShowSettings] = useState(true);

  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const [filterKey, setFilterKey] = useState<FilterKey>("year-latest");
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [worksOverlayOpacity, setWorksOverlayOpacity] = useState(0);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const worksStart = vh * 0.85;
      setHeroOpacity(Math.max(0, 1 - sy / (vh * 0.4)));
      setHeaderOpacity(
        Math.min(1, Math.max(0, (sy - (worksStart - vh * 0.2)) / (vh * 0.2))),
      );
      // Works overlay: fade in as approaching works, fade out as scrolling through
      if (sy < worksStart - vh * 0.15) {
        setWorksOverlayOpacity(0);
      } else if (sy < worksStart) {
        setWorksOverlayOpacity((sy - (worksStart - vh * 0.15)) / (vh * 0.15));
      } else {
        setWorksOverlayOpacity(Math.max(0, 1 - (sy - worksStart) / (vh * 0.4)));
      }
    };
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
      document.documentElement.style.setProperty(
        "--page-header-height",
        `${entry.contentRect.height}px`,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
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

  function openWork(work: Work) {
    setActiveWorkSlug(work.slug);
    setOpen(false);
    window.history.pushState(null, "", `/works?work=${work.slug}`);
  }

  return (
    <section className="relative w-full transition-[padding-top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]">
      {/* "elinor silow" overlay — fades out as user scrolls */}
      <div
        className="fixed inset-0 z-[50] flex items-center justify-center pointer-events-none "
        style={{ opacity: heroOpacity }}
      >
        <OGubbeText
          text="elinor silow"
          loading={loading}
          className="text-[40px] lg:text-[96px] text-foreground/20"
          sizes="144px"
        />
      </div>

      {/* "works" overlay — fades in approaching works, fades out scrolling through */}
      <div
        className="fixed hidden inset-0 z-[50] lg:flex items-center justify-center pointer-events-none "
        style={{ opacity: worksOverlayOpacity }}
      >
        <OGubbeText
          text="Works"
          className="text-[40px] lg:text-[96px]"
          sizes="144px"
        />
      </div>

      {/* Hero section */}
      <div className="lg:snap-start h-screen">
        <Hero />
      </div>

      {/* Page header — fixed at bottom, fades in as works grid enters */}
      <div
        ref={pageHeaderRef}
        className="fixed bottom-0 left-0 z-[60] pointer-events-none flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-1 px-[18px] lg:pr-[64px] pl-[18px] pb-[9px] lg:pb-0 lg:pl-[9px] pt-[9px] w-full bg-gradient-to-t from-background to-background/0 "
        style={{ opacity: loading ? 0 : headerOpacity }}
      >
        {showSettings && (
          <>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0"
              onClick={cycleSort}
            >
              ({SORT_LABELS[currentSort]})
            </Button>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0"
              onClick={cycleCategory}
            >
              ({CATEGORY_LABELS[currentCategory]})
            </Button>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0"
              onClick={() => setAsList((v) => !v)}
            >
              {asList ? "(list)" : "(grid)"}
            </Button>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0 hidden lg:flex"
              onClick={() => setProportional((v) => !v)}
            >
              {proportional ? "(proportional)" : "(fill)"}
            </Button>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0 flex lg:hidden"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "(text)" : "(no text)"}
            </Button>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0 hidden lg:flex"
              onClick={() => setGridCols((c) => Math.max(2, c - 1))}
            >
              (−)
            </Button>
            <Button
              variant="link"
              size="controls"
              className="pointer-events-auto px-0 hidden lg:flex"
              onClick={() => setGridCols((c) => Math.min(14, c + 1))}
            >
              (+)
            </Button>
            <Button
              variant="link"
              size="controls"
              className="hidden lg:flex pointer-events-auto px-0"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "(show text)" : "(hide text)"}
            </Button>
          </>
        )}
        <Button
          variant="link"
          size="controls"
          className="pointer-events-auto px-0 text-muted-foreground"
          onClick={() => setShowSettings((v) => !v)}
        >
          <span className="lg:hidden">
            {showSettings ? "(close)" : "(settings)"}
          </span>
          <span className="hidden lg:inline">
            {showSettings ? "(hide settings)" : "(settings)"}
          </span>
        </Button>
      </div>

      {/* Works grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {asList ? (
          <div className="flex flex-col pt-4">
            {works.map((work) => (
              <RowSlide key={work.id}>
                <Button
                  variant="ghost"
                  size="controls"
                  onClick={() => openWork(work)}
                  className="w-full rounded-none justify-center font-universNextProExt font-extrabold text-[14px] lg:text-[18px]"
                >
                  {work.title.rendered}
                </Button>
              </RowSlide>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop grid — row-based for per-row slide animation */}
            <div className="hidden lg:block pr-[64px] ">
              {Array.from(
                { length: Math.ceil(works.length / gridCols) },
                (_, rowIndex) => {
                  const rowWorks = works.slice(
                    rowIndex * gridCols,
                    (rowIndex + 1) * gridCols,
                  );
                  return (
                    <RowSlide key={rowIndex} className="flex flex-row">
                      {rowWorks.map((work, colIndex) => (
                        <div
                          key={work.id}
                          style={{ width: `${100 / gridCols}%` }}
                          className={
                            showInfo ? "border-foreground/20 border-t-2" : ""
                          }
                        >
                          <WorkCard
                            work={work}
                            isMobile={false}
                            showInfo={showInfo}
                            revealIndex={rowIndex * gridCols + colIndex}
                            proportional={proportional}
                            onOpen={() => openWork(work)}
                          />
                        </div>
                      ))}
                    </RowSlide>
                  );
                },
              )}
            </div>

            {/* Mobile grid — per-card slide animation */}
            <div className="lg:hidden flex flex-col">
              {works.map((work, i) => (
                <RowSlide key={work.id}>
                  <WorkCard
                    work={work}
                    isMobile={true}
                    showInfo={showInfo}
                    revealIndex={i}
                    onOpen={() => openWork(work)}
                  />
                </RowSlide>
              ))}
            </div>
          </>
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

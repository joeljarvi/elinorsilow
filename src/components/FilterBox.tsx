"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import {
  useExhibitions,
  ExCategory,
  ExSort,
} from "@/context/ExhibitionsContext";
import WigglyButton from "./WigglyButton";
import { useTheme } from "next-themes";

const transition = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

/* -------------------- SHARED UI -------------------- */

function FilterLabel({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={`font-timesNewRoman font-normal lowercase text-[18px] lg:text-[21px] text-muted-foreground tracking-widest mx-[32px] pb-[4px] px-[0px] block text-center lg:text-left ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------- DATA -------------------- */

const WORK_SORTS = [
  { value: "year-latest", label: "Latest" },
  { value: "year-oldest", label: "Oldest" },
  { value: "title", label: "A–Z" },
];

const WORK_CATS = [
  { value: "all", label: "All" },
  { value: "painting", label: "Painting" },
  { value: "drawing", label: "Drawing" },
  { value: "sculpture", label: "Sculpture" },
  { value: "textile", label: "Textile" },
];

const EX_SORTS = [
  { value: "year-latest", label: "Latest" },
  { value: "year-oldest", label: "Oldest" },
  { value: "title", label: "A–Z" },
];

const EX_CATS = [
  { value: "all", label: "All" },
  { value: "solo", label: "Solo" },
  { value: "group", label: "Group" },
];

/* -------------------- CONTROLS -------------------- */

function WorksControls() {
  const { workSort, setWorkSort, categoryFilter, setCategoryFilter } =
    useWorks();
  const {
    showAsList,
    setShowAsList,
    gridCols,
    setGridCols,
    showColorBg,
    setShowColorBg,
  } = useUI();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-y-[44px] lg:grid lg:grid-cols-3 lg:gap-y-0 w-full pt-[18px] pb-[18px] justify-center items-center lg:items-start">
      <div>
        <FilterLabel>Sort by</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-start mt-[9px] px-[18px]">
          {WORK_SORTS.map((s) => (
            <WigglyButton
              key={s.value}
              text={s.label}
              onClick={() => setWorkSort(s.value as WorkSort)}
              className={workSort === s.value ? "text-foreground" : "text-muted-foreground"}
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Filter by category</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-start mt-[9px] px-[18px]">
          {WORK_CATS.map((c) => (
            <WigglyButton
              key={c.value}
              text={c.label}
              onClick={() => setCategoryFilter(c.value as CategoryFilter)}
              className={categoryFilter === c.value ? "text-foreground" : "text-muted-foreground"}
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Settings</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-start mt-[9px] px-[18px]">
          <WigglyButton
            text="Grid"
            onClick={() => setShowAsList(false)}
            className={!showAsList ? "text-foreground" : "text-muted-foreground"}
          />
          <WigglyButton
            text="List"
            onClick={() => setShowAsList(true)}
            className={showAsList ? "text-foreground" : "text-muted-foreground"}
          />
          {!showAsList && (
            <>
              <WigglyButton text="Columns" className="text-muted-foreground" />
              <WigglyButton
                text="−"
                onClick={() => setGridCols(Math.max(1, gridCols - 1))}
                className="text-foreground"
              />
              <WigglyButton text={gridCols.toString()} className="text-foreground" />
              <WigglyButton
                text="+"
                onClick={() => setGridCols(Math.min(8, gridCols + 1))}
                className="text-foreground"
              />
            </>
          )}
          <WigglyButton
            text={showColorBg ? "B/W" : "COLOR"}
            onClick={() => setShowColorBg(!showColorBg)}
            className={showColorBg ? "text-foreground" : "text-muted-foreground"}
          />
          <WigglyButton
            text={theme === "dark" ? "light" : "dark"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

function ExhibitionsControls() {
  const { exCat, setExCat, exSort, setExSort } = useExhibitions();

  return (
    <div className="flex flex-col gap-y-[44px] lg:grid lg:grid-cols-3 lg:gap-y-0 w-full pt-[18px] pb-[18px] items-center lg:items-start">
      <div>
        <FilterLabel>Sort</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-start mt-[9px] lg:mt-[18px] px-[18px]">
          {EX_SORTS.map((s) => (
            <WigglyButton
              key={s.value}
              text={s.label}
              onClick={() => setExSort(s.value as ExSort)}
              className={
                exSort === s.value ? "text-foreground" : "text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Type</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-start mt-[9px] lg:mt-[18px] px-[18px]">
          {EX_CATS.map((c) => (
            <WigglyButton
              key={c.value}
              text={c.label}
              onClick={() => setExCat(c.value as ExCategory)}
              className={
                exCat === c.value ? "text-foreground" : "text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterContent() {
  const { activePage } = useUI();
  return activePage === "exhibitions" ? (
    <ExhibitionsControls />
  ) : (
    <WorksControls />
  );
}

/* -------------------- MAIN -------------------- */

export default function FilterBox() {
  const { filterOpen, handleFilterOpen } = useUI();

  const drawerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(0);

  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    const measure = () => setDrawerHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none px-[0px] lg:px-0">
      <motion.div
        animate={{ y: filterOpen ? 0 : drawerHeight }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="pointer-events-auto flex flex-col items-center  lg:items-end w-full lg:w-auto"
      >
        {/* External toggle button — visible when closed, slides off on mobile when open */}
        <WigglyButton
          text={filterOpen ? "close" : "filter"}
          onClick={handleFilterOpen}
          className="px-[18px] mb-[8px]"
        />

        {/* DRAWER */}
        <div
          ref={drawerRef}
          className="bg-background shadow-lg w-full lg:max-w-6xl h-screen lg:h-auto flex flex-col lg:block overflow-hidden"
        >
          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto lg:max-h-[75vh] flex flex-col justify-center lg:block pt-[32px] lg:pt-[32px] pb-[18px]">
            <FilterContent />
          </div>

          {/* Mobile close button — bottom center */}
          <div className="lg:hidden flex-shrink-0 flex justify-center pb-[18px]">
            <WigglyButton text="close" onClick={handleFilterOpen} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

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
      className={`font-timesNewRoman font-normal lowercase text-[16px] lg:text-[18px] text-muted-foreground tracking-widest mx-[0px] pb-[0px] px-[18px] block text-center lg:text-right ${className}`}
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

function WorksControls({ onMobileSelect }: { onMobileSelect: () => void }) {
  const { workSort, setWorkSort, categoryFilter, setCategoryFilter } =
    useWorks();
  const {
    showAsList,
    setShowAsList,
    gridCols,
    setGridCols,
    gridRows,
    setGridRows,
    showColorBg,
    setShowColorBg,
    textBlurred,
    setTextBlurred,
  } = useUI();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-y-[44px] lg:gap-y-[64px] w-full pt-[18px] pb-[18px] justify-center items-center lg:items-end lg:justify-end">
      <div>
        <FilterLabel>Sort by</FilterLabel>
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end mt-[0px] px-[9px]">
          {WORK_SORTS.map((s) => (
            <WigglyButton
              key={s.value}
              text={s.label}
              size="text-[16px] lg:text-[18px]"
              active={workSort === s.value}
              onClick={() => {
                setWorkSort(s.value as WorkSort);
                onMobileSelect();
              }}
              className={
                workSort === s.value
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Filter by</FilterLabel>
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end lg:items-end mt-[0px] px-[9px]">
          {WORK_CATS.map((c) => (
            <WigglyButton
              key={c.value}
              text={c.label}
              size="text-[16px] lg:text-[18px]"
              active={categoryFilter === c.value}
              onClick={() => {
                setCategoryFilter(c.value as CategoryFilter);
                onMobileSelect();
              }}
              className={
                categoryFilter === c.value
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Settings</FilterLabel>
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end lg:items-end mt-[0px] px-[9px]">
          <WigglyButton
            text={showAsList ? "hide list" : "show list"}
            size="text-[16px] lg:text-[18px]"
            active={showAsList}
            onClick={() => {
              setShowAsList(!showAsList);
              onMobileSelect();
            }}
            className={showAsList ? "text-foreground" : "text-muted-foreground"}
          />
          <span className="flex">
            <WigglyButton
              text="Cols"
              size="text-[16px] lg:text-[18px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="−"
              size="text-[16px] lg:text-[18px]"
              onClick={() => setGridCols(Math.max(1, gridCols - 1))}
              className="text-foreground"
            />
            <WigglyButton
              text={gridCols.toString()}
              size="text-[16px] lg:text-[18px]"
              className="text-foreground"
            />
            <WigglyButton
              text="+"
              size="text-[16px] lg:text-[18px]"
              onClick={() => setGridCols(Math.min(4, gridCols + 1))}
              className="text-foreground"
            />
          </span>
          <span className="flex">
            <WigglyButton
              text="Rows"
              size="text-[16px] lg:text-[18px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="−"
              size="text-[16px] lg:text-[18px]"
              onClick={() => setGridRows(Math.max(1, gridRows - 1))}
              className="text-foreground"
            />
            <WigglyButton
              text={gridRows.toString()}
              size="text-[16px] lg:text-[18px]"
              className="text-foreground"
            />
            <WigglyButton
              text="+"
              size="text-[16px] lg:text-[18px]"
              onClick={() => setGridRows(Math.min(4, gridRows + 1))}
              className="text-foreground"
            />
          </span>
          <WigglyButton
            text={showColorBg ? "B/W" : "COLOR"}
            size="text-[16px] lg:text-[18px]"
            active={showColorBg}
            onClick={() => {
              setShowColorBg(!showColorBg);
              onMobileSelect();
            }}
            className={showColorBg ? "text-foreground" : "text-muted-foreground"}
          />
          <WigglyButton
            text={textBlurred ? "unblur" : "blur text"}
            size="text-[16px] lg:text-[18px]"
            active={textBlurred}
            onClick={() => {
              setTextBlurred(!textBlurred);
              onMobileSelect();
            }}
            className={textBlurred ? "text-foreground" : "text-muted-foreground"}
          />
          <WigglyButton
            text={theme === "dark" ? "light" : "dark"}
            size="text-[16px] lg:text-[18px]"
            onClick={() => {
              setTheme(theme === "dark" ? "light" : "dark");
              onMobileSelect();
            }}
            className="text-foreground"
          />
        </div>
      </div>
    </div>
  );
}

function ExhibitionsControls({ onMobileSelect }: { onMobileSelect: () => void }) {
  const { exCat, setExCat, exSort, setExSort, exAsList, setExAsList } =
    useExhibitions();
  const { exGridCols, setExGridCols, exGridRows, setExGridRows } = useUI();

  return (
    <div className="flex flex-col gap-y-[44px] lg:gap-y-[9px] w-full pt-[18px] pb-[18px] items-center lg:items-end">
      <div>
        <FilterLabel>Sort</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-end mt-[9px] px-[18px] lg:px-[9px]">
          {EX_SORTS.map((s) => (
            <WigglyButton
              key={s.value}
              text={s.label}
              size="text-[18px]"
              active={exSort === s.value}
              onClick={() => {
                setExSort(s.value as ExSort);
                onMobileSelect();
              }}
              className={
                exSort === s.value ? "text-foreground" : "text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Type</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-end mt-[9px] px-[18px] lg:px-[9px]">
          {EX_CATS.map((c) => (
            <WigglyButton
              key={c.value}
              text={c.label}
              size="text-[18px]"
              active={exCat === c.value}
              onClick={() => {
                setExCat(c.value as ExCategory);
                onMobileSelect();
              }}
              className={
                exCat === c.value ? "text-foreground" : "text-muted-foreground"
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Settings</FilterLabel>
        <div className="flex flex-wrap justify-center lg:justify-end mt-[9px] px-[0px] lg:px-[9px]">
          <WigglyButton
            text={exAsList ? "hide list" : "show list"}
            size="text-[18px]"
            active={exAsList}
            onClick={() => {
              setExAsList(!exAsList);
              onMobileSelect();
            }}
            className={exAsList ? "text-foreground" : "text-muted-foreground"}
          />
          <span className="flex">
            <WigglyButton text="Cols" size="text-[18px]" className="text-muted-foreground" />
            <WigglyButton text="−" size="text-[18px]" onClick={() => setExGridCols(Math.max(1, exGridCols - 1))} className="text-foreground" />
            <WigglyButton text={exGridCols.toString()} size="text-[18px]" className="text-foreground" />
            <WigglyButton text="+" size="text-[18px]" onClick={() => setExGridCols(Math.min(4, exGridCols + 1))} className="text-foreground" />
          </span>
          <span className="flex">
            <WigglyButton text="Rows" size="text-[18px]" className="text-muted-foreground" />
            <WigglyButton text="−" size="text-[18px]" onClick={() => setExGridRows(Math.max(1, exGridRows - 1))} className="text-foreground" />
            <WigglyButton text={exGridRows.toString()} size="text-[18px]" className="text-foreground" />
            <WigglyButton text="+" size="text-[18px]" onClick={() => setExGridRows(Math.min(4, exGridRows + 1))} className="text-foreground" />
          </span>
        </div>
      </div>
    </div>
  );
}

function FilterContent({ onMobileSelect }: { onMobileSelect: () => void }) {
  const { activePage } = useUI();
  return activePage === "exhibitions" ? (
    <ExhibitionsControls onMobileSelect={onMobileSelect} />
  ) : (
    <WorksControls onMobileSelect={onMobileSelect} />
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

  // On mobile, close the filter drawer after any selection
  function handleMobileSelect() {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      handleFilterOpen();
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-auto z-[50] flex justify-center lg:justify-end pointer-events-none px-[0px] lg:px-0">
      <motion.div
        animate={{ y: filterOpen ? 0 : drawerHeight }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="pointer-events-auto flex flex-col items-center lg:items-end w-full lg:w-auto"
      >
        {/* DRAWER */}
        <div
          ref={drawerRef}
          className="bg-background lg:bg-transparent w-full h-dvh flex flex-col justify-end overflow-hidden"
        >
          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center lg:justify-end pt-[32px] lg:pt-[18px] pb-[18px]">
            <FilterContent onMobileSelect={handleMobileSelect} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

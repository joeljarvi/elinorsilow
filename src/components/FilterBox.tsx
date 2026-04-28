"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
      className={`font-timesNewRoman font-normal  text-[18px] lg:text-[16px]  text-foreground tracking-wider mx-[0px] pb-[0px] px-[18px] block text-center lg:text-right  ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------- DATA -------------------- */

const WORK_SORTS = [
  { value: "year-latest", label: "Latest" },
  { value: "year-oldest", label: "Oldest" },
  { value: "title", label: "A–Ö" },
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
  { value: "title", label: "A–Ö" },
];

const EX_CATS = [
  { value: "all", label: "All" },
  { value: "solo", label: "Solo" },
  { value: "group", label: "Group " },
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-y-[44px] lg:gap-y-[9px] w-full pt-[18px] pb-[18px] justify-center items-center lg:items-end lg:justify-end">
      <div>
        <FilterLabel>Sort by</FilterLabel>
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end mt-[0px] px-[9px]">
          {WORK_SORTS.map((s) => (
            <WigglyButton
              key={s.value}
              text={s.label}
              size="text-[24px] lg:text-[16px]"
              active={workSort === s.value}
              onClick={() => {
                setWorkSort(s.value as WorkSort);
                onMobileSelect();
              }}
              className={
                workSort === s.value
                  ? "text-foreground "
                  : "text-muted-foreground "
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
              size="text-[24px] lg:text-[16px]"
              active={categoryFilter === c.value}
              onClick={() => {
                setCategoryFilter(c.value as CategoryFilter);
                onMobileSelect();
              }}
              className={
                categoryFilter === c.value
                  ? "text-foreground "
                  : "text-muted-foreground "
              }
            />
          ))}
        </div>
      </div>

      <div>
        <FilterLabel>Settings</FilterLabel>
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end lg:items-end mt-[0px] px-[9px]">
          <WigglyButton
            text={showAsList ? "Hide list" : "Show list"}
            size="text-[24px] lg:text-[16px]"
            active={showAsList}
            onClick={() => {
              setShowAsList(!showAsList);
              onMobileSelect();
            }}
            className={
              showAsList ? "text-foreground " : "text-muted-foreground "
            }
          />
          <span className="hidden lg:flex">
            <WigglyButton
              text="Columns"
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="−"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setGridCols(Math.max(1, gridCols - 1))}
              className="text-muted-foreground"
            />
            <WigglyButton
              text={gridCols.toString()}
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="+"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setGridCols(Math.min(4, gridCols + 1))}
              className="text-muted-foreground"
            />
          </span>
          <span className="hidden lg:flex">
            <WigglyButton
              text="Rows"
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="−"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setGridRows(Math.max(1, gridRows - 1))}
              className="text-foreground"
            />
            <WigglyButton
              text={gridRows.toString()}
              size="text-[18px] lg:text-[16px]"
              className="text-foreground"
            />
            <WigglyButton
              text="+"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setGridRows(Math.min(4, gridRows + 1))}
              className="text-foreground"
            />
          </span>
          <WigglyButton
            text={showColorBg ? "Color" : "B/W"}
            size="text-[24px] lg:text-[16px]"
            active={true}
            onClick={() => {
              setShowColorBg(!showColorBg);
              onMobileSelect();
            }}
            className={`text-foreground flex lg:hidden`}
          />
          <WigglyButton
            text={textBlurred ? "Unblur" : "Blur text"}
            size="text-[24px] lg:text-[16px]"
            active={textBlurred}
            onClick={() => {
              setTextBlurred(!textBlurred);
              onMobileSelect();
            }}
            className={`no-hide-text ${textBlurred ? "text-foreground" : "text-muted-foreground"}`}
          />
          {mounted && (
            <WigglyButton
              text={theme === "dark" ? "Dark" : "Light"}
              size="text-[24px] lg:text-[16px]"
              active={true}
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                onMobileSelect();
              }}
              className={`${theme === "dark" ? "text-foreground " : "text-muted-foreground"} `}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ExhibitionsControls({
  onMobileSelect,
}: {
  onMobileSelect: () => void;
}) {
  const { exCat, setExCat, exSort, setExSort, exAsList, setExAsList } =
    useExhibitions();
  const {
    exGridCols,
    setExGridCols,
    exGridRows,
    setExGridRows,
    textBlurred,
    setTextBlurred,
  } = useUI();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-y-[44px] lg:gap-y-[32px] w-full pt-[18px] pb-[18px] justify-center items-center lg:items-end lg:justify-end">
      <div>
        <FilterLabel>Sort</FilterLabel>
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end mt-[0px] px-[9px]">
          {EX_SORTS.map((s) => (
            <WigglyButton
              key={s.value}
              text={s.label}
              size="text-[18px] lg:text-[16px]"
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
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end lg:items-end mt-[0px] px-[9px]">
          {EX_CATS.map((c) => (
            <WigglyButton
              key={c.value}
              text={c.label}
              size="text-[18px] lg:text-[16px]"
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
        <div className="flex flex-wrap lg:flex-col justify-center lg:justify-end lg:items-end mt-[0px] px-[9px]">
          <WigglyButton
            text={exAsList ? "Hide list" : "Show list"}
            size="text-[18px] lg:text-[16px]"
            active={exAsList}
            onClick={() => {
              setExAsList(!exAsList);
              onMobileSelect();
            }}
            className={exAsList ? "text-foreground" : "text-muted-foreground"}
          />
          <span className="hidden lg:flex">
            <WigglyButton
              text="Columns"
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="−"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setExGridCols(Math.max(1, exGridCols - 1))}
              className="text-muted-foreground"
            />
            <WigglyButton
              text={exGridCols.toString()}
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="+"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setExGridCols(Math.min(4, exGridCols + 1))}
              className="text-muted-foreground"
            />
          </span>
          <span className="hidden lg:flex">
            <WigglyButton
              text="Rows"
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="−"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setExGridRows(Math.max(1, exGridRows - 1))}
              className="text-muted-foreground"
            />
            <WigglyButton
              text={exGridRows.toString()}
              size="text-[18px] lg:text-[16px]"
              className="text-muted-foreground"
            />
            <WigglyButton
              text="+"
              size="text-[18px] lg:text-[16px]"
              onClick={() => setExGridRows(Math.min(4, exGridRows + 1))}
              className="text-muted-foreground"
            />
          </span>
          <WigglyButton
            text={textBlurred ? "Unblur" : "Blur text"}
            size="text-[18px] lg:text-[16px]"
            active={textBlurred}
            onClick={() => {
              setTextBlurred(!textBlurred);
              onMobileSelect();
            }}
            className={`no-hide-text ${textBlurred ? "text-foreground text-shadow-md" : "text-muted-foreground text-shadow-none"}`}
          />
          {mounted && (
            <WigglyButton
              text={theme === "dark" ? "Dark" : "Light"}
              size="text-[18px] lg:text-[16px]"
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                onMobileSelect();
              }}
              className="text-foreground"
              active={true}
            />
          )}
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
  const { filterOpen, handleFilterOpen, showColorBg } = useUI();

  // On mobile, close the filter drawer after any selection
  function handleMobileSelect() {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      handleFilterOpen();
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-auto z-[110] lg:z-[70] flex justify-center lg:justify-end pointer-events-none px-[0px] lg:px-0">
      <motion.div
        initial={{ y: "100dvh" }}
        animate={{ y: filterOpen ? "0dvh" : "100dvh" }}
        transition={transition}
        className="pointer-events-auto flex flex-col items-center lg:items-end w-full lg:w-auto"
      >
        {/* DRAWER */}
        <div className="bg-background lg:bg-transparent w-full h-dvh flex flex-col justify-end overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center lg:justify-end pt-[32px] lg:pt-[9px] pb-[18px] lg:pb-[9px] lg:px-0">
            <FilterContent onMobileSelect={handleMobileSelect} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

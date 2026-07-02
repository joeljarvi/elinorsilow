"use client";

import { motion } from "framer-motion";
import { useUI } from "@/context/UIContext";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import {
  useExhibitions,
  ExCategory,
  ExSort,
} from "@/context/ExhibitionsContext";
import { Button } from "@/components/ui/button";

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
      className={`font-timesNewRoman font-normal  text-[16px]  text-muted-foreground tracking-wider pb-1 px-2  block text-left lg:text-right  ${className}`}
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
  const { workSort, setWorkSort, categoryFilter, setCategoryFilter } = useWorks();
  const { gridCols, setGridCols, gridRows, setGridRows } = useUI();

  const sortIndex = WORK_SORTS.findIndex((s) => s.value === workSort);
  const catIndex = WORK_CATS.findIndex((c) => c.value === categoryFilter);

  const btnClass = "justify-start font-timesNewRoman font-normal text-3xl";

  return (
    <div className="flex flex-col w-full gap-y-2 mt-8">
      <Button variant="link" className={btnClass}
        onClick={() => setWorkSort(WORK_SORTS[(sortIndex + 1) % WORK_SORTS.length].value as WorkSort)}>
        Sort by: {WORK_SORTS[sortIndex]?.label ?? WORK_SORTS[0].label}
      </Button>
      <Button variant="link" className={btnClass}
        onClick={() => setCategoryFilter(WORK_CATS[(catIndex + 1) % WORK_CATS.length].value as CategoryFilter)}>
        Filter by: {WORK_CATS[catIndex]?.label ?? WORK_CATS[0].label}
      </Button>
      <div className="hidden lg:contents">
        <Button variant="link" className={btnClass}
          onClick={() => setGridCols((gridCols % 4) + 1)}>
          Cols: {gridCols}
        </Button>
        <Button variant="link" className={btnClass}
          onClick={() => setGridRows((gridRows % 4) + 1)}>
          Rows: {gridRows}
        </Button>
      </div>
      <Button
        variant="link"
        className="justify-start font-timesNewRoman underline font-bold  underline-offset-4 text-3xl"
        onClick={onMobileSelect}
      >
        Apply
      </Button>
    </div>
  );
}

function ExhibitionsControls({
  onMobileSelect,
}: {
  onMobileSelect: () => void;
}) {
  const { exCat, setExCat, exSort, setExSort } = useExhibitions();
  const { exGridCols, setExGridCols, exGridRows, setExGridRows } = useUI();

  const sortIndex = EX_SORTS.findIndex((s) => s.value === exSort);
  const catIndex = EX_CATS.findIndex((c) => c.value === exCat);

  const btnClass = "justify-start font-timesNewRoman font-normal text-3xl";

  return (
    <div className="flex flex-col w-full gap-y-2 mt-8">
      <Button variant="link" className={btnClass}
        onClick={() => setExSort(EX_SORTS[(sortIndex + 1) % EX_SORTS.length].value as ExSort)}>
        Sort by: {EX_SORTS[sortIndex]?.label ?? EX_SORTS[0].label}
      </Button>
      <Button variant="link" className={btnClass}
        onClick={() => setExCat(EX_CATS[(catIndex + 1) % EX_CATS.length].value as ExCategory)}>
        Filter by: {EX_CATS[catIndex]?.label ?? EX_CATS[0].label}
      </Button>
      <div className="hidden lg:contents">
        <Button variant="link" className={btnClass}
          onClick={() => setExGridCols((exGridCols % 4) + 1)}>
          Cols: {exGridCols}
        </Button>
        <Button variant="link" className={btnClass}
          onClick={() => setExGridRows((exGridRows % 4) + 1)}>
          Rows: {exGridRows}
        </Button>
      </div>
      <Button variant="link"
        className="justify-start font-timesNewRoman underline font-bold underline-offset-4 text-3xl"
        onClick={onMobileSelect}>
        Apply
      </Button>
    </div>
  );
}

export function FilterContent({
  onMobileSelect,
}: {
  onMobileSelect: () => void;
}) {
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
    <div className="fixed bottom-0 left-0 right-0 lg:left-auto z-[110] lg:z-[70] hidden lg:flex justify-center lg:justify-end pointer-events-none px-[0px] lg:px-0">
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

"use client";

import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useIndex } from "@/context/IndexContext";

// The active filters (category, year, size, search), fixed at the top right
// (desktop), styled like Menu: "Filter : " then the category (clicking it cycles to the
// next) and each other active filter as a button (clicking one clears it).

// The category toggle's steps, in order (each click moves to the next).
const WORK_CATEGORY_STEPS = [
  { value: "all", label: "All" },
  { value: "painting", label: "Paintings" },
  // Drawings: left out until there are any.
  { value: "sculpture", label: "Sculptures" },
  { value: "textile", label: "Textiles" },
] as const;
const EX_CATEGORY_STEPS = [
  { value: "all", label: "All" },
  { value: "solo", label: "Solo" },
  { value: "group", label: "Group" },
] as const;

export default function ActiveFilters({
  className = "",
}: {
  className?: string;
}) {
  const {
    mode,
    yearFilter,
    setYearFilter,
    sizeFilter,
    setSizeFilter,
    search,
    setSearch,
  } = useIndex();
  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();
  const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
  const exhibitions = mode === "exhibitions";
  // The category: a toggle — all → each main category in turn → all.
  const steps: readonly { value: string; label: string }[] = exhibitions
    ? EX_CATEGORY_STEPS
    : WORK_CATEGORY_STEPS;
  const category = exhibitions ? exCat : categoryFilter;
  const stepIndex = Math.max(
    0,
    steps.findIndex((st) => st.value === category),
  );
  const setCategory = (v: string) =>
    exhibitions
      ? setExCat(v as typeof exCat)
      : setCategoryFilter(v as typeof categoryFilter);
  const nextCategory = () =>
    setCategory(steps[(stepIndex + 1) % steps.length].value);
  // The other active filters (year, size, search): each a button that
  // clears it.
  const filters = [
    yearFilter !== "all" && {
      key: "year",
      label: yearFilter,
      clear: () => setYearFilter("all"),
    },
    !exhibitions &&
      sizeFilter !== "all" && {
        key: "size",
        label: cap(sizeFilter),
        clear: () => setSizeFilter("all"),
      },
    search.trim() && {
      key: "search",
      label: `"${search.trim()}"`,
      clear: () => setSearch(""),
    },
  ].filter((f): f is { key: string; label: string; clear: () => void } =>
    Boolean(f),
  );
  return (
    <div
      className={`flex-wrap items-baseline justify-end gap-x-3 normal-case ${className}`}
    >
      {/* "Filter" on desktop; mobile shows just ": All". */}
      <span className="hidden lg:inline">Filter</span>
      <span>:</span>
      <button
        type="button"
        onClick={nextCategory}
        aria-label="Next category"
        className="cursor-pointer hover:underline"
      >
        {steps[stepIndex].label}
      </button>
      {filters.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={f.clear}
          aria-label={`Clear ${f.key} filter`}
          className="cursor-pointer hover:line-through"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

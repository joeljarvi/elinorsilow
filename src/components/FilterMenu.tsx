"use client";

import { useEffect } from "react";
import { useIndex } from "@/context/IndexContext";
import { useUI, type ImageSize } from "@/context/UIContext";
import type { WorkSize } from "@/lib/workSize";
import { useWorks, type CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, type ExCategory } from "@/context/ExhibitionsContext";

const WORK_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "painting", label: "Painting" },
  { value: "drawing", label: "Drawing" },
  { value: "sculpture", label: "Sculpture" },
  { value: "textile", label: "Textile" },
];
const EX_FILTERS: { value: ExCategory; label: string }[] = [
  { value: "solo", label: "Solo" },
  { value: "group", label: "Group" },
];
const SIZE_FILTERS: { value: WorkSize; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];
const IMAGE_SIZES: { value: ImageSize; label: string }[] = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
];
const ALL = { value: "all", label: "All" };

// One setting: its name, then its options as buttons on a line (wrapping) —
// the current one solid, the others faded.
function Setting<T extends string>({
  name,
  options,
  value,
  onChange,
  extra,
}: {
  name: string;
  // More text after the options, on the same line.
  extra?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-start lg:justify-end gap-x-3 lg:gap-x-2 lg:gap-y-0 mb-0 w-full ">
      <span className="h-auto flex items-baseline justify-start lg:justify-end whitespace-nowrap mb-0 text-neutral-800 font-bold text-[14px] tracking-wide">
        by {name}
      </span>
      <div className="flex flex-wrap gap-x-4 tracking-wide">
        <span className="text-[14px] font-bold">:</span>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`h-auto  cursor-pointer font-bold text-[14px] uppercase  ${value === o.value ? "" : "opacity-40 hover:opacity-100"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {extra && <span className="h-auto text-xl">{extra}</span>}
    </div>
  );
}

// The works / exhibitions lists' settings, opened by the nav's Filter button
// the way Menu opens the menu: a full-height overlay on the page background
// (under the nav, which stays on top to close it; Esc closes it too). Search,
// then filter by (category, year, size — works — each combining), settings
// (show scale, image size), and reset / randomize — every option a button.
export default function FilterSettings({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const {
    mode,
    setSort,
    yearFilter,
    setYearFilter,
    sizeFilter,
    setSizeFilter,
    closeAllRows,
    search,
    setSearch,
    worksLayout,
    setWorksLayout,
    showScale,
    setShowScale,
    randomize,
  } = useIndex();
  const { imageSize, setImageSize } = useUI();
  const { allWorks, categoryFilter, setCategoryFilter } = useWorks();
  const { exhibitions: allExhibitions, exCat, setExCat } = useExhibitions();
  const exhibitions = mode === "exhibitions";
  // The view's years, newest first.
  const years = [
    ...new Set(
      (exhibitions
        ? allExhibitions.map((e) => e.acf.year)
        : allWorks.map((w) => w.acf.year)
      )
        .map(String)
        .filter((y) => Number(y) > 0),
    ),
  ].sort((a, b) => Number(b) - Number(a));
  // Back to the view's defaults, with every row closed.
  const clear = () => {
    setSort(exhibitions ? "year" : "latest");
    if (exhibitions) setExCat("all");
    else setCategoryFilter("all");
    setYearFilter("all");
    setSizeFilter("all");
    setSearch("");
    closeAllRows();
  };

  return (
    // The menu: mobile, along the bottom just above the nav bar (as tall as
    // its contents); desktop, under the nav at the top right.
    <div
      data-filter-menu
      className="fixed inset-x-0 top-auto bottom-8 left-0 right-0 lg:top-4 lg:bottom-auto lg:left-auto lg:w-full lg:max-w-1/2 z-[75]"
    >
      <div
        // Lenis (the page's smooth scrolling) would take the wheel otherwise.
        data-lenis-prevent
        className="h-auto max-h-[calc(100dvh-2.25rem)] lg:max-h-[calc(100dvh-4rem)] overflow-y-auto flex flex-col lg:flex-row lg:flex-wrap items-start lg:justify-end lg:gap-x-8 gap-y-0 px-3 pt-3 pb-3  lg:pt-0.5 lg:px-1 bg-background lg:bg-transparent text-neutral-800 font-alteHaas text-[18px] lg:text-[14px] uppercase  leading-tight"
      >
        {/* Mobile: search and (works) Vertical / Grid — in the bar on
            desktop. */}
        <div className="lg:hidden flex flex-col gap-y-0 w-full px-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            aria-label={`Search ${mode}`}
            className="w-full text-[14px] font-alteHaas font-bold p-0 border-0 bg-transparent outline-none uppercase placeholder:text-neutral-400 mb-3"
          />
          {!exhibitions && (
            <Setting
              name="View"
              options={[
                { value: "list", label: "Vertical" },
                { value: "grid", label: "Grid" },
              ]}
              value={worksLayout}
              onChange={(v) => setWorksLayout(v as "list" | "grid")}
            />
          )}
        </div>
        <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-end lg:w-full lg:gap-x-8 text-[18px] lg:text-[21px] gap-y-0">
          {exhibitions ? (
            <Setting
              name="Category"
              options={[ALL, ...EX_FILTERS]}
              value={exCat}
              onChange={(v) => setExCat(v as ExCategory)}
            />
          ) : (
            <Setting
              name="Category"
              options={[ALL, ...WORK_FILTERS]}
              value={categoryFilter}
              onChange={(v) => setCategoryFilter(v as CategoryFilter)}
            />
          )}
          <Setting
            name="Year"
            options={[ALL, ...years.map((y) => ({ value: y, label: y }))]}
            value={yearFilter}
            onChange={setYearFilter}
          />
          {!exhibitions && (
            <Setting
              name="Size"
              options={[ALL, ...SIZE_FILTERS]}
              value={sizeFilter}
              onChange={(v) => setSizeFilter(v as WorkSize | "all")}
            />
          )}
          {/* Clear: back to the view's defaults — after the filters, pushed to
            the right end of the row. */}
          <button
            type="button"
            onClick={clear}
            className="self-start lg:self-auto lg:ml-auto font-alteHaas font-bold text-[14px] uppercase cursor-pointer"
          >
            Clear
          </button>
        </div>
        {/* Settings: hidden for now. */}
        <div className="hidden">
          <h2 className="normal-case  mb-3 lg:mb-6">Settings</h2>
          {/* Not on mobile. */}
          {!exhibitions && (
            <div className="hidden lg:block">
              <Setting
                name="Show scale"
                options={[
                  { value: "on", label: "On" },
                  { value: "off", label: "Off" },
                ]}
                value={showScale ? "on" : "off"}
                extra="Matchbox, Option 2, Option 3"
                onChange={(v) => setShowScale(v === "on")}
              />
            </div>
          )}

          <Setting
            name="Image size"
            options={IMAGE_SIZES}
            value={imageSize}
            onChange={setImageSize}
          />
        </div>
      </div>
    </div>
  );
}

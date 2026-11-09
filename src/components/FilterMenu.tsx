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
    <div className="flex flex-wrap gap-x-3 lg:gap-x-6 mb-0 px-3">
      <span className="h-auto flex items-center font-gensco text-[18px] lg:text-[21px] whitespace-nowrap mb-0 text-neutral-800">
        {name}:
      </span>
      <div className="flex flex-wrap gap-x-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`h-auto text-xl cursor-pointer  ${value === o.value ? "" : "opacity-40 hover:opacity-100"}`}
          >
            {o.label},
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
    <div
      // Lenis (the page's smooth scrolling) would take the wheel otherwise.
      data-lenis-prevent
      className="fixed inset-x-0 top-9 lg:top-16 h-dvh z-[75] overflow-y-auto flex flex-col items-start gap-y-6 lg:gap-y-6 p-3 pt-6 px-6 lg:px-6 lg:pt-12 pb-16 bg-background text-neutral-800 font-gensco text-[18px] lg:text-[21px] uppercase font-medium leading-tight"
    >
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        aria-label={`Search ${mode}`}
        className="w-full h-auto border-0 px-6 bg-transparent outline-none uppercase placeholder:text-neutral-400"
      />
      <div className="flex flex-col text-[18px] lg:text-[21px]">
        <h2 className="normal-case mb-3 lg:mb-6">Filter by</h2>

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
      </div>
      <div className="flex flex-col">
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
      <div className="flex  gap-x-3 lg:gap-x-6 ">
        <button
          type="button"
          onClick={clear}
          className="h-auto text-[18px] lg:text-[21px] cursor-pointer uppercase"
        >
          Clear
        </button>
        {/* The filters already apply as they're picked: this closes the
            overlay to show the result. */}
        <button
          type="button"
          onClick={onClose}
          className="h-auto text-[18px] lg:text-[21px] cursor-pointer uppercase"
        >
          Apply filters
        </button>
      </div>
    </div>
  );
}

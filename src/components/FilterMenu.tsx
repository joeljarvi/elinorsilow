"use client";

import type { CSSProperties } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIndex, type IndexSort } from "@/context/IndexContext";
import type { WorkSize } from "@/lib/workSize";
import { useWorks, type CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, type ExCategory } from "@/context/ExhibitionsContext";

const SORTS: { value: IndexSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "title", label: "Title" },
  { value: "year", label: "Year" },
];
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

// The select lists fade out at their left, right and bottom edges (12px): a
// mask, the two gradients intersected. Their padding keeps the text clear.
const LIST_FADE: CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent), linear-gradient(to bottom, black calc(100% - 12px), transparent)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 12px, black calc(100% - 12px), transparent), linear-gradient(to bottom, black calc(100% - 12px), transparent)",
  WebkitMaskComposite: "source-in",
};

// One setting: a select showing its name and current value on the nav's line.
// Its options come in groups, each under its label if it has one.
function Setting<T extends string>({
  name,
  groups,
  value,
  onChange,
}: {
  name: string;
  groups: { label?: string; options: { value: T; label: string }[] }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        aria-label={name}
        className="w-full justify-start h-9 p-0 pl-4 bg-transparent rounded-none cursor-pointer font-areal font-medium text-xl tracking-normal uppercase text-neutral-800 w-full"
      >
        <span className="">{name}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        // Lenis (the page's smooth scrolling) takes the wheel otherwise.
        data-lenis-prevent
        style={LIST_FADE}
        className="w-auto min-w-[var(--radix-select-trigger-width)] pb-3 shadow-none font-arealMono text-base uppercase text-neutral-800"
      >
        {groups.map((g, i) => (
          <SelectGroup key={i}>
            {g.label && (
              <SelectLabel className="pl-4 pt-3 pb-1 font-areal text-base indent-4 uppercase">
                {g.label}
              </SelectLabel>
            )}
            {g.options.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="pl-4 pr-8  font-areal text-xl uppercase cursor-pointer"
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}

// The works / exhibitions lists' settings, opened by the nav's Filter button:
// sort by, filter by and search in a full-width 3-col grid (the nav's second
// row), with a reset button above its right end (the nav's first row, top
// right). Filter by is one select holding all the
// filters, by category, year and size (works), so one applies at a time.
export default function FilterSettings({
  className = "",
}: {
  className?: string;
}) {
  const {
    mode,
    sort,
    setSort,
    yearFilter,
    setYearFilter,
    sizeFilter,
    setSizeFilter,
    closeAllRows,
    search,
    setSearch,
  } = useIndex();
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
  const category = exhibitions ? exCat : categoryFilter;
  // The filter select's value: "all", or e.g. "year:2024".
  const filter =
    category !== "all"
      ? `category:${category}`
      : yearFilter !== "all"
        ? `year:${yearFilter}`
        : sizeFilter !== "all"
          ? `size:${sizeFilter}`
          : "all";
  const setFilter = (next: string) => {
    const [kind, value] = next.split(":");
    const cat = kind === "category" ? value : "all";
    if (exhibitions) setExCat(cat as ExCategory);
    else setCategoryFilter(cat as CategoryFilter);
    setYearFilter(kind === "year" ? value : "all");
    setSizeFilter(kind === "size" ? (value as WorkSize) : "all");
  };
  const prefixed = (
    kind: string,
    options: { value: string; label: string }[],
  ) => options.map((o) => ({ ...o, value: `${kind}:${o.value}` }));
  // Back to the view's defaults, with every row closed.
  const clear = () => {
    setSort(exhibitions ? "year" : "latest");
    setFilter("all");
    setSearch("");
    closeAllRows();
  };

  return (
    <div className={`relative grid grid-cols-3 gap-x-4 w-full ${className}`}>
      <Setting
        name="Sort by"
        groups={[{ options: SORTS }]}
        value={sort}
        onChange={setSort}
      />
      <Setting
        name="Filter by"
        groups={[
          { options: [{ value: "all", label: "All" }] },
          {
            label: "By category",
            options: prefixed(
              "category",
              exhibitions ? EX_FILTERS : WORK_FILTERS,
            ),
          },
          {
            label: "By year",
            options: prefixed(
              "year",
              years.map((y) => ({ value: y, label: y })),
            ),
          },
          ...(exhibitions
            ? []
            : [{ label: "By size", options: prefixed("size", SIZE_FILTERS) }]),
        ]}
        value={filter}
        onChange={setFilter}
      />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        aria-label={`Search ${mode}`}
        className="w-full h-9 pl-4 border-0 bg-transparent outline-none font-areal font-medium text-xl uppercase text-neutral-800 placeholder:text-neutral-800"
      />
      {/* The active filter, on this row, under the reset button. */}
      {filter !== "all" && (
        <span className="absolute top-0 right-4 h-9 flex items-center pointer-events-none font-areal font-medium text-xl uppercase text-neutral-800">
          {filter.split(":")[1]}
        </span>
      )}
      <button
        type="button"
        onClick={clear}
        className="absolute bottom-full right-0 h-9 cursor-pointer font-areal font-medium text-xl  uppercase text-neutral-800"
      >
        Reset
      </button>
    </div>
  );
}

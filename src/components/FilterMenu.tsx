"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useDragControls } from "framer-motion";
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
import { useUI } from "@/context/UIContext";
import type { WorkSize } from "@/lib/workSize";
import { useWorks, type CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, type ExCategory } from "@/context/ExhibitionsContext";

const SORTS: { value: IndexSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "title", label: "Title" },
  { value: "year", label: "Year" },
  { value: "random", label: "Random" },
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
        // Name and value on the left; the caret, larger, at the right end.
        className="w-full justify-start [&>[data-slot=select-value]]:mr-auto [&>[data-slot=select-value]]:italic [&>svg]:size-5 [&>svg]:p-0 h-9 p-0 pl-0 bg-transparent rounded-none cursor-pointer font-areal font-medium text-xl tracking-normal uppercase text-neutral-800 border-b-2 border-b-neutral-800"
      >
        <span className="">{name}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        // Lenis (the page's smooth scrolling) takes the wheel otherwise.
        data-lenis-prevent
        // Above the Filter panel (z-[100]) and the nav (z-80). Set inline too:
        // Radix copies the list's z-index to the wrapper it positions.
        style={{ ...LIST_FADE, zIndex: 110 }}
        className="z-[110] w-auto min-w-[var(--radix-select-trigger-width)] pb-3 shadow-none font-arealMono  text-base uppercase text-neutral-800"
      >
        {groups.map((g, i) => (
          <SelectGroup key={i}>
            {g.label && (
              <SelectLabel className="pl-4 pt-3 pb-1 font-areal text-base italic indent-4 uppercase">
                {g.label}
              </SelectLabel>
            )}
            {g.options.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="pl-4 pr-8 data-[state=checked]:italic font-areal text-xl uppercase cursor-pointer"
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
// a panel fixed at the top right (a quarter of the width, under the nav) with
// search, sort by, filter by (category, year, size — works — each its own
// select, so they combine), then settings (show scale, image size) and
// reset. It can be dragged around by its
// top line, which also has a cross that closes it.
export default function FilterSettings({ onClose }: { onClose: () => void }) {
  const drag = useDragControls();
  // A press outside the panel closes it — not on its select lists (rendered
  // elsewhere), not while one is open (that press just closes the list), and
  // not on the nav's Filter button (which toggles it itself).
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (panel.current?.contains(target)) return;
      if (target?.closest("[data-slot=select-content], [data-filter-toggle]"))
        return;
      if (document.querySelector("[data-slot=select-content]")) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [onClose]);
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
  const all = { value: "all", label: "All" };
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
    <motion.div
      drag
      dragControls={drag}
      dragListener={false}
      dragMomentum={false}
      ref={panel}
      className="fixed top-4 right-4 z-[100] hidden lg:flex flex-col w-1/4 px-4 pb-4 pt-2 bg-background border-2 border-neutral-800 font-areal font-medium text-xl uppercase text-neutral-800"
    >
      {/* Top line: drag here to move the panel; the cross closes it. */}
      <div
        onPointerDown={(e) => drag.start(e)}
        className="h-9 -mx-4 px-4 flex items-center justify-between cursor-grab active:cursor-grabbing touch-none select-none mb-4"
      >
        <span className="text-xl text-neutral-800 ">Filter settings</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label="Close filter"
          className="cursor-pointer"
        >
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="block size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <line x1="1" y1="1" x2="19" y2="19" />
            <line x1="19" y1="1" x2="1" y2="19" />
          </svg>
        </button>
      </div>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        aria-label={`Search ${mode}`}
        className="w-full h-9 border-x-0 border-b-2 border-b-neutral-800 bg-transparent outline-none uppercase placeholder:text-neutral-800 mb-8"
      />
      <Setting
        name="Sort by"
        groups={[{ options: SORTS }]}
        value={sort}
        onChange={setSort}
      />
      <span className="mt-8 h-9 flex items-center text-xl text-neutral-800 mb-4">
        Filter by
      </span>
      <div className="flex flex-col gap-2">
        {exhibitions ? (
          <Setting
            name="Category"
            groups={[{ options: [all, ...EX_FILTERS] }]}
            value={exCat}
            onChange={(v) => setExCat(v as ExCategory)}
          />
        ) : (
          <Setting
            name="Category"
            groups={[{ options: [all, ...WORK_FILTERS] }]}
            value={categoryFilter}
            onChange={(v) => setCategoryFilter(v as CategoryFilter)}
          />
        )}
        <Setting
          name="Year"
          groups={[
            { options: [all, ...years.map((y) => ({ value: y, label: y }))] },
          ]}
          value={yearFilter}
          onChange={setYearFilter}
        />
        {!exhibitions && (
          <Setting
            name="Size"
            groups={[{ options: [all, ...SIZE_FILTERS] }]}
            value={sizeFilter}
            onChange={(v) => setSizeFilter(v as WorkSize | "all")}
          />
        )}
      </div>
      <span className="mt-8 h-9 mb-4 flex items-center text-xl text-neutral-800">
        Settings
      </span>
      <div className="flex flex-col gap-2">
        {!exhibitions && (
          <label className="h-9 flex items-center justify-between cursor-pointer border-b-2 border-b-neutral-800 ">
            Show scale
            <input
              type="checkbox"
              checked={showScale}
              onChange={(e) => setShowScale(e.target.checked)}
              className="size-4 accent-neutral-800 cursor-pointer"
            />
          </label>
        )}
        <div className="h-9 flex items-center gap-x-3 border-b-2 border-b-neutral-800">
          <span className="mr-auto">Image size</span>
          {(["S", "M", "L"] as const).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setImageSize(sz)}
              aria-pressed={imageSize === sz}
              className={`cursor-pointer ${imageSize === sz ? "" : "opacity-40 hover:opacity-100"}`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>
      {/* Reset, and Randomize (a new random order) at the bottom right. */}
      <div className="mt-8 h-9 flex items-center justify-between">
        <button
          type="button"
          onClick={clear}
          className="cursor-pointer uppercase"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={randomize}
          className="cursor-pointer uppercase"
        >
          Randomize
        </button>
      </div>
    </motion.div>
  );
}

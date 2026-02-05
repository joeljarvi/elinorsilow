"use client";

import HDivider from "./HDivider";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { useState } from "react";

export default function WorksFilter() {
  const [isDesktop] = useState(false);
  const {
    stagedWorkSort,
    setStagedWorkSort,
    stagedSelectedYear,
    setStagedSelectedYear,
    stagedCategoryFilter,
    setStagedCategoryFilter,
    uniqueYears,
    applyFilters: applyWorksFilters,
    clearFilters: clearWorksFilters,
    isApplyingFilters: isApplyingWorksFilters,
  } = useWorks();

  const { setOpen } = useUI();

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: "All", value: "all" },
    { label: "Painting", value: "painting" },
    { label: "Sculpture", value: "sculpture" },
    { label: "Textile", value: "textile" },
  ];

  const sorts: { label: string; value: WorkSort }[] = [
    { label: "Latest", value: "year-latest" },
    { label: "Oldest", value: "year-oldest" },
    { label: "A–Ö", value: "title" },
    { label: "Year", value: "year" },
  ];

  return (
    <div className="w-full">
      <HDivider />
      <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full">
        {isApplyingWorksFilters ? (
          <div className="pl-0 my-2 font-gintoRegularItalic text-sm animate-pulse flex items-center">
            Applying filters…
          </div>
        ) : (
          <div className="w-full flex flex-col items-start justify-start pt-2 space-y-4">
            {/* Category Filter */}
            <div className="flex flex-col items-start justify-start w-full">
              <span className="text-[10px] opacity-40 font-gintoRegular uppercase tracking-widest mb-1 px-3">Category</span>
              <div className="flex flex-wrap items-center justify-start gap-x-1">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant="link"
                    size="sm"
                    onClick={() => setStagedCategoryFilter(cat.value)}
                    className={`text-sm ${
                      stagedCategoryFilter === cat.value
                        ? "font-gintoRegularItalic text-blue-600"
                        : "font-gintoRegular"
                    }`}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="flex flex-col items-start justify-start w-full">
               <span className="text-[10px] opacity-40 font-gintoRegular uppercase tracking-widest mb-1 px-3">Sort by</span>
              <div className="flex flex-wrap items-center justify-start gap-x-1">
                {sorts.map((sort) => (
                  <Button
                    key={sort.value}
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setStagedWorkSort(sort.value);
                      if (sort.value !== "year") setStagedSelectedYear(null);
                    }}
                    className={`text-sm ${
                      stagedWorkSort === sort.value
                        ? "font-gintoRegularItalic text-blue-600"
                        : "font-gintoRegular"
                    }`}
                  >
                    {sort.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Year Selection (only if Sort by Year is active) */}
            {stagedWorkSort === "year" && (
              <div className="flex flex-col items-start justify-start w-full bg-foreground/5 p-2 rounded-sm">
                 <span className="text-[10px] opacity-40 font-gintoRegular uppercase tracking-widest mb-1 px-1">Select Year</span>
                <div className="flex flex-wrap items-center justify-start gap-1">
                  {uniqueYears.map((year) => (
                    <Button
                      key={year}
                      variant="link"
                      size="sm"
                      onClick={() => setStagedSelectedYear(year)}
                      className={`text-xs ${
                        stagedSelectedYear === year
                          ? "font-gintoRegularItalic text-blue-600 underline"
                          : "font-gintoRegular"
                      }`}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-start gap-x-4 items-center w-full py-2 border-t border-foreground/10">
              <Button
                variant="default"
                size="sm"
                className="font-gintoRegular text-xs px-4"
                onClick={async () => {
                  await applyWorksFilters();
                  if (!isDesktop) setOpen(false);
                }}
              >
                Apply
              </Button>

              <Button
                variant="link"
                size="sm"
                className="font-gintoRegular text-xs opacity-50 hover:opacity-100"
                onClick={async () => {
                  await clearWorksFilters();
                  if (!isDesktop) setOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
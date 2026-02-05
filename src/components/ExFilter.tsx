"use client";

import HDivider from "./HDivider";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { useState } from "react";

export default function ExFilter() {
  const [isDesktop] = useState(false);
  const {
    stagedExhibitionSort,
    setStagedExhibitionSort,
    stagedExSelectedYear,
    setStagedExSelectedYear,
    stagedSelectedType,
    setStagedSelectedType,
    applyFilters: applyExhibitionsFilters,
    clearFilters: clearExhibitionsFilters,
    isApplyingFilters: isApplyingExhibitionsFilters,
    uniqueExYears,
  } = useExhibitions();
  const { setOpen } = useUI();

  const types: { label: string; value: string }[] = [
    { label: "All", value: "all" },
    { label: "Solo", value: "Solo" },
    { label: "Group", value: "Group" },
  ];

  const sorts: { label: string; value: ExhibitionSort }[] = [
    { label: "Year", value: "year" },
    { label: "Title", value: "title" },
    { label: "Type", value: "type" },
  ];

  return (
    <div className="mb-2 w-full">
      <HDivider />
      <div className="pt-2 flex flex-col justify-center items-center lg:items-start lg:justify-start">
        {isApplyingExhibitionsFilters ? (
          <div className="pl-0 py-4 font-gintoRegularItalic text-sm animate-pulse text-center lg:text-left">
            Applying filters…
          </div>
        ) : (
          <div className="w-full flex flex-col items-start justify-start space-y-4">
            {/* Sort by */}
            <div className="flex flex-col items-start justify-start w-full">
              <span className="text-[10px] opacity-40 font-gintoRegular uppercase tracking-widest mb-1 px-3">Sort by</span>
              <div className="flex flex-wrap items-center justify-start gap-x-1">
                {sorts.map((sort) => (
                  <Button
                    key={sort.value}
                    variant="link"
                    size="sm"
                    onClick={() => setStagedExhibitionSort(sort.value)}
                    className={`text-sm ${
                      stagedExhibitionSort === sort.value
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
            {stagedExhibitionSort === "year" && (
              <div className="flex flex-col items-start justify-start w-full bg-foreground/5 p-2 rounded-sm">
                <span className="text-[10px] opacity-40 font-gintoRegular uppercase tracking-widest mb-1 px-1">Filter by Year</span>
                <div className="flex flex-wrap items-center justify-start gap-1">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setStagedExSelectedYear("all")}
                    className={`text-xs ${
                      stagedExSelectedYear === "all"
                        ? "font-gintoRegularItalic text-blue-600 underline"
                        : "font-gintoRegular"
                    }`}
                  >
                    All
                  </Button>
                  {uniqueExYears.map((year) => (
                    <Button
                      key={year}
                      variant="link"
                      size="sm"
                      onClick={() => setStagedExSelectedYear(year.toString())}
                      className={`text-xs ${
                        stagedExSelectedYear === year.toString()
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

            {/* Filter by Type */}
            <div className="flex flex-col items-start justify-start w-full">
              <span className="text-[10px] opacity-40 font-gintoRegular uppercase tracking-widest mb-1 px-3">Filter by Type</span>
              <div className="flex flex-wrap items-center justify-start gap-x-1">
                {types.map((t) => (
                  <Button
                    key={t.value}
                    variant="link"
                    size="sm"
                    onClick={() => setStagedSelectedType(t.value)}
                    className={`text-sm ${
                      stagedSelectedType === t.value
                        ? "font-gintoRegularItalic text-blue-600"
                        : "font-gintoRegular"
                    }`}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-start gap-x-4 items-center w-full py-2 border-t border-foreground/10">
              <Button
                variant="default"
                size="sm"
                className="font-gintoRegular text-xs px-4"
                onClick={async () => {
                  await applyExhibitionsFilters();
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
                  await clearExhibitionsFilters();
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
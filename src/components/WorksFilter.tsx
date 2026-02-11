"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export default function WorksFilter() {
  const [isDesktop] = useState(false);

  const {
    uniqueYears,
    applyFilters: applyWorksFilters,
    clearFilters: clearWorksFilters,
    isApplyingFilters: isApplyingWorksFilters,
    workSort,
    selectedYear,
    categoryFilter,
  } = useWorks();

  const { setOpen } = useUI();

  const [stagedWorkSort, setStagedWorkSort] = useState<WorkSort>(workSort);
  const [stagedSelectedYear, setStagedSelectedYear] = useState<number | null>(
    selectedYear
  );
  const [stagedCategoryFilter, setStagedCategoryFilter] =
    useState<CategoryFilter>(categoryFilter);

  useEffect(() => {
    setStagedWorkSort(workSort);
    setStagedSelectedYear(selectedYear);
    setStagedCategoryFilter(categoryFilter);
  }, [workSort, selectedYear, categoryFilter]);

  return (
    <div className="col-span-3 lg:col-start-4 lg:col-span-3 lg:row-start-2 w-full grid  grid-rows-3 pointer-events-auto px-8 lg:px-0 pb-2 lg:pb-0  ">
      {isApplyingWorksFilters ? (
        <h3 className=" animate-pulse h3">Applying filters…</h3>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 w-full items-center">
            <h3 className=" pl-4 h3">Sort by</h3>
            <Select
              value={stagedWorkSort}
              onValueChange={(v) => {
                setStagedWorkSort(v as WorkSort);
                if (v !== "year") setStagedSelectedYear(null);
              }}
            >
              <SelectTrigger className=" col-span-2  w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year-latest">Latest</SelectItem>
                <SelectItem value="year-oldest">Oldest</SelectItem>
                <SelectItem value="title">A–Ö</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Category */}
          <div className="grid grid-cols-3 items-center  w-full gap-4">
            <h3 className="pl-4 h3">Category</h3>
            <Select
              value={stagedCategoryFilter}
              onValueChange={(v) =>
                setStagedCategoryFilter(v as CategoryFilter)
              }
            >
              <SelectTrigger className="col-span-2 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="sculpture">Sculpture</SelectItem>
                <SelectItem value="textile">Textile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}

          {/* Year */}
          {stagedWorkSort === "year" && (
            <div className="grid grid-cols-3 items-center  w-full gap-4">
              <h3 className="pl-4 h3">Year</h3>
              <Select
                value={stagedSelectedYear?.toString() ?? ""}
                onValueChange={(v) => setStagedSelectedYear(Number(v))}
              >
                <SelectTrigger className="w-full col-span-2">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Actions */}
          <div className="grid grid-cols-3 gap-4 w-full items-center ">
            <Button
              variant="link"
              className="col-span-1 justify-start w-min"
              onClick={async () => {
                await applyWorksFilters(
                  stagedWorkSort,
                  stagedSelectedYear,
                  stagedCategoryFilter
                );
                setOpen(false);
              }}
            >
              •Apply
            </Button>

            <Button
              variant="link"
              className="col-span-1 justify-start w-min"
              onClick={async () => {
                await clearWorksFilters();
              }}
            >
              •Clear
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

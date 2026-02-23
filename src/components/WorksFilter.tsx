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
    <div className=" w-full  flex flex-col pointer-events-auto px-0 lg:px-0 lg:pl-0  gap-y-4  pt-4  ">
      {isApplyingWorksFilters ? (
        <h3 className=" animate-pulse h3">Applying filters…</h3>
      ) : (
        <>
          <div className=" grid grid-cols-3 gap-4 w-full items-center">
            <Select
              value={stagedWorkSort}
              onValueChange={(v) => {
                setStagedWorkSort(v as WorkSort);
                if (v !== "year") setStagedSelectedYear(null);
              }}
            >
              <SelectTrigger className=" col-span-3  w-full">
                <SelectValue placeholder="Sort by Latest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year-latest">Sort by latest</SelectItem>
                <SelectItem value="year-oldest">oldest</SelectItem>
                <SelectItem value="title">title</SelectItem>
                <SelectItem value="year">year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Category */}
          <div className="grid grid-cols-3 items-center  w-full gap-4">
            <Select
              value={stagedCategoryFilter}
              onValueChange={(v) =>
                setStagedCategoryFilter(v as CategoryFilter)
              }
            >
              <SelectTrigger className="col-span-3 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
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
              <Select
                value={stagedSelectedYear?.toString() ?? ""}
                onValueChange={(v) => setStagedSelectedYear(Number(v))}
              >
                <SelectTrigger className="w-full col-span-3">
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
          <div className="grid grid-cols-3  w-full items-center ">
            <Button
              variant="link"
              className="col-span-1 justify-start pl-0 w-min"
              onClick={async () => {
                await applyWorksFilters(
                  stagedWorkSort,
                  stagedSelectedYear,
                  stagedCategoryFilter
                );
                setOpen(false);
              }}
            >
              • Apply
            </Button>

            <Button
              variant="link"
              className="col-span-1 justify-start pl-0 w-min"
              onClick={async () => {
                await clearWorksFilters();
              }}
            >
              • Clear
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

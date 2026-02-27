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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const {
    uniqueYears,
    applyFilters: applyWorksFilters,
    clearFilters: clearWorksFilters,
    isApplyingFilters: isApplyingWorksFilters,
    workSort,
    selectedYear,
    categoryFilter,
  } = useWorks();

  const { setOpen, handleOpenWorksFilter } = useUI();

  const [stagedWorkSort, setStagedWorkSort] = useState<WorkSort>(workSort);
  const [stagedSelectedYear, setStagedSelectedYear] = useState<number | null>(
    selectedYear,
  );
  const [stagedCategoryFilter, setStagedCategoryFilter] =
    useState<CategoryFilter>(categoryFilter);

  useEffect(() => {
    setStagedWorkSort(workSort);
    setStagedSelectedYear(selectedYear);
    setStagedCategoryFilter(categoryFilter);
  }, [workSort, selectedYear, categoryFilter]);

  return (
    <div className="border-foreground border-t-[0.5px] lg:border-transparent w-full  flex flex-col pointer-events-auto px-0 lg:px-0 lg:pl-0  gap-y-0    ">
      <div className=" grid grid-cols-3 gap-0 w-full items-center">
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
          <SelectContent side={isDesktop ? "bottom" : "top"}>
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
          onValueChange={(v) => setStagedCategoryFilter(v as CategoryFilter)}
        >
          <SelectTrigger className="col-span-3 w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent side={isDesktop ? "bottom" : "top"}>
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
            <SelectContent side={isDesktop ? "bottom" : "top"}>
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
      <div className="grid grid-cols-2  w-full items-center border-transparent lg:border-foreground lg:border-b-[0.5px]">
        <Button
          variant="default"
          size="lg"
          className="col-span-1  w-full"
          onClick={async () => {
            await applyWorksFilters(
              stagedWorkSort,
              stagedSelectedYear,
              stagedCategoryFilter,
            );
            handleOpenWorksFilter();
            setOpen(false);
          }}
        >
          Apply
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="col-span-1 justify-center  w-full"
          onClick={async () => {
            await clearWorksFilters();
            handleOpenWorksFilter();
            setOpen(false);
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

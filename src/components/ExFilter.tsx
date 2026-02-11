"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import HDivider from "./HDivider";

export default function ExFilter() {
  const [isDesktop] = useState(false);
  const {
    applyFilters: applyExhibitionsFilters,
    clearFilters: clearExhibitionsFilters,
    isApplyingFilters: isApplyingExhibitionsFilters,
    uniqueExYears,
    exhibitionSort,
    exSelectedYear,
    selectedType,
  } = useExhibitions();

  const { setOpen } = useUI();

  const [stagedExhibitionSort, setStagedExhibitionSort] =
    useState<ExhibitionSort>(exhibitionSort);
  const [stagedExSelectedYear, setStagedExSelectedYear] =
    useState<string>(exSelectedYear);
  const [stagedSelectedType, setStagedSelectedType] =
    useState<string>(selectedType);

  useEffect(() => {
    setStagedExhibitionSort(exhibitionSort);
    setStagedExSelectedYear(exSelectedYear);
    setStagedSelectedType(selectedType);
  }, [exhibitionSort, exSelectedYear, selectedType]);

  return (
    <div className="lg:col-start-6 col-span-3 lg:col-span-3 lg:row-start-2 w-full grid grid-rows-3  pointer-events-auto px-8 lg:px-0 pb-2 lg:pb-0  ">
      {isApplyingExhibitionsFilters ? (
        <h3 className="h3 animate-pulse">Applying filters…</h3>
      ) : (
        <>
          {/* Sort */}
          <div className="grid grid-cols-3 items-center  w-full gap-4 ">
            <h3 className="pl-4 h3">Sort by</h3>
            <Select
              value={stagedExhibitionSort}
              onValueChange={(v) =>
                setStagedExhibitionSort(v as ExhibitionSort)
              }
            >
              <SelectTrigger className="col-span-2 w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          {stagedExhibitionSort === "year" && (
            <div className="grid grid-cols-3 items-center  w-full gap-4 ">
              <h3 className="pl-4 h3">Year</h3>
              <Select
                value={stagedExSelectedYear}
                onValueChange={setStagedExSelectedYear}
              >
                <SelectTrigger className="col-span-2 w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueExYears.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Type */}
          <div className="grid grid-cols-3 gap-4 w-full items-center ">
            <h3 className="h3 pl-4">Type</h3>
            <Select
              value={stagedSelectedType}
              onValueChange={setStagedSelectedType}
            >
              <SelectTrigger className="col-span-2 w-full">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Solo">Solo</SelectItem>
                <SelectItem value="Group">Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-4 w-full items-center">
            <Button
              variant="link"
              className="col-span-1 justify-start w-min"
              onClick={async () => {
                await applyExhibitionsFilters(
                  stagedExhibitionSort,
                  stagedExSelectedYear,
                  stagedSelectedType
                );
                if (!isDesktop) setOpen(false);
              }}
            >
              •Apply
            </Button>

            <Button
              variant="link"
              className="col-span-1 justify-start w-min"
              onClick={async () => {
                await clearExhibitionsFilters();
                if (!isDesktop) setOpen(false);
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

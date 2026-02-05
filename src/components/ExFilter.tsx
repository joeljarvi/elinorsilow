"use client";

import HDivider from "./HDivider";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";

export default function ExFilter() {
  const [isDesktop, setIsDesktop] = useState(false);
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

  return (
    <div className="mb-2 w-full">
      <HDivider className=" " />
      <div className="pt-2 flex flex-col  justify-center items-center lg:items-start lg:justify-start">
        {isApplyingExhibitionsFilters ? (
          <div className="pl-0 lg:pl-8 py-4 font-EBGaramondItalic text-sm animate-pulse text-center lg:text-left">
            Applying filters…
          </div>
        ) : (
          <>
            {/* Sort by */}

            <Select
              value={stagedExhibitionSort}
              onValueChange={(v) =>
                setStagedExhibitionSort(v as ExhibitionSort)
              }
            >
              <SelectTrigger size="default" className="w-full  ">
                <SelectValue placeholder="Sort exhibitions" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="year">Sort by year</SelectItem>
                <SelectItem value="title">Sort by title (a-ö)</SelectItem>
                <SelectItem value="type">Sort by solo/group</SelectItem>
              </SelectContent>
            </Select>

            {stagedExhibitionSort === "year" && (
              <>
                <Select
                  value={stagedExSelectedYear}
                  onValueChange={setStagedExSelectedYear}
                >
                  <SelectTrigger size="default" className=" w-full  ">
                    <SelectValue placeholder="Filter by year" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="all">All</SelectItem>
                    {uniqueExYears.map((year) => (
                      <SelectItem
                        key={`ex-year-${year}`}
                        value={year.toString()}
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {/* Filter by Type */}

            <Select
              value={stagedSelectedType}
              onValueChange={setStagedSelectedType}
            >
              <SelectTrigger size="default" className="w-full  ">
                <SelectValue placeholder="all exhibitions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All exhibitions</SelectItem>
                <SelectItem value="Solo">solo exhibitions</SelectItem>
                <SelectItem value="Group">group exhibitions</SelectItem>
              </SelectContent>
            </Select>

            <HDivider className="mt-2  " />
            <div className="flex  items-center justify-start   w-full pt-2 gap-x-8   ">
              <Button
                variant="default"
                size="sm"
                className=" font-gintoRegular text-sm  "
                onClick={async () => {
                  await applyExhibitionsFilters();
                  if (!isDesktop) setOpen(false);
                }}
              >
                Apply filters
              </Button>
              <Button
                variant="default"
                size="sm"
                className="font-gintoRegular  text-sm  justify-end"
                onClick={async () => {
                  await clearExhibitionsFilters();
                  if (!isDesktop) setOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

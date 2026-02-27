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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const {
    applyFilters: applyExhibitionsFilters,
    clearFilters: clearExhibitionsFilters,
    isApplyingFilters: isApplyingExhibitionsFilters,
    uniqueExYears,
    exhibitionSort,
    exSelectedYear,
    selectedType,
  } = useExhibitions();

  const { setOpen, handleOpenExhibitionsFilter } = useUI();

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
    <div className="border-foreground border-t-[0.5px] flex flex-col w-full   pointer-events-auto  bg-transparent ">
      {/* Sort */}
      <div className="grid grid-cols-3 items-center  w-full gap-4 ">
        <Select
          value={stagedExhibitionSort}
          onValueChange={(v) => setStagedExhibitionSort(v as ExhibitionSort)}
        >
          <SelectTrigger className="col-span-3 w-full">
            <SelectValue placeholder="Sort by latest" />
          </SelectTrigger>
          <SelectContent side={isDesktop ? "bottom" : "top"}>
            <SelectItem value="year">Sort by year</SelectItem>
            <SelectItem value="title">Sort by title</SelectItem>
            <SelectItem value="type">Sort by type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      {stagedExhibitionSort === "year" && (
        <div className="grid grid-cols-3 items-center  w-full gap-4 ">
          <Select
            value={stagedExSelectedYear}
            onValueChange={setStagedExSelectedYear}
          >
            <SelectTrigger className="col-span-3 w-full">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent side={isDesktop ? "bottom" : "top"}>
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
        <Select
          value={stagedSelectedType}
          onValueChange={setStagedSelectedType}
        >
          <SelectTrigger className="col-span-3 w-full">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent side={isDesktop ? "bottom" : "top"}>
            <SelectItem value="all">Show all</SelectItem>
            <SelectItem value="Solo">Solo Exhibitions</SelectItem>
            <SelectItem value="Group">Group Exhibitions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 w-full items-center">
        <Button
          variant="default"
          size="lg"
          className="col-span-1 justify-center  w-full"
          onClick={async () => {
            await applyExhibitionsFilters(
              stagedExhibitionSort,
              stagedExSelectedYear,
              stagedSelectedType,
            );
            handleOpenExhibitionsFilter();
            if (!isDesktop) setOpen(false);
          }}
        >
          Apply
        </Button>

        <Button
          variant="secondary"
          size="lg"
          className="col-span-1   w-full"
          onClick={async () => {
            await clearExhibitionsFilters();
            handleOpenExhibitionsFilter();
            if (!isDesktop) setOpen(false);
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

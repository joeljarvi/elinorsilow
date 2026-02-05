"use client";

import HDivider from "./HDivider";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
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

export default function WorksFilter() {
  const [isDesktop, setIsDesktop] = useState(false);
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
    workSort,
  } = useWorks();

  const { setOpen } = useUI();

  return (
    <div className="   w-full ">
      <HDivider />
      <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full ">
        {isApplyingWorksFilters ? (
          <div className=" pl-0  my-2  font-gintoRegularItalic text-sm animate-pulse flex items-center">
            Applying filters…
          </div>
        ) : (
          <div className=" w-full flex flex-col items-start justify-start lg:items-start lg:justify-start pt-2">
            <Select
              value={stagedWorkSort}
              onValueChange={(v) => {
                setStagedWorkSort(v as WorkSort);
                if (v !== "year") setStagedSelectedYear(null);
              }}
            >
              <SelectTrigger size="default" className="w-full   ">
                <SelectValue placeholder="Sort works" />
              </SelectTrigger>

              <SelectContent className="">
                <SelectItem value="year-latest">
                  Sort by year (latest)
                </SelectItem>
                <SelectItem value="year-oldest">
                  Sort by year (oldest)
                </SelectItem>
                <SelectItem value="year">Sort by year (specific)</SelectItem>
                <SelectItem value="title">Sort by title (a–ö)</SelectItem>
              </SelectContent>
            </Select>

            {stagedWorkSort === "year" && (
              <>
                <Select
                  value={stagedSelectedYear?.toString()}
                  onValueChange={(v) => setStagedSelectedYear(Number(v))}
                >
                  <SelectTrigger size="default" className="   ">
                    <SelectValue placeholder="2024" />
                  </SelectTrigger>

                  <SelectContent position="popper">
                    {uniqueYears.map((year) => (
                      <SelectItem
                        key={`work-year-${year}`}
                        value={year.toString()}
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <Select
              value={stagedCategoryFilter}
              onValueChange={(v) =>
                setStagedCategoryFilter(v as CategoryFilter)
              }
            >
              <SelectTrigger size="default" className=" w-full  ">
                <SelectValue placeholder="All works" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All works</SelectItem>
                <SelectItem value="painting">Paintings</SelectItem>
                <SelectItem value="drawing">Drawings (coming soon)</SelectItem>
                <SelectItem value="sculpture">Sculpture</SelectItem>
                <SelectItem value="textile">Textile</SelectItem>
              </SelectContent>
            </Select>

            <HDivider className="mt-2" />
            <div className="flex justify-start gap-x-8   items-center   w-full py-2  ">
              <Button
                variant="link"
                size="sm"
                className="font-gintoRegular hover:font-gintoRegularItalic text-sm justify-start text-left  "
                onClick={async () => {
                  await applyWorksFilters();
                  if (!isDesktop) setOpen(false);
                }}
              >
                Apply filters
              </Button>

              <Button
                variant="link"
                size="sm"
                className="font-gintoRegular hover:font-gintoRegularItalic text-sm text-left  lg:w-min  "
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

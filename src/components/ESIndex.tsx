"use client";

import { useState } from "react";
import Image from "next/image";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/ui/button";
import WorkModal from "./WorkModal";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS: { label: string; value: CategoryFilter }[] = [
  { label: "all", value: "all" },
  { label: "painting", value: "painting" },
  { label: "drawing", value: "drawing" },
  { label: "sculpture", value: "sculpture" },
  { label: "textile", value: "textile" },
];

const SORTS: { label: string; value: WorkSort }[] = [
  { label: "newest", value: "year-latest" },
  { label: "oldest", value: "year-oldest" },
  { label: "title", value: "title" },
];

export default function ESIndex() {
  const {
    filteredWorks,
    categoryFilter,
    setCategoryFilter,
    workSort,
    setWorkSort,
  } = useWorks();
  const { filterOpen, setFilterOpen, setOpenDesktopNav } = useUI();
  const [workSlug, setWorkSlug] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 p-0 lg:p-0 mt-24">
      <div className="flex flex-col col-span-3 p-4 gap-y-4">
        <span className="flex justify-between w-full">
          <h2 className=" h2 lg:border-b py-1 lg:border-b-foreground w-full ">
            All Works
          </h2>
          <Button
            variant="link"
            className="lg:hidden"
            onClick={() => {
              const next = !filterOpen;
              setFilterOpen(next);
              if (next) setOpenDesktopNav(false);
            }}
          >
            Filter & Sort
          </Button>
        </span>
        <div className=" flex flex-col lg:grid grid-cols-3 min-h-dvh ">
          {filteredWorks.map((work) => (
            <button
              key={work.id}
              onClick={() => setWorkSlug(work.slug)}
              className="group relative aspect-square overflow-hidden  bg-background cursor-zoom-in border-b border-b-foreground mb-4  "
            >
              <div className="absolute inset-0 flex items-start justify-start">
                {work.image_url && (
                  <div className="relative h-1/2 w-1/2">
                    <Image
                      src={work.image_url}
                      alt={work.title.rendered}
                      className="object-contain object-top-left"
                      sizes="(min-width: 1024px) 25vw, 33vw"
                      fill
                    />
                  </div>
                )}
              </div>

              <span className="hidden absolute inset-x-0 bottom-0 z-10  flex-col py-2 text-left font-arealMono text-base lg:opacity-0 transition-opacity group-hover:opacity-100">
                <h3>{work.title.rendered}</h3>
                <div className="hidden">
                  <span>{work.acf.year}</span>
                  <span>{work.acf.materials}</span>
                  <span>{work.acf.dimensions}</span>
                </div>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col col-span-1 lg:sticky lg:top-24 lg:self-start">
        <div className="col-span-1 flex flex-col p-4 gap-y-4 justify-start items-start w-full  ">
          <h2 className="col-span-1 h2  py-1 border-b border-b-foreground w-full">
            Filter
          </h2>
          <div className="flex flex-col gap-y-1  w-full">
            {CATEGORY_FILTERS.map((f) => (
              <Button
                key={f.value}
                variant="default"
                className={` ${categoryFilter === f.value && "bg-neutral-300"}`}
                onClick={() => setCategoryFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="col-span-1 flex flex-col p-4 gap-y-4 justify-start items-start w-full  ">
          <h2 className="col-span-1 h2  py-1 border-b border-b-foreground w-full">
            Sort by
          </h2>
          <div className="flex flex-col gap-y-1 w-full">
            {SORTS.map((s) => (
              <Button
                key={s.value}
                variant="default"
                onClick={() => setWorkSort(s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {filterOpen && (
        <div className="fixed bottom-0 left-0 w-full z-20 pb-1 px-1 flex flex-col gap-y-4 h-auto ">
          <div className="flex flex-col gap-y-1   ">
            {CATEGORY_FILTERS.map((f) => (
              <Button
                key={f.value}
                variant="default"
                className={` ${categoryFilter === f.value && "bg-neutral-300"}`}
                onClick={() => setCategoryFilter(f.value)}
              >
                {f.label}
              </Button>
            ))}
            <div className="flex flex-col gap-y-1">
              {SORTS.map((s) => (
                <Button
                  key={s.value}
                  variant="default"
                  onClick={() => setWorkSort(s.value)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {workSlug && (
        <WorkModal slug={workSlug} onClose={() => setWorkSlug(null)} showInfo />
      )}
    </div>
  );
}

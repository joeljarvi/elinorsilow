"use client";

import Staggered from "@/components/Staggered";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Work } from "../../../lib/wordpress";
import { useUI } from "@/context/UIContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";

export default function WorksPageClient() {
  const {
    filteredWorks,
    setActiveWorkSlug,
    activeWorkSlug,
    getWorkSizeClass,
    workSort,
  } = useWorks();

  const router = useRouter();
  const { showInfo, open, setOpen, showWorksFilter, handleOpenWorksFilter } =
    useUI();

  return (
    <section className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full mt-30 ">
      <div className="fixed top-14 lg:top-16 z-20 n w-full grid grid-cols-2 lg:grid-cols-6     grid-rows-[1.5rem_minmax(0,1fr)]   mb-1 lg:mb-0 lg:gap-x-4 px-2 lg:px-0 gap-y-2 lg:gap-y-0  ">
        <h1 className="h1 lg:col-span-1 px-4">Verk ({filteredWorks.length})</h1>

        <Button
          variant="link"
          size="sm"
          onClick={() => handleOpenWorksFilter()}
          className="col-start-3 justify-end lg:justify-start  "
        >
          Filter
        </Button>
        {showWorksFilter && <WorksFilter />}
      </div>
      <Staggered
        items={filteredWorks}
        getKey={(item) => item.id}
        className="flex flex-col items-center justify-center w-full lg:grid lg:grid-cols-3 lg:justify-start lg:items-start px-4 lg:px-0 mb-36"
        renderItem={(item: Work) => (
          <div
            className="lg:col-span-1 lg:w-full aspect-square flex flex-col justify-between lg:justify-between cursor-pointer gap-y-2 lg:gap-y-4 bg-background hover:bg-neutral-100 w-[100vw] "
            onClick={() => {
              setActiveWorkSlug(item.slug);
              setOpen(false);
              router.push(`/?work=${item.slug}`);
            }}
          >
            <div
              className={`relative aspect-square   mx-auto lg:mx-0 ${getWorkSizeClass(
                item.acf.dimensions
              )} flex`}
            >
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.title.rendered}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-contain object-top lg:object-top-left p-0 lg:px-4"
                />
              )}
            </div>

            <div className="flex flex-col items-baseline pt-6 px-6 pb-6 lg:px-4 lg:pb-4 text-sm font-directorMono">
              <span>{item.title.rendered}</span>
              {item.acf.year && <span>{item.acf.year}</span>}
              {item.acf.materials && <span>{item.acf.materials}</span>}
              {item.acf.dimensions && <span>{item.acf.dimensions}</span>}
            </div>
          </div>
        )}
      />
    </section>
  );
}

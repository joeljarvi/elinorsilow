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
    <section className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full mt-[calc(25vh+2rem)] ">
      <div className="fixed top-[25vh]  z-20 grid grid-cols-6  w-full lg:justify-start gap-4   mb-1 lg:mb-0 ">
        <h1 className="h1 col-span-6 lg:col-span-1 px-4 ">
          Verk ({filteredWorks.length})
        </h1>

        <Button
          variant="link"
          size="sm"
          onClick={() => handleOpenWorksFilter()}
          className="hidden lg:flex col-start-2 justify-end lg:justify-start  "
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

            <div className="flex flex-col items-baseline px-4 pb-8 l text-sm font-directorMono">
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

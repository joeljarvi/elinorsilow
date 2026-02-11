"use client";

import Staggered from "@/components/Staggered";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Work, Exhibition } from "../../../lib/wordpress";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";
import ExFilter from "@/components/ExFilter";

export default function ExhibitionsPageClient() {
  const { filteredExhibitions, setActiveExhibitionSlug, activeExhibitionSlug } =
    useExhibitions();

  const router = useRouter();
  const {
    showInfo,
    open,
    setOpen,
    showExhibitionsFilter,
    handleOpenExhibitionsFilter,
  } = useUI();

  return (
    <section className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full mt-30 ">
      <div className="fixed top-14 lg:top-16 z-20 n w-full grid grid-cols-2 lg:grid-cols-6     grid-rows-[1.5rem_minmax(0,1fr)]   mb-1 lg:mb-0 lg:gap-x-4 px-2  gap-y-2 lg:gap-y-0  ">
        <h1 className="h1 lg:col-span-1 px-2   ">
          Utställningar ({filteredExhibitions.length})
        </h1>

        <Button
          variant="link"
          size="sm"
          onClick={() => handleOpenExhibitionsFilter()}
          className="hidden lg:flex col-start-3 justify-end lg:justify-start  "
        >
          Filter
        </Button>
        {showExhibitionsFilter && <ExFilter />}
      </div>
      <Staggered
        items={filteredExhibitions}
        getKey={(item) => item.id}
        className="flex flex-col items-center justify-center w-full lg:flex-row lg:items-start lg:justify-start  gap-x-4"
        renderItem={(item: Exhibition, index: number) => (
          <div
            className="flex flex-col justify-start lg:justify-between cursor-pointer gap-y-4 lg:gap-y-2  w-full h-full bg-background hover:bg-foreground/10 transition-all  "
            onClick={() => {
              setActiveExhibitionSlug(item.slug);
              setOpen(false);
              router.push(`/?exhibition=${item.slug}`);
            }}
          >
            {" "}
            <div className="relative  mx-auto lg:mx-0 h-full w-screen lg:w-auto  lg:h-[calc(100vh-10rem)] aspect-square lg:aspect-video ">
              {" "}
              {item.acf.image_1?.url && (
                <Image
                  src={item.acf.image_1.url}
                  alt={item.title.rendered}
                  fill
                  priority={index < 3}
                  className="object-cover object-top lg:object-center px-4 lg:px-0"
                />
              )}{" "}
            </div>{" "}
            <div className="flex flex-col  justify-start items-baseline gap-x-8 h3 lg:h4 px-4 lg:px-0 pb-6">
              {" "}
              <span>{item.title.rendered}</span>{" "}
              <span className="">{item.acf.exhibition_type}</span>{" "}
              <span className="">{item.acf.location}</span>{" "}
              <span className="">{item.acf.city}</span>{" "}
              <span className="">{item.acf.year}</span>{" "}
            </div>{" "}
          </div>
        )}
      />
    </section>
  );
}

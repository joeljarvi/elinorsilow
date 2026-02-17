"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Work } from "../../lib/wordpress";
import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState } from "react";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";
import { Button } from "./ui/button";
import Link from "next/link";
import HDivider from "./HDivider";

export function WorkCard({ item, setActiveWorkSlug, setOpen, router }) {
  const { getWorkSizeClass } = useWorks();

  return (
    <div
      className="aspect-square flex flex-col justify-start lg:justify-start cursor-pointer gap-y-0 lg:gap-y-0 w-[100vw] lg:w-full  transition-all   "
      onClick={() => {
        setActiveWorkSlug(item.slug);
        setOpen(false);
        router.push(`/?work=${item.slug}`);
      }}
    >
      <div className=" flex lg:hidden flex-wrap items-baseline  py-4  justify-start text-sm font-directorLight h3  ">
        <span className="font-directorBold uppercase mr-2">
          {item.title.rendered},
        </span>
        {item.acf.year && <span className="mr-2">{item.acf.year},</span>}
        {item.acf.materials && (
          <span className="mr-2 whitespace-normal">{item.acf.materials}, </span>
        )}
        {item.acf.dimensions && <span>{item.acf.dimensions}</span>}
      </div>
      <div
        className={`relative h-[80vh] lg:h-[75vh] mx-auto lg:mx-0 ${getWorkSizeClass(
          item.acf.dimensions
        )} flex`}
      >
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.title.rendered}
            fill
            className="object-contain object-top lg:object-top-left"
          />
        )}
      </div>
    </div>
  );
}

export function FeaturedWorksCarousel({}: {}) {
  const router = useRouter();
  const { open: isNavOpen } = useUI();
  const { open: isModalOpen } = useWorks();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const { featuredWorks, setActiveWorkSlug, setOpen } = useWorks();

  const worksGallery = useGalleryCarousel({
    enableKeyboard: true,
    id: "featured-works",
  });

  return (
    <section className="w-full mt-[50vh] lg:mt-0 grid grid-cols-6 px-4 lg:px-8 lg:pt-8  ">
      {/* mobile */}
      <div className="flex flex-col lg:hidden col-span-6 pt-4 gap-y-4 w-full">
        {featuredWorks.map((item) => (
          <WorkCard
            key={item.id}
            item={item}
            setActiveWorkSlug={setActiveWorkSlug}
            setOpen={setOpen}
            router={router}
          />
        ))}
      </div>

      {/* desktop */}
      <div className="hidden lg:block  px-0 col-span-6 ">
        <Carousel setApi={worksGallery.setApi} opts={{ align: "start" }}>
          <CarouselContent className="">
            {featuredWorks.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-1/3">
                <WorkCard
                  item={item}
                  setActiveWorkSlug={setActiveWorkSlug}
                  setOpen={setOpen}
                  router={router}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

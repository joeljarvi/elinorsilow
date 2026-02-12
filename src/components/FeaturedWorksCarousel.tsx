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

function WorkCard({ item, setActiveWorkSlug, setOpen, router }) {
  const { getWorkSizeClass } = useWorks();

  return (
    <div
      className="aspect-square flex flex-col justify-start lg:justify-between cursor-pointer gap-y-4 lg:gap-y-2 w-[100vw] lg:w-full bg-background hover:bg-foreground/10 transition-all"
      onClick={() => {
        setActiveWorkSlug(item.slug);
        setOpen(false);
        router.push(`/?work=${item.slug}`);
      }}
    >
      <div
        className={`relative aspect-square mx-auto lg:mx-0 ${getWorkSizeClass(
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

      <div className="flex flex-col items-baseline pt-4 px-4 pb-16 lg:p-0 text-sm font-directorMono">
        <span>{item.title.rendered}</span>
        {item.acf.year && <span>{item.acf.year}</span>}
        {item.acf.materials && <span>{item.acf.materials}</span>}
        {item.acf.dimensions && <span>{item.acf.dimensions}</span>}
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
    pause: isNavOpen || isModalOpen,
    delay: 5000,
    enableKeyboard: true,
    id: "featured-works",
  });

  return (
    <section className="w-full">
      {/* mobile */}
      <div className="flex flex-col lg:hidden">
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
      <div className="hidden lg:block px-4">
        <Carousel
          setApi={worksGallery.setApi}
          plugins={[worksGallery.autoplay.current]}
          opts={{ align: "start" }}
        >
          <CarouselContent className="-ml-6">
            {featuredWorks.map((item) => (
              <CarouselItem key={item.id} className="pl-6 basis-1/3">
                <WorkCard
                  item={item}
                  setActiveWorkSlug={setActiveWorkSlug}
                  setOpen={setOpen}
                  router={router}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-end gap-4  pr-4">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

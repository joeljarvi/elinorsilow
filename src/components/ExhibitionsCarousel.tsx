"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";
import { Exhibition } from "../../lib/wordpress";
import { usePathname } from "next/navigation";

function ExhibitionCard({ item, setActiveExhibitionSlug, setOpen, router }) {
  const image = item.acf.image_1?.url;

  return (
    <div
      className=" flex flex-col cursor-pointer gap-y-4 bg-background   transition-all "
      onClick={() => {
        setActiveExhibitionSlug(item.slug);
        setOpen(false);
        router.push(`/?exhibition=${item.slug}`);
      }}
    >
      <div className="relative w-full aspect-square lg:aspect-video">
        {image && (
          <Image
            src={image}
            alt={item.title.rendered}
            fill
            sizes="33vw"
            className="object-cover object-center"
          />
        )}
        <div className="hidden absolute inset-0  flex-col items-center justify-center text-2xl lg:text-lg font-directorLight gap-y-4  ">
          <h3 className=" text-sm bg-background  font-directorLight   ">
            {item.acf.exhibition_type}
          </h3>
          <h2 className="bg-background  text-4xl text-center  mx-16  ">
            {item.title.rendered}
          </h2>
          <span className="bg-background flex flex-wrap justify-center ">
            <h3 className="bg-background ">{item.acf.location}, </h3>
            <h3 className="bg-background   ml-2">{item.acf.city}</h3>
          </span>

          {item.acf.year && (
            <h3 className=" text-sm bg-background  ">{item.acf.year}</h3>
          )}
        </div>
      </div>

      <div className=" flex-col  text-sm font-directorLight px-4 pb-8 ">
        <span className="font-directorBold uppercase mr-2">
          {item.title.rendered},
        </span>
        {item.acf.year && <span className="mr-2">{item.acf.year},</span>}
        {item.acf.location && <span>{item.acf.location}, </span>}
        {item.acf.city && <span>{item.acf.city}, </span>}

        {item.acf.exhibition_type && <span>{item.acf.exhibition_type}</span>}
      </div>
    </div>
  );
}

export function ExhibitionsCarousel({ items }: { items: Exhibition[] }) {
  const router = useRouter();
  const { open: isNavOpen } = useUI();
  const { open: isModalOpen } = useExhibitions();

  const { setActiveExhibitionSlug, setOpen } = useExhibitions();
  const pathname = usePathname();

  const gallery = useGalleryCarousel({
    enableKeyboard: true,
    id: "featured-exhibitions", // unique id
  });
  return (
    <div className="w-full grid grid-cols-6 mb-4">
      <div className="flex flex-col lg:hidden col-span-6 px-0 gap-y-0">
        {items.map((item) => (
          <ExhibitionCard
            key={item.id}
            item={item}
            setActiveExhibitionSlug={setActiveExhibitionSlug}
            setOpen={setOpen}
            router={router}
          />
        ))}
      </div>
      <Carousel
        setApi={gallery.setApi}
        opts={{ align: "start" }}
        className="w-full h-full hidden lg:block col-span-6 "
      >
        <CarouselContent className="-ml-6">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="pl-6 basis-full lg:basis-2/3"
            >
              <ExhibitionCard
                item={item}
                setActiveExhibitionSlug={setActiveExhibitionSlug}
                setOpen={setOpen}
                router={router}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

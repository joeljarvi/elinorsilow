"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

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

function ExhibitionCard({ item, setActiveExhibitionSlug, setOpen, router }) {
  const image = item.acf.image_1?.url;

  return (
    <div
      className=" flex flex-col cursor-pointer gap-y-4 bg-background hover:bg-foreground/10 transition-all"
      onClick={() => {
        setActiveExhibitionSlug(item.slug);
        setOpen(false);
        router.push(`/?exhibition=${item.slug}`);
      }}
    >
      <div className="relative w-full aspect-video">
        {image && (
          <Image
            src={image}
            alt={item.title.rendered}
            fill
            sizes="33vw"
            className="object-cover object-center"
          />
        )}
      </div>

      <div className="flex flex-col pt-4 px-4 pb-16 lg:p-0 text-sm font-directorMono">
        <span>{item.title.rendered}</span>
        {item.acf.year && <span>{item.acf.year}</span>}
        {item.acf.exhibition_type && <span>{item.acf.exhibition_type}</span>}
        {item.acf.city && <span>{item.acf.city}</span>}
      </div>
    </div>
  );
}

export function ExhibitionsCarousel({ items }: { items: Exhibition[] }) {
  const router = useRouter();
  const { open: isNavOpen } = useUI();
  const { open: isModalOpen } = useExhibitions();

  const { setActiveExhibitionSlug, setOpen } = useExhibitions();

  const gallery = useGalleryCarousel({
    pause: isNavOpen || isModalOpen,
    delay: 5000,
    enableKeyboard: true,
    id: "featured-exhibitions", // unique id
  });
  return (
    <div className="hidden lg:flex w-full px-4">
      <Carousel
        setApi={gallery.setApi}
        plugins={[gallery.autoplay.current]}
        opts={{ align: "start" }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-6">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-6 basis-full">
              <ExhibitionCard
                item={item}
                setActiveExhibitionSlug={setActiveExhibitionSlug}
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
  );
}

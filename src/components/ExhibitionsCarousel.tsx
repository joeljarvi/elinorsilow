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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function ExhibitionCard({ item, setActiveExhibitionSlug, setOpen, router }) {
  const image = item.acf.image_1?.url;

  return (
    <button
      className=" flex flex-col cursor-pointer gap-y-4 bg-background   transition-all text-left w-full"
      onClick={() => {
        setActiveExhibitionSlug(item.slug);
        setOpen(false);
        router.push(`/?exhibition=${item.slug}`);
      }}
      aria-label={`Öppna utställning: ${item.title.rendered}`}
    >
      <div className="relative w-full aspect-video lg:aspect-video">
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

      <div
        className="flex flex-col 
       text-sm font-directorLight text-left px-0 pb-4 lg:p-8   "
      >
        <div className="flex flex-col w-full lg:w-[400px] p-4 bg-background">
          <span className="font-directorBold uppercase mr-2 mb-0 lg:mb-2">
            {item.title.rendered}
          </span>

          {item.acf.location && (
            <span className="hidden lg:flex">{item.acf.location} </span>
          )}
          {item.acf.city && (
            <span className="hidden lg:flex">{item.acf.city} </span>
          )}

          {item.acf.exhibition_type && <span>{item.acf.exhibition_type}</span>}
          {item.acf.year && <span className="mr-2">{item.acf.year}</span>}
        </div>
      </div>
    </button>
  );
}

export function ExhibitionsCarousel({ items }: { items: Exhibition[] }) {
  const router = useRouter();
  const { setActiveExhibitionSlug, setOpen } = useExhibitions();

  const [api, setApi] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const gallery = useGalleryCarousel({
    enableKeyboard: true,
    id: "featured-exhibitions",
  });

  // Sync active index
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => api.off("select", onSelect);
  }, [api]);

  // Vertical scroll → horizontal snap
  useEffect(() => {
    if (!api) return;

    const section = document.getElementById("exhibitions-scroll");
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();

      const scrollProgress = Math.min(
        Math.max(-rect.top / (rect.height - window.innerHeight), 0),
        1
      );

      setProgress(scrollProgress);

      const snaps = api.scrollSnapList();
      const maxIndex = snaps.length - 1;
      const index = Math.round(scrollProgress * maxIndex);

      api.scrollTo(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api]);

  return (
    <section id="exhibitions-scroll" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden ">
        {/* CAROUSEL */}
        <Carousel
          setApi={(embla) => {
            gallery.setApi(embla);
            setApi(embla);
          }}
          opts={{
            align: "center", // important for snapping
            dragFree: false,
            containScroll: "trimSnaps",
          }}
          aria-label="Utvalda utställningar"
          className="h-full"
        >
          <CarouselContent className="h-full">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-full flex items-center justify-center"
              >
                <button
                  className="relative w-[70vw] h-[80vh] cursor-pointer"
                  onClick={() => {
                    setActiveExhibitionSlug(item.slug);
                    setOpen(false);
                    router.push(`/?exhibition=${item.slug}`);
                  }}
                  aria-label={`Öppna utställning: ${item.title.rendered}`}
                >
                  {item.acf.image_1?.url && (
                    <Image
                      src={item.acf.image_1.url}
                      alt={item.title.rendered}
                      fill
                      className="object-contain object-left-top"
                      priority
                    />
                  )}
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* CAPTIONS */}
        <div className="absolute bottom-16 left-16 z-50 pointer-events-none">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              animate={{ opacity: activeIndex === index ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              className="absolute"
            >
              <h2 className="font-directorBold h2">{item.title.rendered}</h2>

              <div className="mt-2 h3 text-sm font-directorLight">
                {item.acf.location && <div>{item.acf.location}</div>}
                {item.acf.city && <div>{item.acf.city}</div>}
                {item.acf.exhibition_type && (
                  <div>{item.acf.exhibition_type}</div>
                )}
                {item.acf.year && <div>{item.acf.year}</div>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div className="absolute bottom-16 right-16 w-40 h-[2px] bg-white/20 z-50">
          <motion.div
            className="h-full bg-white"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
}

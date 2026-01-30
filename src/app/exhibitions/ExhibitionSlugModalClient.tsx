"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useExhibitions } from "@/context/ExhibitionsContext";

import { Exhibition } from "../../../lib/wordpress";
import { AnimatePresence, motion } from "framer-motion";
import type { CarouselApi } from "@/components/ui/carousel";

import { ArrowLeftIcon } from "@radix-ui/react-icons";

type Props = {
  slug: string;
  onClose?: () => void;
};

export default function ExhibitionSlugModalClient({ slug, onClose }: Props) {
  const { getExhibitionBySlug } = useExhibitions();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);

  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    getExhibitionBySlug(slug).then((ex) => {
      if (!ex) {
        setLoading(false);
        return;
      }
      setExhibition(ex);
      setLoading(false);
    });
  }, [slug, getExhibitionBySlug]);

  useEffect(() => {
    if (!isCarouselOpen || !api) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCarouselOpen(false);
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCarouselOpen, api]);

  useEffect(() => {
    if (!isCarouselOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCarouselOpen]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCarouselIndex(api.selectedScrollSnap());
      setIsZoomed(false);
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (isCarouselOpen && api) {
      api.scrollTo(carouselIndex, true);
    }
  }, [isCarouselOpen, carouselIndex, api]);

  if (loading || !exhibition || !exhibition.acf) {
    return <div></div>;
  }

  const images = [
    exhibition.acf.image_1,
    exhibition.acf.image_2,
    exhibition.acf.image_3,
    exhibition.acf.image_4,
    exhibition.acf.image_5,
    exhibition.acf.image_6,
    exhibition.acf.image_7,
    exhibition.acf.image_8,
    exhibition.acf.image_9,
    exhibition.acf.image_10,
  ]
    .filter(Boolean)
    .map((img, idx) => ({
      id: img?.id ?? `img-${idx}`,

      url: img?.url ?? "",
      desc: img?.description ?? "",
    }));

  console.log(
    "images:",
    images.length,
    images.map((i) => i.url)
  );
  console.log("carouselIndex:", carouselIndex);

  return (
    <div
      className="col-start-1 lg:col-start-2
    col-span-6 lg:col-span-4
    relative
gap-4
 grid grid-cols-3
  p-4 lg:p-4 text-sm
  z-40  w-full bg-background 
"
    >
      <div className="bg-orange-300 col-span-3 p-6   ">
        <div className="col-span-3 grid grid-cols-3     justify-start ">
          <span className="w-full  col-span-3 lg:col-span-2">
            <button
              onClick={() => {
                setCarouselIndex(0);
                setIsCarouselOpen(true);
              }}
              className="relative w-2/3 aspect-video overflow-hidden "
            >
              <Image
                src={images[0]?.url}
                alt=""
                fill
                className="object-cover transition-transform hover:scale-105"
              />
            </button>

            <div className="flex flex-wrap items-baseline justify-start max-w-64     ">
              <h1 className="font-EBGaramondItalic   tracking-normal mr-1   ">
                {exhibition.title.rendered}
              </h1>
              {exhibition.acf.location && (
                <span className="font-EBGaramond   ">
                  {exhibition.acf.location}
                </span>
              )}
              {exhibition.acf.city && (
                <span className="font-EBGaramond   ">
                  , {exhibition.acf.city}
                </span>
              )}

              {exhibition.acf.year && (
                <span className="font-EBGaramond ml-1  ">
                  ({exhibition.acf.year})
                </span>
              )}
            </div>
          </span>
        </div>
        <div className="mt-24 col-span-3 lg:col-span-2  lg:max-w-full font-EBGaramond mb-3">
          <h3>{exhibition.acf.description}</h3>
        </div>

        <div className="col-span-3  grid grid-cols-3 gap-4 w-full  ">
          {images.map((src, idx) => (
            <div key={idx} className="col-span-3 lg:col-span-2 flex flex-col">
              <button
                onClick={() => {
                  setCarouselIndex(idx);
                  setIsCarouselOpen(true);
                }}
                className="relative aspect-video overflow-hidden flex flex-col"
              >
                <Image
                  src={src.url}
                  alt={src.desc || `Image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform hover:scale-105 cursor-pointer"
                />
              </button>
              {src.desc && (
                <div className="w-full font-EBGaramond p-2">{src.desc}</div>
              )}
            </div>
          ))}
        </div>
        <div className=" col-span-3 font-EBGaramond pb-0 flex flex-col items-start justify-center gap-y-2 my-6">
          <h3>{exhibition.acf.credits}</h3>

          <span className="flex items-center justify-between w-full gap-x-4">
            <Button
              className="   font-EBGaramond hover:font-EBGaramondItalic cursor-pointertransition-all"
              size="linkSize"
              variant="link"
              onClick={onClose}
            >
              Back to exhibitions
            </Button>
            <span className="flex items-center justify-end gap-x-2"></span>
            <button className="font-EBGaramond hover:font-EBGaramondItalic transition-all cursor-pointer">
              Previous
            </button>
            <button className="font-EBGaramond hover:font-EBGaramondItalic transition-all cursor-pointer">
              Next
            </button>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isCarouselOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 h-screen w-full grid grid-cols-4"
          >
            {/* backdrop only on content area */}
            <div
              className="col-start-2 col-span-3 lg:bg-black/30 bg-black/50 absolute inset-y-0 right-0"
              onClick={() => setIsCarouselOpen(false)}
            />
            <div className="relative inset-y-0 right-0 col-start-2 col-span-3 lg:relative lg:col-start-2 lg:col-span-3 w-full h-full pointer-events-auto bg-background">
              <Carousel
                setApi={setApi}
                opts={{ startIndex: carouselIndex }}
                className="h-full w-full"
              >
                <CarouselContent className="h-full">
                  {images.map((img, idx) => (
                    <CarouselItem
                      key={img.id}
                      className="h-full flex flex-col items-center justify-center"
                    >
                      <motion.div className="relative h-full w-full flex flex-col items-start justify-start pointer-events-auto">
                        {/* Image */}
                        <div className="relative w-full h-[calc(100vh-6rem)] lg:h-[calc(100vh-2rem)] aspect-video flex items-center justify-center">
                          <Image
                            src={img.url}
                            alt={img.desc || `Image ${idx + 1}`}
                            fill
                            className={`object-center object-contain transition-transform duration-300 py-4  ${
                              isZoomed
                                ? "scale-150 cursor-zoom-out"
                                : "cursor-zoom-in"
                            }`}
                            onClick={() => setIsZoomed(!isZoomed)}
                          />
                        </div>

                        {/* Description */}
                        {img.desc && (
                          <div className="px-4 font-EBGaramond flex flex-wrap items-baseline text-center justify-center max-w-xs lg:max-w-5xl mx-auto   ">
                            {img.desc}
                          </div>
                        )}
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Prev */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  api?.scrollNext();
                }}
                className="absolute z-30 left-4 top-1/2 -translate-y-1/2 pointer-events-auto  leading-none"
              >
                <ArrowLeftIcon className="w-3 h-3" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  api?.scrollNext();
                }}
                className="absolute z-30 right-4 top-1/2 -translate-y-1/2 pointer-events-auto  leading-none"
              >
                <ArrowRightIcon className="w-3 h-3" />
              </button>

              {/* Counter */}
              {/* <div className="fixed z-40 top-4 left-4 mix-blend-difference text-background px-3 py-1 rounded font-EBGaramond select-none pointer-events-none text-sm">
              {carouselIndex + 1} / {images.length}
            </div> */}

              {/* Back button */}
              <Button
                className="absolute top-4 right-4 z-40 font-EBGaramond hover:font-EBGaramondItalic cursor-pointer transition-all"
                size="sm"
                variant="link"
                onClick={() => setIsCarouselOpen(false)}
              >
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

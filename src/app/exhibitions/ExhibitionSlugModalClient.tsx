"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useExhibitions } from "@/context/ExhibitionsContext";

import { Exhibition, getExhibitionBySlug } from "../../../lib/wordpress";
import { AnimatePresence, motion } from "framer-motion";
import type { CarouselApi } from "@/components/ui/carousel";
import HDivider from "@/components/HDivider";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";
import { useLenis } from "lenis/react";

type Props = {
  slug: string;
  onClose?: () => void;
};

export default function ExhibitionSlugModalClient({ slug, onClose }: Props) {
  const router = useRouter();
  const lenis = useLenis();
  const { filteredExhibitions, getExhibitionBySlug: getFromContext } =
    useExhibitions();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const loadExhibitionByIndex = useCallback(
    async (index: number) => {
      if (
        !filteredExhibitions ||
        index < 0 ||
        index >= filteredExhibitions.length
      )
        return;
      const ex = filteredExhibitions[index];
      setExhibition(ex);
      setCurrentIndex(index);
      setLoading(false);
      window.history.replaceState(null, "", `/?exhibition=${ex.slug}`);
    },
    [filteredExhibitions]
  );

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    if (filteredExhibitions && filteredExhibitions.length > 0) {
      const index = filteredExhibitions.findIndex((e) => e.slug === slug);
      if (index >= 0) {
        setExhibition(filteredExhibitions[index]);
        setCurrentIndex(index);
        setLoading(false);
        return;
      }
    }

    getFromContext(slug).then((ex) => {
      if (!ex) {
        setLoading(false);
        return;
      }
      setExhibition(ex);
      setLoading(false);
    });
  }, [slug, getFromContext, filteredExhibitions]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) loadExhibitionByIndex(currentIndex - 1);
  }, [currentIndex, loadExhibitionByIndex]);

  const goNext = useCallback(() => {
    if (filteredExhibitions && currentIndex < filteredExhibitions.length - 1)
      loadExhibitionByIndex(currentIndex + 1);
  }, [currentIndex, filteredExhibitions, loadExhibitionByIndex]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
  });

  useEffect(() => {
    // Only handle global keys if carousel is CLOSED
    if (isCarouselOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCarouselOpen, goPrev, goNext, onClose]);

  // Carousel specific keys
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
      {...swipeHandlers}
      className="col-start-1 lg:col-start-2
    col-span-6 lg:col-span-4
    relative
gap-4
 grid grid-cols-3
  pt-4 px-2 pb-2  lg:px-4 lg:pt-4 text-sm lg:text-sm
  z-40  w-full bg-background  scroll-bar-hide text-foreground/30
"
    >
      <div className=" col-span-3  ">
        <div className="col-span-3 flex flex-col lg:grid grid-cols-3     justify-center items-center w-full ">
          <span className="w-full  col-span-3 lg:col-span-2 flex flex-col items-center justify-center lg:items-start lg:justify-start">
            {/* <button
              onClick={() => {
                setCarouselIndex(0);
                setIsCarouselOpen(true);
              }}
              className="relative w-full h-full aspect-video overflow-hidden max-w-3/4  "
            >
              <Image
                src={images[0]?.url}
                alt=""
                fill
                className="object-contain  object-left transition-transform hover:scale-105 "
              />
            </button> */}

            <div className="flex flex-wrap items-baseline justify-center lg:justify-start max-w-full w-full  text-xs lg:max-w-full  lg:mt-0 px-2 font-gintoRegular tracking-wide ">
              <h1 className="font-gintoRegularItalic ">
                {exhibition.title.rendered},
              </h1>
              {exhibition.acf.year && (
                <span className="font-gintoRegular ml-1  ">
                  {exhibition.acf.year},
                </span>
              )}
              {exhibition.acf.exhibition_type && (
                <span className="ml-1   ">
                  {exhibition.acf.exhibition_type}
                </span>
              )}
              {exhibition.acf.location && (
                <span className="  ">, {exhibition.acf.location}</span>
              )}
              {exhibition.acf.city && (
                <span className="  ">, {exhibition.acf.city}</span>
              )}

              <Button
                className="  font-gintoBlack     transition-all  tracking-wide justify-start items-baseline  rounded  text-xs gap-x-1  ml-2  uppercase text-foreground/80"
                size="sm"
                variant="link"
                onClick={onClose}
              >
                Back
              </Button>
            </div>
          </span>
        </div>
        <div className="mt-24 col-span-3 lg:col-span-2 px-4 max-w-92  lg:max-w-lg font-gintoRegular mx-0 text-left text-xs tracking-wide  mb-2 lg:mb-2">
          <h3>{exhibition.acf.description}</h3>
        </div>

        <div className="col-span-3  grid grid-cols-3 gap-2 lg:gap-4 w-full  ">
          {images.map((src, idx) => (
            <div key={idx} className="col-span-3 lg:col-span-2 flex flex-col">
              <button
                onClick={() => {
                  setCarouselIndex(idx);
                  setIsCarouselOpen(true);
                }}
                className="relative aspect-video overflow-hidden flex flex-col w-full h-full"
              >
                <Image
                  src={src.url}
                  alt={src.desc || `Image ${idx + 1}`}
                  fill
                  className="object-contain object-center lg:object-left transition-transform hover:scale-105 cursor-pointer"
                />
              </button>
              {src.desc && (
                <div className="w-full p text-sm lg:text-sm px-2 mt-2 text-center lg:text-left">
                  {src.desc}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className=" col-span-3 lg:col-span-3 p pb-0 flex flex-col items-center lg:items-start justify-center gap-y-2 mt-8 lg:mt-4 text-sm lg:text-sm mx-auto w-full  ">
          <h3 className=" col-span-3 lg:col-span-2 px-4 max-w-92  lg:max-w-lg font-gintoRegular mx-0 text-left text-xs tracking-wide  mb-2 lg:mb-2">
            {exhibition.acf.credits}
          </h3>
          <HDivider />
          <span className="flex items-center justify-center lg:items-center lg:justify-start w-full gap-x-4">
            <Button
              className="hidden lg:flex font-gintoRegular    transition-all  tracking-wide justify-start items-baseline  text-xs gap-x-1 uppercase "
              size="sm"
              variant="link"
              onClick={onClose}
            >
              Back
            </Button>
            <Button
              className=" font-gintoRegular    transition-all  tracking-wide justify-start items-baseline  text-xs gap-x-1 uppercase"
              size="sm"
              variant="link"
              onClick={goPrev}
              disabled={currentIndex <= 0}
            >
              Prev
            </Button>
            <Button
              className=" font-gintoRegular    transition-all  tracking-wide justify-start items-baseline  text-xs gap-x-1 uppercase"
              size="sm"
              variant="link"
              onClick={goNext}
              disabled={
                !filteredExhibitions ||
                currentIndex >= filteredExhibitions.length - 1
              }
            >
              Next
            </Button>
          </span>
        </div>
        {/* <div className="col-span-3 flex justify-center py-8">
          <Button
            variant="link"
            size="sm"
            className="p text-foreground hover:text-foreground/70"
            onClick={() => {
              const el = document.querySelector(".overflow-auto");
              if (el) el.scrollTo({ top: 0, behavior: "smooth" });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Back to Top
          </Button>
        </div> */}
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
              className="col-start-1 col-span-4 lg:col-start-2 lg:col-span-3 lg:bg-black/30 bg-black/50 absolute inset-y-0 right-0"
              onClick={() => setIsCarouselOpen(false)}
            />
            <div className="relative inset-y-0 right-0 col-start-1 col-span-4 lg:col-start-2 lg:col-span-3 lg:relative  w-full h-full pointer-events-auto bg-background">
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
                        <div className="relative w-full h-screen aspect-video flex items-center justify-center">
                          <Image
                            src={img.url}
                            alt={img.desc || `Image ${idx + 1}`}
                            fill
                            className={`object-center object-contain transition-transform duration-300 p-2 lg:p-4  ${
                              isZoomed
                                ? "scale-150 cursor-zoom-out"
                                : "cursor-zoom-in"
                            }`}
                            onClick={() => setIsZoomed(!isZoomed)}
                          />
                        </div>

                        {/* Description */}
                        {img.desc && (
                          <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2  px-1 font-EBGaramond flex flex-wrap items-baseline text-center justify-center max-w-sm lg:max-w-5xl mx-auto  bg-background pt-0  leading-tight ">
                            {img.desc}
                          </div>
                        )}
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Prev */}
              {/* <button
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
              </button> */}

              {/* Counter */}
              {/* <div className="fixed z-40 top-4 left-4 mix-blend-difference text-background px-3 py-1 rounded font-EBGaramond select-none pointer-events-none text-sm">
              {carouselIndex + 1} / {images.length}
            </div> */}

              {/* Back button */}
              <Button
                className="absolute top-2 left-1/2 -translate-x-1/2  flex z-50   font-gintoRegular    transition-all  tracking-wide justify-start items-baseline  text-xs gap-x-1 uppercase"
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

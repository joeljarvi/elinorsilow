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
 grid grid-cols-6
  pt-4 px-2 pb-2  lg:px-0 lg:pt-4 
  z-30  w-full bg-red-500  scroll-bar-hide 
"
    >
      <span className=" mt-8 lg:mt-12 w-full  col-span-6 lg:col-span-6 flex justify-between lg:grid grid-cols-6  gap-4">
        <div className="col-span-3 flex lg:hidden flex-col     justify-start px-2 lg:px-0 items-start w-full h3">
          <h1 className=" ">{exhibition.title.rendered}</h1>
          {exhibition.acf.year && (
            <span className="">{exhibition.acf.year}</span>
          )}
          {exhibition.acf.exhibition_type && (
            <span className=" ">{exhibition.acf.exhibition_type}</span>
          )}
          {exhibition.acf.location && (
            <span className="  ">{exhibition.acf.location}</span>
          )}
          {exhibition.acf.city && (
            <span className="  ">{exhibition.acf.city}</span>
          )}
        </div>
        <div className="hidden lg:flex col-span-3  flex-wrap items-baseline justify-center lg:justify-start max-w-full w-full  lg:max-w-full   pl-4 h3  ">
          <h1 className=" ">{exhibition.title.rendered},</h1>
          {exhibition.acf.year && (
            <span className="ml-1  ">{exhibition.acf.year},</span>
          )}
          {exhibition.acf.exhibition_type && (
            <span className="ml-1   ">{exhibition.acf.exhibition_type}</span>
          )}
          {exhibition.acf.location && (
            <span className="  ">, {exhibition.acf.location}</span>
          )}
          {exhibition.acf.city && (
            <span className="  ">, {exhibition.acf.city}</span>
          )}
        </div>
        <Button
          className="col-start-4 justify-end lg:justify-start "
          variant="link"
          size="sm"
          onClick={() => {
            const url = `${window.location.origin}/exhibitions/${exhibition.slug}`;
            navigator.clipboard.writeText(url);
          }}
        >
          Dela
        </Button>
        <Button
          className="col-start-5 justify-end  lg:justify-start pr-4 lg:pr-0"
          size="sm"
          variant="link"
          onClick={onClose || (() => router.push("/"))}
        >
          Tillbaka
        </Button>
      </span>

      <div
        className="mt-30 col-span-6 lg:col-span-5
      flex flex-col items-start justify-start px-2 lg:px-4  mx-0 text-left  mb-2 lg:mb-2 w-full"
      >
        <div className="grid grid-cols-5 gap-4 w-full">
          <h3 className="col-span-4 lg:col-span-2 h3 whitespace-normal  mb-4 lg:mb-2">
            {exhibition.acf.description}
          </h3>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative w-full grid grid-cols-5"
        >
          {/* backdrop only on content area */}

          <div className="relative inset-y-0 right-0 col-start-1 col-span-4 lg:col-start-1 lg:col-span-5 lg:relative  w-full h-full pointer-events-auto bg-background pt-18">
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
                      <div className="relative  mx-auto lg:mx-0 h-full w-screen lg:w-auto  lg:h-[calc(100vh-10rem)] aspect-square lg:aspect-video">
                        <Image
                          src={img.url}
                          alt={img.desc || `Image ${idx + 1}`}
                          fill
                          className="object-contain object-top lg:object-center px-6 lg:px-0"
                        />
                        {img.desc && (
                          <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2  px-1 font-EBGaramond flex flex-wrap items-baseline text-center justify-center max-w-sm lg:max-w-5xl mx-auto  bg-background pt-0  leading-tight ">
                            {img.desc}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

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
            {/* 
            {/* Counter */}
            <div className="absolute z-40 top-4 left-4 mix-blend-difference text-background px-3 py-1 rounded font-EBGaramond select-none pointer-events-none text-sm">
              {carouselIndex + 1} / {images.length}
            </div>

            {/* Back button */}
            <Button
              className="absolute left-2 bottom-16  flex z-50   "
              size="sm"
              variant="link"
              onClick={() => setIsCarouselOpen(false)}
            >
              Back
            </Button>
          </div>
        </motion.div>
        {/* <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-2 w-full mb-4">
          {images.map((src, idx) => (
            <div key={idx} className="col-span-1  flex flex-col  gap-4 w-full">
              <button
                onClick={() => {
                  setCarouselIndex(idx);
                  setIsCarouselOpen(true);
                }}
                className="relative aspect-square lg:aspect-video  overflow-hidden lg:flex flex-col w-full  "
              >
                <Image
                  src={src.url}
                  alt={src.desc || `Image ${idx + 1}`}
                  fill
                  className="object-cover object-center  cursor-pointer"
                />
              </button>
            </div>
          ))}
        </div> */}
        <div className="grid grid-cols-5 gap-4 w-full">
          <h3 className=" col-start-1 col-span-5 lg:col-span-1 max-w-xs lg:max-w-full   mx-0 h3 mb-2 lg:mb-2">
            {exhibition.acf.credits}
          </h3>
        </div>

        <div className=" col-span-3 lg:col-span-3 p pb-0 flex flex-col items-center lg:items-start justify-center gap-y-2 mt-2 text-sm lg:text-sm mx-auto w-full  ">
          <HDivider />
          <span className="flex items-center justify-between lg:items-center lg:justify-start w-full gap-x-4">
            <Button
              className="hidden lg:flex  "
              size="sm"
              variant="link"
              onClick={onClose}
            >
              Back
            </Button>
            <Button
              className=" "
              size="sm"
              variant="link"
              onClick={goPrev}
              disabled={currentIndex <= 0}
            >
              Prev
            </Button>
            <Button
              className=" "
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
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";

import { Exhibition } from "../../../lib/wordpress";
import { motion } from "framer-motion";
import { useUI } from "@/context/UIContext";
import HDivider from "@/components/HDivider";
import Link from "next/link";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  onClose?: () => void;
};

export default function ExhibitionSlugModalClient({ slug, onClose }: Props) {
  const router = useRouter();
  const { open, setOpen } = useUI();
  const { filteredExhibitions, getExhibitionBySlug: getFromContext } =
    useExhibitions();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const [carouselIndex, setCarouselIndex] = useState(0);

  const modalGallery = useGalleryCarousel({
    enableKeyboard: true,
    id: "modal-gallery", // unique id
  });

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

  const works = [
    exhibition.acf.work_1,
    exhibition.acf.work_2,
    exhibition.acf.work_3,
    exhibition.acf.work_4,
    exhibition.acf.work_5,
    exhibition.acf.work_6,
    exhibition.acf.work_7,
    exhibition.acf.work_8,
    exhibition.acf.work_9,
    exhibition.acf.work_10,
  ].filter(Boolean);

  console.log(
    "images:",
    images.length,
    images.map((i) => i.url)
  );
  console.log("carouselIndex:", carouselIndex);

  return (
    <div
      {...swipeHandlers}
      className="
    relative
gap-4
 grid grid-cols-6
p-4
overflow-y-scroll
  z-30  w-full   scroll-bar-hide bg-background shadow 
"
    >
      <span className="   w-full  col-span-6 lg:col-span-6 flex justify-between lg:grid grid-cols-6  gap-4">
        <div className=" col-span-6 flex flex-col   justify-start  items-start w-full h3">
          <div className="flex justify-between w-full">
            <h1 className="  max-w-xs uppercase font-directorBold ">
              {exhibition.title.rendered}
            </h1>
            <div className=" flex gap-x-4  ">
              <Button
                className="hidden lg:flex"
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
                className=""
                size="sm"
                variant="link"
                onClick={onClose || (() => router.push("/"))}
              >
                Stäng (x)
              </Button>
            </div>
          </div>
          {exhibition.acf.exhibition_type && (
            <span className=" ">{exhibition.acf.exhibition_type}</span>
          )}
          {exhibition.acf.year && (
            <span className="">Year: {exhibition.acf.year}</span>
          )}
          {exhibition.acf.location && (
            <span className="  ">Location: {exhibition.acf.location}</span>
          )}

          {exhibition.acf.city && (
            <span className="  ">City: {exhibition.acf.city}</span>
          )}
        </div>
      </span>

      <h3 className="mt-30 col-span-5 lg:col-span-3 h3 whitespace-normal ">
        {exhibition.acf.description}
      </h3>

      {/* backdrop only on content area */}

      <div className=" flex flex-col inset-y-0 right-0 col-start-1 col-span-6 relative  w-full h-full pointer-events-auto bg-background mb-8 ">
        <Carousel
          setApi={modalGallery.setApi}
          opts={{ startIndex: carouselIndex, align: "start" }}
          className="h-full w-full "
        >
          <CarouselContent className="h-full w-full ">
            {images.map((img, idx) => (
              <CarouselItem
                key={img.id}
                className="h-full w-full flex flex-col items-start justify-start  basis-full"
              >
                <motion.div
                  className="relative h-full w-full flex flex-col items-start justify-start pointer-events-auto gap-y-4 
                "
                >
                  {/* Image */}
                  <div className="relative  mx-0 h-full w-screen lg:w-auto  lg:h-[calc(100vh-10rem)] aspect-square lg:aspect-video">
                    <Image
                      src={img.url}
                      alt={img.desc || `Image ${idx + 1}`}
                      fill
                      className="object-contain object-left-top lg:object-left "
                    />
                  </div>

                  {/* Description */}
                  {img.desc && (
                    <div className="relative  p-4 h3 whitespace-normal  flex flex-wrap items-baseline text-left justify-start max-w-full lg:max-w-5xl   bg-background pt-0  leading-tight ">
                      {img.desc}
                    </div>
                  )}
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Counter */}
        <div className="absolute z-40 top-4 left-4 mix-blend-difference text-background px-3 py-1 rounded font-EBGaramond select-none pointer-events-none text-sm">
          {modalGallery.index + 1} / {images.length}
        </div>

        {works.length > 0 && (
          <div className="col-span-6 lg:col-span-6 mb-8">
            <h4 className="h4 font-directorBold mb-2">Verk i utställningen:</h4>

            <ul className="space-y-0 grid grid-cols-2 gap-x-4 lg:grid-cols-3">
              {works.map((work: any, index: number) => (
                <li key={work.id ?? index}>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-left text-blue-600 "
                    onClick={() => {
                      setOpen(false);
                      router.push(`/?work=${work.slug}`);
                    }}
                  >
                    {work}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h3 className=" col-start-1 col-span-6    whitespace-normal   mx-0 h3 mb-4 lg:mb-2">
          {exhibition.acf.credits}
        </h3>
      </div>

      <div className=" col-start-1 col-span-4 lg:col-span-3 p pb-0 flex  gap-y-4 mt-4  w-full  ">
        <Button className="  " size="sm" variant="link" onClick={onClose}>
          Tillbaka (x)
        </Button>
        <Button
          className=" "
          size="sm"
          variant="link"
          onClick={goPrev}
          disabled={currentIndex <= 0}
        >
          Föregående
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
          Nästa
        </Button>
      </div>
    </div>
  );
}

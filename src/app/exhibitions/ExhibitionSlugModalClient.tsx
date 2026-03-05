"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";
import { Cross1Icon } from "@radix-ui/react-icons";

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
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxCarousel = useGalleryCarousel({
    enableKeyboard: lightboxIndex !== null,
    id: "lightbox-gallery",
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
    [filteredExhibitions],
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, lightboxIndex]);

  if (loading || !exhibition || !exhibition.acf) return <div />;

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
      alt: img?.alt ?? "",
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

  const scrollToTop = () => {
    const scrollable = document.querySelector('[aria-modal="true"]');
    if (scrollable) scrollable.scrollTop = 0;
  };

  return (
    <>
      <div
        id="modal-top"
        {...swipeHandlers}
        className="relative gap-0 p-4 z-30 w-full scroll-bar-hide bg-background shadow justify-start flex flex-col"
      >
        {/* Header */}
        <div className="flex items-baseline justify-between w-full  p-8 lg:p-4">
          <h1 id="exhibition-modal-title" className="h1 text-2xl">
            {exhibition.title.rendered}
          </h1>
          <div className="flex gap-x-4 items-baseline">
            <Button
              className="hidden lg:flex"
              variant="link"
              size="lg"
              aria-label="Copy exhibition link"
              onClick={() => {
                const url = `${window.location.origin}/exhibitions/${exhibition.slug}`;
                navigator.clipboard.writeText(url);
              }}
            >
              Share
            </Button>
            <Button
              className="aspect-square h-auto"
              size="lg"
              variant="link"
              onClick={onClose || (() => router.push("/"))}
            >
              Close (x)
            </Button>
          </div>
        </div>

        {/* Image grid */}
        <div className="w-full mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-8">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-video bg-foreground/5 overflow-hidden cursor-zoom-in"
                aria-label={`Visa bild ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || img.desc || `Bild ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>

          {/* Description — spans full width, split into 2 columns */}
          {exhibition.acf.description && (
            <div className="mt-8 columns-1 lg:columns-2 gap-8 w-full h3 whitespace-normal p-4 p text-2xl font-bookish">
              {exhibition.acf.description}
            </div>
          )}

          {works.length > 0 && (
            <div className="mb-8 mt-8 p-4">
              <h4 className="h3  text-2xl mb-2">Verk i utställningen:</h4>
              <ul className="space-y-0 grid grid-cols-1 gap-x-4 lg:grid-cols-4">
                {works.map((work: any, index: number) => (
                  <li key={index}>
                    <Button
                      variant="link"
                      size="lg"
                      className="p-0 h-auto text-left text-blue-600"
                      onClick={() => {
                        setOpen(false);
                        router.push(`/?work=${work}`);
                      }}
                    >
                      {work}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="whitespace-normal mx-0 h3 mb-4 lg:mb-2 mt-4 columns-1 lg:columns-2 gap-8 w-full h3  text-2xl p-4">
            {exhibition.acf.credits}
          </h3>
        </div>

        <div className="pb-0 flex gap-y-4 mt-4 w-full justify-between items-center">
          <div className="flex">
            <Button size="lg" variant="link" onClick={onClose}>
              Back (x)
            </Button>
            <Button
              size="lg"
              variant="link"
              onClick={goPrev}
              disabled={currentIndex <= 0}
            >
              Prev
            </Button>
            <Button
              size="lg"
              variant="link"
              onClick={goNext}
              disabled={
                !filteredExhibitions ||
                currentIndex >= filteredExhibitions.length - 1
              }
            >
              Next
            </Button>
          </div>
          <Button size="lg" variant="link" onClick={scrollToTop}>
            Back to top ↑
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col">
          <div className="absolute flex justify-between items-baseline w-full px-4 py-3 shrink-0 z-">
            <span className="text-foreground/60 text-2xl font-bookish">
              {lightboxCarousel.index + 1} / {images.length}
            </span>
            <Button
              size="lg"
              variant="link"
              className="items-start aspect-square z-50"
              onClick={() => setLightboxIndex(null)}
              aria-label="Stäng bildvisning"
            >
              Close (x)
            </Button>
          </div>

          <Carousel
            setApi={lightboxCarousel.setApi}
            opts={{ startIndex: lightboxIndex, align: "center", loop: true }}
            className="flex-1 min-h-0 overflow-hidden"
          >
            <CarouselContent className="-ml-0 h-full">
              {images.map((img, idx) => (
                <CarouselItem
                  key={img.id}
                  className="pl-0 flex flex-col items-center justify-center gap-4 px-8 h-[calc(100vh-60px)]"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.url}
                      alt={img.alt || img.desc || `Bild ${idx + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {img.desc && (
                    <p className="text-white/70 text-sm text-center max-w-xl shrink-0 pb-4">
                      {img.desc}
                    </p>
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </>
  );
}

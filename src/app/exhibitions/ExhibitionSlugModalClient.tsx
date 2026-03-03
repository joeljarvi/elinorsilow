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
      if (!filteredExhibitions || index < 0 || index >= filteredExhibitions.length)
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
      if (!ex) { setLoading(false); return; }
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

  const swipeHandlers = useSwipe({ onSwipedLeft: goNext, onSwipedRight: goPrev });

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

  return (
    <>
      <div
        {...swipeHandlers}
        className="relative gap-4 grid grid-cols-6 p-4 z-30 w-full scroll-bar-hide bg-background shadow"
      >
        <span className="w-full col-span-6 lg:col-span-6 flex justify-between lg:grid grid-cols-6 gap-4">
          <div className="col-span-6 lg:col-start-2 lg:col-span-5 flex flex-col justify-start items-start w-full h3">
            <div className="flex justify-between w-full">
              <h1 id="exhibition-modal-title" className="max-w-xs uppercase font-directorBold">
                {exhibition.title.rendered}
              </h1>
              <div className="flex gap-x-4">
                <Button
                  className="hidden lg:flex"
                  variant="link"
                  size="sm"
                  aria-label="Dela länk till utställning"
                  onClick={() => {
                    const url = `${window.location.origin}/exhibitions/${exhibition.slug}`;
                    navigator.clipboard.writeText(url);
                  }}
                >
                  Dela
                </Button>
                <Button
                  size="sm"
                  variant="link"
                  onClick={onClose || (() => router.push("/"))}
                >
                  Stäng (x)
                </Button>
              </div>
            </div>
            {exhibition.acf.exhibition_type && (
              <span>{exhibition.acf.exhibition_type}</span>
            )}
            {exhibition.acf.year && <span>Year: {exhibition.acf.year}</span>}
            {exhibition.acf.location && <span>Location: {exhibition.acf.location}</span>}
            {exhibition.acf.city && <span>City: {exhibition.acf.city}</span>}
          </div>
        </span>

        <h3 className="mt-30 col-span-5 lg:mt-0 lg:col-start-4 lg:col-span-2 h3 whitespace-normal">
          {exhibition.acf.description}
        </h3>

        {/* Image grid */}
        <div className="flex flex-col col-start-1 col-span-6 relative w-full pointer-events-auto bg-background mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-square bg-foreground/5 overflow-hidden cursor-zoom-in"
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

          {works.length > 0 && (
            <div className="col-span-6 lg:col-span-6 mb-8 mt-8">
              <h4 className="h4 font-directorBold mb-2">Verk i utställningen:</h4>
              <ul className="space-y-0 grid grid-cols-2 gap-x-4 lg:grid-cols-3">
                {works.map((work: any, index: number) => (
                  <li key={index}>
                    <Button
                      variant="link"
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

          <h3 className="col-start-1 col-span-6 whitespace-normal mx-0 h3 mb-4 lg:mb-2 mt-4">
            {exhibition.acf.credits}
          </h3>
        </div>

        <div className="col-start-1 col-span-4 lg:col-span-3 pb-0 flex gap-y-4 mt-4 w-full">
          <Button size="sm" variant="link" onClick={onClose}>
            Tillbaka (x)
          </Button>
          <Button
            size="sm"
            variant="link"
            onClick={goPrev}
            disabled={currentIndex <= 0}
          >
            Föregående
          </Button>
          <Button
            size="sm"
            variant="link"
            onClick={goNext}
            disabled={!filteredExhibitions || currentIndex >= filteredExhibitions.length - 1}
          >
            Nästa
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 shrink-0">
            <span className="text-white/60 text-sm">
              {lightboxCarousel.index + 1} / {images.length}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-white/70"
              onClick={() => setLightboxIndex(null)}
              aria-label="Stäng bildvisning"
            >
              <Cross1Icon aria-hidden="true" />
            </Button>
          </div>

          <Carousel
            setApi={lightboxCarousel.setApi}
            opts={{ startIndex: lightboxIndex, align: "center", loop: true }}
            className="flex-1 min-h-0"
          >
            <CarouselContent className="h-full">
              {images.map((img, idx) => (
                <CarouselItem
                  key={img.id}
                  className="h-full flex flex-col items-center justify-center gap-4 px-8"
                >
                  <div className="relative w-full flex-1 min-h-0">
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

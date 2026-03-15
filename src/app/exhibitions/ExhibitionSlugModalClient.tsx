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
import { useWorks, normalizeSlug } from "@/context/WorksContext";
import WorkModal from "@/app/works/WorkModal";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";
import { Exhibition } from "../../../lib/sanity";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";
import { Cross1Icon } from "@radix-ui/react-icons";


type Props = {
  slug: string;
  onClose?: () => void;
};

export default function ExhibitionSlugModalClient({ slug, onClose }: Props) {
  const router = useRouter();
  const { filteredExhibitions, getExhibitionBySlug: getFromContext } =
    useExhibitions();
  const { setActiveWorkSlug, activeWorkSlug } = useWorks();
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
      isLandscape:
        img?.width && img?.height ? img.width >= img.height : true,
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
        id="modal-top"
        {...swipeHandlers}
        className="relative w-full bg-background"
      >
        {/* Fixed controls */}
        <div className="fixed top-0 right-0 z-50 flex items-center gap-x-2 p-4">
          <Button
            className="aspect-square h-auto"
            size="lg"
            variant="link"
            onClick={onClose || (() => router.push("/"))}
            aria-label="close"
          >
            <Cross1Icon aria-hidden="true" />
          </Button>
        </div>

        {/* Hero */}
        {/* Mobile: full-screen image with text overlay + progressive blur */}
        <div className="relative h-screen lg:hidden">
          {exhibition.acf.image_1 && (
            <Image
              src={exhibition.acf.image_1.url}
              alt={exhibition.title.rendered}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          )}
          {/* Progressive blur overlay at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.85) 30%, hsl(var(--background) / 0.4) 60%, transparent 100%)",
              backdropFilter: "blur(0px)",
            }}
          />
          <div className="absolute inset-0 p-8 font-bookish flex flex-col items-center justify-center text-center backdrop-blur-sm">
            <h1
              id="exhibition-modal-title"
              className="text-foreground text-3xl leading-tight mb-3"
            >
              {exhibition.title.rendered}
            </h1>
            <p className="text-foreground/70 text-base">
              {[
                exhibition.acf.exhibition_type,
                exhibition.acf.location,
                exhibition.acf.city,
                exhibition.acf.year,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>

        {/* Desktop: 3-col split */}
        <div className="hidden lg:grid grid-cols-3 h-screen">
          {/* Col 1: text info */}
          <div className="col-span-1 flex flex-col justify-between p-8 font-bookish border-r border-border overflow-y-auto">
            <h1
              id="exhibition-modal-title"
              className="text-foreground text-4xl leading-tight mb-3"
            >
              {exhibition.title.rendered}
            </h1>
            <p className="text-foreground/70 text-lg">
              {[
                exhibition.acf.exhibition_type,
                exhibition.acf.location,
                exhibition.acf.city,
                exhibition.acf.year,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          {/* Col 2–3: landscape image */}
          <div className="col-span-2 relative">
            {exhibition.acf.image_1 && (
              <Image
                src={exhibition.acf.image_1.url}
                alt={exhibition.title.rendered}
                fill
                sizes="66vw"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        {/* Description + first image: 3-col */}
        {(exhibition.acf.description || images.length > 0) && (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-x-4">
            {exhibition.acf.description && (
              <div className="lg:col-span-1 pt-12 pr-4 font-bookish text-2xl leading-snug">
                {exhibition.acf.description}
              </div>
            )}
            {images[0] && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="lg:col-span-2 relative overflow-hidden cursor-zoom-in h-[75vh]"
                aria-label="Visa bild 1"
              >
                <Image
                  src={images[0].url}
                  alt={images[0].alt || images[0].desc || "Bild 1"}
                  fill
                  className="object-contain object-top lg:object-left-top"
                />
              </button>
            )}
          </div>
        )}

        {/* Remaining images: 4-col grid */}
        {images.length > 1 && (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-x-4">
            {images.slice(1).map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(idx + 1)}
                className={`relative overflow-hidden cursor-zoom-in h-[75vh] ${img.isLandscape ? "lg:col-span-2" : "lg:col-span-1"}`}
                aria-label={`Visa bild ${idx + 2}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || img.desc || `Bild ${idx + 2}`}
                  fill
                  className="object-contain object-top lg:object-left-top"
                />
              </button>
            ))}
          </div>
        )}

        {/* Works */}
        {works.length > 0 && (
          <div className="px-8 py-8 font-bookish">
            <h4 className="text-2xl leading-snug mb-4">Verk i utställningen</h4>
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
              {works.map((work: any, index: number) => (
                <li key={index}>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-left text-2xl leading-snug font-bookish text-blue-600"
                    onClick={() => {
                      const s = normalizeSlug(work);
                      setActiveWorkSlug(s);
                      window.history.pushState(null, "", `/works?work=${s}`);
                    }}
                  >
                    {work}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Credits */}
        {exhibition.acf.credits && (
          <div className="px-8 pb-8 font-bookish text-2xl leading-snug text-foreground/60">
            {exhibition.acf.credits}
          </div>
        )}

        {/* Footer nav */}
        <div className="flex justify-between items-center px-4 pb-8 pt-4">
          <div className="flex">
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
          <Button
            size="lg"
            className="hidden lg:flex"
            variant="link"
            onClick={() => {
              const scrollable = document.querySelector('[aria-modal="true"]');
              if (scrollable) scrollable.scrollTop = 0;
            }}
          >
            Back to top ↑
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col">
          <div className="absolute flex justify-between items-baseline w-full p-4 z-40">
            <span className="text-foreground/60 text-2xl font-bookish h-12 p-4">
              {lightboxCarousel.index + 1} / {images.length}
            </span>
            <Button
              size="lg"
              variant="link"
              onClick={() => setLightboxIndex(null)}
              aria-label="close"
            >
              <Cross1Icon aria-hidden="true" />
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
                  className="pl-0 flex flex-col items-center justify-center gap-4 p-4 h-screen"
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

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => setActiveWorkSlug(null)}
        />
      )}
    </>
  );
}

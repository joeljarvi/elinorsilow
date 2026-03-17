"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import {
  Cross1Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";

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
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

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
      leftColRef.current?.scrollTo({ top: 0 });
      rightColRef.current?.scrollTo({ top: 0 });
      window.history.replaceState(
        null,
        "",
        `/exhibitions?exhibition=${ex.slug}`,
      );
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
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") {
        if (lightboxIndex !== null) setLightboxIndex(null);
        else if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onClose, lightboxIndex]);

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

  const hasPrev = currentIndex > 0;
  const hasNext =
    !!filteredExhibitions && currentIndex < filteredExhibitions.length - 1;

  function ControlsHeader() {
    return (
      <div className="fixed top-0 left-0 z-[50] lg:relative lg:z-auto pt-4 bg-background w-full">
        <div className="mx-4 flex items-center font-bookish text-sm border border-border [&>*+*]:border-l [&>*+*]:border-border">
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous exhibition"
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next exhibition"
          >
            <ArrowRightIcon />
          </Button>
          <span className="flex-1 px-3 py-1.5 text-sm truncate text-muted-foreground">
            {exhibition.title.rendered}
          </span>
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={onClose ?? (() => router.push("/exhibitions"))}
            aria-label="Close"
            className="no-hide-text"
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: two fixed scrolling columns */}
      <div
        {...swipeHandlers}
        className="hidden lg:flex flex-col h-full bg-background"
      >
        {/* Shared header */}
        <ControlsHeader />

        {/* Columns */}
        <div className="flex flex-1 min-h-0">
          {/* Left: text */}
          <div
            ref={leftColRef}
            className="flex-1 mt-4 min-h-0 overflow-y-auto border-r border-border flex flex-col"
          >
            <InfoBox exhibition={exhibition} />
            {exhibition.acf.description && (
              <div className="px-4 py-6 indent-4 p">
                {exhibition.acf.description}
              </div>
            )}
            {works.length > 0 && (
              <div className="mx-4 mb-4 font-bookish flex flex-col border border-border [&>*+*]:border-t [&>*+*]:border-border">
                <div className="px-3 py-1.5 text-sm text-muted-foreground">
                  Featuring the works
                </div>
                {works.map((work: any, index: number) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="controls"
                    className="justify-start w-full rounded-none"
                    onClick={() => {
                      const s = normalizeSlug(work);
                      setActiveWorkSlug(s);
                      window.history.pushState(null, "", `/works?work=${s}`);
                    }}
                  >
                    {work}
                  </Button>
                ))}
              </div>
            )}
            {exhibition.acf.credits && (
              <div className="px-4 pb-8 font-bookish text-sm text-muted-foreground">
                {exhibition.acf.credits}
              </div>
            )}
          </div>

          {/* Right: images */}
          <div
            ref={rightColRef}
            className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-y-4"
          >
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="relative h-[75vh] w-full overflow-hidden p-4 pb-0 cursor-zoom-in shrink-0"
                aria-label={`View image ${idx + 1}`}
              >
                <CornerFrame />
                <div className="absolute inset-4 flex items-end">
                  <Image
                    src={img.url}
                    alt={img.alt || img.desc || `Image ${idx + 1}`}
                    fill
                    sizes="50vw"
                    className="object-top object-contain"
                    priority={idx === 0}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* end columns */}
      </div>

      {/* Mobile: single column */}
      <div
        {...swipeHandlers}
        className="lg:hidden flex flex-col bg-background pt-12"
        id="modal-top"
      >
        <ControlsHeader />
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(idx)}
            className="relative h-[50vh] w-full overflow-hidden p-4 pb-0 cursor-zoom-in"
            aria-label={`View image ${idx + 1}`}
          >
            <CornerFrame />
            <div className="absolute inset-4 flex items-end">
              <Image
                src={img.url}
                alt={img.alt || img.desc || `Image ${idx + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority={idx === 0}
              />
            </div>
          </button>
        ))}
        <InfoBox exhibition={exhibition} />
        {exhibition.acf.description && (
          <div className="px-4 py-6 p indent-6">
            {exhibition.acf.description}
          </div>
        )}
        {works.length > 0 && (
          <div className="mx-4 mb-4 font-bookish flex flex-col border border-border [&>*+*]:border-t [&>*+*]:border-border">
            {works.map((work: any, index: number) => (
              <Button
                key={index}
                variant="ghost"
                size="controls"
                className="justify-start w-full rounded-none"
                onClick={() => {
                  const s = normalizeSlug(work);
                  setActiveWorkSlug(s);
                  window.history.pushState(null, "", `/works?work=${s}`);
                }}
              >
                {work}
              </Button>
            ))}
          </div>
        )}
        {exhibition.acf.credits && (
          <div className="px-4 indent-6 pb-8 font-bookish text-sm text-muted-foreground">
            {exhibition.acf.credits}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[80] bg-background flex flex-col">
          <div className="sticky top-0 z-10 pt-4 bg-background">
            <div className="mx-4 flex items-center font-bookish text-sm border border-border [&>*+*]:border-l [&>*+*]:border-border">
              <span className="px-3 py-1.5 text-muted-foreground text-sm">
                {lightboxCarousel.index + 1} / {images.length}
              </span>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="controlsIcon"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close lightbox"
                className="no-hide-text"
              >
                <Cross1Icon />
              </Button>
            </div>
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
                  className="pl-0 flex flex-col items-center justify-center p-4 h-screen"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.url}
                      alt={img.alt || img.desc || `Image ${idx + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  {img.desc && (
                    <p className="text-muted-foreground text-sm text-center max-w-xl shrink-0 pb-4 font-bookish">
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

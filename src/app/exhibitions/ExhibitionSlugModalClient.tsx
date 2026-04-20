"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useWorks, normalizeSlug } from "@/context/WorksContext";
import WorkModal from "@/components/WorkModal";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";
import { Exhibition } from "../../../lib/sanity";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";
import WigglyButton from "@/components/WigglyButton";

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

  const galleryCarousel = useGalleryCarousel({
    enableKeyboard: true,
    id: "exhibition-gallery",
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
      if (e.key === "ArrowLeft") {
        if (galleryCarousel.index > 0) galleryCarousel.api?.scrollPrev();
        else goPrev();
      }
      if (e.key === "ArrowRight") {
        const images = getImages(exhibition);
        if (galleryCarousel.index < images.length - 1)
          galleryCarousel.api?.scrollNext();
        else goNext();
      }
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onClose, galleryCarousel, exhibition]);

  if (loading || !exhibition || !exhibition.acf) return <div />;

  const images = getImages(exhibition);
  const hasPrev = currentIndex > 0;
  const hasNext =
    !!filteredExhibitions && currentIndex < filteredExhibitions.length - 1;

  const metadataLines = [
    exhibition.title.rendered,
    exhibition.acf.year,
    exhibition.acf.exhibition_type
      ? `${exhibition.acf.exhibition_type} exhibition`
      : null,
    exhibition.acf.location,
    exhibition.acf.city,
  ].filter(Boolean) as string[];

  return (
    <div {...swipeHandlers} className="relative w-full h-full bg-background">
      {/* Gallery — fills the entire modal */}
      <Carousel
        setApi={galleryCarousel.setApi}
        opts={{ startIndex: 0, align: "center", loop: false }}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {images.map((img, idx) => (
            <CarouselItem
              key={img.id}
              className="pl-0 flex items-center justify-center h-dvh"
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={img.alt || img.desc || `Image ${idx + 1}`}
                  fill
                  className="object-contain object-center"
                  priority={idx === 0}
                />
              </div>
              {img.desc && (
                <p className="absolute bottom-[64px] left-0 right-0 text-center text-muted-foreground text-sm font-timesNewRoman px-4">
                  {img.desc}
                </p>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Metadata overlay — mobile: top-center, desktop: bottom-center */}
      <div className="absolute hidden top-[9px] left-0 right-0  justify-center z-10 pointer-events-none  ">
        <div className="flex flex-wrap justify-center gap-x-[9px] gap-y-0 px-[9px]">
          {metadataLines.map((line, i) => (
            <WigglyButton
              key={i}
              text={line}
              size="text-[16px] "
              className="pointer-events-none font-timesNewRoman"
            />
          ))}
        </div>
      </div>

      {/* Controls — mobile: bottom-center, desktop: top-right */}
      <div className="absolute bottom-[9px] left-0 right-0 flex justify-center z-10 lg:bottom-auto lg:top-[9px] lg:right-[9px] lg:left-auto lg:justify-end bg-transparent">
        <div className="flex gap-x-0">
          <WigglyButton
            text="close"
            className="text-muted-foreground"
            size="text-[16px] "
            active={false}
            onClick={onClose ?? (() => router.push("/exhibitions"))}
          />

          {hasPrev && (
            <>
              <span className="inline-flex items-center font-timesNewRoman font-normal text-[19px] select-none text-muted-foreground">
                /
              </span>
              <WigglyButton
                text="prev"
                className="text-muted-foreground"
                size="text-[16px] "
                active={false}
                onClick={goPrev}
              />
            </>
          )}

          {hasNext && (
            <>
              <span className="inline-flex items-center font-timesNewRoman font-normal text-[19px] select-none text-muted-foreground">
                /
              </span>
              <WigglyButton
                text="next"
                size="text-[16px] "
                className="text-muted-foreground"
                active={true}
                onClick={goNext}
              />
            </>
          )}
        </div>
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-[9px] left-[9px]  z-10 pointer-events-none">
          <WigglyButton
            text={`${galleryCarousel.index + 1} / ${images.length}`}
            size="text-[16px] "
            className="text-muted-foreground"
            active={false}
          />
        </div>
      )}

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => setActiveWorkSlug(null)}
        />
      )}
    </div>
  );
}

function getImages(exhibition: Exhibition | null) {
  if (!exhibition?.acf) return [];
  return [
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
}

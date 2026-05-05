"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useWorks } from "@/context/WorksContext";
import WorkModal from "@/components/WorkModal";
import InfoBox from "@/components/InfoBox";
import { useGalleryCarousel } from "@/lib/useGalleryCarousel";
import { Exhibition } from "../../../lib/sanity";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";
import WigglyButton from "@/components/WigglyButton";

type Props = {
  slug: string;
  onClose?: () => void;
  onOpenWorkByTitle?: (title: string) => void;
};

export default function ExhibitionSlugModalClient({
  slug,
  onClose,
  onOpenWorkByTitle,
}: Props) {
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

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") galleryCarousel.api?.scrollPrev();
      if (e.key === "ArrowRight") galleryCarousel.api?.scrollNext();
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, galleryCarousel]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => galleryCarousel.api?.scrollNext(),
    onSwipedRight: () => galleryCarousel.api?.scrollPrev(),
  });

  if (loading || !exhibition || !exhibition.acf) return <div />;

  const images = getImages(exhibition);

  return (
    <div className="relative w-full min-h-dvh bg-background flex flex-col ">
      {/* InfoBox — top on mobile, left panel on desktop */}
      <div
        className="w-full  lg:h-auto lg:overflow-y-auto flex-shrink-0 px-[18px] pb-[0px] pt-[18px] lg:pb-[18px]"
        onClick={(e) => e.stopPropagation()}
      >
        <InfoBox exhibition={exhibition} onWorkSelect={onOpenWorkByTitle} />
      </div>

      {/* Gallery — fills viewport height, takes remaining width on desktop */}
      <div
        {...swipeHandlers}
        className="relative w-full h-dvh lg:flex-1 flex-shrink-0"
      >
        <Carousel
          setApi={galleryCarousel.setApi}
          opts={{
            startIndex: 0,
            align: "center",
            loop: false,
            watchDrag: false,
            duration: isDesktop ? 0 : undefined,
          }}
          className="w-full h-full"
        >
          <CarouselContent className="-ml-0 h-full">
            {images.map((img, idx) => (
              <CarouselItem
                key={img.id}
                className="pl-0 flex items-center justify-center h-dvh"
              >
                <div className="relative w-full h-full">
                  {/* LEFT = prev */}
                  <div
                    className="absolute left-0 top-0 w-1/2 h-full z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      galleryCarousel.api?.scrollPrev();
                    }}
                  />
                  {/* RIGHT = next */}
                  <div
                    className="absolute right-0 top-0 w-1/2 h-full z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      galleryCarousel.api?.scrollNext();
                    }}
                  />
                  <Image
                    src={img.url}
                    alt={img.alt || img.desc || `Image ${idx + 1}`}
                    fill
                    className="object-contain object-center px-[9px]"
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

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-10 pointer-events-none px-[9px] lg:bottom-[9px]">
            <WigglyButton
              text={`${galleryCarousel.index + 1} / ${images.length}`}
              size="text-[16px]"
              className="bg-transparent text-muted-foreground"
              active
            />
          </div>
        )}

        {/* Close button */}
        <div className="fixed bottom-[9px] left-0 right-0 flex justify-center z-20 lg:bottom-auto lg:top-[9px] lg:right-[9px] lg:left-auto lg:justify-end bg-transparent">
          <div className="flex gap-x-0 w-full px-2">
            <WigglyButton
              text="close"
              className="bg-transparent py-[9px] px-2 justify-center flex w-full"
              size="text-[16px]"
              active
              onClick={onClose ?? (() => router.push("/exhibitions"))}
            />
          </div>
        </div>
      </div>

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

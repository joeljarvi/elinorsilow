"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { RevealImage } from "@/components/RevealImage";
import { Button } from "@/components/ui/button";
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
import {
  Cross1Icon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";
import { OGubbeText } from "@/components/OGubbeText";
import BlurredSlideshowBackground from "@/components/BlurredSlideshowBackground";
import WigglyButton from "@/components/WigglyButton";
import DynamicGrid from "@/components/DynamicGrid";
import { TruckElectric } from "lucide-react";

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
      if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") lightboxCarousel.api?.scrollPrev();
        if (e.key === "ArrowRight") lightboxCarousel.api?.scrollNext();
        if (e.key === "Escape") setLightboxIndex(null);
      } else {
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
        if (e.key === "Escape" && onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onClose, lightboxIndex, lightboxCarousel.api]);

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

  const location = exhibition.acf.location ?? "";
  const city = exhibition.acf.city ?? "";

  return (
    <div {...swipeHandlers} className="flex flex-col bg-background w-full">
      {/* Back / prev / next */}
      <div className="fixed bottom-[9px] top-auto left-0 right-0 z-20 flex justify-center gap-x-0 lg:bottom-auto lg:top-4 lg:right-[64px] lg:left-auto">
        <WigglyButton
          text="back"
          size="text-[18px] lg:text-[19px]"
          bold={true}
          active={false}
          onClick={onClose ?? (() => router.push("/exhibitions"))}
        />
        {hasPrev && (
          <WigglyButton
            text="prev"
            size="text-[18px] lg:text-[19px]"
            bold={true}
            active={false}
            onClick={goPrev}
          />
        )}
        {hasNext && (
          <WigglyButton
            text="next"
            size="text-[18px] lg:text-[19px]"
            bold={true}
            active={true}
            onClick={goNext}
          />
        )}
      </div>

      {/* Slideshow + info overlay */}
      {images.length > 0 && (
        <div className="relative w-full h-screen aspect-auto lg:aspect-video">
          <BlurredSlideshowBackground
            urls={images.map((img) => img.url)}
            onImageClick={(index) => setLightboxIndex(index)}
          />

          {/* Exhibition info overlay + image grid */}
          <div className="absolute top-0 left-0 z-10 flex flex-col w-full lg:w-1/2 overflow-y-auto h-full">
            {/* Info panel */}
            <div className="flex flex-col items-center justify-start pb-[18px] w-full bg-[#41B97D]">
              <div className="pt-[9px] flex justify-between w-full items-center px-[9px]">
                <WigglyButton
                  text={`${exhibition.acf.exhibition_type} Exhibition`}
                  size="text-[16px] lg:text-[19px]"
                  className="text-center justify-start font-timesNewRoman font-bold tracking-widest px-[4px]"
                  bold={false}
                />
                <WigglyButton
                  text={exhibition.title.rendered}
                  size="text-[14px] lg:text-[19px]"
                  className="text-center justify-center font-timesNewRoman font-bold tracking-widest px-[4px]"
                  bold={true}
                  active={true}
                />
                <WigglyButton
                  text={exhibition.acf.year}
                  size="text-[16px] lg:text-[19px]"
                  className="text-center justify-end font-timesNewRoman font-bold tracking-widest px-[4px]"
                  bold={false}
                />
              </div>
              <div className="flex w-full justify-between items-center px-[9px]">
                <WigglyButton
                  text={exhibition.acf.location}
                  size="text-[16px] lg:text-[19px]"
                  className="text-center justify-center font-timesNewRoman font-bold tracking-widest px-[4px] -mt-[4px]"
                  bold={false}
                />
                <WigglyButton
                  text={exhibition.acf.city}
                  size="text-[16px] lg:text-[19px]"
                  className="text-center justify-center font-timesNewRoman font-bold tracking-widest -mt-[4px] px-[4px]"
                  bold={false}
                />
              </div>
              <p className="font-timesNewRoman pt-[32px] text-[16px] lg:text-[19px] leading-[1.2] no-hide-text text-foreground tracking-wider text-center px-[9px]">
                {exhibition.acf.description}
              </p>
            </div>

            {/* Image grid */}
            <div className="hidden  flex-wrap w-full p-[9px] gap-x-[9px] gap-y-[9px] overflow-y-auto bg-background ">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  className="relative  h-[10vh] aspect-video overflow-hidden"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || img.desc || `Image ${idx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Works circle */}
      {works.length > 0 && (
        <div className=" bg-[#B3F7FE] w-full flex flex-col justify-center rounded-full aspect-square lg:max-w-1/3 h-full">
          <div className="flex flex-col gap-y-0 no-hide-text justify-start items-center">
            <WigglyButton
              size="text-[16px] lg:text-[19px]"
              bold={true}
              className="text-[16px] lg:text-[19px] mb-[9px]"
              text="featuring the works"
              active={false}
            />
            {works.map((work: any, index: number) => (
              <WigglyButton
                key={index}
                bold={false}
                size="text-[16px] lg:text-[19px]"
                className="font-normal text-[16px] lg:text-[19px]"
                active={true}
                onClick={() => {
                  const s = normalizeSlug(work);
                  setActiveWorkSlug(s);
                  window.history.pushState(null, "", `/works?work=${s}`);
                }}
                text={work}
              />
            ))}
          </div>
        </div>
      )}

      {/* Credits */}
      {exhibition.acf.credits && (
        <div className="w-full px-[9px] pt-[18px] lg:px-[18px] pb-[44px] lg:pb-[18px] lg:max-w-1/2">
          <div className="w-full flex flex-col items-center justify-center lg:items-start">
            <WigglyButton
              size="text-[16px] lg:text-[19px]"
              bold={true}
              className="text-[16px] lg:text-[19px] mb-[9px]"
              text="Credits"
              active={true}
            />
            <p className="font-timesNewRoman text-[16px] lg:text-[19px] text-center lg:text-left leading-[1.3] tracking-wider">
              {exhibition.acf.credits}
            </p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[110] bg-background flex flex-col h-dvh">
          <div className="absolute top-0 right-0 w-full z-[120]  bg-transparent">
            <div className="mx-4 flex items-center gap-x-2 pt-[18px] ">
              <WigglyButton
                className="text-muted-foreground"
                text={`${lightboxCarousel.index + 1} / ${images.length}`}
                active={true}
              />
              <div className="flex-1" />
              <Button
                variant="link"
                size="controls"
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
            className="flex-1  overflow-hidden"
          >
            <CarouselContent className="-ml-0 h-full">
              {images.map((img, idx) => (
                <CarouselItem
                  key={img.id}
                  className="pl-0 flex flex-col items-center justify-center h-dvh"
                >
                  <div className="relative w-full flex-1 min-h-0">
                    <Image
                      src={img.url}
                      alt={img.alt || img.desc || `Image ${idx + 1}`}
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                  {img.desc && (
                    <p className="text-muted-foreground text-sm text-center max-w-xl shrink-0 pb-4 font-timesNewRoman">
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
    </div>
  );
}

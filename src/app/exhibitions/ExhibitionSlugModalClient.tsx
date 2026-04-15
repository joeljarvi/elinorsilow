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
import CornerFrame from "@/components/CornerFrame";
import { OGubbeText } from "@/components/OGubbeText";
import BlurredSlideshowBackground from "@/components/BlurredSlideshowBackground";
import WigglyButton from "@/components/WigglyButton";
import DynamicGrid from "@/components/DynamicGrid";

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
      {/* Hero header */}
      <div className="relative h-[50dvh] w-full overflow-hidden shrink-0">
        {/* Blurred crossfade background */}
        <BlurredSlideshowBackground urls={images.map((img) => img.url)} />

        {/* Close button */}
        <div className="fixed bottom-4 left-0 right-0 z-20 flex justify-center lg:bottom-auto lg:top-4 lg:right-[64px] lg:left-auto">
          <WigglyButton
            text="back"
            size="text-[18px] lg:text-[19px]"
            bold={true}
            onClick={onClose ?? (() => router.push("/exhibitions"))}
            className=""
          />
        </div>

        {/* Exhibition info */}
        <div className="relative flex flex-row justify-between gap-x-[32px] px-[9px] lg:px-[18px] pt-[9px] lg:pt-[18px] pb-[18px] h-[100dvh] pointer-events-auto items-start justify-items-center z-10 w-full">
          <WigglyButton
            text={exhibition.title.rendered}
            size="text-[16px] lg:text-[19px]"
            className="  text-center justify-center  font-timesNewRoman font-bold tracking-wider  "
            vertical
            bold={true}
          />

          {location && (
            <WigglyButton
              text={location}
              size="text-[16px] lg:text-[19px]"
              className="  text-center justify-center  font-timesNewRoman font-bold tracking-wider"
              vertical
              bold={true}
            />
          )}
          {city && (
            <WigglyButton
              text={city}
              size="text-[16px] lg:text-[19px]"
              className="  text-center justify-center  font-timesNewRoman font-bold tracking-wider"
              vertical
              bold={true}
            />
          )}
          {exhibition.acf.exhibition_type && (
            <WigglyButton
              text={`${exhibition.acf.exhibition_type} Exhibition`}
              size="text-[16px] lg:text-[19px]"
              className="  text-center justify-center font-timesNewRoman font-bold tracking-wider"
              vertical
              bold={true}
            />
          )}
          {exhibition.acf.year && (
            <WigglyButton
              text={exhibition.acf.year}
              size="text-[16px] lg:text-[19px]"
              className="  text-center justify-center font-timesNewRoman font-bold tracking-wider "
              vertical
              bold={true}
            />
          )}
        </div>
      </div>

      {/* Description */}
      {exhibition.acf.description && (
        <div className="flex flex-col items-center justify-start mx-auto w-full max-w-3xl px-[0px] lg:px-[18px] pt-[64px] pb-4 no-hide-text ">
          <OGubbeText
            className="font-timesNewRoman font-bold text-[16px] lg:text-[19px]"
            text={exhibition.title.rendered}
          />

          <p className="font-timesNewRoman indent-6  text-[16px] lg:text-[19px] leading-[1.2]  px-[0px] no-hide-text text-foreground  tracking-wide ">
            {exhibition.acf.description}
          </p>
        </div>
      )}

      {/* Images — DynamicGrid */}
      {images.length > 0 && (
        <DynamicGrid
          items={images.map((img, idx) => ({
            id: String(img.id),
            node: (
              <button
                onClick={() => setLightboxIndex(idx)}
                className="relative w-full overflow-hidden cursor-zoom-in block"
                aria-label={`View image ${idx + 1}`}
              >
                <CornerFrame />
                <RevealImage
                  src={img.url}
                  alt={img.alt || img.desc || `Image ${idx + 1}`}
                  width={800}
                  height={600}
                  sizes="50vw"
                  revealIndex={idx}
                  className="w-full h-auto object-top"
                />
              </button>
            ),
          }))}
          gridCols={1}
          gridRows={1}
        />
      )}

      {/* Works + credits */}
      {(works.length > 0 || exhibition.acf.credits) && (
        <div className="  w-full ">
          <div className="flex flex-col gap-8  pt-0 w-full">
            {works.length > 0 && (
              <div className=" flex flex-col gap-y-0 no-hide-text justify-start items-center">
                <WigglyButton
                  className="text-muted-foreground"
                  text="featuring the works"
                />
                {works.map((work: any, index: number) => (
                  <WigglyButton
                    key={index}
                    className="font-normal text-[18px]"
                    onClick={() => {
                      const s = normalizeSlug(work);
                      setActiveWorkSlug(s);
                      window.history.pushState(null, "", `/works?work=${s}`);
                    }}
                    text={work}
                  />
                ))}
              </div>
            )}
            {exhibition.acf.credits && (
              <div className="flex-1 w-full">
                <p className="font-universNextProExt font-extrabold text-[13px] text-muted-foreground mb-2">
                  Credits
                </p>
                <p className="font-timesNewRoman text-[15px] text-muted-foreground leading-relaxed">
                  {exhibition.acf.credits}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[110] bg-background flex flex-col h-dvh">
          <div className="absolute top-0 right-0 w-full z-[120]  bg-background">
            <div className="mx-4 flex items-center gap-x-2 pt-[18px] ">
              <WigglyButton
                className="text-muted-foreground"
                text={`${lightboxCarousel.index + 1} / ${images.length}`}
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
                  className="pl-0 flex flex-col items-center justify-center py-[0px] px-4 h-dvh"
                >
                  <div className="relative w-full h-full">
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

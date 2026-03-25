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
import CornerFrame from "@/components/CornerFrame";
import { OGubbeText } from "@/components/OGubbeText";

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

  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    if (!exhibition?.acf) return;
    const count = [
      exhibition.acf.image_1, exhibition.acf.image_2, exhibition.acf.image_3,
      exhibition.acf.image_4, exhibition.acf.image_5, exhibition.acf.image_6,
      exhibition.acf.image_7, exhibition.acf.image_8, exhibition.acf.image_9,
      exhibition.acf.image_10,
    ].filter(Boolean).length;
    if (count <= 1) return;
    setBgIndex(0);
    const interval = setInterval(() => setBgIndex((i) => (i + 1) % count), 3000);
    return () => clearInterval(interval);
  }, [exhibition]);

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

  const venue = [exhibition.acf.location, exhibition.acf.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div {...swipeHandlers} className="flex flex-col bg-background">

      {/* Hero header */}
      <div className="relative h-[80vh] w-full overflow-hidden shrink-0">
        {/* Blurred crossfade background */}
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIndex ? "opacity-100" : "opacity-0"}`}
          >
            <Image
              src={img.url}
              alt=""
              fill
              sizes="100vw"
              className="object-cover blur-xl"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/40" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose ?? (() => router.push("/exhibitions"))}
          className="absolute top-4 right-4 z-20 p-2"
          aria-label="Close"
        >
          <Cross1Icon />
        </button>

        {/* Exhibition info */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 lg:px-8 gap-y-2 text-center mix-blend-difference text-background [&_img]:invert">
          <OGubbeText text={exhibition.title.rendered} sizes="36px" className="font-universNextProExt font-extrabold leading-tight text-[18px] lg:text-[24px]" />
          {venue && <OGubbeText text={venue} sizes="36px" className="font-universNextProExt font-extrabold flex-wrap justify-center text-[18px] lg:text-[24px]" />}
          {exhibition.acf.exhibition_type && <OGubbeText text={`${exhibition.acf.exhibition_type} Exhibition`} sizes="36px" className="font-universNextProExt font-extrabold text-[18px] lg:text-[24px]" />}
          {exhibition.acf.year && <OGubbeText text={String(exhibition.acf.year)} sizes="36px" className="font-universNextProExt font-extrabold text-[18px] lg:text-[24px]" />}
        </div>
      </div>

      {/* Description */}
      {exhibition.acf.description && (
        <div className="mx-auto w-full max-w-3xl px-6 lg:px-8 pt-10 pb-4">
          <p className="font-timesNewRoman text-[16px] indent-6 leading-relaxed">
            {exhibition.acf.description}
          </p>
        </div>
      )}

      {/* Images — full-width two-column grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 px-4 lg:px-8 py-8">
          {images.map((img, idx) => (
            <button
              key={img.id}
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
                priority={idx === 0}
              />
            </button>
          ))}
        </div>
      )}

      {/* Works + credits */}
      {(works.length > 0 || exhibition.acf.credits) && (
        <div className="mx-auto w-full max-w-3xl px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 border-t border-border pt-8">
            {works.length > 0 && (
              <div className="flex-1 flex flex-col gap-y-1">
                <p className="font-universNextProExt font-extrabold text-[13px] text-muted-foreground mb-2">Featuring the works</p>
                {works.map((work: any, index: number) => (
                  <button
                    key={index}
                    className="font-timesNewRoman text-[15px] text-left hover:underline underline-offset-2"
                    onClick={() => {
                      const s = normalizeSlug(work);
                      setActiveWorkSlug(s);
                      window.history.pushState(null, "", `/works?work=${s}`);
                    }}
                  >
                    {work}
                  </button>
                ))}
              </div>
            )}
            {exhibition.acf.credits && (
              <div className="flex-1">
                <p className="font-universNextProExt font-extrabold text-[13px] text-muted-foreground mb-2">Credits</p>
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
        <div className="fixed inset-0 z-[80] bg-background flex flex-col">
          <div className="sticky top-0 z-10 pt-4 bg-background">
            <div className="mx-4 flex items-center gap-x-2 font-universNextPro text-sm">
              <span className="px-1 text-muted-foreground text-sm">
                {lightboxCarousel.index + 1} / {images.length}
              </span>
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
            className="flex-1 min-h-0 overflow-hidden"
          >
            <CarouselContent className="-ml-0 h-full">
              {images.map((img, idx) => (
                <CarouselItem
                  key={img.id}
                  className="pl-0 flex flex-col items-center justify-center py-[32px] px-4 h-screen"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img.url}
                      alt={img.alt || img.desc || `Image ${idx + 1}`}
                      fill
                      className="object-contain object-top"
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

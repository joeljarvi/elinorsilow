"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useWorks } from "@/context/WorksContext";
import WorkModal from "@/components/WorkModal";
import InfoBox from "@/components/InfoBox";
import { Exhibition } from "../../../lib/sanity";
import useSwipe from "@/hooks/use-swipe";
import { useRouter } from "next/navigation";
import WigglyButton from "@/components/WigglyButton";
import { useUI } from "@/context/UIContext";

type Props = {
  slug: string;
  onClose?: () => void;
  onOpenWorkByTitle?: (title: string) => void;
};

const transition = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

function getImages(exhibition: Exhibition) {
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

function getWorks(exhibition: Exhibition): string[] {
  return [
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
  ].filter(Boolean) as string[];
}

export default function ExhibitionSlugModalClient({
  slug,
  onClose,
  onOpenWorkByTitle,
}: Props) {
  const router = useRouter();
  const { filteredExhibitions, getExhibitionBySlug: getFromContext } =
    useExhibitions();
  const { setActiveWorkSlug, activeWorkSlug } = useWorks();
  const { moreFun, moreFunBg, refreshMoreFunBg } = useUI();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    if (filteredExhibitions?.length > 0) {
      const ex = filteredExhibitions.find((e) => e.slug === slug);
      if (ex) {
        setExhibition(ex);
        setLoading(false);
        return;
      }
    }
    getFromContext(slug).then((ex) => {
      if (ex) setExhibition(ex);
      setLoading(false);
    });
  }, [slug, getFromContext, filteredExhibitions]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
      if (e.key === "ArrowRight") setSlideIndex((s) => s + 1);
      if (e.key === "ArrowLeft") setSlideIndex((s) => Math.max(s - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const swipeHandlers = useSwipe({
    onSwipedLeft: () => setSlideIndex((s) => s + 1),
    onSwipedRight: () => setSlideIndex((s) => Math.max(s - 1, 0)),
  });

  if (loading || !exhibition?.acf) return <div className="w-full h-dvh" />;

  const description = exhibition.acf.description ?? "";
  const works = getWorks(exhibition);
  const images = getImages(exhibition);
  const credits = exhibition.acf.credits ?? "";

  type Slide =
    | { type: "meta" }
    | { type: "description" }
    | { type: "works" }
    | { type: "image"; url: string; alt: string; desc: string }
    | { type: "credits" };

  const slides: Slide[] = [
    { type: "meta" },
    ...(description ? [{ type: "description" as const }] : []),
    ...images.map((img) => ({ type: "image" as const, ...img })),
    ...(works.length > 0 ? [{ type: "works" as const }] : []),
    ...(credits ? [{ type: "credits" as const }] : []),
  ];
  const totalSlides = slides.length;
  const clampedIndex = Math.min(slideIndex, totalSlides - 1);
  const slide = slides[clampedIndex];

  const isImageSlide = slide?.type === "image";

  return (
    <div
      {...swipeHandlers}
      className="fixed inset-1 z-[210] flex flex-col transition-colors duration-300"
      style={moreFun ? { backgroundColor: moreFunBg } : undefined}
      onClick={() => {
        if (moreFun) refreshMoreFunBg();
        if (isImageSlide) {
          onClose?.() ?? router.push("/exhibitions");
        } else {
          setSlideIndex((s) => Math.min(s + 1, totalSlides - 1));
        }
      }}
    >
      {/* Blurred first image background — persists across all slides */}

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={clampedIndex}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={transition}
          className="flex-1 flex items-center justify-center"
        >
          {slide?.type === "meta" && (
            <WigglyButton
              text={exhibition.title.rendered}
              className="font-timesNewRoman font-normal tracking-wider text-foreground whitespace-break-spaces"
              size="text-7xl"
              mobileSize="text-4xl"
              bold
              active
            />
          )}

          {slide?.type === "description" && (
            <p className="font-timesNewRoman text-foreground text-2xl leading-[1.2] lg:leading-[1.1] lg:text-3xl tracking-wide text-center max-w-2xl px-8">
              {description}
            </p>
          )}

          {slide?.type === "works" && (
            <div
              className="flex flex-col items-center gap-y-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {works.map((w, i) => (
                <WigglyButton
                  key={i}
                  text={w}
                  size="text-3xl"
                  mobileSize="text-2xl"
                  className="tracking-wide px-0 text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenWorkByTitle?.(w);
                  }}
                  anchorFill="currentColor"
                  forceBaseline
                  active
                />
              ))}
            </div>
          )}

          {slide?.type === "image" && (
            <div className="relative w-full h-full">
              <Image
                src={slide.url}
                alt={slide.alt}
                fill
                className="object-contain object-center px-4 py-16 lg:object-top lg:pb-22 pointer-events-none"
                priority
              />
            </div>
          )}

          {slide?.type === "credits" && (
            <div className="flex flex-col items-center  text-center max-w-xl px-8">
              <p className="font-timesNewRoman text-xl lg:text-3xl  tracking-wide">
                {credits}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide counter — top left */}
      {totalSlides > 1 && (
        <div
          className="fixed top-3 left-4 z-[220] font-timesNewRoman text-sm text-foreground pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          {clampedIndex + 1} / {totalSlides}
        </div>
      )}

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[220] pb-4 px-6 lg:px-4 pointer-events-none flex flex-col items-center gap-y-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thumbnails — visible after description slide (images, works, credits) */}
        {slide?.type !== "meta" &&
          slide?.type !== "description" &&
          images.length > 0 &&
          (() => {
            const imageStartIdx = slides.findIndex((s) => s.type === "image");
            return (
              <div className="flex flex-wrap justify-center gap-1 pointer-events-none">
                {images.map((img, i) => {
                  const targetIdx = imageStartIdx + i;
                  const active = clampedIndex === targetIdx;
                  return (
                    <button
                      key={img.id}
                      className={`relative w-10 h-10 overflow-hidden pointer-events-auto shrink-0 transition-opacity ${active ? "opacity-100" : "opacity-40"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideIndex(targetIdx);
                      }}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            );
          })()}

        {/* Meta info — only on title slide */}
        {slide?.type === "meta" && (
          <>
            {/* Mobile: InfoBox centered only */}
            <div className="flex lg:hidden justify-center">
              <div className="pointer-events-auto">
                <InfoBox exhibition={exhibition} centered />
              </div>
            </div>

            {/* Desktop: justify-between with balanced spacer to keep InfoBox centered */}
            <div className="hidden lg:flex justify-between items-end w-full">
              <div className="w-24" />
              <div className="pointer-events-auto">
                <InfoBox exhibition={exhibition} centered />
              </div>
              <div className="w-24 flex justify-end pointer-events-auto">
                <WigglyButton
                  text="close"
                  size="text-3xl"
                  mobileSize="text-2xl"
                  className="tracking-wide text-muted-foreground"
                  onClick={() => onClose?.() ?? router.push("/exhibitions")}
                  active
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile close — top right */}
      <button
        className="lg:hidden fixed top-3 right-3 z-[220] font-timesNewRoman text-2xl text-muted-foreground"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.() ?? router.push("/exhibitions");
        }}
      >
        ×
      </button>

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => setActiveWorkSlug(null)}
        />
      )}
    </div>
  );
}

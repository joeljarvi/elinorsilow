"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useWorks } from "@/context/WorksContext";
import WorkModal from "@/components/WorkModal";
import { Exhibition } from "../../../lib/sanity";
import { Button } from "@/components/ui/button";
import MetaLine from "@/components/MetaLine";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Props = {
  slug: string;
  onClose?: () => void;
  onOpenWorkByTitle?: (title: string) => void;
};

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

export default function ExhibitionSlugModalClient({ slug, onClose }: Props) {
  const { filteredExhibitions, getExhibitionBySlug: getFromContext } =
    useExhibitions();
  const { setActiveWorkSlug, activeWorkSlug } = useWorks();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const close = () => (onClose ? onClose() : router.back());
  // "overview": all images wrapping. "single": one image at a time in a
  // full-height carousel. The metadata shows in both.
  const [view, setView] = useState<"overview" | "single">("overview");
  const [startIndex, setStartIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const openSingle = (i: number) => {
    setStartIndex(i);
    setView("single");
  };

  useEffect(() => {
    if (!slug) return;
    if (exhibition?.slug === slug) {
      setLoading(false);
      return;
    }
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
  }, [slug, getFromContext, filteredExhibitions, exhibition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // A work opened from this exhibition handles its own keys.
      if (activeWorkSlug) return;
      if (e.key === "Escape") onClose?.();
      if (view === "single" && e.key === "ArrowLeft") api?.scrollPrev();
      if (view === "single" && e.key === "ArrowRight") api?.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeWorkSlug, onClose, view, api]);

  if (loading || !exhibition?.acf) return <div className="w-full h-dvh" />;

  const images = getImages(exhibition);
  const credits = exhibition.acf.credits ?? "";
  // Venue is shown with the title, top left.
  // "Stockholm, Group Exhibition, 2026" (MetaLine drops empty parts).
  const meta = [
    exhibition.acf.city,
    exhibition.acf.exhibition_type &&
      `${exhibition.acf.exhibition_type} Exhibition`,
    exhibition.acf.year,
  ];

  return (
    // "Title, Venue" fixed top left, the metadata fixed bottom left over
    // the images. The images start right below the title (pt-10 clears
    // it); the overview gallery is at most 75vh and scrolls inside, the
    // single carousel fills the rest of the height. Clicking outside the
    // images closes the modal.
    <div
      className={`relative w-full h-full flex flex-col p-4 pt-20 lg:pt-10 overflow-y-auto scrollbar-hide ${view === "single" ? "gap-2 pb-2" : "gap-6"}`}
      onClick={onClose}
    >
      {/* View toggle. Desktop: "Overview / Single", top center. Mobile:
          one button, top right, naming the view it switches to. */}
      {images.length > 0 && (
        <button
          type="button"
          className="lg:hidden fixed top-4 right-4 z-20 font-gtAlpina text-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (view === "overview") openSingle(0);
            else setView("overview");
          }}
        >
          {view === "overview" ? "Single" : "Overview"}
        </button>
      )}
      {images.length > 0 && (
        <span
          className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-20 items-baseline gap-1 font-gtAlpina text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={`cursor-pointer ${view === "overview" ? "" : "opacity-40 hover:opacity-100"}`}
            aria-pressed={view === "overview"}
            onClick={() => setView("overview")}
          >
            Overview
          </button>
          <span aria-hidden>/</span>
          <button
            type="button"
            className={`cursor-pointer ${view === "single" ? "" : "opacity-40 hover:opacity-100"}`}
            aria-pressed={view === "single"}
            onClick={() => openSingle(0)}
          >
            Single
          </button>
        </span>
      )}

      {/* Above the images/carousel (z-20; they sit at the default level).
          Mobile: "Title, Venue" and the metadata together, top left.
          Desktop: this stack sits bottom left with just the metadata — the
          title moves to the top left (lg:fixed takes it out of the stack). */}
      <div className="fixed top-4 left-4 lg:top-auto lg:bottom-4 z-20 max-w-[60%] lg:max-w-[40%] flex flex-col gap-1 pointer-events-none">
        <h2
          id="exhibition-modal-title"
          className="lg:fixed lg:top-4 lg:left-4 lg:max-w-[40%] font-gtAmericaCondensed uppercase text-sm leading-none"
        >
          {exhibition.title.rendered}
          {exhibition.acf.location && (
            <>
              ,{" "}
              <span className="font-gtAlpina normal-case">
                {exhibition.acf.location}
              </span>
            </>
          )}
        </h2>
        <MetaLine parts={meta} />
      </div>

      {images.length > 0 && view === "overview" && (
        <div
          className="flex flex-wrap content-start justify-center lg:justify-start gap-2 w-full shrink-0 my-auto lg:my-0 max-h-[75vh] overflow-y-auto scrollbar-hide"
          // Images are sized from the gallery's 75vh: a third of it minus
          // the two row gaps (gap-2 = 0.5rem each), so three rows fill it.
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={`${img.url}?h=1200&auto=format`}
              alt={img.alt || `${exhibition.title.rendered} — image ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="block h-auto max-h-[calc((75vh-1rem)/3)] w-auto max-w-none shrink-0 cursor-zoom-in"
              onClick={() => openSingle(i)}
            />
          ))}
        </div>
      )}

      {/* Single — one image at a time, as tall as the space between the
          header and the metadata allows (flex-1; the gaps around it are
          tighter in this view); click the image (or use ←/→) for the next
          one. */}
      {images.length > 0 && view === "single" && (
        <div
          className="flex-1 min-h-0 flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Carousel
            setApi={setApi}
            opts={{ loop: images.length > 1, startIndex }}
            className="w-full h-full [&>[data-slot=carousel-content]]:h-full"
          >
            <CarouselContent className="h-full">
              {images.map((img, i) => (
                <CarouselItem
                  key={img.id}
                  className={`h-full flex items-center justify-center ${images.length > 1 ? "cursor-e-resize" : ""}`}
                  onClick={() => api?.scrollNext()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${img.url}?h=1800&auto=format`}
                    alt={
                      img.alt || `${exhibition.title.rendered} — image ${i + 1}`
                    }
                    className="block max-h-full max-w-full w-auto h-auto object-contain"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {/* Back — mobile: bottom right; desktop: top right (bottom left
          holds the metadata there). Portaled to <body> (z-[95]) so it sits
          above the modal. Hidden while a work is open on top — its Close
          takes this spot. On the plain exhibition page (no onClose) it goes
          back in history. */}
      {!activeWorkSlug &&
        typeof document !== "undefined" &&
        createPortal(
          <Button
            variant="link"
            size="sm"
            className="fixed bottom-4 right-4 lg:bottom-auto lg:top-4 z-[95] text-sm font-gtAmericaCondensed font-black uppercase tracking-wide"
            onClick={close}
          >
            Back
          </Button>,
          document.body,
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

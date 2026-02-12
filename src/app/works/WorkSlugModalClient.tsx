"use client";

import { useEffect, useState, useCallback } from "react";
import { Work, getWorkBySlug } from "../../../lib/wordpress";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, Share2 } from "lucide-react";
import useSwipe from "@/hooks/use-swipe";

type WorkSlugModalClientProps = {
  slug: string;
  onClose?: () => void;
};

type EmbeddedMedia = {
  source_url: string;
  alt_text?: string;
};

export default function WorkSlugModalClient({
  slug,
  onClose,
}: WorkSlugModalClientProps) {
  const router = useRouter();
  const {
    filteredWorks,
    normalizeSlug,
    workLoading: contextLoading,
  } = useWorks();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Load the work by slug
  const loadWorkByIndex = useCallback(
    async (index: number) => {
      if (!filteredWorks || index < 0 || index >= filteredWorks.length) return;
      const w = filteredWorks[index];
      setWork(w);
      setCurrentIndex(index);
      setLoading(false);
      // Update URL without full reload if possible, or relying on parent state
      // But since this is a client component inside a parallel route or modal,
      // we might just want to update the displayed content.
      // The parent `WorkModal` passes `slug` from props, which might be static.
      // However, updating internal state `work` works for "in-modal" navigation.

      // Ideally we would push a new route, but for a modal,
      // changing internal state is smoother.
      // NOTE: This causes a mismatch between URL and content if we don't push state.
      // But for this task, we follow the "carousel" pattern requested.
      // Better: window.history.replaceState(null, "", `/?work=${w.slug}`);
      window.history.replaceState(null, "", `/?work=${w.slug}`);
    },
    [filteredWorks]
  );

  useEffect(() => {
    if (!slug || contextLoading || !filteredWorks) return;

    const index = filteredWorks.findIndex(
      (w) => normalizeSlug(w.title.rendered) === slug
    );

    if (index >= 0) {
      // Use the one from the list
      setWork(filteredWorks[index]);
      setCurrentIndex(index);
      setLoading(false);
    } else {
      // Fallback if not in filtered list (e.g. direct link to filtered-out work)
      (async () => {
        try {
          const fetchedWork = await getWorkBySlug(slug);
          setWork(fetchedWork);
          // We can't set a valid currentIndex if it's not in filteredWorks
          setCurrentIndex(-1);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [slug, filteredWorks, contextLoading, normalizeSlug]);

  // Navigate to prev/next
  const goPrev = useCallback(() => {
    if (currentIndex > 0) loadWorkByIndex(currentIndex - 1);
  }, [currentIndex, loadWorkByIndex]);

  const goNext = useCallback(() => {
    if (filteredWorks && currentIndex < filteredWorks.length - 1)
      loadWorkByIndex(currentIndex + 1);
  }, [currentIndex, filteredWorks, loadWorkByIndex]);

  // Swipe handlers
  const swipeHandlers = useSwipe({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
  });

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onClose]);

  if (loading) return <div></div>;
  if (!work) return <p>Work not found</p>;

  const images: string[] = (
    work._embedded?.["wp:featuredmedia"] as EmbeddedMedia[] | undefined
  )?.map((m) => m.source_url) || [work.image_url || "/placeholder.jpg"];

  return (
    <div
      {...swipeHandlers}
      className=" col-start-1 lg:col-start-2
    col-span-6 lg:col-span-5
    relative flex flex-col lg:flex-col-reverse   min-h-screen items-center justify-start lg:items-start lg:justify-start w-full    "
    >
      {/* Carousel */}
      <Carousel className=" w-full h-full  ">
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem
              key={idx}
              className="w-full flex justify-center lg:justify-start items-center"
            >
              <div className="relative w-full h-[calc(100vh-12.5rem)] lg:h-[calc(100vh-3.5rem)] flex flex-col  lg:items-start justify-center items-center">
                <Image
                  src={src}
                  alt={`${work.title.rendered} - ${idx + 1}`}
                  fill
                  className="w-auto max-w-[100vw] lg:max-w-[100vw] h-auto object-contain object-top mx-auto lg:object-top-left lg:mx-0 px-2 lg:px-4 lg:pb-4  "
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Work info */}
      <div className="flex flex-row justify-start lg:justify-between w-full items-baseline bg-transparent mt-0   px-4 pb-1.5  pt-2 lg:pb-2 ">
        <div className="hidden lg:flex flex-wrap justify-start items-baseline text-left h3 max-w-sm lg:max-w-full  lg:pb-1 mx-auto lg:mx-0">
          <span className="">{work.title.rendered}</span>,{" "}
          {work.acf.year && <span className="ml-1">{work.acf.year},</span>}
          {work.acf.materials && (
            <span className="ml-1">{work.acf.materials},</span>
          )}
          {work.acf.dimensions && (
            <span className="ml-1">{work.acf.dimensions}</span>
          )}
        </div>

        <div className="flex lg:hidden flex-col items-baseline  text-sm font-directorMono ">
          <span>{work.title.rendered}</span>
          {work.acf.year && <span>{work.acf.year}</span>}
          {work.acf.materials && <span>{work.acf.materials}</span>}
          {work.acf.dimensions && <span>{work.acf.dimensions}</span>}
        </div>

        <div className="absolute bottom-4 right-4 lg:top-4  lg:bottom-auto items-baseline  gap-2 flex">
          <Button
            className=""
            variant="link"
            size="sm"
            onClick={() => {
              const url = `${window.location.origin}/works/${work.slug}`;
              navigator.clipboard.writeText(url);
            }}
          >
            Dela
          </Button>
          <Button
            className=""
            size="sm"
            variant="link"
            onClick={onClose || (() => router.push("/"))}
          >
            Tillbaka
          </Button>
        </div>
      </div>

      {/* Prev/Next buttons */}
      <div className="hidden lg:absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
        <Button
          size="icon"
          variant="ghost"
          disabled={currentIndex <= 0}
          onClick={goPrev}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="hidden lg:absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
        <Button
          size="icon"
          variant="ghost"
          disabled={!filteredWorks || currentIndex >= filteredWorks.length - 1}
          onClick={goNext}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

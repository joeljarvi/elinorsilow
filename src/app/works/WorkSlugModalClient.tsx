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
import HDivider from "@/components/HDivider";
import { Cross1Icon } from "@radix-ui/react-icons";

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
      className=" 
    relative flex flex-col lg:grid grid-cols-3  h-screen items-start justify-start lg:items-start lg:justify-start w-full   "
    >
      <div className="flex w-full   ">
        <div className="flex flex-col items-baseline text-sm font-directorLight  w-full mb-4 p-4 lg:p-8 ">
          <div className="flex justify-between items-center w-full ">
            <span className="h1 font-directorBold uppercase mr-4">
              {work.title.rendered}
            </span>

            <Button
              className="absolute top-0 right-0 aspect-square h-auto"
              size="sm"
              variant="ghost"
              onClick={onClose || (() => router.push("/"))}
            >
              <Cross1Icon />
            </Button>
          </div>

          {work.acf.materials && (
            <span className="mr-2 max-w-sm"> {work.acf.materials}</span>
          )}
          {work.acf.dimensions && <span> {work.acf.dimensions}</span>}
          {work.acf.year && <span className="mr-2"> {work.acf.year}</span>}
          {work.acf.exhibition && (
            <span className="h3 ">Part of {work.acf.exhibition}</span>
          )}
        </div>
      </div>

      {/* Carousel */}
      <Carousel className=" w-full h-full  ">
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem
              key={idx}
              className="w-full flex justify-start lg:justify-start items-center"
            >
              <div className="relative w-full h-[calc(100vh-12rem)] lg:h-[calc(100vh-0rem)] flex flex-col  lg:items-start justify-center items-center mx-auto">
                <Image
                  src={src}
                  alt={`${work.title.rendered} - ${idx + 1}`}
                  fill
                  className="w-auto max-w-[100vw] lg:max-w-[100vw] h-auto object-contain  mx-0 object-center
                   lg:mx-0 px-4 lg:px-0 lg:pb-4 pt-4 lg:py-0 "
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Work info */}
    </div>
  );
}

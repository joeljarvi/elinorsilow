"use client";

import { useEffect, useState, useCallback } from "react";
import { Work, getWorkBySlug } from "../../../lib/wordpress";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ResetIcon } from "@radix-ui/react-icons";

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
  const { allWorks, normalizeSlug, workLoading: contextLoading } = useWorks();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Load the work by slug
  const loadWorkByIndex = useCallback(
    async (index: number) => {
      if (!allWorks || index < 0 || index >= allWorks.length) return;
      const w = allWorks[index];
      setWork(w);
      setCurrentIndex(index);
      setLoading(false);
    },
    [allWorks]
  );

  useEffect(() => {
    if (!slug || contextLoading || !allWorks) return;

    const index = allWorks.findIndex(
      (w) => normalizeSlug(w.title.rendered) === slug
    );

    if (index >= 0) {
      loadWorkByIndex(index);
    } else {
      (async () => {
        try {
          const fetchedWork = await getWorkBySlug(slug);
          setWork(fetchedWork);
          setCurrentIndex(0);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [slug, allWorks, contextLoading, normalizeSlug, loadWorkByIndex]);

  if (loading) return <div></div>;
  if (!work) return <p>Work not found</p>;

  const images: string[] = (
    work._embedded?.["wp:featuredmedia"] as EmbeddedMedia[] | undefined
  )?.map((m) => m.source_url) || [work.image_url || "/placeholder.jpg"];

  // Navigate to prev/next
  const goPrev = () => loadWorkByIndex(currentIndex - 1);
  const goNext = () => loadWorkByIndex(currentIndex + 1);

  return (
    <div
      className="col-start-1 lg:col-start-2
    col-span-6 lg:col-span-4
    relative flex flex-col lg:flex-col-reverse  h-screen items-start justify-between w-full    "
    >
      <div className="flex justify-start  w-full items-baseline bg-transparent gap-x-1   mt-0  lg:mt-2  pt-2 px-3 pb-1.5 lg:pt-4 lg:px-6 lg:pb-4 ">
        <div className="  flex flex-wrap items-baseline text-left justify-start max-w-full  text-sm font-EBGaramond    ">
          <span className="font-EBGaramondItalic mr-1">
            {work.title.rendered},
          </span>
          {work.acf.materials && (
            <span className="mr-1">{work.acf.materials},</span>
          )}
          {work.acf.dimensions && (
            <span className="mr-1">{work.acf.dimensions}</span>
          )}
          {work.acf.year && <span>({work.acf.year})</span>}{" "}
          <Button
            className="  font-EBGaramond hover:font-EBGaramondItalic     transition-all  tracking-wide justify-start items-baseline  rounded  text-xs gap-x-1  ml-2 uppercase"
            size="listSize"
            variant="link"
            onClick={onClose}
          >
            Back
          </Button>
        </div>
      </div>
      {/* Carousel */}
      <Carousel className="w-full h-full px-6 pt-0 lg:px-4 lg:pt-4 ">
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem
              key={idx}
              className="w-full flex justify-end lg:justify-start items-end lg:items-start"
            >
              <div className="relative w-full h-[calc(100vh-10.5rem)] lg:h-[calc(100vh-6rem)]">
                <Image
                  src={src}
                  alt={`${work.title.rendered} - ${idx + 1}`}
                  fill
                  className="w-auto max-w-[80vw] lg:max-w-[100vw] h-auto object-contain object-left lg:object-top-left "
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Work info */}

      {/* Prev/Next buttons */}
      <div className="hidden lg:absolute top-1/2 left-0 transform -translate-y-1/2 px-2">
        <Button
          size="icon"
          variant="ghost"
          disabled={currentIndex === 0}
          onClick={goPrev}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </Button>
      </div>

      <div className="hidden lg:absolute top-1/2 right-0 transform -translate-y-1/2 px-2">
        <Button
          size="icon"
          variant="ghost"
          disabled={currentIndex === allWorks.length - 1}
          onClick={goNext}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

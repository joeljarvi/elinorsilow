"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Work, getWorkBySlug } from "../../../lib/sanity";
import { useWorks } from "@/context/WorksContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import useSwipe from "@/hooks/use-swipe";
import {
  Cross1Icon,
  WidthIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EnterFullScreenIcon,
  ExitFullScreenIcon,
} from "@radix-ui/react-icons";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";

type WorkSlugModalClientProps = {
  slug: string;
  onClose?: () => void;
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
  const [proportional, setProportional] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadWorkByIndex = useCallback(
    async (index: number) => {
      if (!filteredWorks || index < 0 || index >= filteredWorks.length) return;
      const w = filteredWorks[index];
      setWork(w);
      setCurrentIndex(index);
      setLoading(false);
      window.history.replaceState(null, "", `/works?work=${w.slug}`);
    },
    [filteredWorks],
  );

  useEffect(() => {
    if (!slug || contextLoading || !filteredWorks) return;
    const index = filteredWorks.findIndex(
      (w) => normalizeSlug(w.title.rendered) === slug,
    );
    if (index >= 0) {
      setWork(filteredWorks[index]);
      setCurrentIndex(index);
      setLoading(false);
    } else {
      (async () => {
        try {
          const fetchedWork = await getWorkBySlug(slug);
          setWork(fetchedWork);
          setCurrentIndex(-1);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [slug, filteredWorks, contextLoading, normalizeSlug]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) loadWorkByIndex(currentIndex - 1);
  }, [currentIndex, loadWorkByIndex]);

  const goNext = useCallback(() => {
    if (filteredWorks && currentIndex < filteredWorks.length - 1)
      loadWorkByIndex(currentIndex + 1);
  }, [currentIndex, filteredWorks, loadWorkByIndex]);

  const swipeHandlers = useSwipe({ onSwipedLeft: goNext, onSwipedRight: goPrev });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext, onClose]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  if (loading) return <div />;
  if (!work) return <p>Work not found</p>;

  const hasPrev = currentIndex > 0;
  const hasNext = !!filteredWorks && currentIndex < filteredWorks.length - 1;

  return (
    <div
      ref={containerRef}
      {...swipeHandlers}
      className="flex flex-col w-full h-screen bg-background"
    >
      {/* Controls header */}
      <div className="pt-4 bg-background">
        <div className="mx-4 flex items-center font-bookish text-sm border border-border [&>*+*]:border-l [&>*+*]:border-border">
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={goPrev}
            disabled={!hasPrev}
            aria-label="Previous work"
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={goNext}
            disabled={!hasNext}
            aria-label="Next work"
          >
            <ArrowRightIcon />
          </Button>
          <span className="flex-1 px-3 py-1.5 text-sm truncate text-muted-foreground">
            {work.title.rendered}
          </span>
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={() => setProportional((p) => !p)}
            aria-label={proportional ? "Full width" : "Proportional"}
          >
            <WidthIcon />
          </Button>
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <ExitFullScreenIcon /> : <EnterFullScreenIcon />}
          </Button>
          <Button
            variant="ghost"
            size="controlsIcon"
            onClick={onClose ?? (() => router.push("/works"))}
            aria-label="Close"
            className="no-hide-text"
          >
            <Cross1Icon />
          </Button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-4 flex items-center justify-center">
          {work.image_url && (
            <ProportionalWorkImage
              src={work.image_url}
              alt={work.title.rendered}
              dimensions={work.acf.dimensions}
              proportional={proportional}
              className="max-w-full max-h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

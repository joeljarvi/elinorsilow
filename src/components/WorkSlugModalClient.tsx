"use client";

import { useEffect, useState, useCallback } from "react";
import { Work, getWorkBySlug } from "../../lib/sanity";
import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import useSwipe from "@/hooks/use-swipe";
import BlurredWorkBg from "@/components/BlurredWorkBg";
import WigglyButton from "@/components/WigglyButton";
import InfoBox from "@/components/InfoBox";
import WigglyDivider from "./WigglyDivider";

type WorkSlugModalClientProps = {
  slug: string;
  onClose?: () => void;
  showInfo?: boolean;
};

export default function WorkSlugModalClient({
  slug,
  onClose,
  showInfo,
}: WorkSlugModalClientProps) {
  const {
    filteredWorks,
    normalizeSlug,
    workLoading: contextLoading,
  } = useWorks();
  const { showColorBg } = useUI();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadWorkByIndex = useCallback(
    (index: number) => {
      if (!filteredWorks || index < 0 || index >= filteredWorks.length) return;
      const w = filteredWorks[index];
      setWork(w);
      setCurrentIndex(index);
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

  const swipeHandlers = useSwipe({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, onClose]);

  if (loading) return <div className="w-full h-dvh" />;
  if (!work) return null;

  return (
    <div
      {...swipeHandlers}
      className="relative w-full h-dvh flex flex-col  gap-x-4 p-[9px]"
      onClick={onClose}
    >
      {showColorBg && work?.image_url && (
        <BlurredWorkBg imageUrl={work.image_url} />
      )}
      {/* Image */}
      {showInfo && (
        <div
          className="flex-shrink-0  w-full lg:w-[280px] pt-[0px] "
          onClick={(e) => e.stopPropagation()}
        >
          <WigglyDivider
            text="work"
            className="text-muted-foreground"
            size="text-[8px]"
            active
          />
          <InfoBox work={work} />
          <WigglyDivider
            text="work"
            className="text-muted-foreground"
            size="text-[8px]"
            active
          />
        </div>
      )}
      <div className="mt-[9px] flex-1 flex flex-col min-w-0" onClick={onClose}>
        <div className="relative flex-1 ">
          {work.image_url && (
            <Image
              src={work.image_url}
              alt={work.title.rendered}
              fill
              className={`object-contain pointer-events-auto ${showInfo ? "object-left-top" : "object-center"}`}
              priority
            />
          )}
        </div>
      </div>

      {/* Mobile close button */}
      <div className="fixed bottom-[32px] left-1/2 -translate-x-1/2 z-[20] justify-center">
        <WigglyButton text="close" active size="text-18px" onClick={onClose} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Work, getWorkBySlug } from "../../../lib/sanity";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import useSwipe from "@/hooks/use-swipe";
import InfoBox from "@/components/InfoBox";

type WorkSlugModalClientProps = {
  slug: string;
  onClose?: () => void;
};

export default function WorkSlugModalClient({
  slug,
  onClose,
}: WorkSlugModalClientProps) {
  const {
    filteredWorks,
    normalizeSlug,
    workLoading: contextLoading,
  } = useWorks();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [infoOpen, setInfoOpen] = useState(false);

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

  if (loading) return <div className="w-screen h-screen" />;
  if (!work) return null;

  return (
    <div
      {...swipeHandlers}
      className="w-screen h-screen flex flex-col lg:flex-row p-[18px] gap-x-4"
    >
      {/* Info panel — slides down from above on mobile, slides in from left on desktop */}
      <div
        className={`shrink-0 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-start lg:justify-center pointer-events-auto w-full lg:w-auto ${infoOpen ? "max-h-[50vh] lg:max-h-screen lg:w-1/2" : "max-h-0 lg:max-h-screen lg:w-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <InfoBox work={work} revealed={infoOpen} />
      </div>

      {/* Image + button */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative flex-1">
          {work.image_url && (
            <Image
              src={work.image_url}
              alt={work.title.rendered}
              fill
              className="object-contain"
              priority
            />
          )}
        </div>
        <div
          className="flex justify-center py-2 mt-[18px] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="font-timesNewRomanWide font-bold text-[14px] lg:text-[18px]"
            style={{ mixBlendMode: "difference", color: "white" }}
            onClick={() => setInfoOpen((v) => !v)}
          >
            {infoOpen ? "(less)" : "(more info)"}
          </button>
        </div>
      </div>
    </div>
  );
}

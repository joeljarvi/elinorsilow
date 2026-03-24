"use client";

import { useEffect, useState, useCallback } from "react";
import { Work, getWorkBySlug } from "../../../lib/sanity";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import useSwipe from "@/hooks/use-swipe";

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
    // Outer container handles swipe; clicks pass through to backdrop
    <div
      {...swipeHandlers}
      className="w-screen h-screen flex items-center justify-center p-[18px]"
    >
      <div className="relative w-full h-full">
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
    </div>
  );
}

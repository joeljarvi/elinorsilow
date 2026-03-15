"use client";

import { useEffect, useState, useCallback } from "react";
import { Work, getWorkBySlug } from "../../../lib/sanity";
import { useWorks } from "@/context/WorksContext";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import useSwipe from "@/hooks/use-swipe";
import { Cross1Icon } from "@radix-ui/react-icons";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";

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
  const [proportional, setProportional] = useState(false);

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
    [filteredWorks],
  );

  useEffect(() => {
    if (!slug || contextLoading || !filteredWorks) return;

    const index = filteredWorks.findIndex(
      (w) => normalizeSlug(w.title.rendered) === slug,
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

  return (
    <div {...swipeHandlers} className="relative w-full h-screen">
      <div className="absolute inset-4 flex items-center justify-center">
        {work.image_url && (
          <ProportionalWorkImage
            src={work.image_url}
            alt={work.title.rendered}
            dimensions={work.acf.dimensions}
            proportional={proportional}
            className="max-w-full lg:max-h-screen"
          />
        )}
      </div>
      <Button
        className="absolute top-2 left-2 z-10 font-bookish "
        size="lg"
        variant="link"
        onClick={() => setProportional((p) => !p)}
      >
        {proportional ? "Full width" : "Proportional"}
      </Button>
      <Button
        className="absolute top-2 right-2 aspect-square h-auto z-10 "
        size="lg"
        variant="link"
        onClick={onClose || (() => router.push("/"))}
        aria-label="close"
      >
        <Cross1Icon aria-hidden="true" />
      </Button>
    </div>
  );
}

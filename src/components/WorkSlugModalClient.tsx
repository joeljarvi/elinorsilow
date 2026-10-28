"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Work, getWorkBySlug } from "../../lib/sanity";
import { useWorks } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useSwipe from "@/hooks/use-swipe";
import { Button } from "@/components/ui/button";

import InfoBox from "@/components/InfoBox";
import CloseButton from "@/components/CloseButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BADGE_BASE =
  "h-8 w-min shrink-0 whitespace-nowrap rounded-full border-transparent px-2 py-0 text-lg shadow-none cursor-default";

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
  const router = useRouter();
  const {
    filteredWorks,
    normalizeSlug,
    workLoading: contextLoading,
  } = useWorks();
  const { showColorBg } = useUI();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

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

  // Click target: next work, wrapping from the last back to the first.
  const goNextWrapping = useCallback(() => {
    if (!filteredWorks?.length || currentIndex < 0) return;
    loadWorkByIndex((currentIndex + 1) % filteredWorks.length);
  }, [currentIndex, filteredWorks, loadWorkByIndex]);

  const imageRef = useRef<HTMLImageElement>(null);

  // Click on the visible artwork → next work; anywhere else → close. The
  // image is object-contain, so its <img> box is bigger than the artwork:
  // work out the drawn area from the natural size and test against that.
  const onModalClick = (e: React.MouseEvent) => {
    // WorkModal's backdrop also closes on click — handle it here only.
    e.stopPropagation();
    const img = imageRef.current;
    if (img?.naturalWidth) {
      const box = img.getBoundingClientRect();
      const scale = Math.min(
        box.width / img.naturalWidth,
        box.height / img.naturalHeight,
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const left = box.left + (box.width - w) / 2;
      const top = box.top + (box.height - h) / 2;
      if (
        e.clientX >= left &&
        e.clientX <= left + w &&
        e.clientY >= top &&
        e.clientY <= top + h
      ) {
        goNextWrapping();
        return;
      }
    }
    onClose?.();
  };

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
    // Same anatomy as the index GridItem cards: metadata top left, image
    // centered at ~1/3 height.
    <div
      {...swipeHandlers}
      className="relative w-full  flex flex-col justify-between text-left p-6 lg:p-2 h-full  lg:overflow-y-auto scrollbar-hide"
      onClick={onModalClick}
    >
      {/* Image — mobile: full height (clear of the nav row at the top and
          "Show info" at the bottom), shrinking to the top half while the
          info drawer is open. Desktop: full height. */}
      <div className="absolute inset-0 flex items-start justify-center p-4 pt-14 pb-16 lg:p-4 pointer-events-none">
        {work.image_url && (
          <div
            className={`relative w-full transition-[height] duration-300 ease-out lg:h-full ${mobileInfoOpen ? "h-1/2" : "h-full"}`}
          >
            <Image
              ref={imageRef}
              src={work.image_url}
              alt={work.title.rendered}
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        )}
      </div>

      {/* Backdrop — mobile only, closes the info drawer on tap outside it
          without also closing the work modal underneath it. */}
      {mobileInfoOpen && (
        <div
          className="fixed inset-0 z-[205] lg:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setMobileInfoOpen(false);
          }}
        />
      )}

      {/* Floating "show info" button — mobile only. On desktop the metadata
          panel is already visible, so there's nothing to toggle. */}
      <Button
        variant="link"
        size="sm"
        className="fixed bottom-4 right-4 z-[215]   lg:hidden"
        onClick={(e) => {
          e.stopPropagation();
          setMobileInfoOpen((v) => !v);
        }}
      >
        {mobileInfoOpen ? "Hide info" : "Show info"}
      </Button>

      {/* Metadata — a bottom drawer on mobile (slides up on demand), the
          original always-visible top-left panel on desktop — all fields in
          the left column (cols 1–2). On desktop the
          full-screen panel lets clicks through (to the work / close) except
          on its columns. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[210] max-h-[70vh] overflow-y-auto bg-background transition-transform duration-300 ease-out ${mobileInfoOpen ? "translate-y-0" : "translate-y-full"} lg:absolute lg:top-0 lg:bottom-auto lg:z-auto lg:max-h-none lg:translate-y-0 lg:overflow-visible lg:bg-transparent lg:pointer-events-none left-0 px-4 pt-4 lg:pt-0 lg:px-4 pb-4 lg:pb-6 flex flex-col lg:grid grid-cols-12 justify-end lg:justify-end lg:items-end lg:h-screen  w-full font-areal font-medium gap-4 lg:gap-0 border-t border-foreground lg:border-t-0 `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="col-span-2 flex flex-col gap-4 lg:gap-16 lg:pointer-events-auto font-gtAlpina">
          <div className=" flex-col   flex gap-2">
            <h3 className=" uppercase tracking-wide text-sm lg:text-xs  w-full">
              Title
            </h3>

            <span className="text-sm lg:text-base font-gtAlpina">
              {work.title.rendered}
            </span>
          </div>
          <div className=" flex-col   flex gap-2">
            <h3 className=" uppercase tracking-wide text-sm lg:text-xs  w-full">
              Materials
            </h3>

            <span className="text-sm lg:text-base font-gtAlpina leading-tight">
              {work.acf.materials}
            </span>
          </div>
          {work.acf.exhibition && (
            <div className=" flex-col   flex gap-0">
              <h3 className=" uppercase tracking-wide text-xs  w-full">
                Part of exhibition
              </h3>

              <span className="text-sm lg:text-base font-gtAlpina leading-tight">
                {work.acf.exhibition}
              </span>
            </div>
          )}
          <div className=" flex-col   flex gap-2">
            <h3 className=" uppercase tracking-wide text-sm lg:text-xs  w-full">
              Dimensions
            </h3>

            <span className="text-sm lg:text-base font-gtAlpina leading-tight">
              {work.acf.dimensions}
            </span>
          </div>
          <div className=" flex-col  flex gap-2">
            <h3 className=" uppercase tracking-wide text-sm lg:text-xs  w-full">
              Year
            </h3>

            <span className="text-sm lg:text-base font-gtAlpina leading-tight">
              {work.acf.year}
            </span>
          </div>
        </div>
      </div>

      {/* Close — top right, portaled to <body> (z-[95]) so it sits above
          the modal (the nav, z-80, stays visible above it too). On the plain work
          page (no onClose) it goes back in history. */}
      {typeof document !== "undefined" &&
        createPortal(
          <Button
            variant="link"
            size="sm"
            className="fixed top-4 right-2 lg:right-4 z-[95] text-sm lg:text-xs font-medium tracking-wide"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
              else router.back();
            }}
          >
            Close
          </Button>,
          document.body,
        )}
    </div>
  );
}

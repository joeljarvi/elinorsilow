// lib/useGalleryCarousel.ts
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";
import { useCarouselContext } from "@/context/CarouselContext";

type Options = {
  pause?: boolean;
  delay?: number;
  enableKeyboard?: boolean;
  id: string;
};

export function useGalleryCarousel({
  pause = false,
  delay = 4500,
  enableKeyboard = true,
  id,
}: Options) {
  const [api, setApiState] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(0);
  const { activeId, setActiveId } = useCarouselContext();

  const autoplay = useRef(
    Autoplay({
      delay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  // ✅ Called by <Carousel setApi={...} />
  const setApi = (emblaApi: CarouselApi) => {
    setApiState(emblaApi);

    // Only start autoplay if this is active
    if (!pause && activeId === id) {
      autoplay.current.reset(); // reset timer
      autoplay.current.play();
    }
  };

  // Pause/resume when nav/modal or activeId changes
  useEffect(() => {
    if (!api) return;

    autoplay.current.stop();

    if (!pause && activeId === id) {
      autoplay.current.play();
    }
  }, [pause, activeId, id, api]);

  // Track index
  useEffect(() => {
    if (!api) return;

    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Keyboard arrows
  useEffect(() => {
    if (!api || !enableKeyboard) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, enableKeyboard]);

  // Activate this carousel on mount
  useEffect(() => {
    setActiveId(id);
    return () => {
      setActiveId(null);
    };
  }, [id, setActiveId]);

  return { api, setApi, index, autoplay };
}

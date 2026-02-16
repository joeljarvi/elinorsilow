import { useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { useCarouselContext } from "@/context/CarouselContext";

type Options = {
  enableKeyboard?: boolean;
  id: string;
};

export function useGalleryCarousel({ enableKeyboard = true, id }: Options) {
  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [index, setIndex] = useState(0);
  const { activeId, setActiveId } = useCarouselContext();

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

  // Keyboard navigation
  useEffect(() => {
    if (!api || !enableKeyboard) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") api.scrollPrev();
      if (e.key === "ArrowRight") api.scrollNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api, enableKeyboard]);

  // Activate carousel
  useEffect(() => {
    setActiveId(id);
    return () => setActiveId(null);
  }, [id, setActiveId]);

  return { api, setApi, index };
}

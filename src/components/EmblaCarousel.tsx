"use client";

import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

export default function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  useEffect(() => {
    if (emblaApi) {
      console.log(emblaApi.slideNodes()); // Access API for debugging
    }
  }, [emblaApi]);

  return (
    <div className="relative embla" ref={emblaRef}>
      <div className="embla__container flex overflow-hidden">
        <div className="embla__slide flex-none w-full p-4">Slide 1</div>
        <div className="embla__slide flex-none w-full p-4">Slide 2</div>
        <div className="embla__slide flex-none w-full p-4">Slide 3</div>
      </div>

      <div className="absolute top-4 left-4 flex gap-4 z-50">
        <Button
          variant="ghost"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!emblaApi?.canScrollPrev()}
        >
          Prev
        </Button>
        <Button
          variant="ghost"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!emblaApi?.canScrollNext()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

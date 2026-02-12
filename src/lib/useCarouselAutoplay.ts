import { useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export function useCarouselAutoplay({
  isPaused,
  delay = 4500,
}: {
  isPaused: boolean;
  delay?: number;
}) {
  const autoplay = useRef(
    Autoplay({
      delay,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    if (!autoplay.current) return;

    if (isPaused) autoplay.current.stop();
    else autoplay.current.play();
  }, [isPaused]);

  return autoplay;
}

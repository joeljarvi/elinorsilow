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
    const plugin = autoplay.current;
    if (!plugin) return;
    try {
      if (isPaused) plugin.stop();
      else plugin.play();
    } catch {
      // plugin not yet attached to an Embla instance — safe to ignore
    }
  }, [isPaused]);

  return autoplay;
}

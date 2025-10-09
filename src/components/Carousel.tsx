"use client";

import { useRef, useEffect, useState } from "react";
import { useMotionValueEvent, useScroll, MotionValue } from "framer-motion";
import Lenis from "lenis";

interface CarouselProps<T> {
  items: T[];
  renderItem: (
    item: T,
    index: number,
    scrollYProgress: MotionValue<number>
  ) => React.ReactNode;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  className?: string;
}

export function Carousel<T>({
  items,
  renderItem,
  onIndexChange,
  initialIndex = 0,
  className = "",
}: CarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (!containerRef.current || lenisRef.current) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      orientation: "vertical",
    });
    lenisRef.current = lenis;

    const viewportHeight = window.innerHeight;
    lenis.scrollTo(initialIndex * viewportHeight, { immediate: true });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [initialIndex]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(
      Math.floor(latest * items.length),
      items.length - 1
    );
    console.log("New index:", newIndex);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  });

  return (
    <div className={`relative ${className}`}>
      <div className="mix-blend-difference text-white fixed grid grid-rows-4 z-40 h-full">
        <div className=" row-start-2  text-2xl lg:text-xl px-3  lg:px-3 font-hershey  ">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{ height: `${items.length * 100}vh` }}
        className="relative grid grid-cols-1"
      >
        {items.map((item, i) => renderItem(item, i, scrollYProgress))}
      </div>
    </div>
  );
}

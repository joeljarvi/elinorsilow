"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, MotionValue } from "framer-motion";

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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Framer motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Update index as user scrolls
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(
      Math.floor(latest * items.length),
      items.length - 1
    );
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      onIndexChange?.(newIndex);
    }
  });

  return (
    <div className={`relative bg-background  ${className}`}>
      <div className="mix-blend-difference text-white fixed grid grid-rows-4 z-40 h-full">
        <div className=" row-start-2  text-2xl lg:text-xl px-3  lg:px-3 font-hershey  ">
          {currentIndex + 1} / {items.length}
        </div>
      </div>

      {/* Scroll container */}
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

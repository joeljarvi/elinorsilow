"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import Lenis from "lenis";

interface CarouselProps<T> {
  bgColor?: string;
  setBgColor?: React.Dispatch<React.SetStateAction<string>>;
  items: T[];
  renderItem: (item: T, index: number, scrollYProgress: any) => React.ReactNode;
  onIndexChange?: (index: number) => void;
  initialIndex?: number;
  className?: string;
}

export function Carousel<T>({
  bgColor,
  setBgColor,
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // Initialize Lenis
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
  }, []);

  // Update current index based on scroll
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
    <div className={`relative ${bgColor} ${className}`}>
      {/* Progress Bar */}
      <div className="fixed top-1/4 left-3 text-base font-haas mix-blend-difference text-white  z-40  lg:text-xs  lg:px-0">
        {currentIndex + 1} / {items.length}
      </div>

      {/* Carousel Items */}
      <div
        ref={containerRef}
        style={{ height: `${items.length * 100}vh` }}
        className="relative grid grid-cols-1 "
      >
        {items.map((item, i) => renderItem(item, i, scrollYProgress))}
      </div>
    </div>
  );
}

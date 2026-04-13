"use client";

import Image, { ImageProps } from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealImageProps extends ImageProps {
  revealIndex?: number;
  noScaleY?: boolean;
  blurUntilCentered?: boolean;
}

export function RevealImage({
  revealIndex = 0,
  noScaleY = false,
  blurUntilCentered = false,
  className,
  ...props
}: RevealImageProps) {
  const [revealed, setRevealed] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const randomDelay = useRef(Math.random() * 600);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // One-shot reveal observer (triggers scaleY animation)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const isMobile = window.innerWidth < 1024;
          const delay = isMobile ? revealIndex * 60 : randomDelay.current;
          setTimeout(() => setRevealed(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealIndex]);

  // Persistent center observer (for blur)
  useEffect(() => {
    if (!blurUntilCentered) return;
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCentered(entry.isIntersecting),
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [blurUntilCentered]);

  const isBlurred = !loaded || (blurUntilCentered && !isCentered);

  return (
    <div
      ref={wrapperRef}
      className={cn(props.fill ? "absolute inset-0" : "relative")}
    >
      <motion.div
        animate={{ scaleY: noScaleY || revealed ? 1 : 0 }}
        initial={{ scaleY: noScaleY ? 1 : 0 }}
        transition={
          noScaleY ? {} : { duration: 0.9, ease: [0.25, 1, 0.5, 1] }
        }
        style={{ originY: 0 }}
        className={props.fill ? "absolute inset-0" : "relative w-full h-full"}
      >
        <Image
          {...props}
          className={cn(
            className,
            "transition-[filter] duration-500",
            isBlurred && "blur-lg",
          )}
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </div>
  );
}

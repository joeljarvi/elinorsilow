"use client";

import Image, { ImageProps } from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RevealImageProps extends ImageProps {
  revealIndex?: number;
}

export function RevealImage({
  revealIndex = 0,
  className,
  ...props
}: RevealImageProps) {
  const [revealed, setRevealed] = useState(false);
  const randomDelay = useRef(Math.random() * 800);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = imgRef.current;
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
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [revealIndex]);

  return (
    <Image
      ref={imgRef}
      {...props}
      className={cn(
        "transition-[filter] duration-[1200ms] ease-in-out",
        revealed ? "blur-none" : "blur-md",
        className
      )}
    />
  );
}

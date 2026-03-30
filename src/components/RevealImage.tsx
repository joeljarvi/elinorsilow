"use client";

import Image, { ImageProps } from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  const randomDelay = useRef(Math.random() * 600);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={wrapperRef}
      className={cn(props.fill ? "absolute inset-0" : "relative")}
    >
      <motion.div
        animate={revealed ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
        style={{ originY: 0 }}
        className={props.fill ? "absolute inset-0" : "relative w-full h-full"}
      >
        <Image {...props} className={className} />
      </motion.div>
    </div>
  );
}

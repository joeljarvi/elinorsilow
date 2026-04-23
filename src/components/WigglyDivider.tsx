"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WigglyDividerProps {
  char?: string;
  className?: string;
  size?: string;
  active?: boolean;
  sizeGradient?: { from: number; to: number };
  wiggleGradient?: boolean;
  textShadow?: boolean;
}

type LetterDistortion = { rotate: number; y: number };

export default function WigglyDivider({
  char = "-",
  className,
  size = "text-[16px]",
  active = false,
  sizeGradient,
  wiggleGradient = false,
  textShadow = false,
}: WigglyDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const distortions = useRef<LetterDistortion[]>([]);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const measureFontSize = sizeGradient
      ? (sizeGradient.from + sizeGradient.to) / 2
      : undefined;

    // Measure character width with a temporary off-screen element
    const temp = document.createElement("span");
    temp.className = `font-timesNewRoman tracking-wider ${size}`;
    temp.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;visibility:hidden;white-space:nowrap";
    if (measureFontSize) temp.style.fontSize = `${measureFontSize}px`;
    temp.textContent = char;
    document.body.appendChild(temp);
    const charWidth = temp.getBoundingClientRect().width;
    document.body.removeChild(temp);

    const update = () => {
      if (!containerRef.current || charWidth === 0) return;
      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const n = Math.floor(containerWidth / charWidth);
      if (n !== distortions.current.length) {
        distortions.current = Array.from({ length: n }, () => ({
          rotate: parseFloat((Math.random() * 14 - 7).toFixed(1)),
          y: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        }));
      }
      setCount(n);
    };

    const observer = new ResizeObserver(update);
    observer.observe(containerRef.current);
    update();
    return () => observer.disconnect();
  }, [char, size, sizeGradient?.from, sizeGradient?.to]);

  const distorted = mounted && (active || hovered);
  const transition = { duration: 0.18, ease: "easeOut" as const };

  const getCharFontSize = (i: number) => {
    if (!sizeGradient || count < 2) return undefined;
    const t = i / (count - 1);
    return sizeGradient.from + (sizeGradient.to - sizeGradient.from) * t;
  };

  const getWiggleFactor = (i: number) =>
    wiggleGradient ? i / Math.max(count - 1, 1) : 1;

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full flex items-baseline overflow-hidden",
        textShadow && "text-shadow-md",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {Array.from({ length: count }, (_, i) => {
        const fs = getCharFontSize(i);
        return (
          <motion.span
            key={i}
            className={cn(
              "inline-block leading-none font-timesNewRoman tracking-wider",
              size,
            )}
            style={fs ? { fontSize: `${fs}px` } : undefined}
            animate={
              distorted
                ? {
                    rotate:
                      (distortions.current[i]?.rotate ?? 0) *
                      getWiggleFactor(i),
                    y:
                      (distortions.current[i]?.y ?? 0) * getWiggleFactor(i),
                  }
                : { rotate: 0, y: 0 }
            }
            transition={{ ...transition, delay: distorted ? i * 0.008 : 0 }}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
}

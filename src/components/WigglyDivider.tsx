"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  prepareWithSegments,
  measureNaturalWidth,
} from "@chenglou/pretext";

interface WigglyDividerProps {
  char?: string;
  text?: string;
  vertical?: boolean;
  justify?: boolean;
  className?: string;
  size?: string;
  active?: boolean;
  sizeGradient?: { from: number; to: number };
  wiggleGradient?: boolean;
  textShadow?: boolean;
}

type LetterDistortion = { rotate: number; y: number };

const transition = { duration: 0.18, ease: "easeOut" as const };

function measureFontSizePx(sizeClass: string): number {
  const temp = document.createElement("span");
  temp.className = `font-timesNewRoman ${sizeClass}`;
  temp.style.cssText =
    "position:fixed;left:-9999px;top:-9999px;visibility:hidden;white-space:nowrap";
  temp.textContent = "x";
  document.body.appendChild(temp);
  const px = parseFloat(window.getComputedStyle(temp).fontSize) || 16;
  document.body.removeChild(temp);
  return px;
}

export default function WigglyDivider({
  char = "-",
  text,
  vertical = false,
  justify = false,
  className,
  size = "text-[16px]",
  active = false,
  sizeGradient,
  wiggleGradient = false,
  textShadow = false,
}: WigglyDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const distortions = useRef<LetterDistortion[]>([]);
  const [count, setCount] = useState(0); // number of word/char repetitions
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Text mode: use pretext to measure word width (horizontal) or letter height (vertical)
  useEffect(() => {
    if (!text || !containerRef.current) return;

    const basePx = measureFontSizePx(size);

    // Measure word width for horizontal fill
    const font = `normal ${basePx}px "Times New Roman", Times, serif`;
    const prepared = prepareWithSegments(text, font);
    const wordWidth = measureNaturalWidth(prepared);

    // Measure letter height for vertical fill
    const tempH = document.createElement("span");
    tempH.className = `font-timesNewRoman ${size}`;
    tempH.style.cssText =
      "position:fixed;left:-9999px;top:-9999px;visibility:hidden;white-space:nowrap";
    tempH.textContent = "X";
    document.body.appendChild(tempH);
    const letterH = tempH.getBoundingClientRect().height;
    document.body.removeChild(tempH);
    const wordHeight = letterH * text.length;

    const update = () => {
      if (!containerRef.current) return;
      const { width: containerW, height: containerH } =
        containerRef.current.getBoundingClientRect();
      const span = vertical ? containerH : containerW;
      const wordSpan = vertical ? wordHeight : wordWidth;
      if (span === 0 || wordSpan === 0) return;
      const n = Math.max(1, Math.floor(span / wordSpan));
      const totalLetters = n * text.length;
      if (totalLetters !== distortions.current.length) {
        distortions.current = Array.from({ length: totalLetters }, () => ({
          rotate: parseFloat((Math.random() * 14 - 7).toFixed(1)),
          y: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        }));
      }
      setCount(n);
      setMounted(true);
    };

    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    update();
    return () => ro.disconnect();
  }, [text, size, vertical]);

  // Char fill mode: measure char width, repeat to fill container
  useEffect(() => {
    if (text || !containerRef.current) return;

    const measureFontSize = sizeGradient
      ? (sizeGradient.from + sizeGradient.to) / 2
      : undefined;

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
      setMounted(true);
    };

    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    update();
    return () => ro.disconnect();
  }, [text, char, size, sizeGradient?.from, sizeGradient?.to]);

  const distorted = mounted && (active || hovered);
  const spread = justify && distorted;

  const getCharFontSize = (i: number, total: number) => {
    if (!sizeGradient || total < 2) return undefined;
    const t = i / (total - 1);
    return sizeGradient.from + (sizeGradient.to - sizeGradient.from) * t;
  };

  const getWiggleFactor = (i: number, total: number) =>
    wiggleGradient ? i / Math.max(total - 1, 1) : 1;

  // Text fill mode: render `count` repetitions of the word
  if (text) {
    const letters = Array.from({ length: count }, () => text.split("")).flat();
    return (
      <div
        ref={containerRef}
        className={cn(
          vertical
            ? cn(
                "h-full flex flex-col items-center overflow-hidden",
                spread ? "justify-between" : "justify-start",
              )
            : cn(
                "w-full flex items-baseline overflow-hidden",
                spread ? "justify-between" : "justify-start",
              ),
          textShadow && "text-shadow-md",
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {letters.map((char, i) =>
          char === " " ? (
            vertical ? (
              <span key={i} className="block h-[0.4em]" />
            ) : (
              <span key={i} className="inline-block w-[0.3em]" />
            )
          ) : (
            <motion.span
              key={i}
              layout={justify}
              className={cn(
                "inline-block leading-none font-timesNewRoman tracking-wider",
                size,
              )}
              style={(() => {
                const fs = getCharFontSize(i, letters.length);
                return fs ? { fontSize: `${fs}px` } : undefined;
              })()}
              animate={
                distorted
                  ? {
                      rotate:
                        (distortions.current[i]?.rotate ?? 0) *
                        getWiggleFactor(i, letters.length),
                      y:
                        (distortions.current[i]?.y ?? 0) *
                        getWiggleFactor(i, letters.length),
                    }
                  : { rotate: 0, y: 0 }
              }
              transition={{ ...transition, delay: distorted ? i * 0.015 : 0 }}
            >
              {char}
            </motion.span>
          ),
        )}
      </div>
    );
  }

  // Char fill mode
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
        const fs = getCharFontSize(i, count);
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
                      getWiggleFactor(i, count),
                    y:
                      (distortions.current[i]?.y ?? 0) *
                      getWiggleFactor(i, count),
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

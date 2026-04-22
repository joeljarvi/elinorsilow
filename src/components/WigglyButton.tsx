"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WigglyButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  href?: string;
  vertical?: boolean;
  className?: string;
  size?: string;
  bold?: boolean;
  revealAnimation?: boolean;
  active?: boolean;
  textShadow?: boolean;
  sizeGradient?: { from: number; to: number };
  wiggleGradient?: boolean;
}

type LetterDistortion = { rotate: number; y: number };

export default function WigglyButton({
  text,
  onClick,
  href,
  vertical = false,
  className,
  size = "text-[16px]",
  bold = false,
  active = false,
  textShadow = false,
  sizeGradient,
  wiggleGradient = false,
}: WigglyButtonProps) {
  const [hovered, setHovered] = useState(false);
  const distortions = useRef<LetterDistortion[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    distortions.current = text.split("").map(() => ({
      rotate: parseFloat((Math.random() * 14 - 7).toFixed(1)),
      y: parseFloat((Math.random() * 6 - 3).toFixed(1)),
    }));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distorted = mounted && (active || hovered);
  const letters = text.split("");

  const getCharFontSize = (i: number): number | undefined => {
    if (!sizeGradient) return undefined;
    const t = letters.length > 1 ? i / (letters.length - 1) : 0;
    return sizeGradient.from + (sizeGradient.to - sizeGradient.from) * t;
  };

  const getWiggleFactor = (i: number) =>
    wiggleGradient ? i / Math.max(letters.length - 1, 1) : 1;

  const transition = { duration: 0.18, ease: "easeOut" as const };

  const letterSpans = vertical
    ? letters.map((char, i) =>
        char === " " ? (
          <span key={i} className="block h-[0.4em]" />
        ) : (
          <motion.span
            key={i}
            className={cn(
              "inline-block leading-none font-timesNewRoman tracking-wider",
              size,
              bold ? "font-bold" : "font-normal",
            )}
            animate={
              distorted
                ? {
                    rotate: (distortions.current[i]?.rotate ?? 0) * getWiggleFactor(i),
                    y: (distortions.current[i]?.y ?? 0) * getWiggleFactor(i),
                  }
                : { rotate: 0, y: 0 }
            }
            transition={{ ...transition, delay: distorted ? i * 0.015 : 0 }}
          >
            {char}
          </motion.span>
        ),
      )
    : letters.map((char, i) =>
        char === " " ? (
          <span key={i} className="inline-block w-[0.3em]" />
        ) : (
          <motion.span
            key={i}
            className={cn(
              "inline-block leading-none font-timesNewRoman tracking-wider",
              size,
              bold ? "font-bold" : "font-normal",
            )}
            animate={
              distorted
                ? {
                    rotate: (distortions.current[i]?.rotate ?? 0) * getWiggleFactor(i),
                    y: (distortions.current[i]?.y ?? 0) * getWiggleFactor(i),
                  }
                : { rotate: 0, y: 0 }
            }
            transition={{ ...transition, delay: distorted ? i * 0.015 : 0 }}
          >
            {char}
          </motion.span>
        ),
      );

  if (href) {
    return (
      <Link
        href={href}
        data-no-reveal
        className={cn(
          "no-hide-text pointer-events-auto px-[9px] tracking-wider",
          vertical
            ? "inline-flex flex-col items-center"
            : "inline-flex items-baseline text-[16px]",
          textShadow && "text-shadow-xl",
          className,
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {letterSpans}
      </Link>
    );
  }

  if (vertical) {
    return (
      <button
        data-no-reveal
        className={cn(
          "no-hide-text pointer-events-auto cursor-pointer px-[9px] inline-flex flex-col items-center tracking-wider",
          textShadow && "text-shadow-xl",
          className,
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {letters.map((char, i) =>
          char === " " ? (
            <span key={i} className="block h-[0.4em]" />
          ) : (
            <motion.span
              key={i}
              className={cn(
                "inline-block leading-none font-timesNewRoman tracking-wider",
                size,
                bold ? "font-bold" : "font-normal",
              )}
              animate={
                distorted
                  ? {
                      rotate: distortions.current[i]?.rotate ?? 0,
                      y: distortions.current[i]?.y ?? 0,
                    }
                  : { rotate: 0, y: 0 }
              }
              transition={{ ...transition, delay: distorted ? i * 0.015 : 0 }}
            >
              {char}
            </motion.span>
          ),
        )}
      </button>
    );
  }

  return (
    <button
      data-no-reveal
      className={cn(
        " pointer-events-auto cursor-pointer px-[9px] flex flex-wrap items-baseline text-[16px] tracking-wider",
        textShadow && "text-shadow-md",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {letters.map((char, i) => {
        const fs = getCharFontSize(i);
        return char === " " ? (
          <span
            key={i}
            className="inline-block w-[0.3em]"
            style={fs ? { width: `${fs * 0.3}px` } : undefined}
          />
        ) : (
          <motion.span
            key={i}
            className={cn(
              "inline-block leading-none font-timesNewRoman tracking-wider",
              size,
              bold ? "font-bold" : "font-normal",
            )}
            style={fs ? { fontSize: `${fs}px` } : undefined}
            animate={
              distorted
                ? {
                    rotate: (distortions.current[i]?.rotate ?? 0) * getWiggleFactor(i),
                    y: (distortions.current[i]?.y ?? 0) * getWiggleFactor(i),
                  }
                : { rotate: 0, y: 0 }
            }
            transition={{ ...transition, delay: distorted ? i * 0.015 : 0 }}
          >
            {char}
          </motion.span>
        );
      },
      )}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface WigglyButtonProps {
  text: string;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => void;
  href?: string;
  vertical?: boolean;
  justify?: boolean;
  spreading?: boolean;
  className?: string;
  size?: string;
  bold?: boolean;
  revealAnimation?: boolean;
  active?: boolean;
  textShadow?: boolean;
  stroke?: string;
  strokeWidth?: number;
  sizeGradient?: { from: number; to: number };
  wiggleGradient?: boolean;
  target?: string;
  rel?: string;
  scrollTilt?: boolean;
  mobileSize?: string;
  showAnchors?: boolean;
  letterFill?: string;
  anchorFill?: string;
  forceBaseline?: boolean;
  forceBoring?: boolean;
  loopingWave?: boolean;
  forceMono?: boolean;
}

type LetterDistortion = { rotate: number; y: number };

const transition = { duration: 0.18, ease: "easeOut" as const };

export default function WigglyButton({
  text,
  onClick,
  href,
  vertical = false,
  justify = false,
  spreading,
  className,
  size = "text-[16px]",
  mobileSize,
  bold = false,
  active = false,
  textShadow = false,
  sizeGradient,
  wiggleGradient = false,
  target,
  rel,
}: WigglyButtonProps) {
  const [hovered, setHovered] = useState(false);
  const distortions = useRef<LetterDistortion[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Subtle per-letter jitter — small enough to read as "alive" without being distracting.
    distortions.current = text.split("").map(() => ({
      rotate: parseFloat((Math.random() * 8 - 4).toFixed(1)),
      y: parseFloat((Math.random() * 3 - 1.5).toFixed(1)),
    }));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distorted = mounted && (active || hovered);
  const spread =
    spreading !== undefined
      ? spreading || (justify && hovered)
      : justify && distorted;
  const letters = text.split("");

  const getCharFontSize = (i: number): number | undefined => {
    if (!sizeGradient) return undefined;
    const t = letters.length > 1 ? i / (letters.length - 1) : 0;
    return sizeGradient.from + (sizeGradient.to - sizeGradient.from) * t;
  };

  const getWiggleFactor = (i: number) =>
    wiggleGradient ? i / Math.max(letters.length - 1, 1) : 1;

  const responsiveSize = mobileSize ? `${mobileSize} lg:${size}` : size;

  const verticalLetters = letters.map((char, i) =>
    char === " " ? (
      <span key={i} className="block h-[0.4em]" />
    ) : (
      <motion.span
        key={i}
        layout={justify}
        className={cn(
          "inline-block leading-none font-timesNewRoman ",
          responsiveSize,
          bold ? "font-bold" : "font-normal",
        )}
        animate={
          distorted
            ? {
                rotate:
                  (distortions.current[i]?.rotate ?? 0) * getWiggleFactor(i),
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

  const horizontalLetters = letters.map((char, i) => {
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
        layout={justify}
        className={cn(
          "inline-block leading-none font-timesNewRoman tracking-wide",
          responsiveSize,
          bold ? "font-bold" : "font-normal",
        )}
        style={fs ? { fontSize: `${fs}px` } : undefined}
        animate={
          distorted
            ? {
                rotate:
                  (distortions.current[i]?.rotate ?? 0) * getWiggleFactor(i),
                y: (distortions.current[i]?.y ?? 0) * getWiggleFactor(i),
              }
            : { rotate: 0, y: 0 }
        }
        transition={{ ...transition, delay: distorted ? i * 0.015 : 0 }}
      >
        {char}
      </motion.span>
    );
  });

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        data-no-reveal
        className={cn(
          "pointer-events-auto ",
          vertical
            ? cn(
                "inline-flex flex-col items-center",
                justify && "h-full",
                spread ? "justify-between" : "justify-center",
              )
            : cn(
                "inline-flex items-baseline",
                justify ? "w-full" : "flex-wrap",
                spread ? "justify-between" : "justify-center",
              ),
          textShadow && "text-shadow-md",
          className,
        )}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {vertical ? verticalLetters : horizontalLetters}
      </Link>
    );
  }

  if (vertical) {
    return (
      <button
        data-no-reveal
        className={cn(
          "pointer-events-auto cursor-pointer  inline-flex flex-col items-center tracking-wider",
          justify && "h-full",
          spread ? "justify-between" : "justify-center",
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
        {verticalLetters}
      </button>
    );
  }

  return (
    <button
      data-no-reveal
      className={cn(
        "pointer-events-auto cursor-pointer  inline-flex items-baseline tracking-wide",
        justify ? "w-full" : "flex-wrap",
        spread ? "justify-between" : "justify-center",
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
      {horizontalLetters}
    </button>
  );
}

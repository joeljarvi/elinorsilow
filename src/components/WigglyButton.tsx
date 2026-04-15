"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WigglyButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  vertical?: boolean;
  className?: string;
  size?: string;
  bold?: boolean;
  revealAnimation?: boolean;
  active?: boolean;
}

type LetterDistortion = { rotate: number; y: number };

export default function WigglyButton({
  text,
  onClick,
  vertical = false,
  className,
  size = "text-[16px] lg:text-[19px]",
  bold = false,
  active = false,
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

  const transition = { duration: 0.18, ease: "easeOut" as const };

  if (vertical) {
    return (
      <button
        className={cn(
          "no-hide-text pointer-events-auto cursor-pointer px-[9px] inline-flex flex-col items-center",
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
                "inline-block leading-none font-timesNewRoman",
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
      className={cn(
        "no-hide-text pointer-events-auto cursor-pointer px-[9px] inline-flex items-baseline text-[16px] lg:text-[19px]",
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

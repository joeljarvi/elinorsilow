"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

interface WordProps {
  children: string;
  scrollProgress: ReturnType<typeof useMotionValue<number>>;
  range: [number, number];
  className?: string;
}

const AppendixWord: React.FC<{ children: React.ReactNode; scrollProgress: ReturnType<typeof useMotionValue<number>> }> = ({ children, scrollProgress }) => {
  const opacity = useTransform(scrollProgress, [0.85, 1], [0, 1]);
  return (
    <motion.span className="relative" style={{ opacity }}>
      {children}
    </motion.span>
  );
};

const Word: React.FC<WordProps> = ({ children, scrollProgress, range, className }) => {
  const opacity = useTransform(scrollProgress, range, [0, 1]);

  return (
    <span className={cn("relative mr-[0.25em]", className)}>
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

export interface MagicTextProps {
  text: string;
  className?: string;
  getWordClassName?: (index: number, word: string) => string | undefined;
  indent?: boolean;
  appendix?: React.ReactNode;
}

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className,
  getWordClassName,
  indent = false,
  appendix,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollProgress = useMotionValue(0);
  const words = text.split(" ");

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Absolute offset of wrapper from page top, calculated once at mount
    const wrapperOffset = wrapper.getBoundingClientRect().top + window.scrollY;
    const scrollable = wrapper.offsetHeight - window.innerHeight;

    let rafId: number;

    const update = () => {
      if (scrollable > 0) {
        const scrolled = window.scrollY - wrapperOffset;
        scrollProgress.set(Math.max(0, Math.min(1, scrolled / scrollable)));
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [scrollProgress]);

  return (
    <div ref={wrapperRef} style={{ height: "200vh" }}>
      <div className="sticky top-0 pt-[20vh]">
        <p className={cn("flex flex-wrap", className)}>
          {indent && <span className="inline-block w-[1em]" aria-hidden />}
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={i}
                scrollProgress={scrollProgress}
                range={[start, end]}
                className={getWordClassName?.(i, word)}
              >
                {word}
              </Word>
            );
          })}
          {appendix && (
            <AppendixWord scrollProgress={scrollProgress}>
              {appendix}
            </AppendixWord>
          )}
        </p>
      </div>
    </div>
  );
};

"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";

/* -------------------- VARIANTS -------------------- */

const NUM_VARIANTS = 4;

type LetterStyle = {
  scaleX: number;
  scaleY: number;
  rotate: number;
  italic: boolean;
  bold: boolean;
  spacing: string;
};

function getLetterStyle(char: string, variant: number): LetterStyle {
  const c = char.toLowerCase();
  const isE = c === "e";
  const isS = c === "s";
  const isI = c === "i";
  const isL = c === "l";
  const isR = c === "r";
  const isN = c === "n";
  const isT = c === "t";
  const isVeryWide = ["w", "m", "t"].includes(c);
  const isWide = isE || isS || isN;

  // base spacing — shared across variants
  const spacing = isT
    ? "0.4em"
    : isVeryWide
      ? "1.50em"
      : isWide
        ? "0.65em"
        : isR
          ? "0.4em"
          : "0.1em";

  if (variant === 0) {
    // v1 — wide: E and S stretched horizontally, S bold
    return {
      scaleX: isS ? 4 : isVeryWide ? 5 : isWide ? 3 : 2,
      scaleY: ["r", "i", "s"].includes(c) ? 0.8 : 1,
      rotate: 0,
      italic: false,
      bold: isS,
      spacing,
    };
  }

  if (variant === 1) {
    // v2 — italic + wide: E and S italic and stretched
    return {
      scaleX: isS ? 4 : isVeryWide ? 5 : isWide ? 3 : 2,
      scaleY: 1,
      rotate: 0,
      italic: isE || isS,
      bold: false,
      spacing,
    };
  }

  if (variant === 2) {
    // v3 — tall: i and l elongated vertically, narrow
    return {
      scaleX: isI || isL ? 1 : isVeryWide ? 5 : isWide ? 3 : 2,
      scaleY: isI ? 3 : isL ? 2 : 1,
      rotate: 0,
      italic: false,
      bold: false,
      spacing,
    };
  }

  // v4 — tall l and s
  return {
    scaleX: isL || isS ? 1 : isVeryWide ? 5 : isWide ? 3 : 2,
    scaleY: isL ? 3 : isS ? 2 : 1,
    rotate: 0,
    italic: false,
    bold: false,
    spacing,
  };
}

/* -------------------- ANIMATION -------------------- */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.012 },
  },
};

const letterAnim = {
  hidden: { opacity: 0, filter: "blur(8px)", scaleX: 0 },
  show: ({ scaleX, scaleY, rotate }: LetterStyle) => ({
    opacity: 1,
    filter: "blur(0px)",
    scaleX,
    scaleY,
    rotate,
    transition: { duration: 0.35 },
  }),
};

/* -------------------- LETTER -------------------- */

function Letter({ char, variant }: { char: string; variant: number }) {
  if (char === " ") return <span className="inline-block w-[0.5em]" />;

  const style = getLetterStyle(char, variant);

  return (
    <motion.span
      className={`inline-block relative${style.italic ? " italic" : ""}${style.bold ? " font-bold" : ""}`}
      custom={style}
      variants={letterAnim}
      style={{
        transformOrigin: "center center",
        marginLeft: style.spacing,
        marginRight: style.spacing,
      }}
    >
      {char}
    </motion.span>
  );
}

/* -------------------- MAIN -------------------- */

export function StretchLetters({
  body = "",
  className = "",
  onClick: onClickProp,
  defaultVariant = 0,
}: {
  body?: string;
  className?: string;
  onClick?: () => void;
  defaultVariant?: number;
}) {
  const { showInfo } = useUI();

  const prevShowInfo = useRef(showInfo);
  const [animKey, setAnimKey] = useState(0);
  const [variant, setVariant] = useState(defaultVariant);

  const containerRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (prevShowInfo.current === true && showInfo === false) {
      setAnimKey((k) => k + 1);
    }
    prevShowInfo.current = showInfo;
  }, [showInfo]);

  useEffect(() => {
    setVariant(defaultVariant);
    setAnimKey((k) => k + 1);
  }, [body, defaultVariant]);

  const letters = body.split("");

  function handleClick() {
    setVariant((v) => (v + 1) % NUM_VARIANTS);
    setAnimKey((k) => k + 1);
    onClickProp?.();
  }

  return (
    <div className="w-full">
      <motion.p
        key={animKey}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        ref={containerRef}
        onClick={handleClick}
        className={`${className} text-[21px] lg:text-[21px] leading-[1.2] px-[18px] no-hide-text font-timesNewRoman font-normal text-foreground tracking-widest pt-[9px] pb-[9px] pointer-events-auto cursor-pointer mb-[0px] max-w-full lg:max-w-3xl `}
      >
        {letters.map((char, i) => (
          <Letter key={i} char={char} variant={variant} />
        ))}
        {"\u00A0"}
      </motion.p>
    </div>
  );
}

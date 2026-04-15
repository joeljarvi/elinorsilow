"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useInfo } from "@/context/InfoContext";

/* -------------------- ANIMATION -------------------- */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012,
    },
  },
};

const letterAnim = {
  hidden: { opacity: 0, filter: "blur(8px)", scaleX: 0 },
  show: (isWide: boolean) => ({
    opacity: 1,
    filter: "blur(0px)",
    scaleX: isWide ? 2 : 1,
    transition: { duration: 0.35 },
  }),
};

/* -------------------- LETTER -------------------- */

function Letter({ char }: { char: string }) {
  const isWide = ["e", "s"].includes(char.toLowerCase());

  // handle space cleanly
  if (char === " ") {
    return <span className="inline-block w-[0.25em]" />;
  }

  const baseSpacing = "0.02em";
  const wideSpacing = "0.18em";

  return (
    <motion.span
      custom={isWide}
      variants={letterAnim}
      className="inline-block"
      style={{
        transformOrigin: "center center",
        marginLeft: isWide ? wideSpacing : baseSpacing,
        marginRight: isWide ? wideSpacing : baseSpacing,
      }}
    >
      {char}
    </motion.span>
  );
}
/* -------------------- FALLBACK -------------------- */

const FALLBACK_BODY =
  "(b. 1993, Malmö, Sweden) is a Stockholm-based artist working with painting, sculpture, and textile. Her work explores raw emotion through material, gesture, and form. For collaborations or inquiries: elinor.silow@gmail.com";

/* -------------------- MAIN -------------------- */

export function HeroTextLetters() {
  const { showInfo } = useUI();
  const { longBio } = useInfo();

  const prevShowInfo = useRef(showInfo);
  const [animKey, setAnimKey] = useState(0);

  const containerRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (prevShowInfo.current === true && showInfo === false) {
      setAnimKey((k) => k + 1);
    }
    prevShowInfo.current = showInfo;
  }, [showInfo]);

  const body = longBio || FALLBACK_BODY;
  const fullText = `Elinor Silow ${body}`;
  const letters = fullText.split("");

  return (
    <motion.p
      key={animKey}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={containerRef}
      className="text-[24px] lg:text-[21px] leading-[1.2] px-[18px] no-hide-text font-timesNewRoman text-foreground tracking-wide pt-[18px] pb-[18px] pointer-events-none mb-[0px] max-w-full lg:max-w-3xl"
    >
      {letters.map((char, i) => (
        <Letter key={i} char={char} />
      ))}

      {"\u00A0"}
    </motion.p>
  );
}

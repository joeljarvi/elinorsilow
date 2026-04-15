"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, Fragment } from "react";
import { useUI } from "@/context/UIContext";
import { useInfo } from "@/context/InfoContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012,
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(8px)",
    transition: { duration: 0.5, ease: [0.4, 0, 0.6, 1] as const },
  },
};

const wordAnim = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35 },
  },
};

const FALLBACK_BODY =
  "(b. 1993, Malmö, Sweden) is a Stockholm-based artist working with painting, sculpture, and textile. Her work explores raw emotion through material, gesture, and form. For collaborations or inquiries:";

function Word({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      variants={wordAnim}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.span>
  );
}

export function HeroText() {
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
  const bodyWords = body.split(" ");

  return (
    <motion.p
      key={animKey}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={containerRef}
      className=" text-[16px] lg:text-[19px] leading-[1.2]  px-[9px] no-hide-text font-timesNewRoman text-foreground  tracking-wide pt-[18px] pb-[18px] pointer-events-none mb-[0px] max-w-3xl   "
    >
      {"Elinor Silow".split(" ").map((w, i) => (
        <Fragment key={`name-${i}`}>
          <Word className="font-timesNewRoman  text-[16px] lg:text-[19px] flex items-center ">
            {w}
          </Word>
          {"\u00A0"}
        </Fragment>
      ))}
      {bodyWords.map((w, i) => (
        <Word key={`body-${i}`}>
          {w}
          {i < bodyWords.length - 1 ? "\u00A0" : ""}
        </Word>
      ))}
      {"\u00A0"}
      <Word>
        <Button
          variant="link"
          asChild
          className="font-timesNewRoman font-normal  text-[16px] lg:text-[19px] px-0 pointer-events-auto underline underline-offset-3 decoration-1 hover:no-underline leading-[1.2] "
        >
          <Link href="mailto:elinor.silow@gmail.com">
            elinor.silow@gmail.com
          </Link>
        </Button>
      </Word>
    </motion.p>
  );
}

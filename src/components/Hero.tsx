"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import PagePaddingSync from "./PagePaddingSync";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.012,
    },
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

const BODY =
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

export default function Hero() {
  const { showInfo } = useUI();
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

  const bodyWords = BODY.split(" ");

  return (
    <div className="relative h-screen pr-[18px] lg:pr-[64px]">
      <PagePaddingSync />
      <motion.p
        ref={containerRef}
        key={animKey}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        style={{ paddingLeft: "var(--page-pl)" }}
        className="absolute bottom-0 text-[24px] lg:text-[40px] leading-[1.2] lg:leading-[46px] mx-0 no-hide-text font-timesNewRoman text-foreground pb-[9px] max-w-6xl"
      >
        {"Elinor Silow".split(" ").map((w, i) => (
          <Word
            key={`name-${i}`}
            className="font-universNextProExt font-extrabold text-[21px] lg:text-[36px]"
          >
            {w}
            {"\u00A0"}
          </Word>
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
            variant="stroke"
            asChild
            className="font-universNextProExt font-extrabold text-[22px] lg:text-[36px] px-0"
          >
            <Link href="mailto:elinor.silow@gmail.com">
              elinor.silow@gmail.com
            </Link>
          </Button>
        </Word>
      </motion.p>
    </div>
  );
}

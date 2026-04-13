"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, Fragment } from "react";
import { useUI } from "@/context/UIContext";
import { OGubbeText } from "./OGubbeText";

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

export function HeroText() {
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
    <motion.p
      key={animKey}
      variants={container}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      ref={containerRef}
      className=" text-[24px] lg:text-[21px] leading-[1.2]  px-[0px] no-hide-text font-timesNewRoman text-foreground  tracking-wide pt-[9px] pointer-events-none mb-[0px] max-w-4xl  "
    >
      {"Elinor Silow".split(" ").map((w, i) => (
        <Fragment key={`name-${i}`}>
          <Word className="font-timesNewRoman  text-[24px] lg:text-[21px] flex items-center ">
            <OGubbeText
              className="font-timesNewRoman font-bold text-[24px] lg:text-[21px] "
              text={w}
              sizes="18px"
              lettersOnly
            />
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
          className="font-timesNewRoman  text-[24px] lg:text-[21px] px-0 pointer-events-auto underline"
        >
          <Link href="mailto:elinor.silow@gmail.com">
            elinor.silow@gmail.com
          </Link>
        </Button>
      </Word>
    </motion.p>
  );
}

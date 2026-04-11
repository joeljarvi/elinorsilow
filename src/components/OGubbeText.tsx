"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

/* -------------------- IMAGE POOL -------------------- */

const O_IMAGES = [
  "/O/O_1.png",
  "/O/O_2.png",
  "/O/O_3.png",
  "/O/O_4.png",
  "/O/ogubbe_frilagd_new.png",
];

/* -------------------- SINGLE CHAR -------------------- */

function OGubbeChar({
  char,
  o,
  sizes = "20px",
  rotate = true,
  containerHovered = false,
}: {
  char: string;
  o?: string;
  sizes?: string;
  rotate?: boolean;
  containerHovered?: boolean;
}) {
  const [restAngle, setRestAngle] = useState(0);
  const [scrollAngle, setScrollAngle] = useState(0);

  // pick image once per instance
  const randomImage = useMemo(() => {
    if (o) return o;
    return O_IMAGES[Math.floor(Math.random() * O_IMAGES.length)];
  }, [o]);

  useEffect(() => {
    setRestAngle(Math.random() * 360);
  }, []);

  const lastScrollY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );

  useEffect(() => {
    if (!rotate) return;

    const onScroll = () => {
      const delta = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      setScrollAngle((prev) => prev + delta * 0.4);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rotate]);

  const angle = restAngle + scrollAngle;

  return (
    <motion.span
      className="inline-block w-[1em] h-[1em] relative align-middle shrink-0 cursor-default"
      animate={
        !rotate
          ? { rotate: 0 }
          : containerHovered
            ? { rotate: 0 }
            : { rotate: angle }
      }
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <Image
        src={randomImage}
        alt={char}
        fill
        sizes={sizes}
        className="object-contain"
      />
    </motion.span>
  );
}

/* -------------------- MAIN COMPONENT -------------------- */

interface OGubbeTextProps {
  text: string;
  className?: string;
  fontSize?: string;
  o?: string;
  sizes?: string;
  blend?: boolean;
  vertical?: boolean;
  lettersOnly?: boolean;
  wrap?: boolean;

  rotate?: boolean;
  revealAnimation?: boolean;
}

export function OGubbeText({
  text,
  className,
  fontSize,
  o,
  sizes,
  vertical = false,
  lettersOnly = false,
  wrap = false,
  rotate = true,
  revealAnimation = true,
}: OGubbeTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [itemYOffset, setItemYOffset] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;

      const computed = window.getComputedStyle(el);
      const fontSizePx = parseFloat(computed.fontSize);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.font = `${computed.fontWeight} ${fontSizePx}px ${computed.fontFamily}`;

      const m = ctx.measureText("x");
      const xHeightEm = m.actualBoundingBoxAscent / fontSizePx;
      const ascentEm = m.fontBoundingBoxAscent / fontSizePx;

      setItemYOffset(ascentEm - 0.5 - xHeightEm / 2);
    };

    document.fonts.ready.then(measure);
  }, [fontSize]);

  const style = {
    ...(fontSize ? { fontSize } : {}),
  };

  const ASCENDERS = new Set("bdfhijkltBDFHIJKLT");

  const chars = useMemo(() => {
    return String(text ?? "")
      .split(/(o|O)/g)
      .flatMap((seg, i) => {
        if (seg === "o" || seg === "O") {
          return [{ isO: true, char: seg, key: `o-${i}` }];
        }
        return seg.split("").map((c, j) => ({
          isO: false,
          char: c,
          key: `${i}-${j}`,
        }));
      });
  }, [text]);

  const [tilts, setTilts] = useState<number[]>([]);
  useEffect(() => {
    setTilts(chars.map(() => Math.random() * 3 - 1.5));
  }, [chars.length]);

  const [containerHovered, setContainerHovered] = useState(false);
  const [containerRotation, setContainerRotation] = useState(0);

  useEffect(() => {
    setContainerRotation(Math.random() * 4 - 2);
  }, []);

  /* ---------- WORD GROUPING ---------- */

  const wordGroups = useMemo(() => {
    type CharWithIndex = (typeof chars)[0] & { globalIndex: number };

    const groups: { chars: CharWithIndex[]; isSpace: boolean; key: string }[] =
      [];

    let current: CharWithIndex[] = [];

    chars.forEach((c, i) => {
      if (c.char === " ") {
        if (current.length > 0) {
          groups.push({
            chars: current,
            isSpace: false,
            key: `wg-${groups.length}`,
          });
          current = [];
        }
        groups.push({ chars: [], isSpace: true, key: `sp-${i}` });
      } else {
        current.push({ ...c, globalIndex: i });
      }
    });

    if (current.length > 0) {
      groups.push({
        chars: current,
        isSpace: false,
        key: `wg-${groups.length}`,
      });
    }

    return groups;
  }, [chars]);

  /* -------------------- VERTICAL -------------------- */

  if (vertical) {
    return (
      <span
        className={cn(
          "inline-flex flex-col items-center justify-center font-universNextProExt font-extrabold leading-0",
          className,
        )}
        style={{
          ...style,
          gap: containerHovered ? "0.2em" : "0.06em",
          transition: "gap 0.2s ease",
          rotate: `${containerRotation}deg`,
        }}
        onMouseEnter={() => setContainerHovered(true)}
        onMouseLeave={() => setContainerHovered(false)}
      >
        {chars.map(({ isO, char, key }, i) =>
          isO && !lettersOnly ? (
            <OGubbeChar
              key={key}
              char={char}
              o={o}
              sizes={sizes}
              rotate={rotate}
              containerHovered={containerHovered}
            />
          ) : char === " " ? (
            <span key={key} className="block h-[0.6em]" />
          ) : (
            <motion.span
              key={key}
              className="leading-none text-center w-full"
              style={{ transformOrigin: "top center" }}
              initial={revealAnimation ? { scaleY: 0 } : false}
              animate={{
                scaleY: 1,
                rotate: containerHovered ? 0 : (tilts[i] ?? 0),
              }}
              transition={{
                scaleY: { delay: i * 0.3, duration: 0.35, ease: "easeOut" },
                rotate: { duration: 0.15, ease: "easeOut" },
              }}
            >
              {char}
            </motion.span>
          ),
        )}
      </span>
    );
  }

  /* -------------------- WRAP -------------------- */

  if (wrap) {
    return (
      <span
        ref={containerRef}
        className={cn(
          "inline-flex flex-wrap items-center font-universNextProExt font-extrabold overflow-visible",
          className,
        )}
        style={{ ...style, rowGap: "0.2em" }}
        onMouseEnter={() => setContainerHovered(true)}
        onMouseLeave={() => setContainerHovered(false)}
      >
        {wordGroups.map((group) =>
          group.isSpace ? (
            <span key={group.key} className="inline-block w-[0.3em]" />
          ) : (
            <span
              key={group.key}
              className="inline-flex items-center"
              style={{ height: "1.5em" }}
            >
              {group.chars.map(({ isO, char, key, globalIndex }) => (
                <motion.span
                  key={key}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "1.5em",
                    y: `${itemYOffset}em`,
                    transformOrigin: "left center",
                  }}
                  initial={revealAnimation ? { scaleX: 0 } : false}
                  animate={{
                    scaleX: 1,
                    rotate: containerHovered ? 0 : (tilts[globalIndex] ?? 0),
                  }}
                  transition={{
                    scaleX: {
                      delay: globalIndex * 0.3,
                      duration: 0.35,
                      ease: "easeOut",
                    },
                    rotate: { duration: 0.15, ease: "easeOut" },
                  }}
                >
                  {isO && !lettersOnly ? (
                    <OGubbeChar
                      char={char}
                      o={o}
                      sizes={sizes}
                      rotate={rotate}
                      containerHovered={containerHovered}
                    />
                  ) : (
                    <span
                      className="leading-none inline-flex items-center"
                      style={
                        ASCENDERS.has(char) ? { paddingTop: "50%" } : undefined
                      }
                    >
                      {char}
                    </span>
                  )}
                </motion.span>
              ))}
            </span>
          ),
        )}
      </span>
    );
  }

  /* -------------------- DEFAULT -------------------- */

  return (
    <span
      ref={containerRef}
      className={cn(
        "inline-flex items-center font-universNextProExt font-extrabold overflow-visible",
        className,
      )}
      style={{
        ...style,
        height: "1.5em",
        gap: containerHovered ? "0.2em" : "0.06em",
        transition: "gap 0.2s ease",
      }}
      onMouseEnter={() => setContainerHovered(true)}
      onMouseLeave={() => setContainerHovered(false)}
    >
      {chars.map(({ isO, char, key }, i) => (
        <motion.span
          key={key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: "1.5em",
            y: `${itemYOffset}em`,
            transformOrigin: "left center",
          }}
          initial={revealAnimation ? { scaleX: 0 } : false}
          animate={{
            scaleX: 1,
            rotate: containerHovered ? 0 : (tilts[i] ?? 0),
          }}
          transition={{
            scaleX: { delay: i * 0.3, duration: 0.35, ease: "easeOut" },
            rotate: { duration: 0.15, ease: "easeOut" },
          }}
        >
          {isO && !lettersOnly ? (
            <OGubbeChar
              char={char}
              o={o}
              sizes={sizes}
              rotate={rotate}
              containerHovered={containerHovered}
            />
          ) : char === " " ? (
            <span className="inline-block w-[0.3em]" />
          ) : (
            <span
              className="leading-none inline-flex items-center"
              style={ASCENDERS.has(char) ? { paddingTop: "50%" } : undefined}
            >
              {char}
            </span>
          )}
        </motion.span>
      ))}
    </span>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

function OGubbeChar({
  loading,
  char,
  o = "/ogubbe_frilagd_new.png",
  sizes = "20px",
  rotate = true,
}: {
  loading: boolean;
  char: string;
  o?: string;
  sizes?: string;
  rotate?: boolean;
}) {
  const [restAngle, setRestAngle] = useState(() => Math.random() * 360);
  const [scrollAngle, setScrollAngle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const prevLoading = useRef(loading);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    if (prevLoading.current && !loading) {
      setRestAngle(Math.random() * 360);
    }
    prevLoading.current = loading;
  }, [loading]);

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

  const angle = restAngle + scrollAngle + (hovered ? 180 : 0);

  return (
    <motion.span
      className="inline-block w-[2em] h-[2em] relative align-[-0.4em] shrink-0 cursor-default"
      onHoverStart={() => rotate && setHovered(true)}
      onHoverEnd={() => rotate && setHovered(false)}
      animate={
        !rotate
          ? { rotate: 0 }
          : loading
            ? { rotate: angle + 360 }
            : { rotate: angle }
      }
      transition={
        rotate && loading
          ? { rotate: { repeat: Infinity, duration: 1.6, ease: "linear" } }
          : { duration: 0.15, ease: "easeOut" }
      }
    >
      <Image
        src={o}
        alt={char}
        fill
        sizes={sizes}
        className="object-contain invert"
      />
    </motion.span>
  );
}

interface OGubbeTextProps {
  text: string;
  loading?: boolean;
  className?: string;
  fontSize?: string;
  o?: string;
  sizes?: string;
  blend?: boolean;
}

export function OGubbeText({
  text,
  loading = false,
  className,
  fontSize,
  o,
  sizes,
  blend = false,
}: OGubbeTextProps) {
  const segments = text.split(/(o|O)/g);

  return (
    <span
      className={cn("inline-flex items-center  ", className)}
      style={{
        ...(fontSize ? { fontSize } : {}),
        ...(blend ? { mixBlendMode: "difference", color: "white" } : {}),
      }}
    >
      {segments.map((seg, i) => {
        if (seg === "o" || seg === "O") {
          return (
            <OGubbeChar
              key={i}
              loading={loading}
              char={seg}
              o={o}
              sizes={sizes}
              rotate={true}
            />
          );
        }
        return <span key={i}>{seg}</span>;
      })}
    </span>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

function OGubbeChar({ loading, char, o = "/ogubbe_frilagd.png", sizes = "20px" }: { loading: boolean; char: string; o?: string; sizes?: string }) {
  const [restAngle, setRestAngle] = useState(() => Math.random() * 360);
  const [hovered, setHovered] = useState(false);
  const prevLoading = useRef(loading);

  useEffect(() => {
    if (prevLoading.current && !loading) {
      setRestAngle(Math.random() * 360);
    }
    prevLoading.current = loading;
  }, [loading]);

  return (
    <motion.span
      className="inline-block w-[2em] h-[2em] relative align-[-0.4em] shrink-0 cursor-default"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={
        loading
          ? { rotate: restAngle + 360 }
          : hovered
            ? { rotate: restAngle + 180 }
            : { rotate: restAngle }
      }
      transition={
        loading
          ? { rotate: { repeat: Infinity, duration: 1.6, ease: "linear" } }
          : { duration: 0.4, ease: "easeOut" }
      }
    >
      <Image
        src={o}
        alt={char}
        fill
        sizes={sizes}
        className="object-contain dark:invert"
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
}

export function OGubbeText({
  text,
  loading = false,
  className,
  fontSize,
  o,
  sizes,
}: OGubbeTextProps) {
  const segments = text.split(/(o|O)/g);

  return (
    <span className={cn("inline-flex items-center", className)} style={fontSize ? { fontSize } : undefined}>
      {segments.map((seg, i) => {
        if (seg === "o" || seg === "O") {
          return <OGubbeChar key={i} loading={loading} char={seg} o={o} sizes={sizes} />;
        }
        return <span key={i}>{seg}</span>;
      })}
    </span>
  );
}

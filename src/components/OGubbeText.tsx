"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

function OGubbeChar({ loading, char }: { loading: boolean; char: string }) {
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
      className="inline-block w-[1.5em] h-[1.5em] relative align-[-0.15em] shrink-0 cursor-default"
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
        src="/ogubbe_frilagd.png"
        alt={char}
        fill
        sizes="20px"
        className="object-contain dark:invert"
      />
    </motion.span>
  );
}

interface OGubbeTextProps {
  text: string;
  loading?: boolean;
  className?: string;
}

export function OGubbeText({
  text,
  loading = false,
  className,
}: OGubbeTextProps) {
  const segments = text.split(/(o|O)/g);

  return (
    <span className={cn(className)}>
      {segments.map((seg, i) => {
        if (seg === "o" || seg === "O") {
          return <OGubbeChar key={i} loading={loading} char={seg} />;
        }
        return <span key={i}>{seg}</span>;
      })}
    </span>
  );
}

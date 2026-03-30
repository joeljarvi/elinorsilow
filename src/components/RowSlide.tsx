"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function RowSlide({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -75% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ paddingLeft: 18 }}
      animate={{ paddingLeft: inView ? 68 : 18 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

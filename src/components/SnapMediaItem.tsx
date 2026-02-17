"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  index: number;
  onActive: (i: number) => void;
  children: React.ReactNode;
  className?: string;
};

export default function SnapMediaItem({
  index,
  onActive,
  children,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

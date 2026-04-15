"use client";

import { AnimatePresence, motion } from "framer-motion";
import { OGubbeText } from "@/components/OGubbeText";

interface PageLoaderProps {
  text: string;
  loading: boolean;
}

export default function PageLoader({ text, loading }: PageLoaderProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Mobile: vertical */}
          <OGubbeText
            text={text}
            vertical
            className="lg:hidden text-[16px] lg:text-[19px] font-timesNewRoman font-bold text-foreground/20"
            sizes="40px"
          />
          {/* Desktop: horizontal */}
          <OGubbeText
            text={text}
            lettersOnly
            className="hidden lg:inline-flex text-[19px] font-timesNewRoman font-bold  text-foreground/20"
            sizes="144px"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

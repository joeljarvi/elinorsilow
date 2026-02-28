"use client";

import { AnimatePresence, motion } from "framer-motion";
import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";

type ExhibitionModalProps = {
  slug: string;
  onClose: () => void;
};

export default function ExhibitionModal({
  slug,
  onClose,
}: ExhibitionModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-30   h-screen scrollbar-hide overflow-hidden bg-background/30 backdrop-blur-sm  "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP only over content columns (col 2-4) */}

        {/* MODAL only in content area (col 2-4) */}
        <motion.div
          key="modal"
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
          className="relative   w-full    flex flex-col overflow-hidden  z-40 scrollbar-hide p-8  "
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exhibition-modal-title"
        >
          <ExhibitionSlugModalClient slug={slug} onClose={onClose} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BackToTop() {
  const lenis = useLenis();

  return (
    <Button
      variant="link"
      size="sm"
      className=" absolute z-50 bottom-4 left-2    "
      onClick={() => lenis?.scrollTo(0)}
    >
      Back to Top
    </Button>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";
import { Button } from "@/components/ui/button";

type ExhibitionModalProps = {
  slug: string;
  onClose: () => void;
};

export default function ExhibitionModal({
  slug,
  onClose,
}: ExhibitionModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-20 h-screen w-full grid grid-cols-4    "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP only over content columns (col 2-4) */}
        <div
          className="col-start-2 col-span-3 lg:bg-black/30 bg-black/50 absolute inset-y-0 right-0 lg:px-8 lg:pt-4 "
          onClick={onClose}
        />

        {/* MODAL only in content area (col 2-4) */}
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          className="relative col-start-1 lg:col-start-2 col-span-4 lg:col-span-3 w-full h-full bg-background  overflow-auto flex flex-col "
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <Button
            className="hidden lg:absolute top-0 right-0   z-50 font-EBGaramond hover:font-EBGaramondItalic cursor-pointer py-6 px-6 transition-all"
            size="linkSize"
            variant="link"
            onClick={onClose}
          >
            Back
          </Button>

          <ExhibitionSlugModalClient slug={slug} onClose={onClose} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

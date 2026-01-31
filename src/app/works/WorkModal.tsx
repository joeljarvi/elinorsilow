"use client";

import { AnimatePresence, motion } from "framer-motion";
import WorkSlugModalClient from "@/app/works/WorkSlugModalClient";
import { Button } from "@/components/ui/button";

type WorkModalProps = {
  slug: string;
  onClose: () => void;
};

export default function WorkModal({ slug, onClose }: WorkModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-30 h-screen w-full grid grid-cols-4 bg-background  "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP only over content columns (col 2-4) */}
        <div
          className="col-start-1 lg:col-start-2 col-span-3 lg:bg-black/30 bg-black/50 absolute inset-y-0 right-0  "
          onClick={onClose}
        />

        {/* MODAL only in content area (col 2-4) */}
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          className="relative col-start-1 col-span-4 lg:col-start-2  w-full h-screen  bg-background  overflow-auto flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* <Button
            className="fixed  bottom-0 left-0  lg:top-0 lg:right-0 lg:left-auto lg:bottom-auto   z-50 font-EBGaramond hover:font-EBGaramondItalic cursor-pointer  text-sm mb-3 pt-2 px-3 flex items-baseline transition-all"
            size="linkSize"
            variant="link"
            onClick={onClose}
          >
            Back
          </Button> */}

          <WorkSlugModalClient onClose={onClose} slug={slug} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

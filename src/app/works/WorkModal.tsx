"use client";

import { AnimatePresence, motion } from "framer-motion";
import WorkSlugModalClient from "@/app/works/WorkSlugModalClient";
import { ReactLenis } from "lenis/react";

type WorkModalProps = {
  slug: string;
  onClose: () => void;
};

export default function WorkModal({ slug, onClose }: WorkModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-30 h-screen w-full bg-transparent grid grid-cols-6   "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP only over content columns (col 2-4) */}
        <div
          className="col-start-1  col-span-6 absolute inset-y-0 right-0 z-30 backdrop-blur-sm bg-black/30 "
          onClick={onClose}
        />

        {/* MODAL only in content area (col 2-4) */}
        <motion.div
          key="modal"
          onClick={(e) => e.stopPropagation()}
          className="relative col-start-1 lg:col-span-4 col-span-6 lg:col-start-1  w-full h-screen  bg-background   flex flex-col overflow-hidden  shadow z-40"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <ReactLenis
            root={false}
            className="h-full overflow-y-auto scrollbar-hide"
            options={{
              smoothWheel: true,
              duration: 1.15,
              easing: (t) => 1 - Math.pow(1 - t, 4),
            }}
          >
            <WorkSlugModalClient onClose={onClose} slug={slug} />
          </ReactLenis>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

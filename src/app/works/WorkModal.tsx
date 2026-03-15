"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorkSlugModalClient from "@/app/works/WorkSlugModalClient";
import { ReactLenis } from "lenis/react";

type WorkModalProps = {
  slug: string;
  onClose: () => void;
};

export default function WorkModal({ slug, onClose }: WorkModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setIsOpen(false);
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Modal panel */}
          <motion.div
            key="modal"
            onClick={(e) => e.stopPropagation()}
            className="relative w-screen h-screen bg-background flex flex-col overflow-hidden z-40"
            initial={{ y: "4%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "4%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="work-modal-title"
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
              <WorkSlugModalClient onClose={handleClose} slug={slug} />
            </ReactLenis>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

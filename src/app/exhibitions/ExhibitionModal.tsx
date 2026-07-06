"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";
import CloseButton from "@/components/CloseButton";

type ExhibitionModalProps = {
  slug: string;
  onClose: () => void;
  onOpenWorkByTitle?: (title: string) => void;
};

export default function ExhibitionModal({
  slug,
  onClose,
  onOpenWorkByTitle,
}: ExhibitionModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setIsOpen(false);
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[200]  bg-background/40 backdrop-blur-xl w-full overflow-hidden noise-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            key="modal"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full overflow-y-auto scrollbar-hide z-40 "
            initial={{ y: "4%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "4%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exhibition-modal-title"
          >
            <ExhibitionSlugModalClient
              slug={slug}
              onClose={handleClose}
              onOpenWorkByTitle={onOpenWorkByTitle}
            />
          </motion.div>

          {/* Close — top right (rendered outside the scrollable modal wrapper so `fixed` anchors to the viewport) */}
          <CloseButton
            className="fixed top-0 right-0 z-[220]"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

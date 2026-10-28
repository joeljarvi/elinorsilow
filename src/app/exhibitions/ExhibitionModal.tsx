"use client";

import { useState } from "react";
import useModalOpen from "@/hooks/use-modal-open";
import { AnimatePresence, motion } from "framer-motion";
import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";

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

  useModalOpen();

  const handleClose = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setIsOpen(false);
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[90] bg-background overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            key="modal"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full overflow-y-auto bg-background scrollbar-hide z-40 shadow "
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

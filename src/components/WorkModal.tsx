"use client";

import { useState } from "react";
import useModalOpen from "@/hooks/use-modal-open";
import { AnimatePresence, motion } from "framer-motion";
import WorkSlugModalClient from "@/components/WorkSlugModalClient";
import { useUI } from "@/context/UIContext";

type WorkModalProps = {
  slug: string;
  onClose: () => void;
  showInfo?: boolean;
};

export default function WorkModal({ slug, onClose, showInfo }: WorkModalProps) {
  const { showColorBg } = useUI();
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
          key="backdrop"
          className={`fixed inset-0 z-[70] cursor-none  `}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            key="content"
            className="w-full h-full bg-background  backdrop-blur-xs   "
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <WorkSlugModalClient
              slug={slug}
              onClose={handleClose}
              showInfo={showInfo}
            />
          </motion.div>

          {/* Custom cursor */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

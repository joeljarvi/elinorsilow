"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorkSlugModalClient from "@/app/works/WorkSlugModalClient";
import { useUI } from "@/context/UIContext";

type WorkModalProps = {
  slug: string;
  onClose: () => void;
};

export default function WorkModal({ slug, onClose }: WorkModalProps) {
  const { showColorBg } = useUI();
  const [isOpen, setIsOpen] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleClose = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setIsOpen(false);
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isOpen && (
        <motion.div
          key="backdrop"
          className={`fixed inset-0 z-[110] cursor-none ${showColorBg ? "bg-background/10" : "bg-background/70 backdrop-blur-sm"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => setCursorVisible(false)}
        >
          <motion.div
            key="content"
            className="w-full h-full"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <WorkSlugModalClient slug={slug} onClose={handleClose} />
          </motion.div>

          {/* Custom cursor */}
          {cursorVisible && (
            <div
              className="hidden lg:block fixed pointer-events-none z-[120] font-universNextProExt font-extrabold text-[11px] tracking-wide"
              style={{
                left: mousePos.x + 14,
                top: mousePos.y,
                transform: "translateY(-50%)",
              }}
            >
              Close window
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

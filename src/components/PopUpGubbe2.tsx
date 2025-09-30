"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PopUpGubbe2() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 10s
    const showTimer = setTimeout(() => setVisible(true), 4000);

    // Hide after 40s (10 + 30)
    const hideTimer = setTimeout(() => setVisible(false), 40000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-6 right-6 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Text (fades in after image) */}

          <div className="relative w-24 h-24">
            <Image
              src="/du_o_lille_jag.png"
              alt="Elinor Silow drawing"
              fill
              className="object-contain dark:invert"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

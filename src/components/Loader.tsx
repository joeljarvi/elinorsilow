"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Loader() {
  return (
    <div className="fixed flex flex-col items-start justify-start w-screen h-screen bg-background p-4">
      <AnimatePresence>
        <motion.div
          key="loading-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, rotate: 360 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.5 },
            rotate: { repeat: Infinity, duration: 2, ease: "linear" },
          }}
          className="w-fit"
        >
          <Image
            src="/ogubbe_frilagd.png"
            alt="drawing by Elinor Silow"
            width={2124}
            height={2123}
            priority
            className="w-12 h-auto object-cover dark:invert"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

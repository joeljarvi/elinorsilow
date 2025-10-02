"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-background">
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
            className="max-w-12 lg:max-w-24 object-cover dark:invert"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

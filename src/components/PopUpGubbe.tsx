"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function PopUpGubbe() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show after 10s
    const showTimer = setTimeout(() => setVisible(true), 10000);

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
          className="font-walkingOCR fixed bottom-3 left-3 lg:right-3 lg:left-auto
           z-50 flex items-start gap-1.5 max-w-3/4 lg:max-w-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          {/* Text (fades in after image) */}
          <div className="flex items-start justify-start border-[0.025rem] border-foreground rounded-xs bg-background p-3">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className=""
            >
              <p className="">
                Interested in making business with Elinor?{" "}
                <a
                  href="mailto:elinor.silow@gmail.com"
                  className="border-b-[0.025rem] border-b-foreground pb-1"
                >
                  Send her a message!
                </a>
              </p>
            </motion.div>
            <div className="flex flex-col items-end justify-start">
              <button
                onClick={() => setVisible(!visible)}
                className=" rounded-full p-1 cursor-pointer text-foreground hover:text-foreground/60"
              >
                <Cross1Icon />
              </button>

              {/* Image slides in */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src="/elli_trumpetgubbe_frilagd.png"
                  alt="Elinor Silow drawing"
                  width={60}
                  height={60}
                  className="object-contain dark:invert mt-16"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

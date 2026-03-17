"use client";

import { useState, useEffect } from "react";
import { useNav } from "@/context/NavContext";
import { useUI } from "@/context/UIContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function NavIcon({ state }: { state: "loading" | "idle" | "open" }) {
  const src =
    state === "loading"
      ? "/nav_loading.svg"
      : state === "open"
        ? "/trumpet_3_NAV.svg"
        : "/trumpet_1_NAV.svg";

  const isLoading = state === "loading";

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: isLoading ? 360 : 0,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={
        isLoading
          ? {
              rotate: {
                repeat: Infinity,
                duration: 1.6,
                ease: "linear",
              },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }
          : { duration: 0.25, ease: "easeOut" }
      }
      className="relative w-18 h-18 no-hide-text"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="96px"
        className="object-contain dark:invert no-hide-text"
        priority
      />
    </motion.div>
  );
}

export default function NavButton() {
  const { infoLoading } = useInfo();
  const { viewLoading } = useNav();
  const { open, handleOpen } = useUI();

  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }

    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  const initialAppLoading = !initialLoaded;
  const showNavLoader = initialAppLoading || viewLoading;

  type NavVisualState = "loading" | "idle" | "open";

  const navState: NavVisualState = showNavLoader
    ? "loading"
    : open
      ? "open"
      : "idle";

  useEffect(() => {
    if (navState !== "idle") return;
    const id = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);
    }, 8000);
    return () => clearInterval(id);
  }, [navState]);

  return (
    <motion.button
      className="fixed bottom-8 right-8 z-[70] drop-shadow-lg"
      onClick={handleOpen}
      aria-label={open ? "Stäng meny" : "Öppna meny"}
      aria-expanded={open}
      animate={isPulsing ? { scale: [1, 1.15, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <NavIcon state={navState} />
      </AnimatePresence>
    </motion.button>
  );
}

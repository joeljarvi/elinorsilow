"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Staggered from "@/components/Staggered";
import HDivider from "@/components/HDivider";
import Link from "next/link";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { DarkModeToggle } from "./DarkModeToggle";
import Nav from "./Nav";

type ExhibitionItem = {
  id: number;
  title: { rendered: string };
  slug?: string;
  __type: "exhibition";
};

type ExhibitionListItem = {
  id: number;
  title: { rendered: string };
  __type: "list";
};

const container: Variants = {
  hidden: {
    transition: { staggerChildren: 0.06, staggerDirection: -1 },
  },
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

function MobileNavOverlay() {
  const { open, handleOpen } = useNav();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed lg:hidden inset-0 z-30 h-screen w-full bg-background flex flex-col items-center justify-center pointer-events-auto"
        >
          <Button
            className="  absolute top-4 left-1/2 -translate-x-1/2 font-EBGaramondAC flex z-50 transition-all tracking-wide justify-start items-baseline rounded text-base gap-x-1 uppercase"
            size="listSize"
            variant="link"
            onClick={handleOpen}
          >
            Back
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NavButton() {
  const { infoLoading } = useInfo();
  const { viewLoading, open, handleOpen } = useNav();

  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }

    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  const initialAppLoading = !initialLoaded;
  const showNavLoader = initialAppLoading || viewLoading;

  return (
    <>
      <button
        className="fixed lg:hidden bottom-8 left-1/2 -translate-x-1/2 top-auto z-50  flex items-center justify-center w-24 h-24 "
        onClick={handleOpen}
      >
        {showNavLoader ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0.6, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              opacity: { duration: 0.4, ease: "easeOut" },
            }}
            className="relative w-24 h-24 mr-4"
          >
            <Image
              src="/ogubbe_frilagd_new.png"
              alt={"loading"}
              fill
              sizes="96px"
              className="h-full w-auto object-contain cursor-pointer dark:invert"
              priority
            />
          </motion.div>
        ) : (
          <motion.div
            key="static"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "linear",
            }}
            className="relative w-24 h-24 mr-2 "
          >
            <Image
              src="/elli_trumpetgubbe_new_frilagd.png"
              alt="Elinor Silow"
              fill
              sizes="96px"
              className="h-full w-auto object-contain cursor-pointer dark:invert"
              priority
            />
          </motion.div>
        )}
      </button>
      {open && <MobileNavOverlay />}
    </>
  );
}

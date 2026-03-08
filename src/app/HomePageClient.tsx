"use client";

import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import type { Work, Exhibition } from "../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import Staggered from "@/components/Staggered";
import Link from "next/link";

import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import InfoPageClient from "@/components/InfoPageClient";
import HDivider from "@/components/HDivider";
import { useState, useEffect } from "react";
import UnderConstruction from "@/components/UnderConstruction";
import { Cross1Icon } from "@radix-ui/react-icons";
import Hero from "@/components/Hero";

type Props = {
  showInfo?: boolean;
  setShowInfo?: (v: boolean) => void;
  view?: "works" | "exhibitions" | "info";
  setView?: (v: "works" | "exhibitions" | "info") => void;
};

function UnderConstructionOverlay() {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="under-construction"
          className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            className="absolute top-0 right-0 aspect-square h-auto"
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            aria-label="Stäng"
          >
            <Cross1Icon aria-hidden="true" />
          </Button>
          <UnderConstruction />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MainContent({}: Props) {
  const { setOpen, showInfo } = useUI();
  const { setActiveWorkSlug, activeWorkSlug, getWorkSizeClass, featuredWorks } =
    useWorks();
  const { activeExhibitionSlug, setActiveExhibitionSlug, featuredExhibitions } =
    useExhibitions();

  const router = useRouter();

  return (
    <>
      <section
        className=" mx-auto
      flex flex-col items-start justify-start w-full min-h-screen  "
      >
        <Hero />
      </section>
      <Button
        className=" w-min hidden  "
        variant="link"
        size="lg"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </Button>

      <UnderConstructionOverlay />

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => {
            setActiveWorkSlug(null);
            setOpen(true);
          }}
        />
      )}

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => {
            setActiveExhibitionSlug(null);
            setOpen(true);
          }}
        />
      )}
    </>
  );
}

export default function HomePageClient() {
  return (
    <div className="min-h-full w-full   ">
      <MainContent />
    </div>
  );
}

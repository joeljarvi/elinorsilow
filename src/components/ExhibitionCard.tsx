"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Exhibition } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { Card, CardContent } from "@/components/ui/card";
import InfoBox from "@/components/InfoBox";
import { RevealImage } from "@/components/RevealImage";

interface ExhibitionCardProps {
  ex: Exhibition;
  index: number;
  onOpen: () => void;
  activeInfoId?: string | null;
  onInfoOpen?: (id: string) => void;
}

const ease = [0.25, 1, 0.5, 1] as const;

export default function ExhibitionCard({
  ex,
  index,
  onOpen,
  activeInfoId,
  onInfoOpen,
}: ExhibitionCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { setHoveredItemTitle } = useUI();
  const cardRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Mobile only: close when another card becomes active
  useEffect(() => {
    if (window.innerWidth < 1024 && activeInfoId !== String(ex.id)) {
      setInfoOpen(false);
    }
  }, [activeInfoId, ex.id]);

  useEffect(() => {
    if (infoOpen) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [infoOpen]);

  return (
    <Card
      ref={cardRef}
      className="w-full h-dvh flex flex-col border-0 shadow-none bg-transparent p-0 gap-0 rounded-none overflow-hidden"
      onMouseEnter={() => setHoveredItemTitle(ex.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full h-full p-0 flex flex-col">
        {/* InfoBox at top */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              ref={infoRef}
              initial={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease }}
              className="overflow-hidden flex-shrink-0 cursor-zoom-in"
              onClick={() => onOpen()}
            >
              <InfoBox
                exhibition={ex}
                onClose={() => setInfoOpen(false)}
                onImageClick={onOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image fills remaining space */}
        <button
          className={`flex-1 min-h-0 flex justify-center items-center w-full px-[32px] lg:px-0 ${infoOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
          onClick={() => {
            if (infoOpen) {
              onOpen();
            } else {
              setInfoOpen(true);
              onInfoOpen?.(String(ex.id));
            }
          }}
          aria-label={
            infoOpen
              ? `Open ${ex.title.rendered}`
              : `Show info: ${ex.title.rendered}`
          }
        >
          {ex.acf.image_1 && (
            <RevealImage
              src={ex.acf.image_1.url}
              alt={ex.title.rendered}
              width={0}
              height={0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              revealIndex={index}
              className="w-full h-auto max-h-full object-contain"
            />
          )}
        </button>
      </CardContent>
    </Card>
  );
}

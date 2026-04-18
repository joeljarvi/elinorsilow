"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Work } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { Card, CardContent } from "@/components/ui/card";
import InfoBox from "@/components/InfoBox";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";

interface WorkCardProps {
  work: Work;
  onOpen: () => void;
  revealIndex?: number;
  objectPosition?: string;
  showTitles?: boolean;
  imageClassName?: string;
}

export default function WorkCard({
  work,
  onOpen,
  revealIndex = 0,
  objectPosition = "center",
  showTitles = false,
  imageClassName = "max-h-dvh",
}: WorkCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { setHoveredItemTitle } = useUI();
  const cardRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (infoOpen) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [infoOpen]);

  return (
    <Card
      ref={cardRef}
      className="w-full h-dvh flex flex-col border-0 shadow-none bg-transparent p-0 gap-0 rounded-none overflow-hidden"
      onMouseEnter={() => setHoveredItemTitle(work.title.rendered)}
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
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="overflow-hidden flex-shrink-0 cursor-zoom-in"
              onClick={() => onOpen()}
            >
              <InfoBox work={work} onClose={() => setInfoOpen(false)} onImageClick={onOpen} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image fills remaining space */}
        <motion.button
          animate={{ scale: infoOpen ? 0.75 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className={`flex-1 min-h-0 flex justify-center items-center w-full ${infoOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
          onClick={() => (infoOpen ? onOpen() : setInfoOpen(true))}
          aria-label={
            infoOpen
              ? `Open ${work.title.rendered}`
              : `Show info: ${work.title.rendered}`
          }
        >
          {work.image_url && (
            <ProportionalWorkImage
              src={work.image_url}
              alt={work.title.rendered}
              revealIndex={revealIndex}
              noScaleY
              dimensions={work.acf.dimensions}
              objectPosition={objectPosition}
              className={`max-h-full ${imageClassName}`}
            />
          )}
        </motion.button>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useRef } from "react";
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
  showTitles?: boolean;
  imageClassName?: string;
}

export default function WorkCard({
  work,
  onOpen,
  revealIndex = 0,
  showTitles = false,
  imageClassName = "max-h-full",
}: WorkCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { setHoveredItemTitle, setVisibleWorkIndex } = useUI();
  const cardRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  return (
    <Card
      ref={cardRef}
      className="w-full bg-transparent flex flex-col  scroll-mt-[64px] lg:scroll-mt-[45px] h-dvh lg:min-h-0 items-start justify-start  border-0 shadow-none   gap-0 rounded-none py-0"
      onMouseEnter={() => setHoveredItemTitle(work.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full h-full items-start justify-start px-0 pb-0  flex flex-col">
        {/* InfoBox above */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              ref={infoRef}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className="flex-shrink-0 cursor-zoom-in lg:p-0 w-full"
              onClick={() => onOpen()}
            >
              <InfoBox work={work} onClose={() => setInfoOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Image */}
        <motion.button
          layout
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className={`flex justify-start items-start w-full ${infoOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
          onClick={() => {
            if (infoOpen) {
              onOpen();
            } else {
              setInfoOpen(true);
              setVisibleWorkIndex(revealIndex);
            }
          }}
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
              objectPosition="top left"
              className={`max-h-full ${imageClassName}`}
            />
          )}
        </motion.button>
      </CardContent>
    </Card>
  );
}

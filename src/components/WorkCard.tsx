"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Work } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { Card, CardContent } from "@/components/ui/card";
import InfoBox from "@/components/InfoBox";
import { OGubbeText } from "@/components/OGubbeText";
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

  useEffect(() => {
    if (infoOpen) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [infoOpen]);

  return (
    <Card
      ref={cardRef}
      className="w-full flex flex-col items-center justify-center border-0 shadow-none bg-transparent p-0 gap-0 rounded-none"
      onMouseEnter={() => setHoveredItemTitle(work.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full p-0">
        <motion.button
          animate={{ scale: infoOpen ? 0.5 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className={`flex justify-center w-full lg:min-h-[200px] ${infoOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
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
              className={imageClassName}
            />
          )}
        </motion.button>

        {/* InfoBox: absolutely positioned below image, does not affect card layout height */}
        <div className="relative w-full h-0">
          <div className="absolute top-0 left-0 right-0 overflow-hidden z-10">
            <motion.div
              animate={{
                y: infoOpen ? "0%" : "-100%",
                opacity: infoOpen ? 1 : 0,
                filter: infoOpen ? "blur(0px)" : "blur(8px)",
              }}
              initial={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="cursor-zoom-in"
              onClick={() => onOpen()}
            >
              <InfoBox work={work} onClose={() => setInfoOpen(false)} />
            </motion.div>
          </div>
        </div>
      </CardContent>

      {showTitles && (
        <div className="flex justify-center pt-[9px]">
          <OGubbeText
            text={work.title.rendered}
            lettersOnly
            wrap
            className="text-[15px] lg:text-[18px]"
            sizes="18px"
          />
        </div>
      )}
    </Card>
  );
}

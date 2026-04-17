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

  // Mobile only: close when another card becomes active
  useEffect(() => {
    if (window.innerWidth < 1024 && activeInfoId !== String(ex.id)) {
      setInfoOpen(false);
    }
  }, [activeInfoId, ex.id]);

  useEffect(() => {
    if (infoOpen) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [infoOpen]);

  return (
    <Card
      ref={cardRef}
      className="w-full flex flex-col border-0 shadow-none bg-transparent mt-0 lg:mt-[0px] p-0 gap-0 rounded-none"
      onMouseEnter={() => setHoveredItemTitle(ex.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full p-0 flex flex-col">
        {/* Image — layout so it animates when InfoBox squeezes it */}
        <motion.div
          layout
          animate={{ scale: infoOpen ? 0.5 : 1 }}
          transition={{ duration: 0.5, ease }}
        >
          <button
            className={`flex justify-center w-full ${infoOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
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
                className="w-full h-auto max-h-[50vh] lg:max-h-[75vh] object-contain"
              />
            )}
          </button>
        </motion.div>

        {/* InfoBox — grows in height, reveals bottom-to-top */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease }}
              style={{ overflow: "hidden" }}
              className="-mt-[9px]"
            >
              <motion.div
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                exit={{ clipPath: "inset(100% 0 0 0)" }}
                transition={{ duration: 0.5, ease }}
                className="cursor-zoom-in"
                onClick={() => onOpen()}
              >
                <InfoBox
                  exhibition={ex}
                  onClose={() => setInfoOpen(false)}
                  onImageClick={onOpen}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Exhibition } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { Card, CardContent } from "@/components/ui/card";
import InfoBox from "@/components/InfoBox";
import { RevealImage } from "@/components/RevealImage";
import WigglyDivider from "./WigglyDivider";
import { info } from "console";
import exhibition from "../../schemas/exhibition";
import TextFrame from "./TextFrame";
import { Work } from "../../lib/sanity";

interface ExhibitionCardProps {
  ex: Exhibition;
  index: number;
  onOpen: () => void;
  activeInfoId?: string | null;
  onInfoOpen?: (id: string) => void;
  onOpenWorkByTitle: (title: string) => void;
}

const ease = [0.25, 1, 0.5, 1] as const;

export default function ExhibitionCard({
  ex,
  index,
  onOpen,
  activeInfoId,
  onInfoOpen,
  onOpenWorkByTitle,
}: ExhibitionCardProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const { setHoveredItemTitle } = useUI();
  const { allWorks } = useWorks();
  const cardRef = useRef<HTMLDivElement>(null);

  // Mobile only: close when another card becomes active
  useEffect(() => {
    if (window.innerWidth < 1024 && activeInfoId !== String(ex.id)) {
      setInfoOpen(false);
    }
  }, [activeInfoId, ex.id]);

  useEffect(() => {
    if (infoOpen && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [infoOpen]);

  const images = [
    ex.acf.image_1,
    ex.acf.image_2,
    ex.acf.image_3,
    ex.acf.image_4,
    ex.acf.image_5,
    ex.acf.image_6,
    ex.acf.image_7,
    ex.acf.image_8,
    ex.acf.image_9,
    ex.acf.image_10,
  ].filter(Boolean);

  return (
    <Card
      ref={cardRef}
      className="scroll-mt-[9px] lg:scroll-mt-[44px] w-full lg:h-auto flex justify-start items-start shadow-none l border-none bg-transparent gap-0 mx-0 relative "
      onMouseEnter={() => setHoveredItemTitle(ex.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full p-0 flex flex-col">
        <div className="flex-1 min-h-0 flex flex-col">
          {/* InfoBox — above image */}
          <AnimatePresence>
            {infoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, filter: "blur(8px)" }}
                animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                exit={{ height: 0, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease }}
                className="overflow-hidden flex-shrink-0 "
              >
                <InfoBox
                  exhibition={ex}
                  onWorkSelect={onOpenWorkByTitle}
                  onClose={() => setInfoOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Images — image_1 fills space when closed, shrinks to first thumbnail when open */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-row flex-wrap content-start gap-[9px] lg:max-w-2xl">
            {ex.acf.image_1 && (
              <motion.button
                layout
                transition={{ layout: { duration: 0.5, ease } }}
                className={
                  infoOpen
                    ? "flex-shrink-0 cursor-zoom-in"
                    : "flex-1 min-h-0 min-w-0 cursor-pointer"
                }
                onClick={() => {
                  if (infoOpen) onOpen();
                  else {
                    setInfoOpen(true);
                    onInfoOpen?.(String(ex.id));
                  }
                }}
              >
                {infoOpen ? (
                  <img
                    src={ex.acf.image_1.url}
                    alt={ex.title.rendered}
                    className="h-[64px] w-auto object-contain "
                    style={{ objectPosition: "top left" }}
                  />
                ) : (
                  <RevealImage
                    src={ex.acf.image_1.url}
                    alt={ex.title.rendered}
                    width={0}
                    height={0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    revealIndex={index}
                    className="w-full h-auto lg:h-full object-contain opacity-100 hover:opacity-30"
                    style={{ objectPosition: "top-left" }}
                  />
                )}
              </motion.button>
            )}

            {/* Remaining thumbnails fade in beside image_1 */}
            <AnimatePresence>
              {infoOpen &&
                images.slice(1).map((img, i) => (
                  <motion.button
                    key={i + 1}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                    className="flex-shrink-0 cursor-zoom-in"
                    onClick={onOpen}
                  >
                    <img
                      src={img!.url}
                      alt={`${ex.title.rendered} ${i + 2}`}
                      className="h-[64px] w-auto object-contain opacity-100 hover:opacity-30"
                    />
                  </motion.button>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
      {infoOpen && (
        <WigglyDivider
          active
          text="exhibition"
          size="text-[8px]"
          className="text-muted-foreground mt-[9px]"
        />
      )}
    </Card>
  );
}

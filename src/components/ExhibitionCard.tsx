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
    if (infoOpen && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "instant", block: "start" });
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
      className="w-full min-h-dvh flex flex-col border-0 shadow-none bg-transparent p-0 gap-0 h-full rounded-none scroll-mt-[9px] lg:scroll-mt-[44px] max-w-3xl lg:max-w-6xl mb-[18px]"
      onMouseEnter={() => setHoveredItemTitle(ex.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full h-full p-0 flex flex-col">
        {/* Mobile: InfoBox above image */}
        <AnimatePresence>
          {infoOpen && (
            <motion.div
              ref={infoRef}
              initial={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
              exit={{ height: 0, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.5, ease }}
              className="lg:hidden overflow-hidden flex-shrink-0 scroll-mt-[18px]"
            >
              <InfoBox exhibition={ex} onClose={() => setInfoOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 min-h-0 flex flex-col  lg:items-start lg:gap-x-[18px]">
          {/* LEFT: Images */}
          <motion.div
            animate={{
              flex: infoOpen ? "0 1 25%" : "1 1 100%",
            }}
            transition={{ duration: 0.5, ease }}
            className="flex min-h-0 gap-[9px] flex-row lg:flex-col overflow-hidden"
          >
            {/* Main image */}
            <motion.button
              className={`flex-shrink min-w-0 ${
                infoOpen ? "cursor-zoom-in" : "cursor-pointer"
              }`}
              onClick={() => {
                if (infoOpen) {
                  onOpen();
                } else {
                  setInfoOpen(true);
                  onInfoOpen?.(String(ex.id));
                }
              }}
            >
              {ex.acf.image_1 && (
                <RevealImage
                  src={ex.acf.image_1.url}
                  alt={ex.title.rendered}
                  width={0}
                  height={0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  revealIndex={index}
                  className="w-full h-auto object-contain opacity-100 hover:opacity-30 object-top"
                  style={{ objectPosition: "top left" }}
                />
              )}
            </motion.button>

            {/* Thumbnails */}
            <AnimatePresence>
              {infoOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4, ease }}
                  className="
            flex flex-col gap-[9px]

            w-[72px] flex-shrink-0
            max-h-[calc(50dvh-120px)]
            overflow-y-auto

            lg:flex-row lg:flex-wrap
            lg:w-auto lg:max-h-none lg:overflow-visible
          "
                >
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={img!.url}
                      alt={`${ex.title.rendered} ${i + 1}`}
                      className="h-[64px] w-auto object-contain opacity-100 hover:opacity-30 cursor-zoom-in"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT: InfoBox */}
          <AnimatePresence>
            {infoOpen && (
              <motion.div
                initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease }}
                className="hidden lg:block w-1/2 flex-shrink-0"
              >
                <InfoBox exhibition={ex} onClose={() => setInfoOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

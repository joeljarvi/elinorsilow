"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

interface CarouselModalProps {
  images: string[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  disableNavigation?: boolean;
}

export function CarouselModal({
  images,
  currentIndex,
  setCurrentIndex,
  onClose,
  disableNavigation = false,
}: CarouselModalProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isWorkSlugPage = segments[0] === "works" && !!segments[1];
  const hasMultiple = images.length > 1 && !disableNavigation;
  const handleNext = () => setCurrentIndex((i) => (i + 1) % images.length);
  const handlePrev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 bg-orange-950 z-[100] flex justify-center items-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Close */}
        <Button
          variant="squared_2"
          className={`absolute top-8 right-12 z-[101] `}
        >
          Close
        </Button>

        {!disableNavigation && hasMultiple && (
          <>
            <button
              className="absolute left-[0.5rem] text-white text-xl font-pressuraLight z-[101]"
              onClick={handlePrev}
            >
              ‹
            </button>
            <button
              className="absolute right-[0.5rem] text-white text-xl font-pressuraLight z-[101]"
              onClick={handleNext}
            >
              ›
            </button>
          </>
        )}

        {/* Image */}
        <motion.div
          onClick={onClose}
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, scale: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, scale: 0.95, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full h-screen cursor-zoom-out"
        >
          <Image
            src={images[currentIndex]}
            alt={`Carousel image ${currentIndex + 1}`}
            fill
            className="object-contain h-screen p-[2rem]"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";

type ExhibitionModalProps = {
  slug: string;
  onClose: () => void;
};

export default function ExhibitionModal({
  slug,
  onClose,
}: ExhibitionModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-40   grid grid-cols-4 min-h-screen scrollbar-hide overflow-hidden bg-background   "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP only over content columns (col 2-4) */}
        <div
          className="col-start-1 col-span-6 lg:bg-black/30 bg-black/50 absolute inset-y-0 right-0  pb-8lg:px-8 lg:pt-4 "
          onClick={onClose}
        />

        {/* MODAL only in content area (col 2-4) */}
        <motion.div
          key="modal"
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
          className="relative col-start-1 lg:col-span-4 col-span-6 lg:col-start-1  w-full h-screen  bg-background   flex flex-col overflow-hidden  shadow z-40 scrollbar-hide  "
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <ReactLenis
            root={false}
            className="h-full overflow-y-auto scrollbar-hide"
            options={{
              smoothWheel: true,
              duration: 1.15,
              easing: (t) => 1 - Math.pow(1 - t, 4),
            }}
          >
            <Button
              className="hidden lg:absolute top-0 right-0   z-50 "
              size="sm"
              variant="link"
              onClick={onClose}
            >
              Back
            </Button>

            <ExhibitionSlugModalClient slug={slug} onClose={onClose} />
          </ReactLenis>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BackToTop() {
  const lenis = useLenis();

  return (
    <Button
      variant="link"
      size="sm"
      className=" absolute z-50 bottom-4 left-2    "
      onClick={() => lenis?.scrollTo(0)}
    >
      Back to Top
    </Button>
  );
}

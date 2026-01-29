"use client";

import { AnimatePresence, motion } from "framer-motion";
import ExhibitionSlugModalClient from "@/app/exhibitions/ExhibitionSlugModalClient";
import { useRouter } from "next/navigation";

export default function ExhibitionModal({ params }) {
  const router = useRouter();

  const close = () => {
    router.back(); // <- closes the modal properly
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 grid grid-cols-6 gap-4 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* BACKDROP */}
        <button
          aria-label="Close exhibition"
          onClick={close}
          className="absolute inset-0 cursor-zoom-out"
        />

        {/* MODAL */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="col-start-1 lg:col-start-2 col-span-5 w-full bg-background shadow-xl "
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
        >
          <ExhibitionSlugModalClient slug={params.slug} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

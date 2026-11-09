"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Press } from "../../lib/sanity";
import IndexPageClient from "./IndexPageClient";
import InfoPageClient from "@/app/info/InfoPageClient";
import { useIndex } from "@/context/IndexContext";

// The index section: the current view (works, exhibitions or info, from the
// URL — see IndexContext).
export default function IndexViews({
  bio,
  press,
}: {
  bio: string;
  press: Press[];
}) {
  const { mode: view } = useIndex();
  return (
    <>
      {/* Switching views: the old one fades out and slides up, the new one
          starts at the top of the page and fades in from below. */}
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {view === "info" ? (
            <InfoPageClient bio={bio} press={press} />
          ) : (
            <IndexPageClient />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

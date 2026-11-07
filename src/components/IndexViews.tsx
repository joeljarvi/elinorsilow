"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Press } from "../../lib/sanity";
import IndexPageClient from "./IndexPageClient";
import InfoPageClient from "@/app/info/InfoPageClient";
import { useIndex } from "@/context/IndexContext";
import { VIEW_LINKS } from "./ESNav";

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
      {/* Bottom edge: the page background fading up to transparent, fixed
          over the content (lets clicks through). */}
      <div
        aria-hidden
        className="fixed inset-x-0 bottom-0 z-[5] h-9 bg-linear-to-t from-background to-transparent pointer-events-none"
      />
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
          {/* Mobile: the view's name, at the top of the list (scrolls with
              it) — col 1, under "Elinor Silow" with an empty row between,
              and an empty row before the list. */}
          <div className="lg:hidden mt-18 mb-9 h-9 px-3 flex items-center font-gtAmericaCondensed uppercase text-3xl leading-none text-foreground">
            {VIEW_LINKS.find((l) => l.view === view)?.label}
          </div>
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

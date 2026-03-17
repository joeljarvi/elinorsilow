"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { HideTextToggle } from "./HideTextToggle";
import NavSearch from "./NavSearch";

const rowClass =
  "justify-start w-full px-6 py-4 font-bookish text-base border-b border-foreground/[0.06] rounded-none h-auto";

export default function MobileNavOverlay() {
  const pathname = usePathname();
  const { open, setOpen } = useUI();
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) setOpen(false);
  }, [pathname, setOpen]);

  return (
    <>
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-overlay"
            className="lg:hidden fixed inset-0 z-[60] bg-background overflow-y-auto h-screen"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <nav className="no-hide-text flex flex-col font-bookish">
              <Button variant="ghost" size="controls" className={rowClass} asChild>
                <Link href="/" onClick={() => setOpen(false)}>Elinor Silow</Link>
              </Button>

              <Button variant="ghost" size="controls" className={rowClass} asChild>
                <Link href="/works" onClick={() => setOpen(false)}>Works</Link>
              </Button>

              <Button variant="ghost" size="controls" className={rowClass} asChild>
                <Link href="/exhibitions" onClick={() => setOpen(false)}>Exhibitions</Link>
              </Button>

              <Button variant="ghost" size="controls" className={rowClass} asChild>
                <Link href="/info" onClick={() => setOpen(false)}>Information</Link>
              </Button>

              <Button variant="ghost" size="controls" className={rowClass} asChild>
                <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
              </Button>

              <Button
                variant="ghost"
                size="controls"
                className={rowClass}
                onClick={() => {
                  setOpen(false);
                  setOpenSearch(true);
                }}
              >
                Search
              </Button>

              <div className="flex items-center border-b border-foreground/[0.06]">
                <HideTextToggle
                  variant="ghost"
                  size="controlsIcon"
                  className="px-6 py-4 rounded-none h-auto"
                />
                <DarkModeToggle className="px-6 py-4 rounded-none h-auto" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

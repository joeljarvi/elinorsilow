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
import { OGubbeText } from "./OGubbeText";

export default function MobileNavOverlay() {
  const pathname = usePathname();
  const { open, setOpen, proportionalImages, setProportionalImages } = useUI();
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <div className="lg:hidden">
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-overlay"
            className={` fixed inset-0 z-[90] bg-background/10 backdrop-blur-3xl  overflow-y-auto h-screen flex flex-col items-start justify-center w-full`}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="pt-[18px] px-0 lg:p-8 relative z-10 w-full">
              <NavSearch
                open={openSearch}
                onClose={() => setOpenSearch(false)}
              />

              <nav className="flex flex-wrap items-center justify-center gap-4 mt-8 w-full">
                {[
                  { href: "/works", label: "Works", match: (p: string) => p === "/" || p.startsWith("/works") },
                  { href: "/exhibitions", label: "Exhibitions", match: (p: string) => p.startsWith("/exhibitions") },
                  { href: "/info", label: "Information", match: (p: string) => p.startsWith("/info") },
                  { href: "/contact", label: "Contact", match: (p: string) => p.startsWith("/contact") },
                ].map(({ href, label, match }) => (
                  <Button
                    key={href}
                    variant="link"
                    className="justify-start"
                    size="controls"
                    asChild
                  >
                    <Link href={href}>
                      {match(pathname)
                        ? <OGubbeText text={label} o="/ogubbe_frilagd_new.png" />
                        : label}
                    </Link>
                  </Button>
                ))}
                <Button
                  variant="link"
                  className="justify-start"
                  size="controls"
                  onClick={() => setOpenSearch(true)}
                >
                  Search
                </Button>
                <DarkModeToggle className="justify-start" />
                <HideTextToggle className="justify-start" size="controls" />
                <Button
                  variant="link"
                  size="controls"
                  className="justify-start"
                  onClick={() => setProportionalImages(!proportionalImages)}
                >
                  {proportionalImages ? "Full width" : "Proportional"}
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

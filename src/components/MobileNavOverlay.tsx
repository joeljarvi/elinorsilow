"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { HideTextToggle } from "./HideTextToggle";
import { WidthIcon } from "@radix-ui/react-icons";
import NavSearch from "./NavSearch";
import { useNav } from "@/context/NavContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { OGubbeText } from "./OGubbeText";

const rowClass =
  "justify-start w-full px-6 py-4 font-bookish text-xl border-b border-foreground/[0.06] rounded-none h-auto";

export default function MobileNavOverlay() {
  const pathname = usePathname();
  const { open, setOpen, proportionalImages, setProportionalImages } = useUI();
  const [openSearch, setOpenSearch] = useState(false);
  const { viewLoading } = useNav();
  const { infoLoading } = useInfo();
  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }
    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  const loading = !initialLoaded || viewLoading;

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
            className={` fixed inset-0 z-[90] bg-background overflow-y-auto h-screen flex flex-col items-start justify-center w-full`}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="pt-[18px] px-0 lg:p-8 relative z-10 w-full">
              <Button
                variant="link"
                size="controls"
                className="hidden "
                asChild
              >
                <Link href="/">
                  <OGubbeText text="Elinor Silow" loading={loading} />
                </Link>
              </Button>
              <NavSearch
                open={openSearch}
                onClose={() => setOpenSearch(false)}
              />

              <nav className="grid grid-cols-2 items-start justify-start mt-8 w-full">
                {[
                  { href: "/works", label: "Works" },
                  { href: "/exhibitions", label: "Exhibitions" },
                  { href: "/info", label: "Information" },
                  { href: "/contact", label: "Contact" },
                ].map(({ href, label }) => (
                  <Button
                    key={href}
                    variant="link"
                    className="justify-start"
                    size="controls"
                    asChild
                  >
                    <Link href={href}>{label}</Link>
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

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

  const NAV_LINKS = [
    {
      href: "/",
      label: "works",
      description: "Paintings, drawings, sculpture, and textile.",
      match: (p: string) => p === "/" || p.startsWith("/works"),
    },
    {
      href: "/exhibitions",
      label: "exhibitions",
      description: "Solo and group exhibitions, 2015–present.",
      match: (p: string) => p.startsWith("/exhibitions"),
    },
    {
      href: "/info",
      label: "info",
      description: "Biography, education, and grants.",
      match: (p: string) => p.startsWith("/info"),
    },
    {
      href: "/contact",
      label: "contact",
      description: "For collaborations and inquiries.",
      match: (p: string) => p.startsWith("/contact"),
    },
  ];

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
            className={` fixed inset-0 z-[70] bg-background/10 backdrop-blur-3xl  overflow-y-auto h-screen flex flex-col items-center justify-center w-full`}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="flex flex-col justify-center items-center gap-6 w-full px-[18px]">
              {NAV_LINKS.map(({ href, label, description }) => (
                <div key={href} className="flex flex-col gap-0">
                  <Button
                    variant="stretch"
                    size="controls"
                    asChild
                    className=" text-[32px] lg:text-[15px] w-min px-0"
                  >
                    <Link href={href}>{label}</Link>
                  </Button>
                </div>
              ))}
              <DarkModeToggle
                className="text-[32px] lg:text-[15px] w-min px-0"
                size="controls"
              />
              <Button
                onClick={() => setOpenSearch(true)}
                variant="link"
                size="controls"
                className="text-[32px] lg:text-[15px] w-min px-0"
              >
                (search)
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

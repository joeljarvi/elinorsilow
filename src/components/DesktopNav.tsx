"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  type Variants,
} from "framer-motion";
import { Button } from "./ui/button";

import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";

import NavSearch from "./NavSearch";
import { HideTextToggle } from "./HideTextToggle";

const navContainer: Variants = {
  hidden: {
    opacity: 0,
    transition: { staggerChildren: 0.06, staggerDirection: -1 },
  },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const navItemVariant: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

function NavItem({
  href,
  active,
  children,
  className = "",
  onClick,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="link"
      size="lg"
      className={`
   ${className}

      ${active ? "" : ""}
      `}
      asChild
      aria-current={active ? "page" : undefined}
    >
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [scrollHidden, setScrollHidden] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { open, setOpen } = useUI();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) setOpen(true);
    setScrollHidden(false);
    lastScrollY.current = 0;
  }, [pathname, setOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastScrollY.current;
      if (currentY < 80) setScrollHidden(false);
      else if (diff > 8) setScrollHidden(true);
      // On desktop, scrolling up restores nav; on mobile, only the button can restore it
      else if (diff < -8 && isDesktop) setScrollHidden(false);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop]);

  // When nav is opened via button, always bring it back into view
  useEffect(() => {
    if (open) setScrollHidden(false);
  }, [open]);

  return (
    <motion.div
      id="main-nav"
      className="z-30 fixed top-0 lg:bottom-0 lg:top-auto left-0 w-full flex flex-col items-start justify-start gap-y-4 bg-background"
      animate={{ y: scrollHidden ? (isDesktop ? "100%" : "-100%") : "0%" }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <div className="absolute hidden lg:block top-0 left-0 w-full h-[10px] -translate-y-full pointer-events-none bg-gradient-to-b from-background/0 to-background" />
      <AnimatePresence>
        {open && (
          <motion.div
            key="desktop-nav"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.nav
              variants={navContainer}
              initial="hidden"
              animate="visible"
              aria-label="Site navigation"
              className=" px-2 pt-4 lg:p-4 flex flex-col lg:flex-row gap-x-30   no-hide-text  text-2xl font-bookish justify-center items-center w-full lg:items-baseline  "
            >
              <NavItem
                className="hidden lg:flex items-center justify-start lg:w-auto"
                href="/"
                active={pathname === "/"}
              >
                Elinor Silow
              </NavItem>
              <span className="hidden lg:flex flex-wrap items-baseline gap-x-0 w-full">
                <NavItem
                  href="/works"
                  className="px-2"
                  active={pathname.startsWith("/works")}
                >
                  Works
                </NavItem>
                ,
                <NavItem
                  href="/exhibitions"
                  className="px-2"
                  active={pathname.startsWith("/exhibitions")}
                >
                  Exhibitions
                </NavItem>
                ,
                <NavItem
                  href="/info"
                  className="px-2"
                  active={pathname.startsWith("/info")}
                >
                  Info
                </NavItem>
                ,
                <Button asChild variant="link" size="lg" className="px-2">
                  <Link href="/">Contact</Link>
                </Button>
                ,
                <Button
                  variant="link"
                  size="lg"
                  className="px-2"
                  onClick={() => setOpenSearch(true)}
                >
                  Search
                </Button>
                ,<HideTextToggle />
                {/* <DarkModeToggle /> */}
              </span>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute lg:hidden bottom-0 left-0 w-full h-[10px] translate-y-full pointer-events-none bg-gradient-to-b from-background to-background/0" />
    </motion.div>
  );
}

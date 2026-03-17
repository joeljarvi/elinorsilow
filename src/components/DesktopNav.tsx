"use client";

import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "./ui/button";

import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";

import NavSearch from "./NavSearch";
import { DarkModeToggle } from "./DarkModeToggle";

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
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="controls"
      className={`h3 ${className}`}
      asChild
    >
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

function ContactButton({ href }: { href: string }) {
  return (
    <Button
      variant="ghost"
      size="controls"
      className="h3 hidden lg:flex font-bookish px-3 py-1.5 border border-foreground/25 transition-shadow duration-300 shadow-[0_0_0_0px_hsl(var(--foreground)/0)] hover:shadow-[0_0_14px_2px_hsl(var(--foreground)/0.15)] hover:border-foreground/50"
      asChild
    >
      <Link href={href}>Contact</Link>
    </Button>
  );
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastScrollY = useRef(new Map<EventTarget, number>());
  const isDesktopRef = useRef(false);
  const pathname = usePathname();
  const { open, setOpen, navVisible, setNavVisible } = useUI();

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      isDesktopRef.current = desktop;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setOpen(true);
    setNavVisible(true);
  }, [pathname, setOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (!isDesktopRef.current) return;
      const target = e.target as HTMLElement;
      const currentScrollY =
        (e.target === document || e.target === document.documentElement)
          ? window.scrollY
          : target.scrollTop;
      const prev = lastScrollY.current.get(e.target!) ?? 0;
      if (currentScrollY < prev) {
        setNavVisible(true);
      } else if (currentScrollY > prev + 5) {
        setNavVisible(false);
      }
      lastScrollY.current.set(e.target!, currentScrollY);
    };
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  return (
    <motion.div
      id="main-nav"
      className="z-[55] fixed top-0 left-0 w-full flex flex-col items-start justify-start bg-background px-0 py-0"
      animate={{ y: isDesktop && !navVisible ? "-100%" : 0 }}
      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <AnimatePresence>
        {(open || !isDesktop) && (
          <motion.div
            key="desktop-nav"
            className="w-full"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.nav
              variants={navContainer}
              initial="hidden"
              animate="visible"
              aria-label="Site navigation"
              className="relative flex justify-between no-hide-text font-bookish items-center w-full bg-background shadow-[var(--shadow-nav)]"
            >
              {/* Left: Elinor Silow (desktop) */}
              <motion.div
                variants={navItemVariant}
                className="flex items-center"
              >
                <NavItem
                  className="hidden lg:flex items-center justify-center font-bookish px-4"
                  href="/"
                >
                  Elinor Silow
                </NavItem>
              </motion.div>

              {/* Center: nav links (desktop) */}
              <motion.span
                variants={navItemVariant}
                className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"
              >
                <span className="hidden lg:flex flex-row items-baseline gap-x-0">
                  <NavItem href="/works">Works</NavItem>
                  <NavItem href="/exhibitions">Exhibitions</NavItem>
                  <NavItem href="/info">Info</NavItem>
                </span>
              </motion.span>

              {/* Right: Contact (glow) + dark mode + search */}
              <motion.span
                variants={navItemVariant}
                className="flex items-center gap-x-0"
              >
                <ContactButton href="/contact" />
                <DarkModeToggle className="hidden lg:flex" />
                <Button
                  className="hidden lg:flex"
                  variant="ghost"
                  size="controlsIcon"
                  onClick={() => setOpenSearch(true)}
                >
                  <MagnifyingGlassIcon />
                </Button>
              </motion.span>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-full h-[10px] translate-y-full pointer-events-none bg-gradient-to-b from-background to-background/0" />
    </motion.div>
  );
}

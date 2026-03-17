"use client";

import Link from "next/link";
import { MagnifyingGlassIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "./ui/button";

import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";

import NavSearch from "./NavSearch";
import { HideTextToggle } from "./HideTextToggle";
import { DarkModeToggle } from "./DarkModeToggle";
import { NavTypewriter } from "./NavTypewriter";

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
      variant="ghost"
      size="controls"
      className={`h3 ${className} ${active ? "bg-foreground/10 text-foreground/80 " : ""}`}
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
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const { open, setOpen, handleOpen } = useUI();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    setOpen(true);
  }, [pathname, setOpen]);

  return (
    <div
      id="main-nav"
      className="z-[55] fixed top-0 left-0 w-full flex flex-col items-start justify-start bg-background px-0 py-0"
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      {/* <div className="absolute top-0 left-0 w-full -translate-y-full pointer-events-none h-8 bg-gradient-to-b from-background/0 to-background" /> */}
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
              className="flex justify-between no-hide-text font-bookish items-center w-full bg-background border-b border-border"
            >
              {/* Left: hamburger (mobile) / Elinor Silow (desktop) */}
              <motion.div
                variants={navItemVariant}
                className="flex items-center"
              >
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  className="hidden"
                  onClick={handleOpen}
                  aria-label="Open menu"
                >
                  <HamburgerMenuIcon />
                </Button>
                <NavItem
                  className="hidden lg:flex items-center justify-center font-bookish  px-4 "
                  href="/"
                  active={pathname === "/"}
                >
                  Elinor Silow
                </NavItem>
              </motion.div>

              {/* Center: Elinor Silow (mobile) / nav links (desktop) */}
              <motion.span
                variants={navItemVariant}
                className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex-1 lg:flex-none"
              >
                <span className="hidden">
                  <NavItem
                    href="/"
                    active={pathname === "/"}
                    className="w-full"
                  >
                    Elinor Silow
                  </NavItem>
                </span>
                <span className="hidden lg:flex flex-row items-baseline gap-x-0">
                  <NavItem
                    href="/works"
                    className=""
                    active={pathname.startsWith("/works")}
                  >
                    Works
                  </NavItem>
                  <NavItem
                    href="/exhibitions"
                    className=""
                    active={pathname.startsWith("/exhibitions")}
                  >
                    Exhibitions
                  </NavItem>
                  <NavItem
                    href="/info"
                    className=""
                    active={pathname.startsWith("/info")}
                  >
                    Info
                  </NavItem>
                  <NavItem href="/" className="" active={false}>
                    Contact
                  </NavItem>
                </span>
              </motion.span>

              {/* Right: dark mode + search */}
              <motion.span
                variants={navItemVariant}
                className="flex items-center pr-0 lg:pr-0 gap-x-0"
              >
                <DarkModeToggle className="hidden lg:flex" />
                <Button
                  className="hidden lg:flex "
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
    </div>
  );
}

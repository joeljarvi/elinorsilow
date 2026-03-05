"use client";

import Link from "next/link";
import { useState } from "react";
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
      className={`px-2
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
  const [hidden] = useState(false);
  const pathname = usePathname();
  const { open, setOpen } = useUI();

  return (
    <div className="z-30 fixed top-0 lg:bottom-0 lg:top-auto left-0 w-full flex flex-col items-start justify-start gap-y-4 bg-background">
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <div className="absolute hidden lg:block top-0 left-0 w-full h-[10px] -translate-y-full pointer-events-none bg-gradient-to-b from-background/0 to-background" />
      <AnimatePresence>
        {open && (
          <motion.div
            key="desktop-nav"
            animate={{ x: hidden ? "-150%" : "0%" }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.nav
              variants={navContainer}
              initial="hidden"
              animate="visible"
              aria-label="Site navigation"
              className=" p-4 flex flex-col lg:flex-row gap-x-30   no-hide-text  text-2xl font-bookish justify-center items-center w-full lg:items-baseline  "
            >
              <NavItem
                className="w-full items-center justify-center lg:justify-start lg:w-auto"
                href="/"
                active={pathname === "/"}
              >
                Elinor Silow
              </NavItem>
              <span className="flex flex-col lg:hidden items-baseline justify-start gap-x-0">
                <NavItem
                  href="/works"
                  className=""
                  active={pathname.startsWith("/works")}
                  onClick={() => setOpen(false)}
                >
                  Works
                </NavItem>

                <NavItem
                  href="/exhibitions"
                  className=""
                  active={pathname.startsWith("/exhibitions")}
                  onClick={() => setOpen(false)}
                >
                  Exhibitions
                </NavItem>

                <NavItem
                  href="/info"
                  className=""
                  active={pathname.startsWith("/info")}
                  onClick={() => setOpen(false)}
                >
                  Info
                </NavItem>

                <Button asChild variant="link" size="lg" className="px-2">
                  <Link href="/">Contact</Link>
                </Button>

                <Button
                  variant="link"
                  size="lg"
                  className="px-2"
                  onClick={() => setOpenSearch(true)}
                >
                  Search
                </Button>

                <DarkModeToggle />
              </span>
              <span className="hidden lg:flex flex-wrap items-baseline gap-x-0 w-full">
                <NavItem
                  href="/works"
                  className=""
                  active={pathname.startsWith("/works")}
                >
                  Works
                </NavItem>
                ,
                <NavItem
                  href="/exhibitions"
                  className=""
                  active={pathname.startsWith("/exhibitions")}
                >
                  Exhibitions
                </NavItem>
                ,
                <NavItem
                  href="/info"
                  className=""
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
                ,
                <DarkModeToggle />
              </span>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute lg:hidden bottom-0 left-0 w-full h-[10px] translate-y-full pointer-events-none bg-gradient-to-b from-background to-background/0" />
    </div>
  );
}

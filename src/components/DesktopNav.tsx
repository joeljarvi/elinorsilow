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
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="link"
      size="linkSizeLg"
      className={`
   ${className}

      ${active ? "uppercase" : "uppercase-none"}
      `}
      asChild
      aria-current={active ? "page" : undefined}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [hidden] = useState(false);
  const pathname = usePathname();
  const { open } = useUI();

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
              className=" pt-4 pl-4 pr-8 pb-4 lg:pl-8 lg:pt-8 lg:pb-8   lg:pr-64 flex flex-wrap gap-y-4 lg:gap-y-2 gap-x-0 lg:gap-x-2 no-hide-text  text-lg lg:text-xl font-directorLight items-baseline  max-w-full lg:max-w-6xl"
            >
              <motion.span variants={navItemVariant}>
                <NavItem href="/" active={pathname === "/"}>
                  Elinor Silow
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <NavItem
                  href="/works"
                  className="ml-2 lg:ml-2"
                  active={pathname.startsWith("/works")}
                >
                  Works
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <NavItem
                  href="/exhibitions"
                  className="ml-2 lg:ml-2"
                  active={pathname.startsWith("/exhibitions")}
                >
                  Exhibitions
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <NavItem
                  href="/info"
                  className="ml-0 lg:ml-0"
                  active={pathname.startsWith("/info")}
                >
                  Info
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <Button
                  asChild
                  variant="link"
                  size="linkSizeLg"
                  className="ml-2 lg:ml-2"
                >
                  <Link href="/">Contact</Link>
                </Button>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <Button
                  variant="link"
                  size="linkSizeLg"
                  className="ml-2"
                  onClick={() => setOpenSearch(true)}
                >
                  Search...
                </Button>
              </motion.span>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute lg:hidden bottom-0 left-0 w-full h-[10px] translate-y-full pointer-events-none bg-gradient-to-b from-background to-background/0" />
    </div>
  );
}

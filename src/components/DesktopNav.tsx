"use client";

import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
      className={`text-base lg:text-xl ${className} ${active ? "underline underline-offset-4 decoration-1 " : ""}`}
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
  const { open, setOpen } = useUI();

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
      className="z-[55] absolute top-0 left-0 w-full flex flex-col items-start justify-start bg-background"
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <div className="absolute hidden lg:block top-0 left-0 w-full h-[10px] -translate-y-full pointer-events-none bg-gradient-to-b from-background/0 to-background" />
      <AnimatePresence>
        {(open || !isDesktop) && (
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
              className="flex justify-between no-hide-text font-bookish items-baseline w-screen bg-background shadow-md pt-8 pb-4 px-4 lg:px-0 border-b border-border"
            >
              <motion.div variants={navItemVariant}>
                <NavItem
                  className="flex items-center justify-start w-min text-2xl lg:text-xl "
                  href="/"
                  active={pathname === "/"}
                >
                  Elinor Silow
                </NavItem>
              </motion.div>
              <motion.span
                variants={navItemVariant}
                className="hidden lg:flex flex-row items-baseline gap-x-2 absolute left-1/2 -translate-x-1/2"
              >
                <NavItem
                  href="/works"
                  className="pl-2 pr-0.5"
                  active={pathname.startsWith("/works")}
                >
                  Works
                </NavItem>

                <NavItem
                  href="/exhibitions"
                  className="pl-2 pr-0.5"
                  active={pathname.startsWith("/exhibitions")}
                >
                  Exhibitions
                </NavItem>

                <NavItem
                  href="/info"
                  className="pl-2 pr-0.5"
                  active={pathname.startsWith("/info")}
                >
                  Info
                </NavItem>

                <NavItem href="/" className="pl-2 pr-0.5" active={false}>
                  Contact
                </NavItem>
              </motion.span>
              <motion.span
                variants={navItemVariant}
                className="flex items-center ml-auto pr-4 gap-x-2"
              >
                <Button
                  variant="link"
                  size="lg"
                  className="pl-2 pr-0.5"
                  onClick={() => setOpenSearch(true)}
                >
                  <MagnifyingGlassIcon className="w-6 h-6 lg:w-4 lg:h-4" />
                </Button>
              </motion.span>

              {/* <DarkModeToggle /> */}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-0 left-0 w-full h-[10px] translate-y-full pointer-events-none bg-gradient-to-b from-background to-background/0" />
    </div>
  );
}

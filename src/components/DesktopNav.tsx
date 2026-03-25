"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import NavSearch from "./NavSearch";
import { DarkModeToggle } from "./DarkModeToggle";
import { useNav } from "@/context/NavContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { OGubbeText } from "./OGubbeText";
import { motion, AnimatePresence } from "framer-motion";

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
    <Button variant="link" size="controls" className={className} asChild>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Works", match: (p: string) => p === "/" || p.startsWith("/works") },
  {
    href: "/exhibitions",
    label: "Exhibitions",
    match: (p: string) => p.startsWith("/exhibitions"),
  },
  { href: "/info", label: "Info", match: (p: string) => p.startsWith("/info") },
  {
    href: "/contact",
    label: "Contact",
    match: (p: string) => p.startsWith("/contact"),
  },
];

const PAGE_LOGO: { match: (p: string) => boolean; text: string }[] = [
  { match: (p) => p === "/" || p.startsWith("/works"), text: "Works" },
  { match: (p) => p.startsWith("/exhibitions"), text: "Exhibitions" },
  { match: (p) => p.startsWith("/info"), text: "Information" },
  { match: (p) => p.startsWith("/contact"), text: "Contact" },
];

function getLogoText(pathname: string): string {
  return PAGE_LOGO.find((l) => l.match(pathname))?.text ?? "Works";
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const { setOpen } = useUI();
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

  // On non-home pages always show nav; on home page show only after scrolling to works
  useEffect(() => {
    if (pathname !== "/") {
      setVisible(true);
      return;
    }

    setVisible(false);

    const onScroll = () => {
      const heroEnd = window.innerHeight * 0.85;
      setVisible(window.scrollY >= heroEnd);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const loading = !initialLoaded || viewLoading;


  const revealedItems = [
    ...NAV_LINKS.map((item, i) => ({
      key: item.href,
      index: i,
      element: (
        <NavItem href={item.href}>
          {item.match(pathname) ? (
            <OGubbeText text={item.label} />
          ) : (
            item.label
          )}
        </NavItem>
      ),
    })),
    {
      key: "dark",
      index: NAV_LINKS.length,
      element: <DarkModeToggle />,
    },
    {
      key: "search",
      index: NAV_LINKS.length + 1,
      element: (
        <Button
          variant="link"
          size="controls"
          onClick={() => setOpenSearch(true)}
        >
          Search
        </Button>
      ),
    },
  ];

  return (
    <div
      id="main-nav"
      className="z-[80] fixed top-0 left-0 w-full"
      onClick={() => setOpen(false)}
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <nav
        aria-label="Site navigation"
        className="font-bookish no-hide-text pt-[32px] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] text-foreground
          grid grid-cols-1 lg:grid-cols-4
          px-[18px] lg:px-0"
      >
        {/* Col 1 — logo (always visible) */}
        <div className="flex justify-center lg:justify-start lg:pl-[18px] items-center">
          <NavItem href="/">
            <AnimatePresence mode="wait">
              <motion.span
                key={visible ? "works" : "name"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OGubbeText
                  className="text-[24px] lg:text-[18px]"
                  text={visible ? getLogoText(pathname) : "Elinor Silow"}
                  loading={loading}
                />
              </motion.span>
            </AnimatePresence>
          </NavItem>
        </div>

        <AnimatePresence>
          {visible && (<>

            {/* Col 3 — Menu + stagger-reveal items (desktop only) */}
            <div
              className="hidden lg:flex items-start justify-start col-start-3"
              onMouseEnter={() => setMenuOpen(true)}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <Button variant="link" size="controls">
                MENU
              </Button>

              <AnimatePresence>
                {menuOpen &&
                  revealedItems.map(({ key, index, element }) => (
                    <motion.span
                      key={key}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{
                        duration: 0.15,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      className="flex items-center"
                    >
                      {element}
                    </motion.span>
                  ))}
              </AnimatePresence>
            </div>

            {/* Col 3 — empty */}
            <div className="hidden lg:block" />

            {/* Col 4 — empty */}
            <div className="hidden lg:block" />
          </>)}
        </AnimatePresence>
      </nav>
    </div>
  );
}

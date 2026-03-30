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
  {
    href: "/",
    label: "works",
    match: (p: string) => p === "/" || p.startsWith("/works"),
  },
  {
    href: "/exhibitions",
    label: "exhibitions",
    match: (p: string) => p.startsWith("/exhibitions"),
  },
  { href: "/info", label: "info", match: (p: string) => p.startsWith("/info") },
  {
    href: "/contact",
    label: "contact",
    match: (p: string) => p.startsWith("/contact"),
  },
];

const PAGE_LOGO: { match: (p: string) => boolean; text: string }[] = [
  { match: (p) => p === "/", text: "elinor silow" },
  { match: (p) => p.startsWith("/works"), text: "works" },
  { match: (p) => p.startsWith("/exhibitions"), text: "exhibitions" },
  { match: (p) => p.startsWith("/info"), text: "information" },
  { match: (p) => p.startsWith("/contact"), text: "contact" },
];

function getLogoText(pathname: string): string {
  return PAGE_LOGO.find((l) => l.match(pathname))?.text ?? "works";
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);

  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const { setOpen, setNavVisible } = useUI();
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
      setNavVisible(true);
      return;
    }

    setVisible(false);
    setNavVisible(true);

    const onScroll = () => {
      const heroEnd = window.innerHeight * 0.85;
      const isVisible = window.scrollY >= heroEnd;
      setVisible(isVisible);
      setNavVisible(isVisible);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, setNavVisible]);

  const loading = !initialLoaded || viewLoading;

  const revealedItems = [
    ...NAV_LINKS.map((item, i) => ({
      key: item.href,
      index: i,
      element: (
        <NavItem href={item.href}>
          {item.match(pathname) ? (
            <OGubbeText text={item.label} o="/ogubbe_frilagd_new.png" />
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
          (search)
        </Button>
      ),
    },
  ];

  return (
    <div
      id="main-nav"
      className="z-[20] fixed top-0 left-0 w-full"
      onClick={() => setOpen(false)}
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <nav
        aria-label="Site navigation"
        className=" no-hide-text pt-[32px]  pb-[18px] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] items-start flex flex-col lg:grid lg:grid-cols-12  px-0 text-background"
      >
        {/* Page logo — desktop col 1, mobile top-right */}
        {(() => {
          const mobileText =
            pathname === "/"
              ? visible
                ? "works"
                : "elinor silow"
              : getLogoText(pathname);
          return (
            <div className="lg:col-start-1 col-span-1 ">
              <NavItem href="/">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={mobileText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <OGubbeText
                      className="px-[0px]  pr-[12px] text-[24px] lg:text-[18px]"
                      text={mobileText}
                      loading={loading}
                      vertical
                    />
                  </motion.span>
                </AnimatePresence>
              </NavItem>
            </div>
          );
        })()}

        {/* MENU — col 3 on desktop */}
        <div
          className={`hidden lg:flex lg:col-start-4 lg:col-span-8 lg:items-center transition-opacity duration-[400ms] ease-linear ${pathname === "/" && !visible ? "opacity-0 pointer-events-none" : ""}`}
        >
          {revealedItems.map(({ key, index, element }) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{
                duration: 0.15,
                delay: index * 0.04,
                ease: "easeOut",
              }}
              className="flex items-center"
            >
              {element}
            </motion.span>
          ))}
        </div>
      </nav>
    </div>
  );
}

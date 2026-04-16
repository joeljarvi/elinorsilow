"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavSearch from "./NavSearch";
import Link from "next/link";
import WigglyButton from "./WigglyButton";
import { Cross1Icon } from "@radix-ui/react-icons";
import { HeroText } from "./HeroText";

const NAV_LINKS = [
  { href: "/", label: "works" },
  { href: "/exhibitions", label: "exhibitions" },
  { href: "/info", label: "info" },
  { href: "/contact", label: "contact" },
];

const transition = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

export default function DesktopNav() {
  const [heroOverlayOpen, setHeroOverlayOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  const pathname = usePathname();
  const {
    open,
    setOpen,
    filterOpen,
    handleFilterOpen,
    activePage,
    openSearch,
    setOpenSearch,
    showColorBg,
  } = useUI();

  const pageLabel =
    activePage === "home" || activePage === "works"
      ? "works"
      : activePage === "exhibitions"
        ? "exhibitions"
        : activePage;

  const isExhibitions = pathname.startsWith("/exhibitions");
  const isInfo = pathname.startsWith("/info");
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <>
      {/* Full-screen search overlay — all screen sizes */}
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />

      {/* HeroText overlay — mobile, opened by tapping "elinor silow" */}
      <AnimatePresence>
        {heroOverlayOpen && (
          <motion.div
            key="hero-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="lg:hidden fixed inset-0 z-[130] bg-background/90 backdrop-blur-sm flex flex-col"
            onClick={() => setHeroOverlayOpen(false)}
          >
            <button
              className="absolute top-[18px] right-[18px] no-hide-text p-[6px] text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setHeroOverlayOpen(false);
              }}
              aria-label="Close"
            >
              <Cross1Icon className="w-[18px] h-[18px]" />
            </button>
            <div
              className="flex flex-col justify-center flex-1 px-[18px]"
              onClick={(e) => e.stopPropagation()}
            >
              <HeroText />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP: horizontal tab bar (always visible) ── */}
      <div
        className={`hidden lg:flex fixed top-0 right-0 z-[80] pointer-events-none pt-[9px] px-[9px]${showColorBg ? " mix-blend-difference" : ""}`}
      >
        <div className="flex items-center pointer-events-auto px-[9px] group">
          {/* Nav links — shown on hover or when navExpanded */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${navExpanded ? "max-w-[600px]" : "max-w-0 group-hover:max-w-[600px]"}`}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <WigglyButton
                  text={label}
                  size="text-[19px]"
                  bold={false}
                  revealAnimation={false}
                  active={pageLabel === label}
                  className={`tracking-wide ${
                    pageLabel === label
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </Link>
            ))}
            <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[19px] select-none text-muted-foreground">
              /
            </span>
          </div>
          <WigglyButton
            text={navExpanded ? "close menu" : "menu"}
            size="text-[19px]"
            bold={false}
            revealAnimation={false}
            active={navExpanded}
            className={`tracking-wide ${
              navExpanded ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setNavExpanded((v) => !v)}
          />
          {!isInfo && (
            <>
              <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[18px] select-none text-muted-foreground">
                /
              </span>
              <WigglyButton
                text={filterOpen ? "close filter" : "filter"}
                size="text-[19px]"
                bold={false}
                revealAnimation={false}
                active={filterOpen}
                className={`tracking-wide ${
                  filterOpen ? "text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => handleFilterOpen()}
              />
            </>
          )}
          <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[19px] select-none text-muted-foreground">
            /
          </span>
          <WigglyButton
            text={openSearch ? "close search" : "search"}
            size="text-[19px]"
            bold={false}
            revealAnimation={false}
            active={openSearch}
            className={`tracking-wide ${
              openSearch ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setOpenSearch(!openSearch)}
          />
          <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[19px] select-none text-muted-foreground">
            /
          </span>
          <WigglyButton
            text="instagram"
            size="text-[19px]"
            bold={false}
            revealAnimation={false}
            href="https://www.instagram.com/elinorsilow"
            className="tracking-wide text-muted-foreground"
          />
        </div>
      </div>

      {/* ── MOBILE: top-slide full-screen ── */}
      <motion.div
        className={`lg:hidden fixed top-0 left-0 z-[120] w-full pointer-events-none${showColorBg ? " mix-blend-difference" : ""}`}
        animate={{ y: open ? 0 : "-100dvh" }}
        transition={transition}
      >
        <div
          className={`relative h-dvh w-full pointer-events-auto transition-[background-color,backdrop-filter] bg-[#E7F8BE] duration-300 ${open ? "bg-background/10 backdrop-blur-lg" : "bg-transparent backdrop-blur-none"}`}
          onClick={() => setOpen(false)}
        >
          <motion.nav
            className="flex flex-row px-[9px] pt-[9px] pb-[18px] h-full pointer-events-auto items-start"
            animate={{ justifyContent: open ? "space-between" : "flex-start" }}
            transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* "elinor silow" → button that opens HeroText overlay */}
            <motion.div layout transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}>
              <WigglyButton
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setHeroOverlayOpen(true);
                }}
                text="elinor silow"
                bold={true}
                size="text-[18px]"
                vertical
                active={open}
              />
            </motion.div>

            {NAV_LINKS.map(({ href, label }) => (
              <motion.div key={href} layout transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}>
                <Link href={href}>
                  <WigglyButton
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                    text={label}
                    bold={true}
                    size="text-[18px]"
                    vertical
                    active={open}
                    revealAnimation={true}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.div layout transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}>
              <WigglyButton
                className="cursor-pointer"
                onClick={() => {
                  setOpen(false);
                  setOpenSearch(true);
                }}
                text="search"
                bold={true}
                size="text-[18px]"
                vertical
                active={open}
              />
            </motion.div>
            <motion.div layout transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}>
              <Link
                href="https://www.instagram.com/elinorsilow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WigglyButton
                  className="cursor-pointer"
                  text="instagram"
                  bold={true}
                  size="text-[18px]"
                  vertical
                  active={open}
                />
              </Link>
            </motion.div>
          </motion.nav>
        </div>
      </motion.div>

{/* ── MOBILE: fixed bottom menu/filter tab ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[130] flex justify-center items-center pb-[9px] pointer-events-auto">
        <WigglyButton
          text={open ? "close" : "menu"}
          className="no-hide-text cursor-pointer pl-[9px] pr-[6px] tracking-wider"
          active={open}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          bold={true}
          size="text-[18px]"
        />

        {!open && (
          <>
            <span className="inline-flex items-center mt-[4px] font-timesNewRoman font-normal text-[16px] select-none text-foreground ">
              /
            </span>

            <WigglyButton
              text={filterOpen ? "close" : "filter"}
              active={filterOpen}
              onClick={(e) => {
                e.stopPropagation();
                handleFilterOpen();
              }}
              bold={false}
              size="text-[18px]"
              className="pl-[6px] no-hide-text"
            />
          </>
        )}
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavSearch from "./NavSearch";
import Link from "next/link";
import WigglyButton from "./WigglyButton";
import { Cross1Icon } from "@radix-ui/react-icons";
import HeroText from "./HeroText";

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
    setFilterOpen,
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
              className="absolute top-[18px] right-[18px] no-hide-text p-[6px] text-muted-foreground"
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
      <div className="hidden lg:flex items-start justify-end fixed top-0 right-0 left-0 z-[80] pointer-events-none pt-[9px] px-[9px] pb-[21px] w-full bg-background">
        {/* Nav links — shown when navExpanded */}
        <div
          className={`items-center h-min bg-background ${navExpanded ? "flex" : "hidden"}`}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <div key={href} className="flex items-center">
              <Link href={href}>
                <WigglyButton
                  text={label}
                  size="text-[16px]"
                  bold={false}
                  revealAnimation={false}
                  active={pageLabel === label}
                  className={`tracking-wide no-hide-text ${
                    pageLabel === label
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                />
              </Link>
              <span className="items-center font-timesNewRoman font-normal text-[16px]  text-muted-foreground">
                /
              </span>
            </div>
          ))}
          <WigglyButton
            text="instagram"
            size="text-[16px]"
            bold={false}
            revealAnimation={false}
            href="https://www.instagram.com/elinorsilow"
            className="tracking-wide text-muted-foreground"
          />

          <span className="inline-flex items-center font-timesNewRoman font-normal text-[16px] select-none text-foreground">
            /
          </span>
          <WigglyButton
            text={openSearch ? "close search" : "search"}
            size="text-[16px]"
            bold={false}
            revealAnimation={false}
            active={openSearch}
            className={`tracking-wide ${
              openSearch ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setOpenSearch(!openSearch)}
          />
          <span className="items-center font-timesNewRoman font-normal text-[16px]  text-foreground">
            /
          </span>
        </div>
        <WigglyButton
          text={navExpanded ? "close menu" : "menu"}
          size="text-[16px]"
          bold={false}
          revealAnimation={false}
          active={navExpanded}
          className={`tracking-wide  `}
          onClick={() => setNavExpanded((v) => !v)}
        />
        {!isInfo && (
          <>
            <span className="inline-flex items-center  font-timesNewRoman font-normal text-[16px] select-none ">
              /
            </span>
            <WigglyButton
              text={filterOpen ? "close filter" : "filter"}
              size="text-[16px]"
              bold={false}
              revealAnimation={false}
              active={filterOpen}
              className={`tracking-wide ${
                filterOpen ? "text-foreground" : "text-foreground"
              }`}
              onClick={() => handleFilterOpen()}
            />
          </>
        )}
      </div>

      {/* ── MOBILE: top-slide full-screen ── */}
      <motion.div
        className={`lg:hidden fixed top-0 left-0 z-[120] w-full pointer-events-none `}
        initial={{ y: "-100dvh" }}
        animate={{ y: open ? 0 : "-100dvh" }}
        transition={transition}
      >
        <div
          className={`relative h-dvh w-full pointer-events-auto transition-[background-color,backdrop-filter]  duration-300 bg-background`}
          onClick={() => setOpen(false)}
        >
          <motion.nav
            className="flex flex-col px-[9px] pt-[9px] pb-[18px]  pointer-events-auto items-center gap-y-[9px] justify-center h-dvh"
            transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* "elinor silow" → button that opens HeroText overlay */}
            <motion.div
              layout
              transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            >
              <WigglyButton
                className="cursor-pointer tracking-normal text-muted-foreground  "
                onClick={() => {
                  setHeroOverlayOpen(true);
                }}
                text="elinor silow"
                size="text-[24px]"
                active={open}
              />
            </motion.div>
            {NAV_LINKS.map(({ href, label }) => (
              <motion.div
                key={href}
                layout
                transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
              >
                <Link href={href}>
                  <WigglyButton
                    className={`cursor-pointer ${pageLabel === label ? "text-foreground" : "text-muted-foreground"}`}
                    onClick={() => setOpen(false)}
                    text={label}
                    size="text-[24px]"
                    active={open}
                    revealAnimation={true}
                    textShadow={pageLabel === label}
                  />
                </Link>
              </motion.div>
            ))}
            <motion.div
              layout
              transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            >
              <WigglyButton
                className="cursor-pointer text-muted-foreground "
                onClick={() => {
                  setOpen(false);
                  setOpenSearch(true);
                }}
                text="search"
                size="text-[24px]"
                active={open}
              />
            </motion.div>
            <motion.div
              layout
              transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
            >
              <Link
                href="https://www.instagram.com/elinorsilow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WigglyButton
                  className="cursor-pointer text-muted-foreground "
                  text="instagram"
                  size="text-[24px]"
                  active={open}
                />
              </Link>
            </motion.div>
          </motion.nav>
        </div>
      </motion.div>

      {/* ── MOBILE: fixed bottom menu/filter tab ── */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[130] flex justify-center items-center pb-[10px] pt-[0px] pointer-events-auto ${showColorBg ? "bg-transparent" : "bg-transparent"} `}
      >
        {/* <div
          className={`${showColorBg ? "hidden" : "block"} absolute bottom-full left-0 right-0 h-[9px] bg-gradient-to-t from-background to-transparent`}
        /> */}
        <WigglyButton
          text={open ? "close" : "menu"}
          className="text-foreground no-hide-text tracking-widest"
          active={open}
          textShadow
          onClick={(e) => {
            e.stopPropagation();
            if (filterOpen) {
              setFilterOpen(false);
              setOpen(true);
            } else {
              setOpen(!open);
            }
          }}
          size="text-[16px]"
        />

        <span className="inline-flex items-center mt-[4px] font-timesNewRoman font-normal px-0 text-[16px] select-none text-foreground text-shadow-md ">
          /
        </span>

        <WigglyButton
          text={filterOpen ? "close" : "filter"}
          active={filterOpen}
          onClick={(e) => {
            e.stopPropagation();
            if (open) {
              setOpen(false);
              setFilterOpen(true);
            } else {
              handleFilterOpen();
            }
          }}
          bold={false}
          size="text-[16px]"
          textShadow
          className="text-foreground no-hide-text tracking-widest"
        />
      </div>
    </>
  );
}

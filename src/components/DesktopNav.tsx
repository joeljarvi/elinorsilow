"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavSearch from "./NavSearch";
import Link from "next/link";
import WigglyButton from "./WigglyButton";
import WigglyDivider from "./WigglyDivider";
import { Cross1Icon } from "@radix-ui/react-icons";
import HeroText from "./HeroText";
import { FilterContent } from "./FilterBox";

const NAV_LINKS = [
  { href: "/", label: "Works" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/info", label: "Info" },
  { href: "/contact", label: "Contact" },
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
  } = useUI();

  const pageLabel =
    activePage === "home" || activePage === "works"
      ? "works"
      : activePage === "exhibitions"
        ? "exhibitions"
        : activePage;

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
      <div className="hidden lg:flex items-start justify-end fixed top-0 right-0 left-0 z-[80] pointer-events-none pt-[9px] px-[9px] pb-[9px] w-full bg-background">
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
                  active={pageLabel === label.toLowerCase()}
                  className={`tracking-wide no-hide-text lowercase ${
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
            text="Instagram"
            size="text-[16px]"
            bold={false}
            revealAnimation={false}
            href="https://www.instagram.com/elinorsilow"
            className="tracking-wide text-muted-foreground lowercase"
          />

          <span className="inline-flex items-center font-timesNewRoman font-normal text-[16px] select-none text-muted-foreground">
            /
          </span>
          <WigglyButton
            text={openSearch ? "Close Search" : "Search"}
            size="text-[16px]"
            bold={false}
            revealAnimation={false}
            active={openSearch}
            className={`tracking-wide lowercase ${
              openSearch ? "text-foreground" : "text-muted-foreground"
            }`}
            onClick={() => setOpenSearch(!openSearch)}
          />
          <span className="items-center font-timesNewRoman font-normal text-[16px]  text-foreground">
            /
          </span>
        </div>
        <WigglyButton
          text={navExpanded ? "Close Menu" : "Menu"}
          size="text-[16px]"
          bold={false}
          revealAnimation={false}
          active={navExpanded}
          className={`tracking-wide lowercase`}
          onClick={() => setNavExpanded((v) => !v)}
        />
        {!isInfo && (
          <>
            <span className="inline-flex items-center  font-timesNewRoman font-normal text-[16px] select-none ">
              /
            </span>
            <WigglyButton
              text={filterOpen ? "Close Filter" : "Filter"}
              size="text-[16px]"
              bold={false}
              revealAnimation={false}
              active={filterOpen}
              className={`tracking-wide lowercase ${
                filterOpen ? "text-foreground" : "text-foreground"
              }`}
              onClick={() => handleFilterOpen()}
            />
          </>
        )}
      </div>

      {/* ── MOBILE: top-slide full-screen ── */}
      <motion.div
        className="lg:hidden fixed top-0 left-0 z-[120] w-full pointer-events-none"
        initial={{ y: "-100dvh" }}
        animate={{ y: open ? 0 : "-100dvh" }}
        transition={transition}
      >
        <div
          className="relative h-dvh w-full pointer-events-auto bg-background overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex flex-col px-[18px] pt-[18px] pb-[64px] pointer-events-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search — always visible at top */}
            <div className="py-[9px]">
              <NavSearch inline open={true} onClose={() => {}} />
            </div>

            {/* Nav section */}
            <div className="flex flex-col items-start justify-start gap-y-[0px] py-[9px]">
              <WigglyButton
                className="cursor-pointer tracking-normal justify-start  w-full text-muted-foreground bg-background py-[9px]"
                onClick={() => setHeroOverlayOpen(true)}
                text="Elinor Silow"
                size="text-[16px]"
                active={open}
              />
              {NAV_LINKS.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link key={href} href={href} className="w-full block">
                    <WigglyButton
                      className={`cursor-pointer bg-background justify-start w-full py-[9px] ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                      onClick={() => setOpen(false)}
                      text={label}
                      size="text-[16px]"
                      active={open}
                    />
                  </Link>
                );
              })}
              <Link
                href="https://www.instagram.com/elinorsilow"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <WigglyButton
                  className="cursor-pointer flex justify-start text-muted-foreground bg-background w-full py-[9px]"
                  text="Instagram"
                  size="text-[16px]"
                  active={open}
                />
              </Link>
            </div>
            <WigglyDivider
              text="menu"
              size="text-[8px]"
              className="w-full  text-muted-foreground"
              active={true}
            />
            {/* Filter section */}
            <FilterContent onMobileSelect={() => setOpen(false)} />
            <WigglyDivider
              text="filter"
              size="text-[8px]"
              className="w-full mt-[9px]  text-muted-foreground"
              active={true}
            />
          </div>
        </div>
      </motion.div>

      {/* ── MOBILE: fixed bottom tab ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[130] flex justify-center items-center pb-[18px] pointer-events-auto bg-transparent">
        <div className="flex items-start w-full px-[9px] h-[32px]">
          <WigglyButton
            text={open ? "close" : "menu&filters"}
            className="text-muted-foreground bg-transparent justify-center py-[9px] px-2 w-full no-hide-text tracking-widest font-bold"
            active={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            size="text-[16px]"
          />
        </div>
      </div>
    </>
  );
}

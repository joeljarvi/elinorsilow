"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavSearch from "./NavSearch";
import Link from "next/link";
import { OGubbeText } from "./OGubbeText";
import WigglyButton from "./WigglyButton";
import { Cross1Icon } from "@radix-ui/react-icons";
import { HeroText } from "./HeroText";
import { StretchLetters } from "./StretchLetters";

const NAV_LINKS = [
  { href: "/", label: "works" },
  { href: "/exhibitions", label: "exhibitions" },
  { href: "/info", label: "info" },
  { href: "/contact", label: "contact" },
];

const transition = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

export default function DesktopNav() {
  const [heroOverlayOpen, setHeroOverlayOpen] = useState(false);

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
  const router = useRouter();

  const pageLabel =
    activePage === "home" || activePage === "works"
      ? "works"
      : activePage === "exhibitions"
        ? "exhibitions"
        : activePage;

  const isExhibitions = pathname.startsWith("/exhibitions");
  const isInfo = pathname.startsWith("/info");
  const logoText = isExhibitions
    ? "Exhibitions"
    : isInfo
      ? "info"
      : "Elinor Silow";
  const logoTarget = isExhibitions
    ? "/info"
    : isInfo
      ? "/works"
      : "/exhibitions";
  const handleLogoClick = () => router.push(logoTarget);

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

      {/* ── DESKTOP: top-slide full-width drawer ── */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 z-[80] w-full pointer-events-none mix-blend pt-[9px] px-[9px]"
        animate={{ y: open ? 0 : "-100dvh" }}
        transition={transition}
      >
        <div className={`h-dvh w-full pointer-events-auto flex justify-center`}>
          <nav
            className="flex flex-row gap-16 px-[64px] pt-[0px] pb-[18px] h-full pointer-events-auto items-start justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="">
              <WigglyButton
                text="close menu"
                size="text-[32px]"
                className="font-timesNewRoman font-normal"
                onClick={() => setOpen(false)}
                vertical
              />
            </div>

            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <OGubbeText
                  className="text-[32px] font-timesNewRoman font-normal"
                  text={label}
                  lettersOnly
                  vertical
                />
              </Link>
            ))}

            <Link
              href="https://www.instagram.com/elinorsilow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <OGubbeText
                className="text-[32px] font-timesNewRoman font-normal"
                text="instagram"
                lettersOnly
                vertical
              />
            </Link>
          </nav>
        </div>

        {/* Menu + filter tab — peeks at top of screen when closed */}
        <div className="w-full flex flex-row items-baseline justify-end pointer-events-auto mix-blend-difference">
          <div className="flex items-center pointer-events-auto px-[9px] group">
            {/* Nav links — hidden, slide in to the left of menu on hover */}
            <div className="flex items-center overflow-hidden max-w-0 group-hover:max-w-[600px] transition-all duration-500 ease-in-out">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}>
                  <WigglyButton
                    text={label}
                    size="text-[18px]"
                    bold={false}
                    revealAnimation={false}
                    active={pageLabel === label}
                    className={
                      pageLabel === label
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  />
                </Link>
              ))}
              <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[18px] select-none text-muted-foreground">
                /
              </span>
            </div>
            <WigglyButton
              text="menu"
              size="text-[18px]"
              bold={false}
              revealAnimation={false}
              active={open}
              className="text-muted-foreground"
            />
            <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[18px] select-none text-muted-foreground">
              /
            </span>
            <WigglyButton
              text={filterOpen ? "close filter" : "filter"}
              size="text-[18px]"
              bold={false}
              revealAnimation={false}
              active={filterOpen}
              className={
                filterOpen ? "text-foreground" : "text-muted-foreground"
              }
              onClick={() => handleFilterOpen()}
            />
            <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-normal text-[18px] select-none text-muted-foreground">
              /
            </span>
            <WigglyButton
              text={openSearch ? "close search" : "search"}
              size="text-[18px]"
              bold={false}
              revealAnimation={false}
              active={openSearch}
              className={
                openSearch ? "text-foreground" : "text-muted-foreground"
              }
              onClick={() => setOpenSearch(!openSearch)}
            />
          </div>
        </div>
      </motion.div>

      {/* ── MOBILE: top-slide full-screen ── */}
      <motion.div
        className="lg:hidden fixed top-0 left-0 z-[120] w-full pointer-events-none"
        animate={{ y: open ? 0 : "-100dvh" }}
        transition={transition}
      >
        <div
          className={`relative h-dvh w-full pointer-events-auto transition-[background-color,backdrop-filter] duration-300 ${open ? "bg-background/10 backdrop-blur-lg" : "bg-transparent backdrop-blur-none"}`}
          onClick={() => setOpen(false)}
        >
          <nav
            className="flex flex-row justify-between gap-x-[32px] px-[9px] pt-[9px] pb-[18px] h-full pointer-events-auto items-start justify-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* "elinor silow" → button that opens HeroText overlay */}
            <WigglyButton
              className=" cursor-pointer "
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

            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <WigglyButton
                  className=" cursor-pointer "
                  onClick={() => {
                    setOpen(false);
                    setHeroOverlayOpen(true);
                  }}
                  text={label}
                  bold={true}
                  size="text-[18px]"
                  vertical
                  active={open}
                  revealAnimation={true}
                />
              </Link>
            ))}
            <WigglyButton
              className=" cursor-pointer"
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
            <Link
              href="https://www.instagram.com/elinorsilow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WigglyButton
                className=" cursor-pointer"
                text="instagram"
                bold={true}
                size="text-[18px]"
                vertical
                active={open}
              />
            </Link>
          </nav>
        </div>
      </motion.div>

      <div className="hidden fixed top-0 left-0 right-0 z-[75] items-center justify-center w-full pointer-events-none">
        <StretchLetters
          className="whitespace-nowrap shrink-0 w-full"
          body={logoText}
          onClick={handleLogoClick}
          defaultVariant={isExhibitions ? 3 : 0}
        />
      </div>

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

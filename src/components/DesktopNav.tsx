"use client";

import { useState, useEffect } from "react";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavSearch from "./NavSearch";
import Link from "next/link";
import { OGubbeText } from "./OGubbeText";
import WigglyButton from "./WigglyButton";

const NAV_LINKS = [
  { href: "/works", label: "works" },
  { href: "/exhibitions", label: "exhibitions" },
  { href: "/info", label: "info" },
  { href: "/contact", label: "contact" },
];

const transition = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const pathname = usePathname();
  const { open, setOpen, filterOpen, handleFilterOpen } = useUI();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  if (pathname === "/") return null;

  return (
    <>
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />

      {/* ── DESKTOP: top-slide full-width drawer ── */}

      {/* Drawer panel — slides in from top */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 z-[80] w-full pointer-events-none"
        animate={{ y: open ? 0 : "-100dvh" }}
        transition={transition}
      >
        <div
          className={`h-dvh w-full pointer-events-auto flex justify-center transition-[background-color,backdrop-filter] duration-300 bg-background`}
        >
          <nav
            className=" flex flex-row  gap-16 px-[64px]  pt-[18px] pb-[18px] h-full pointer-events-auto items-start "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="">
              <WigglyButton
                text="close menu"
                size="text-[32px]"
                className="font-timesNewRoman font-bold "
                onClick={() => setOpen(false)}
                vertical
              />
            </div>
            <Link href="/">
              <OGubbeText
                className="text-[32px] font-timesNewRoman font-bold"
                text="elinor silow"
                vertical
                lettersOnly
              />
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <OGubbeText
                  className="text-[32px] font-timesNewRoman font-bold"
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
                className="text-[32px] font-timesNewRoman font-bold"
                text="instagram"
                lettersOnly
                vertical
              />
            </Link>
          </nav>
        </div>

        {/* Menu + filter tab — peeks at top of screen when closed */}
        <div className="w-full flex justify-center items-center pointer-events-auto mt-[18px]">
          <button
            className="no-hide-text cursor-pointer px-[9px] "
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <OGubbeText
              text="menu"
              lettersOnly
              vertical={false}
              className="text-[18px] font-timesNewRoman font-bold"
              sizes="21px"
            />
          </button>
          <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-bold text-[18px] select-none">
            /
          </span>
          <button
            className="no-hide-text cursor-pointer px-[9px] "
            onClick={(e) => {
              e.stopPropagation();
              handleFilterOpen();
            }}
          >
            <OGubbeText
              text={filterOpen ? "close filter" : "filter"}
              lettersOnly
              vertical={false}
              className="text-[18px] font-timesNewRoman font-bold"
              sizes="18px"
            />
          </button>
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
            className="grid grid-cols-7 gap-x-[9px] px-[18px] pt-[18px] pb-[18px] h-full pointer-events-auto items-start justify-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/">
              <OGubbeText
                className="text-[24px] lg:text-[21px]  font-timesNewRoman font-bold"
                text="elinor silow"
                vertical
                lettersOnly
              />
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <OGubbeText
                  className="text-[24px] lg:text-[21px]  font-timesNewRoman font-bold"
                  text={label}
                  lettersOnly
                  vertical
                />
              </Link>
            ))}
            <WigglyButton
              text="search"
              className="font-timesNewRoman font-bold "
              size="text-[24px] lg:text-[21px] "
              onClick={() => setOpenSearch(true)}
              vertical
            />
            <Link
              href="https://www.instagram.com/elinorsilow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <OGubbeText
                className="text-[24px] lg:text-[21px]  font-timesNewRoman font-bold"
                text="instagram"
                lettersOnly
                vertical
              />
            </Link>
          </nav>
        </div>
      </motion.div>

      {/* ── MOBILE: fixed bottom menu/filter tab ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[130] flex justify-center items-center pb-[18px] pointer-events-auto">
        <button
          className="no-hide-text cursor-pointer px-[12px] py-[0px]"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <OGubbeText
            text={open ? "close menu" : "menu"}
            lettersOnly
            vertical={false}
            className="text-[18px] font-timesNewRoman font-bold"
            sizes="18px"
          />
        </button>
        <span className="inline-flex items-center mt-[9px] font-timesNewRoman font-bold text-[18px] select-none">
          /
        </span>
        <button
          className="no-hide-text cursor-pointer px-[12px] py-[0px]"
          onClick={(e) => {
            e.stopPropagation();
            handleFilterOpen();
          }}
        >
          <OGubbeText
            text={filterOpen ? "close filter" : "filter"}
            lettersOnly
            vertical={false}
            className="text-[18px] font-timesNewRoman font-bold"
            sizes="18px"
          />
        </button>
      </div>
    </>
  );
}

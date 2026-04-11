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
  const { open, setOpen } = useUI();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  if (pathname === "/") return null;

  return (
    <>
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />

      {/* ── DESKTOP: handle + left-slide full-width drawer ── */}

      {/* Handle — always visible, left edge */}
      <WigglyButton
        text={open ? "close" : "menu"}
        onClick={() => setOpen(!open)}
        vertical
        className="hidden lg:flex fixed left-0 top-0 z-[130] px-[18px] py-[18px]"
      />

      {/* Drawer panel — slides in from left */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 z-[120] w-full pointer-events-none"
        animate={{ x: open ? 0 : "-100%" }}
        transition={transition}
      >
        <div
          className={`h-screen w-full pointer-events-auto transition-[background-color,backdrop-filter] duration-300 ${open ? "bg-background/10 backdrop-blur-lg" : "bg-transparent backdrop-blur-none"}`}
          onClick={() => setOpen(false)}
        >
          <nav
            className="grid grid-cols-12 gap-x-[18px] px-[18px] pt-[18px] pb-[18px] h-full pointer-events-auto items-start justify-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/" className="col-start-3">
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
            <WigglyButton
              text="search"
              className="font-timesNewRoman font-bold"
              onClick={() => setOpenSearch(true)}
              vertical
            />
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
      </motion.div>

      {/* ── MOBILE: top-slide full-screen ── */}
      <motion.div
        className="lg:hidden fixed top-0 left-0 z-[120] w-full pointer-events-none"
        animate={{ y: open ? 0 : "-100vh" }}
        transition={transition}
      >
        <div
          className={`relative h-screen w-full pointer-events-auto transition-[background-color,backdrop-filter] duration-300 ${open ? "bg-background/10 backdrop-blur-lg" : "bg-transparent backdrop-blur-none"}`}
          onClick={() => setOpen(false)}
        >
          <nav
            className="grid grid-cols-7 gap-x-[9px] px-[18px] pt-[18px] pb-[18px] h-full pointer-events-auto items-start justify-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href="/">
              <OGubbeText
                className="text-[24px] font-timesNewRoman font-bold"
                text="elinor silow"
                vertical
                lettersOnly
              />
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href}>
                <OGubbeText
                  className="text-[24px] font-timesNewRoman font-bold"
                  text={label}
                  lettersOnly
                  vertical
                />
              </Link>
            ))}
            <WigglyButton
              text="search"
              className="font-timesNewRoman font-bold text-[24px]"
              onClick={() => setOpenSearch(true)}
              vertical
            />
            <Link
              href="https://www.instagram.com/elinorsilow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <OGubbeText
                className="text-[24px] font-timesNewRoman font-bold"
                text="instagram"
                lettersOnly
                vertical
              />
            </Link>
          </nav>

          {/* Close button — bottom center */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-[18px]">
            <WigglyButton text="close" onClick={() => setOpen(false)} />
          </div>
        </div>

        {/* Mobile menu tab — peeks at top of screen when closed */}
        <div className="w-full flex justify-center pointer-events-auto">
          <button
            className="no-hide-text cursor-pointer px-[18px] py-[9px]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <OGubbeText
              text={open ? "close" : "menu"}
              lettersOnly
              vertical={false}
              className="text-[24px] font-timesNewRoman font-bold"
              sizes="18px"
            />
          </button>
        </div>
      </motion.div>
    </>
  );
}

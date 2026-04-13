"use client";

import Link from "next/link";
import { useState } from "react";

import NavSearch from "./NavSearch";
import { OGubbeText } from "./OGubbeText";
import { useTheme } from "next-themes";
import WigglyButton from "./WigglyButton";
import { HeroText } from "./HeroText";
import PopUpGubbe from "./PopUpGubbe";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/works", label: "works" },
  { href: "/exhibitions", label: "exhibitions" },
  { href: "/info", label: "info" },
  { href: "/contact", label: "contact" },
];

export default function Hero() {
  const [openSearch, setOpenSearch] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative h-dvh overflow-hidden flex flex-col justify-start">
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <nav
        className="grid grid-cols-7 lg:grid-cols-12 gap-x-[9px] lg:gap-x-[18px] px-[18px] pt-[18px] pb-[18px] pointer-events-auto items-start justify-items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <WigglyButton
          text="elinor silow"
          vertical
          className="hidden lg:block font-timesNewRoman font-bold tracking-wider text-[24px] lg:text-[32px]"
        />

        {NAV_LINKS.map(({ href, label }, i) => (
          <Link
            key={href}
            href={href}
            className={i === 0 ? "lg:col-start-3" : ""}
          >
            <OGubbeText
              className="text-[24px] lg:text-[32px] font-timesNewRoman font-bold tracking-wider "
              text={label}
              vertical
              lettersOnly
            />
          </Link>
        ))}

        <Link
          href="https://www.instagram.com/elinorsilow"
          target="_blank"
          rel="noopener noreferrer"
        >
          <OGubbeText
            className="text-[24px] lg:text-[32px] font-timesNewRoman font-bold tracking-wider "
            text="instagram"
            rotate
            vertical
          />
        </Link>
        <WigglyButton
          text="search"
          onClick={() => setOpenSearch(true)}
          className="text-[24px] lg:text-[32px]"
          vertical
        />
        <WigglyButton
          text={theme === "dark" ? "light" : "dark"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          vertical
          className="text-[24px] lg:text-[32px]"
        />
      </nav>
      <div className="absolute inset-0 z-[20] flex items-end justify-center lg:justify-start px-[18px] pointer-events-none mb-[18px]">
        <div className=" px-[0px] pt-[9px] pb-[0px]  pointer-events-auto">
          <HeroText />
          {/* <div className=" w-[calc(100vw-64px)] lg:w-[33.3vw] lg:mx-auto relative aspect-video ">
            <Image src="/ELLI_TEXT.png" alt="Elinor Silow" fill />
          </div> */}
        </div>
      </div>
    </div>
  );
}

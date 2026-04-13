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
      <div className="  pointer-events-auto  bg-[#B3F7FE]  ">
        {/* <div className=" w-[calc(100vw-0px)] lg:w-[33.3vw] lg:mx-auto relative aspect-video ">
          <Image src="/ELLI_TEXT.png" alt="Elinor Silow" fill />
        </div> */}
        <HeroText />
      </div>
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <nav
        className=" flex flex-wrap bg-[#41B97D] justify-startlg:justify-start  gap-12 lg:gap-16 px-[32px]  pt-[18px] pb-[18px] h-full pointer-events-auto items-start w-full "
        onClick={(e) => e.stopPropagation()}
      >
        <Link href="/">
          <OGubbeText
            className="text-[24px] lg:text-[21px] font-timesNewRoman font-bold"
            text="elinor silow"
            vertical
            lettersOnly
          />
        </Link>
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href}>
            <OGubbeText
              className="text-[24px] lg:text-[21px] font-timesNewRoman font-bold"
              text={label}
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
            className="text-[24px] lg:text-[21px] font-timesNewRoman font-bold"
            text="instagram"
            vertical
          />
        </Link>
      </nav>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { DarkModeToggle } from "./DarkModeToggle";
import { OGubbeText } from "./OGubbeText";

interface Props {
  setOpenSearch: (open: boolean) => void;
}

const NAV_LINKS = [
  { href: "/", label: "works" },
  { href: "/exhibitions", label: "exhibitions" },
  { href: "/info", label: "info" },
  { href: "/contact", label: "contact" },
];

export default function MobileNavOverlay({ setOpenSearch }: Props) {
  const pathname = usePathname();
  const { open, setOpen } = useUI();

  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[69] lg:hidden pointer-events-auto flex flex-col"
      animate={{ y: open ? 0 : "-90vh" }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Panel content */}
      <div className="h-[90vh] bg-background flex flex-col justify-center items-center px-[32px] pt-[64px] pb-[18px]">
        <div className="flex flex-col gap-[0px] items-center">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="flex justify-center">
              <OGubbeText
                text={label}
                lettersOnly
                className="text-[32px]"
                sizes="32px"
              />
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-[0px] items-center">
          <button
            onClick={() => {
              setOpenSearch(true);
              setOpen(false);
            }}
          >
            <OGubbeText
              text="search"
              lettersOnly
              className="text-[32px]"
              sizes="32px"
            />
          </button>
          <DarkModeToggle textClassName="text-[32px]" sizes="32px" />
        </div>
      </div>

      {/* Button — stuck to bottom of panel, visible at top when closed */}
      <button
        className="no-hide-text w-full flex justify-center py-[9px] pointer-events-auto bg-transparent"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <OGubbeText
          text={open ? "close" : "menu"}
          lettersOnly
          className="text-[18px]"
          sizes="18px"
        />
      </button>
    </motion.div>
  );
}

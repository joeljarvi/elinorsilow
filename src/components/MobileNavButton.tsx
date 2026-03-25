"use client";

import { useUI } from "@/context/UIContext";

export default function NavButton() {
  const { open, handleOpen } = useUI();

  return (
    <button
      className="lg:hidden fixed bottom-[18px] left-1/2 -translate-x-1/2 z-[95] mix-blend-difference text-background no-hide-text pointer-events-auto font-universNextProExt font-extrabold text-[16px]"
      onClick={handleOpen}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      {open ? "CLOSE" : "MENU"}
    </button>
  );
}

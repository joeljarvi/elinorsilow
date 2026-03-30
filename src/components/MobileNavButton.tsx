"use client";

import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

export default function NavButton() {
  const { open, handleOpen } = useUI();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setScrolled(true);
      return;
    }
    setScrolled(false);
    const onScroll = () =>
      setScrolled(window.scrollY >= window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <Button
      variant="link"
      size="controls"
      className="lg:hidden fixed top-[28px] left-1/2 -translate-x-1/2 z-[80] no-hide-text pointer-events-auto font-universNextProExt font-extrabold text-[16px]"
      style={{
        opacity: pathname === "/" && !scrolled ? 0 : 1,
        pointerEvents: pathname === "/" && !scrolled ? "none" : undefined,
        transition: "opacity 0.4s ease",
      }}
      onClick={handleOpen}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      {open ? "(close)" : "(menu)"}
    </Button>
  );
}

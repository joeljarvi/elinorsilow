"use client";

import { useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";

export default function PagePaddingSync() {
  const pl = useMotionValue(18);

  useEffect(() => {
    return pl.on("change", (v) => {
      document.documentElement.style.setProperty("--page-pl", `${v}px`);
    });
  }, [pl]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      pl.set(0);
      document.documentElement.style.setProperty("--page-pl", "0px");
      animate(pl, 18, {
        type: "tween",
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      });
      return;
    }

    // Desktop: 18 initially, animate to 64 when scroll >= 50vh
    pl.set(18);
    document.documentElement.style.setProperty("--page-pl", "18px");

    const onScroll = () => {
      const target = window.scrollY >= window.innerHeight * 0.5 ? 64 : 18;
      animate(pl, target, {
        type: "tween",
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pl]);

  return null;
}

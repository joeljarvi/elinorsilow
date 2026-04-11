"use client";

import Link from "next/link";
import { OGubbeText } from "./OGubbeText";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function SiteLogo() {
  const { scrollY } = useScroll();
  const heroHeightRef = useRef(800);
  const startSizeRef = useRef(36);
  const pathname = usePathname();
  const isWorks = pathname === "/" || pathname === "/works";
  const isHome = isWorks;
  const [atTop, setAtTop] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    heroHeightRef.current = window.innerHeight;
    startSizeRef.current = window.innerWidth >= 1024 ? 36 : 22;
    const threshold = heroHeightRef.current * 0.85;
    setAtTop(window.scrollY < threshold);
    const onScroll = () => setAtTop(window.scrollY < threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    setReady(true);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fontSize = useTransform(scrollY, (y) => {
    const h = heroHeightRef.current;
    const start = startSizeRef.current;
    const ratio = Math.max(0, Math.min(1, y / h));
    return start - (start - 18) * ratio;
  });

  const elinorOpacity = useTransform(scrollY, (y) => {
    const fadeStart = heroHeightRef.current * 0.85;
    const fadeEnd = heroHeightRef.current * 0.95;
    return Math.max(0, Math.min(1, 1 - (y - fadeStart) / (fadeEnd - fadeStart)));
  });

  const worksOpacity = useTransform(scrollY, (y) => {
    const fadeStart = heroHeightRef.current * 0.85;
    const fadeEnd = heroHeightRef.current * 0.95;
    return Math.max(0, Math.min(1, (y - fadeStart) / (fadeEnd - fadeStart)));
  });

  if (!ready) return null;

  return (
    <motion.div
      layout
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`pointer-events-none flex flex-col pl-[18px] pr-[18px] ${
        isWorks && atTop ? "h-screen justify-center" : "pt-[18px] justify-start"
      }`}
    >
      <motion.div layout className="pointer-events-auto">
        <Link href="/">
          {isHome ? (
            <motion.span style={{ fontSize }} className="relative block">
              <motion.span style={{ opacity: elinorOpacity }} className="block">
                <span className="no-hide-text">
                  <OGubbeText text="elinor silow" vertical />
                </span>
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                style={{ opacity: worksOpacity }}
                className="absolute top-0 left-0 block"
              >
                <span className="no-hide-text">
                  <OGubbeText text="works" vertical />
                </span>
              </motion.span>
            </motion.span>
          ) : (
            <motion.span style={{ fontSize: 18 }}>
              <span className="no-hide-text">
                <OGubbeText text="Elinor Silow" vertical />
              </span>
            </motion.span>
          )}
        </Link>
      </motion.div>
    </motion.div>
  );
}

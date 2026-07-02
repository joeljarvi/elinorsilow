"use client";

import { useEffect, useRef, useState } from "react";
import WigglyButton from "./WigglyButton";

const TRUMPETS = [
  "/trumpet_1_NAV.svg",
  "/trumpet_2_NAV.svg",
  "/trumpet_3_NAV.svg",
];

export default function FixedCookieAccept() {
  const [visible, setVisible] = useState(true);
  const [trumpetIndex, setTrumpetIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrumpetIndex((i) => (i + 1) % TRUMPETS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        "--cookie-h",
        `${entry.contentRect.height}px`,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.setProperty("--cookie-h", "0px");
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="fixed  bottom-0 top-auto left-0 right-0 z-[90] w-full flex flex-col lg:flex-row items-start lg:items-baseline justify-center px-4 py-4 lg:py-1 font-timesNewRoman  text-foreground text-xs lg:text-sm   gap-x-1 text-center gap-y-0    "
    >
      <span className="leading-tight flex flex-wrap items-baseline justify-center gap-x-1 lowercase">
        Copyright <strong>Elinor Silow</strong> 2026. All rights reserved.
      </span>
      <span className="leading-tight flex flex-wrap items-baseline justify-center gap-x-2 -mt-1">
        by using this website you consent to the use of cookies.
        <WigglyButton
          text="ok, good!"
          onClick={() => {
            localStorage.setItem("cookiesAccepted", "true");
            setVisible(false);
          }}
          size="text-sm"
          mobileSize="text-xs"
          className="text-foreground leading-tight px-0"
          anchorFill="currentColor"
          bold
          forceBaseline
        />
        <WigglyButton
          text="no, i do not consent."
          onClick={() => {
            localStorage.setItem("cookiesAccepted", "false");
            setVisible(false);
          }}
          size="text-sm"
          mobileSize="text-xs"
          className="text-foreground lg:text-muted-foreground leading-tight px-0"
          anchorFill="currentColor"
          forceBaseline
        />
      </span>
    </div>
  );
}

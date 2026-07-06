"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import WigglyButton from "./WigglyButton";

const TRUMPETS = [
  "/trumpet_1_NAV.svg",
  "/trumpet_2_NAV.svg",
  "/trumpet_3_NAV.svg",
];

export default function FixedCookieAccept() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isHome || localStorage.getItem("cookiesAccepted") === null) {
        setVisible(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isHome]);
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
      className="fixed top-0  bottom-0 lg:top-auto left-0 right-0 z-[90] w-full flex flex-col lg:flex-row  lg:items-baseline justify-end lg:justify-end  px-6 py-6  font-timesNewRoman  text-foreground text-xs lg:text-sm   gap-x-1 text-left gap-y-0    "
    >
      <span className="leading-tight flex flex-col items-baseline justify-start lg:justify-center  lg:items-end gap-4   p-6 w-full text-xl text-left lg:text-right lg:w-min lg:whitespace-nowrap bg-background border border-foreground  ">
        by using this website you consent to the use of cookies.
        <span className="grid grid-cols-2 gap-4 items-baseline justify-start lg:justify-end w-full">
          <WigglyButton
            text="no thanks"
            onClick={() => {
              localStorage.setItem("cookiesAccepted", "false");
              setVisible(false);
            }}
            size="text-xl"
            mobileSize="text-xl"
            className="bg-neutral-200  hover:bg-foreground hover:text-background transition-all leading-tight px-4 py-4"
            anchorFill="currentColor"
            forceBaseline
          />
          <WigglyButton
            text="ok, good!"
            onClick={() => {
              localStorage.setItem("cookiesAccepted", "true");
              setVisible(false);
            }}
            size="text-xl"
            mobileSize="text-xl"
            className=" bg-foreground text-background hover:text-foreground hover:bg-background border border-foreground leading-tight px-4 py-4"
            anchorFill="currentColor"
            forceBaseline
            active
          />
        </span>
      </span>
      <span className="hidden leading-tight  flex-wrap items-baseline justify-center gap-x-1 lowercase">
        Copyright <strong>Elinor Silow</strong> 2026. All rights reserved.
      </span>
    </div>
  );
}

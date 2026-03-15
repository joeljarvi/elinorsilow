"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavSpacer() {
  const [height, setHeight] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    const observer = new ResizeObserver(([entry]) => {
      const h = entry.contentRect.height;
      setHeight(h);
      document.documentElement.style.setProperty("--nav-height", `${h}px`);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  if (pathname.startsWith("/studio")) return null;

  return <div style={{ height }} />;
}

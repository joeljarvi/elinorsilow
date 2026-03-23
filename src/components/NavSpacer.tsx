"use client";

import { useEffect } from "react";

export default function NavSpacer() {
  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--nav-height", `${entry.contentRect.height}px`);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return null;
}

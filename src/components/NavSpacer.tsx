"use client";

import { useEffect } from "react";

export default function NavSpacer() {
  useEffect(() => {
    const nav = document.getElementById("main-nav");
    if (!nav) return;

    // getBoundingClientRect() is border-box, so it includes the nav's own
    // padding — contentRect would drop it and let content ride up under the nav.
    const measure = () => {
      document.documentElement.style.setProperty(
        "--nav-height",
        `${nav.getBoundingClientRect().height}px`,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return null;
}

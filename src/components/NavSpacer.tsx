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
      setHeight(entry.contentRect.height);
    });
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  if (pathname.startsWith("/studio")) return null;

  // Only needed on mobile — on desktop the nav is at the bottom
  return <div className="lg:hidden" style={{ height }} />;
}

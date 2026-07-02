"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { homeBg } = useUI();
  const noPaddingPaths = ["/", "/works", "/exhibitions"];
  const applyPadding = !noPaddingPaths.includes(pathname);

  useEffect(() => {
    document.body.style.backgroundColor = homeBg ?? "";
    document.body.style.transition = "background-color 300ms";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [homeBg]);

  return (
    <div style={applyPadding ? { paddingTop: "var(--nav-height, 0px)" } : undefined}>
      {children}
    </div>
  );
}

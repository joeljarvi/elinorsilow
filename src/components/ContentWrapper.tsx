"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { homeBg } = useUI();
  const noPaddingPaths = ["/"];
  const applyPadding = !noPaddingPaths.includes(pathname);

  useEffect(() => {
    document.body.style.backgroundColor = homeBg ?? "";
    document.body.style.transition = "background-color 300ms";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [homeBg]);

  // A flat one-row offset (mt-12 — the height of a nav button) rather than the
  // measured nav height: the nav's second row is a submenu that opens over the
  // page, so content no longer reflows when it appears.
  return <div className={applyPadding ? "mt-12" : undefined}>{children}</div>;
}

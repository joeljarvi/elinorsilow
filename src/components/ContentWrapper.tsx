"use client";

import { usePathname } from "next/navigation";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noPaddingPaths = ["/", "/works", "/exhibitions"];
  const applyPadding = !noPaddingPaths.includes(pathname);

  return (
    <div style={applyPadding ? { paddingTop: "var(--nav-height, 0px)" } : undefined}>
      {children}
    </div>
  );
}

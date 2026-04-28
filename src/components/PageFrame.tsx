"use client";

import { usePathname } from "next/navigation";
import WigglyDivider from "./WigglyDivider";

function pageTitle(pathname: string): string {
  if (pathname === "/") return "works";
  return pathname.slice(1).split("/")[0];
}

export default function PageFrame() {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <div className="hidden fixed top-0 left-0 w-full h-dvh pointer-events-none z-[40]">
      {/* Top */}
      <div className="absolute top-0 left-0 right-0">
        <WigglyDivider
          text={title}
          active
          size="text-[16px]"
          className="text-muted-foreground"
        />
      </div>

      {/* Left */}
      <div className="absolute left-0 top-0 h-full">
        <WigglyDivider
          text={title}
          vertical
          active
          size="text-[16px]"
          className="text-muted-foreground gap-[0.05em]"
        />
      </div>

      {/* Right */}
      <div className="absolute right-0 top-0 h-full">
        <WigglyDivider
          text={title}
          vertical
          active
          size="text-[16px]"
          className="text-muted-foreground gap-[0.05em]"
        />
      </div>
    </div>
  );
}

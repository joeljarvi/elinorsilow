"use client";

import WigglyDivider from "./WigglyDivider";

function pageTitle(pathname: string): string {
  if (pathname === "/") return "works";
  return pathname.slice(1).split("/")[0];
}

export default function TextFrame() {
  return (
    <div className="hidden absolute inset-0 pointer-events-none z-[40] w-full h-full">
      {/* Top */}
      <div className="absolute top-0 left-0 right-0">
        <WigglyDivider
          char="^"
          active
          size="text-[16px]"
          className="text-muted-foreground"
        />
      </div>

      {/* Left */}
      <div className="absolute left-0 top-0 h-full">
        <WigglyDivider
          char="^"
          vertical
          active
          size="text-[16px]"
          className="text-muted-foreground gap-[0.05em]"
        />
      </div>

      {/* Right */}
      <div className="absolute right-0 top-0 h-full">
        <WigglyDivider
          char="^"
          vertical
          active
          size="text-[16px]"
          className="text-muted-foreground gap-[0.05em]"
        />
      </div>
    </div>
  );
}

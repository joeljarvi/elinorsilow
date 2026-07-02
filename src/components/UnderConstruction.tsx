"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { OGubbeText } from "./OGubbeText";
import WigglyButton from "./WigglyButton";

export default function UnderConstruction() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <button
        onClick={() => setOpen(false)}
        className="fixed top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <div className="flex flex-col items-center gap-0 max-w-md w-full  mx-auto px-[64px]">
        <Image
          src="/nav_loading.svg"
          alt="Sleeping head"
          width={98}
          height={98}
          className="w-[64px] h-[64px] lg:w-[128px] lg:h-[128px] "
        />
        <WigglyButton
          text="Zzzz...under construction..."
          size="text-3xl"
          mobileSize="text-2xl"
          className="tracking-wide text-foreground px-0 mx-0 items-baseline"
          active
          anchorFill="currentColor"
          forceBaseline
        />
      </div>
    </div>
  );
}

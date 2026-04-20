"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { OGubbeText } from "./OGubbeText";

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
        <OGubbeText
          text="Shh... This page is sleeping..."
          className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
          lettersOnly
          revealAnimation={false}
        />

        <OGubbeText
          text=" Please check back later."
          className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
          lettersOnly
          revealAnimation={false}
        />
      </div>
    </div>
  );
}

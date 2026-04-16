"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OGubbeText } from "./OGubbeText";

import { X } from "lucide-react";

export default function ContactClient() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <Link
        href="/"
        className="fixed top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </Link>

      <div className="flex flex-col items-center gap-0 max-w-md w-full  mx-auto px-[64px]">
        <Image
          src="/nav_loading.svg"
          alt="Sleeping head"
          width={98}
          height={98}
          className="w-[64px] h-[64px] lg:w-[128px] lg:h-[128px]"
        />
        <OGubbeText
          text="For business inquiries, please contact Elinor Silow at"
          className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
          lettersOnly
          revealAnimation={false}
        />
        <Link href="mailto:elinor.silow@gmail.com">
          <OGubbeText
            text=" elinor.silow@gmail.com"
            className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
            lettersOnly
            revealAnimation={false}
          />
        </Link>
        <span className="flex gap-x-[9px]">
          <OGubbeText
            text="or message her at:"
            className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
            lettersOnly
            revealAnimation={false}
          />
          <Link href="instagram.com/elinorsilow">
            <OGubbeText
              text=" Instagram"
              className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
              lettersOnly
              revealAnimation={false}
            />
          </Link>
        </span>
      </div>
    </div>
  );
}

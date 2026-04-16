"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { OGubbeText } from "./OGubbeText";
import Link from "next/link";

export default function ErrorFourZeroFour() {
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
          text="404! This page does not exist..."
          className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
          lettersOnly
          revealAnimation={false}
        />

        <OGubbeText
          text="and please don't disturb me when I sleep..."
          className="font-timesNewRoman tracking-wider font-normal text-[18px] lg:text-[36px]"
          lettersOnly
          revealAnimation={false}
        />
      </div>
    </div>
  );
}

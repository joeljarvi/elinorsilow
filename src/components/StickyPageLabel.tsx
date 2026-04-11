"use client";

import { OGubbeText } from "./OGubbeText";

export function StickyPageLabel({ text }: { text: string }) {
  return (
    <div className="sticky top-[0px] z-[80] h-0 overflow-visible pointer-events-none ">
      <div className="pl-[0px] ">
        <OGubbeText
          text={text}
          vertical
          className="text-[18px] lg:text-[24px]  pl-[18px] pt-[18px] pb-[18px]  pr-[18px]"
        />
      </div>
    </div>
  );
}

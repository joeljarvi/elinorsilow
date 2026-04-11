"use client";

import { OGubbeText } from "./OGubbeText";

interface WigglyButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  vertical?: boolean;
  className?: string;
}

export default function WigglyButton({
  text,
  onClick,
  vertical = false,
  className,
}: WigglyButtonProps) {
  return (
    <button
      className={`no-hide-text pointer-events-auto cursor-pointer px-[12px] py-[8px] ${className ?? ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      <OGubbeText
        text={text}
        lettersOnly
        vertical={vertical}
        className="text-[24px] lg:text-[32px] font-timesNewRoman font-bold"
        sizes="18px"
      />
    </button>
  );
}

"use client";

import { OGubbeText } from "./OGubbeText";

interface WigglyButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  vertical?: boolean;
  className?: string;
  size?: string;
  revealAnimation?: boolean;
}

export default function WigglyButton({
  text,
  onClick,
  vertical = false,
  className,
  size = "text-[24px] lg:text-[21px]",
  revealAnimation = true,
}: WigglyButtonProps) {
  return (
    <button
      className={`no-hide-text pointer-events-auto cursor-pointer px-[9px]  ${className ?? ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      <OGubbeText
        text={text}
        lettersOnly
        vertical={vertical}
        className={`${size} font-timesNewRoman font-bold`}
        sizes="18px"
        revealAnimation={revealAnimation}
      />
    </button>
  );
}

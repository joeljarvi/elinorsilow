"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type CloseButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export default function CloseButton({ onClick, className }: CloseButtonProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const button = (
    <button
      type="button"
      aria-label="Close"
      onClick={onClick}
      className={`flex items-center justify-center w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] text-muted-foreground hover:text-foreground transition-colors ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        className="lg:w-7 lg:h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <line x1="4" y1="4" x2="20" y2="20" />
        <line x1="20" y1="4" x2="4" y2="20" />
      </svg>
    </button>
  );

  // Portal straight to <body> — ancestors here use transform/backdrop-filter
  // (framer-motion animations, backdrop-blur), any of which creates a new
  // containing block that would otherwise hijack `position: fixed`.
  if (!mounted) return null;
  return createPortal(button, document.body);
}

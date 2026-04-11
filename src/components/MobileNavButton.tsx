"use client";

import { useUI } from "@/context/UIContext";
import { OGubbeText } from "./OGubbeText";

export default function MobileNavButton() {
  const { open, handleOpen } = useUI();

  return (
    <button
      className="no-hide-text pointer-events-auto cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        handleOpen();
      }}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <OGubbeText text={open ? "close" : "menu"} />
    </button>
  );
}

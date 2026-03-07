"use client";

import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { Button } from "./ui/button";

export function HideTextToggle({ className }: { className?: string }) {
  const { showInfo, setShowInfo } = useUI();

  return (
    <Button
      variant="link"
      size="lg"
      onClick={() => setShowInfo(!showInfo)}
      aria-label={showInfo ? "Hide text" : "Show text"}
      className={` no-hide-text px-4 lg:px-2 ${className ? ` ${className}` : ""}`}
    >
      {showInfo ? "Hide text" : "Show text"}
    </Button>
  );
}

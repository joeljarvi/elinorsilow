"use client";

import React from "react";
import { useUI } from "@/context/UIContext";
import { Button } from "./ui/button";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

export function HideTextToggle({
  className,
  variant = "link",
  size = "lg",
}: {
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const { showInfo, setShowInfo } = useUI();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => setShowInfo(!showInfo)}
      aria-label={showInfo ? "Hide text" : "Show text"}
      className={`no-hide-text ${className ?? ""}`}
    >
      {size === "controlsIcon" ? (
        showInfo ? <EyeClosedIcon /> : <EyeOpenIcon />
      ) : (
        showInfo ? "Hide text" : "Show text"
      )}
    </Button>
  );
}

"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Half2Icon } from "@radix-ui/react-icons";

export function DarkModeToggle({
  className = "",
  size = "controls",
}: {
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button
      variant="link"
      size={size}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`no-hide-text ${className ?? ""}`}
    >
      {isDark ? "Light" : "Dark"}
    </Button>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { OGubbeText } from "./OGubbeText";

export function DarkModeToggle({
  className = "",
  textClassName = "text-[18px]",
  sizes = "18px",
}: {
  className?: string;
  textClassName?: string;
  sizes?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`no-hide-text cursor-pointer ${className}`}
    >
      <OGubbeText
        text={isDark ? "light" : "dark"}
        lettersOnly
        className={textClassName}
        sizes={sizes}
      />
    </button>
  );
}

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "light" ? (
        <button
          onClick={() => setTheme("dark")}
          className="hover:opacity-30 transition-opacity uppercase"
        >
          Dark mode
        </button>
      ) : (
        <button
          onClick={() => setTheme("light")}
          className=" hover:opacity-30 transition-opacity uppercase "
        >
          Light mode
        </button>
      )}
    </div>
  );
}

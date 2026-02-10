"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Image from "next/image";

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
        <Button
          variant="link"
          onClick={() => setTheme("dark")}
          className="nav-toggle no-hide-text   "
        >
          Mörkt läge
        </Button>
      ) : (
        <Button
          variant="link"
          onClick={() => setTheme("light")}
          className="nav-toggle no-hide-text "
        >
          Ljust läge
        </Button>
      )}
    </div>
  );
}

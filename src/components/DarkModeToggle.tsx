"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

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
          size="linkSize"
          onClick={() => setTheme("dark")}
          className="font-gintoBlack "
        >
          Dark mode
        </Button>
      ) : (
        <Button
          variant="link"
          size="linkSize"
          onClick={() => setTheme("light")}
          className="font-gintoBlack  "
        >
          Light
        </Button>
      )}
    </div>
  );
}

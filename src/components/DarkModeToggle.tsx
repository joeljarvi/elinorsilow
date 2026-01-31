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
          variant="nav"
          size="linkSizeMd"
          onClick={() => setTheme("dark")}
          className="font-gintoBlack  "
        >
          Night
        </Button>
      ) : (
        <Button
          variant="nav"
          size="linkSizeMd"
          onClick={() => setTheme("light")}
          className=" font-gintoBlack    "
        >
          Day
        </Button>
      )}
    </div>
  );
}

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
          size="sm"
          variant="link"
          onClick={() => setTheme("dark")}
          className=" justify-center lg:justify-start items-center w-full font-gintoRegular  "
        >
          Dark
        </Button>
      ) : (
        <Button
          variant="link"
          size="sm"
          onClick={() => setTheme("light")}
          className=" justify-center lg:justify-start items-center w-full font-gintoRegular    "
        >
          Light
        </Button>
      )}
    </div>
  );
}

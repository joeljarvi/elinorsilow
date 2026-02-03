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
          variant="default"
          onClick={() => setTheme("dark")}
          className="text-xl lg:text-lg justify-center lg:justify-start items-center w-full font-gintoBlack  "
        >
          Dark
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={() => setTheme("light")}
          className=" text-xl lg:text-lg justify-center lg:justify-start items-center w-full font-gintoBlack   "
        >
          Light
        </Button>
      )}
    </div>
  );
}

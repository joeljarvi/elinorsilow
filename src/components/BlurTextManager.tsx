"use client";

import { useEffect } from "react";
import { useUI } from "@/context/UIContext";

export default function BlurTextManager() {
  const { textBlurred } = useUI();

  useEffect(() => {
    if (textBlurred) {
      document.body.setAttribute("data-blur-text", "true");
    } else {
      document.body.removeAttribute("data-blur-text");
    }
  }, [textBlurred]);

  return null;
}

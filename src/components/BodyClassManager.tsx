"use client";

import { useUI } from "@/context/UIContext";
import { useEffect } from "react";

export default function BodyClassManager() {
  const { showInfo } = useUI();

  useEffect(() => {
    document.body.setAttribute("data-hide-text", (!showInfo).toString());
  }, [showInfo]);

  return null;
}

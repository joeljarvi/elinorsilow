"use client";

import { Header } from "@/components/Header";
import { WorksCarousel } from "@/components/WorksCarousel";
import { useState, useEffect } from "react";

export default function WorksPage() {
  const [openTools, setOpenTools] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpenTools(true);
    }
  }, []);

  return (
    <div className="w-screen h-screen">
      <Header
        titleState="works"
        openTools={openTools}
        setOpenTools={setOpenTools}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
      <WorksCarousel
        openTools={openTools}
        setOpenTools={setOpenTools}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
    </div>
  );
}

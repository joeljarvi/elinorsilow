"use client";

import { ExhibitionCarousel } from "@/components/ExhibitionsCarousel";
import { Header } from "@/components/Header";

import { useState, useEffect } from "react";

export default function Exhibitions() {
  const [openTools, setOpenTools] = useState(false);

  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setOpenTools(true);
    }
  }, []);

  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <Header
          titleState="exhibitions"
          openTools={openTools}
          setOpenTools={setOpenTools}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
        <ExhibitionCarousel />
      </div>
    </>
  );
}

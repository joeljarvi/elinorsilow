"use client";

import Header from "@/components/Header";
import { WorksCarousel } from "@/components/WorksCarousel";
import { useWorks } from "@/context/WorksContext";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PopUpGubbe from "@/components/PopUpGubbe";
import Lenis from "lenis";
import { Work } from "../../lib/wordpress";

function LenisWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (lenisRef.current) return;

    const lenis = new Lenis({ autoRaf: true });
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <div>{children}</div>;
}

export default function HomeContent() {
  const { filteredWorks } = useWorks();
  const searchParams = useSearchParams();
  const slug = searchParams.get("work");

  const initialIndex =
    slug && filteredWorks ? filteredWorks.findIndex((w) => w.slug === slug) : 0;

  const [allWorks, setAllWorks] = useState(filteredWorks || []);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(initialIndex);

  const currentWork =
    allWorks && allWorks.length > 0 ? allWorks[currentWorkIndex] : undefined;

  const [showInfo, setShowInfo] = useState(true);
  const [min, setMin] = useState(true);

  // Lägg till ny work
  const addNewWork = (newWork: Work) => {
    setAllWorks((prev) => [...prev, newWork]);
    setCurrentWorkIndex(allWorks.length); // pekar på nya worken
  };

  function handleSelectWork(index: number) {
    setCurrentWorkIndex(index);
  }

  return (
    <LenisWrapper>
      <div className="w-full bg-white">
        <Header
          initialWorks={allWorks}
          work={currentWork}
          currentWorkIndex={currentWorkIndex}
          showInfo={showInfo}
          min={min}
        />
        <PopUpGubbe />
        <WorksCarousel
          onSelectWork={handleSelectWork}
          initialIndex={currentWorkIndex}
        />
      </div>
    </LenisWrapper>
  );
}

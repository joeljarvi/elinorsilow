"use client";

import Header from "@/components/Header";
import { WorksCarousel } from "@/components/WorksCarousel";
import { useWorks } from "@/context/WorksContext";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PopUpGubbe from "@/components/PopUpGubbe";
import Lenis from "lenis";

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

  const [currentWorkIndex, setCurrentWorkIndex] = useState(initialIndex);
  const currentWork =
    filteredWorks && filteredWorks.length > 0
      ? filteredWorks[currentWorkIndex]
      : undefined;

  const [showInfo, setShowInfo] = useState(true);
  const [min, setMin] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 798) {
        setShowInfo(true);
        setMin(true);
      } else {
        setShowInfo(true);
        setMin(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSelectWork(index: number) {
    setCurrentWorkIndex(index);
  }

  return (
    <LenisWrapper>
      <div className="w-full bg-white">
        <Header
          work={currentWork}
          currentWorkIndex={currentWorkIndex}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          min={min}
          setMin={setMin}
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

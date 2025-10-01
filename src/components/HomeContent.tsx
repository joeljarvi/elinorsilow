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
  const { allWorks } = useWorks();
  const searchParams = useSearchParams();
  const slug = searchParams.get("work");

  const initialIndex =
    slug && allWorks ? allWorks.findIndex((w) => w.slug === slug) : 0;

  const [currentWorkIndex, setCurrentWorkIndex] =
    useState<number>(initialIndex);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [min, setMin] = useState<boolean>(true);

  const currentWork = allWorks[currentWorkIndex];

  const prevWork = currentWorkIndex > 0 ? allWorks[currentWorkIndex - 1] : null;
  const nextWork =
    currentWorkIndex < allWorks.length - 1
      ? allWorks[currentWorkIndex + 1]
      : null;

  function handleSelectWork(index: number) {
    setCurrentWorkIndex(index);
  }

  return (
    <LenisWrapper>
      <div className="w-full bg-white">
        <Header
          initialWorks={allWorks} // full array of works
          currentWorkIndex={currentWorkIndex} // index of the work in view
          currentWork={currentWork} // fallback / current work
          prevWork={prevWork} // previous work
          nextWork={nextWork} // next work
          showInfo={showInfo}
          min={min}
        />

        <PopUpGubbe />

        <WorksCarousel
          initialIndex={currentWorkIndex}
          onSelectWork={setCurrentWorkIndex}
        />
      </div>
    </LenisWrapper>
  );
}

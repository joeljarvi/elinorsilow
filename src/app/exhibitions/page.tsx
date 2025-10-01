"use client";

import { Loader } from "@/components/Loader";
import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import {
  ExhibitionsProvider,
  useExhibitions,
} from "@/context/ExhibitionsContext";
import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import Header from "@/components/Header";
import PopUpGubbe from "@/components/PopUpGubbe";

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

function ExhibitionsPageContent() {
  const { filteredExhibitions, loading, error } = useExhibitions();
  const [currentExhibitionIndex, setCurrentExhibitionIndex] =
    useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [min, setMin] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 798) {
        setShowInfo(true);
        setMin(true); // mobile
      } else {
        setShowInfo(true);
        setMin(false); // desktop
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentExhibition =
    filteredExhibitions?.[currentExhibitionIndex] || null;

  const prevExhibition =
    currentExhibitionIndex > 0
      ? filteredExhibitions?.[currentExhibitionIndex - 1] || null
      : null;

  const nextExhibition =
    currentExhibitionIndex < (filteredExhibitions?.length || 0) - 1
      ? filteredExhibitions?.[currentExhibitionIndex + 1] || null
      : null;

  return (
    <LenisWrapper>
      <Header
        initialExhibitions={filteredExhibitions}
        currentExhibitionIndex={currentExhibitionIndex}
        currentExhibition={currentExhibition}
        showInfo={showInfo}
        min={min}
      />

      <PopUpGubbe />

      {loading && <Loader />}
      {error && <p>Error loading exhibitions: {error.message}</p>}

      {!loading && !error && (
        <ExhibitionsCarousel
          exhibitions={filteredExhibitions}
          onExhibitionChange={setCurrentExhibitionIndex}
        />
      )}
    </LenisWrapper>
  );
}

export default function ExhibitionsPage() {
  return (
    <ExhibitionsProvider>
      <ExhibitionsPageContent />
    </ExhibitionsProvider>
  );
}

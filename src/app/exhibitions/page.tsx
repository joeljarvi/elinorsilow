// ExhibitionsPageContent.tsx
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
import BorderWrapper from "@/components/BorderWrapper";
import PopUpGubbe from "@/components/PopUpGubbe";

function LenisWrapper({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (lenisRef.current) return;

    const lenis = new Lenis({
      autoRaf: true,
    });
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
  const [currentExhibitionIndex, setCurrentExhibitionIndex] = useState(0);
  const { filteredExhibitions, loading, error } = useExhibitions();
  const [showInfo, setShowInfo] = useState<boolean>(() => {
    return true;
  });
  const [min, setMin] = useState<boolean>(() => {
    return true;
  });

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

  const [bgColor, setBgColor] = useState("bg-neutral-400");

  // ✅ derive the current exhibition safely
  const currentExhibition =
    filteredExhibitions?.[currentExhibitionIndex] || null;

  return (
    <>
      <LenisWrapper>
        <div className={bgColor} />
        <Header
          currentExhibition={currentExhibition}
          currentExhibitionIndex={currentExhibitionIndex}
          setCurrentExhibitionIndex={setCurrentExhibitionIndex}
          min={min}
          setMin={setMin}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          bgColor={bgColor}
          setBgColor={setBgColor}
        />

        <PopUpGubbe />

        {loading && <Loader />}
        {error && <p>Error loading exhibitions: {error.message}</p>}

        {!loading && !error && (
          <ExhibitionsCarousel
            onExhibitionChange={setCurrentExhibitionIndex}
            exhibitions={filteredExhibitions || []}
            bgColor={bgColor}
            setBgColor={setBgColor}
          />
        )}
      </LenisWrapper>
    </>
  );
}

export default function ExhibitionsPage() {
  return (
    <ExhibitionsProvider>
      <ExhibitionsPageContent />
    </ExhibitionsProvider>
  );
}

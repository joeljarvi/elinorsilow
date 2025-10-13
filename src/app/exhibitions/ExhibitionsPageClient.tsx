"use client";

import { Loader } from "@/components/Loader";
import { useState, useEffect } from "react";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import Header from "@/components/Header";
import PopUpGubbe from "@/components/PopUpGubbe";

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

  return (
    <>
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
    </>
  );
}

export default function ExhibitionsPageClient() {
  return <ExhibitionsPageContent />;
}

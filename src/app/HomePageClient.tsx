"use client";

import Header from "@/components/Header";
import { WorksCarousel } from "@/components/WorksCarousel";
import { useWorks } from "@/context/WorksContext";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import PopUpGubbe from "@/components/PopUpGubbe";

function HomePageContent() {
  const { allWorks } = useWorks();
  const searchParams = useSearchParams();
  const slug = searchParams.get("work");

  const initialIndex =
    slug && allWorks ? allWorks.findIndex((w) => w.slug === slug) : 0;

  const [currentWorkIndex, setCurrentWorkIndex] =
    useState<number>(initialIndex);

  const showInfo = true;
  const min = true;

  const currentWork = allWorks[currentWorkIndex];

  const prevWork = currentWorkIndex > 0 ? allWorks[currentWorkIndex - 1] : null;
  const nextWork =
    currentWorkIndex < allWorks.length - 1
      ? allWorks[currentWorkIndex + 1]
      : null;

  return (
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
  );
}

export default function HomePageClient() {
  return <HomePageContent />;
}

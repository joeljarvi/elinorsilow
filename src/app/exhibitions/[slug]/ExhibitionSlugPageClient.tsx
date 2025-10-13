"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ExhibitionsProvider,
  useExhibitions,
} from "@/context/ExhibitionsContext";
import Header from "@/components/Header";
import { useParams } from "next/navigation";
import { Loader } from "@/components/Loader";
import { useWorks, WorksProvider } from "@/context/WorksContext";
import Link from "next/link";

import Lenis from "lenis";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [atBottom, setAtBottom] = useState(false);

  // Update state when scroll position changes
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setAtBottom(latest >= 0.95); // ~95% down the page
  });

  const handleClick = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <button
      className="fixed bottom-3 left-3 uppercase  cursor-pointer mix-blend-difference text-white font-hershey text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5  "
      onClick={handleClick}
    >
      {atBottom ? "BAck to top" : "Scroll down"}
    </button>
  );
}

function ExhibitionSlugPageContent() {
  const { filteredExhibitions, loading, error } = useExhibitions();
  const params = useParams();
  const slug = params?.slug as string;
  const { allWorks } = useWorks();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [min, setMin] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: "vertical",
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [slug, filteredExhibitions]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading exhibitions: {error.message}</p>;

  const exhibition = filteredExhibitions.find((exh) => exh.slug === slug);
  if (!exhibition) return <p>Exhibition not found.</p>;

  const images = Object.values(exhibition.acf)
    .filter((v) => typeof v === "object" && v?.url)
    .map((img) => (img as { url: string }).url);

  const currentIndex = filteredExhibitions.findIndex(
    (exh) => exh.slug === slug
  );
  const currentExhibition =
    currentIndex >= 0 ? filteredExhibitions[currentIndex] : null;

  const prevExhibition =
    currentIndex > 0 ? filteredExhibitions[currentIndex - 1] : null;
  const nextExhibition =
    currentIndex < filteredExhibitions.length - 1
      ? filteredExhibitions[currentIndex + 1]
      : null;

  // Reusable scaling wrapper
  function ScalingSection({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["0.2 1", "0.8 0"],
    });
    const scale = useTransform(
      scrollYProgress,
      [0.95, 1, 0.95],
      [0.95, 1, 0.95]
    );

    return (
      <motion.section
        ref={ref}
        style={{ scale }}
        className={`h-screen flex flex-col items-center justify-center snap-start relative  ${className}`}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <div className="w-screen flex flex-col  " ref={scrollContainerRef}>
      <Header
        currentExhibition={currentExhibition}
        currentExhibitionIndex={currentIndex}
        prevExhibition={prevExhibition}
        nextExhibition={nextExhibition}
        showInfo={true}
        min={false}
      />

      {/* Sections with scaling */}
      <div className="snap-y snap-mandatory ">
        {/* Title with background image */}
        <ScalingSection className="overflow-hidden ">
          {images.length > 0 && (
            <Image
              src={images[0]}
              alt={`${exhibition.acf.title} background`}
              fill
              className="object-cover z-0 blur-md opacity-20"
              priority
            />
          )}
        </ScalingSection>
        <div className="absolute top-0 left-0 h-full grid grid-rows-4 text-2xl uppercase font-hershey px-3">
          <h3 className=" row-start-2 mix-blend-difference text-white  z-10   text-2xl lg:text-xl  ">
            {exhibition.acf.title}
          </h3>

          <span className=" row-start-3 flex flex-col mix-blend-difference text-white  z-10 text-2xl lg:text-xl">
            <h3>
              {exhibition.acf.start_date}-{exhibition.acf.end_date}
            </h3>
            <h3></h3>
            <h3>{exhibition.acf.venue}</h3>

            <h3 className=" ">{exhibition.acf.exhibition_type}</h3>
          </span>
        </div>

        {/* Description */}
        <ScalingSection>
          <p className="  max-w-md font-walkingOCR lg:max-w-2xl text-left text-lg lg:text-xl">
            {exhibition.acf.description}
          </p>
        </ScalingSection>

        {/* Images */}
        {images.map((url, idx) => (
          <ScalingSection key={idx}>
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={`Image ${idx + 1}`}
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>
          </ScalingSection>
        ))}
        {exhibition.acf.work_1 && (
          <ScalingSection>
            <div className="leading-tight max-w-sm text-center text-xl font-walkingOCR flex flex-col items-center justify-center">
              <h3 className="mb-1 ">Featuring the works:</h3>
              {Object.keys(exhibition.acf)
                .filter((key) => key.startsWith("work_") && exhibition.acf[key])
                .map((key) => {
                  const title = exhibition.acf[key] as string;
                  const matchedWork = allWorks.find(
                    (work) =>
                      work.title.rendered.trim().toLowerCase() ===
                      title.trim().toLowerCase()
                  );

                  return matchedWork ? (
                    <Link
                      key={matchedWork.id}
                      href={`/works/${matchedWork.slug}`}
                      className="hover:underline mb-1 text-xl"
                    >
                      {matchedWork.title.rendered}
                    </Link>
                  ) : (
                    <p key={key} className="opacity-60 mb-1 text-xl">
                      {title}
                    </p>
                  );
                })}
            </div>
          </ScalingSection>
        )}

        {/* Credits after images */}
        <ScalingSection>
          <p className="leading-tight  max-w-sm text-center text-xl font-walkingOCR">
            {exhibition.acf.credits}
          </p>
        </ScalingSection>
      </div>

      {/* Footer */}
      <ScrollIndicator />
    </div>
  );
}

export default function ExhibitionSlugPageClient() {
  return <ExhibitionSlugPageContent />;
}

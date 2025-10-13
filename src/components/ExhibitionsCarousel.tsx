"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Exhibition } from "../../lib/wordpress";
import { Carousel } from "./Carousel";
import LenisWrapper from "./LenisWrapper";
import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

interface ExhibitionItemProps {
  exhibition: Exhibition;
  index: number;
  totalExhibitions: number;
  scrollYProgress: MotionValue<number>;
}

function ExhibitionItem({
  exhibition,
  index,
  totalExhibitions,
  scrollYProgress,
}: ExhibitionItemProps) {
  const img = exhibition.acf?.image_1?.url || "";
  const isMobile = useIsMobile();

  const start = index / totalExhibitions;
  const end = (index + 1) / totalExhibitions;

  // Dynamiskt scale-beteende beroende på device
  const scale = useTransform(
    scrollYProgress,
    [start, (start + end) / 2, end],
    isMobile ? [0.95, 1, 0.95] : [0.85, 1, 0.85]
  );

  return (
    <motion.div
      style={{ scale }}
      className="px-0 lg:px-6  flex items-center justify-center"
    >
      <Link
        href={`/exhibitions/${exhibition.slug}`}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <motion.div className="relative w-full aspect-video max-w-full lg:max-w-7xl ">
          {img && (
            <Image
              src={img}
              alt={exhibition.title.rendered}
              fill
              className="object-contain object-center p-0 lg:p-12"
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function ExhibitionsCarousel({
  exhibitions,
  onExhibitionChange,
}: {
  exhibitions: Exhibition[];
  onExhibitionChange?: (index: number) => void;
}) {
  if (!exhibitions?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        No exhibitions found.
      </div>
    );
  }

  return (
    <LenisWrapper>
      <Carousel
        items={exhibitions}
        onIndexChange={onExhibitionChange}
        renderItem={(exh, i, scrollYProgress) => (
          <ExhibitionItem
            key={exh.id}
            exhibition={exh}
            index={i}
            totalExhibitions={exhibitions.length}
            scrollYProgress={scrollYProgress}
          />
        )}
      />
    </LenisWrapper>
  );
}

"use client";

import { Carousel } from "./Carousel";
import { Work } from "../../lib/wordpress";
import { useWorks } from "@/context/WorksContext";
import { motion, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "./Loader";
import LenisWrapper from "./LenisWrapper";

interface WorkCarouselItemProps {
  work: Work;
  index: number;
  onSelectWork: (index: number) => void;
}

function WorkCarouselItem({
  work,
  index,
  onSelectWork,
}: Pick<WorkCarouselItemProps, "work" | "index" | "onSelectWork">) {
  const img = work._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  return (
    <motion.div className="w-full h-screen flex items-center justify-center p-3 lg:p-64 rounded-full">
      <Link
        href={`/works/${work.slug}`}
        onClick={() => onSelectWork(index)}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <div className="relative w-full max-w-7xl aspect-video bg-black">
          {img && (
            <Image
              src={img}
              alt={work.title.rendered}
              fill
              className="object-contain object-center p-6 lg:p-24"
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
}

interface WorksCarouselProps {
  onSelectWork: (index: number) => void;
  initialIndex: number;
}

export function WorksCarousel({
  onSelectWork,
  initialIndex = 0,
}: WorksCarouselProps) {
  const { filteredWorks, loading, error } = useWorks();

  if (loading) return <Loader />;
  if (error) return <p>Error loading works: {error.message}</p>;
  if (!filteredWorks?.length) return <p>No works found.</p>;

  return (
    <LenisWrapper>
      <div className="relative w-full h-screen">
        <div className="relative z-10">
          <Carousel
            items={filteredWorks}
            initialIndex={initialIndex}
            onIndexChange={onSelectWork}
            renderItem={(work, i) => (
              <WorkCarouselItem
                key={work.id}
                work={work}
                index={i}
                onSelectWork={onSelectWork}
              />
            )}
          />
        </div>
      </div>
    </LenisWrapper>
  );
}

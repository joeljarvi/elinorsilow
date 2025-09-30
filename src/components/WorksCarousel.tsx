"use client";

import { Carousel } from "./Carousel";
import { Work } from "../../lib/wordpress";
import { useWorks } from "@/context/WorksContext";
import { motion, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader } from "./Loader";

interface WorkCarouselItemProps {
  work: Work;
  index: number;
  totalWorks: number;
  scrollYProgress: MotionValue<number>;
  onSelectWork: (index: number) => void;
}

function WorkCarouselItem({
  work,
  index,
  totalWorks,
  scrollYProgress,
  onSelectWork,
}: Omit<WorkCarouselItemProps, "onWorkChange">) {
  const start = index / totalWorks;
  const end = (index + 1) / totalWorks;

  const scale = useTransform(
    scrollYProgress,
    [start, (start + end) / 2, end],
    [0.97, 1, 0.97]
  );

  const img = work._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  return (
    <motion.div
      style={{ scale }}
      className="w-full h-screen flex items-center justify-center"
    >
      <Link
        href={`/works/${work.slug}`}
        onClick={() => onSelectWork(index)}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <div className="relative w-full max-w-5xl aspect-video bg-black">
          {img && (
            <Image
              src={img}
              alt={work.title.rendered}
              fill
              className="object-contain object-top p-6 lg:p-24"
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
}

interface WorksCarouselProps {
  onSelectWork: (index: number) => void;
  onWorkChange?: (index: number) => void;
  initialIndex: number;
}

export function WorksCarousel({
  onSelectWork,
  onWorkChange,
  initialIndex = 0,
}: WorksCarouselProps) {
  const { filteredWorks, loading, error } = useWorks();

  if (loading) return <Loader />;
  if (error) return <p>Error loading works: {error.message}</p>;
  if (!filteredWorks?.length) return <p>No works found.</p>;

  return (
    <Carousel
      items={filteredWorks}
      initialIndex={initialIndex}
      onIndexChange={onWorkChange}
      renderItem={(work, i, scrollYProgress) => (
        <WorkCarouselItem
          key={work.id}
          work={work}
          index={i}
          totalWorks={filteredWorks.length}
          scrollYProgress={scrollYProgress}
          onSelectWork={onSelectWork}
        />
      )}
    />
  );
}

"use client";

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Exhibition } from "../../lib/wordpress";
import { Carousel } from "./Carousel";

interface ExhibitionItemProps {
  exhibition: Exhibition;
}

function ExhibitionItem({ exhibition }: ExhibitionItemProps) {
  const img = exhibition.acf?.image_1?.url || "";

  return (
    <motion.div className="px-0 lg:px-6 pt-12 flex items-center justify-center">
      <Link
        href={`/exhibitions/${exhibition.slug}`}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-full lg:max-w-7xl aspect-video"
        >
          {img && (
            <Image
              src={img}
              alt={exhibition.title.rendered}
              fill
              className="object-contain object-top lg:object-center p-0 lg:p-12"
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
    <Carousel
      items={exhibitions}
      onIndexChange={onExhibitionChange}
      renderItem={(exh) => <ExhibitionItem key={exh.id} exhibition={exh} />}
    />
  );
}

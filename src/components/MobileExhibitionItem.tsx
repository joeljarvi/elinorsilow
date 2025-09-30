"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Exhibition } from "../../lib/wordpress";

interface MobileExhibitionItemProps {
  exhibition: Exhibition;
  index: number;
  totalExhibitions: number;
  scrollYProgress: any; // Adjust type as per useScroll return type
}

export function MobileExhibitionItem({
  exhibition,
  index,
  totalExhibitions,
  scrollYProgress,
}: MobileExhibitionItemProps) {
  const start = index / totalExhibitions;
  const end = (index + 1) / totalExhibitions;

  const img = exhibition.acf?.image_1?.url || "";

  return (
    <motion.div
      key={exhibition.id}
      className=" h-[100vh]  p-16 flex items-center justify-center"
    >
      <Link
        href={`/exhibitions/${exhibition.slug}`}
        className="w-full h-full flex flex-col items-center justify-center"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          {img && (
            <Image
              src={img}
              alt={exhibition.title.rendered}
              fill
              className="object-contain rounded"
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

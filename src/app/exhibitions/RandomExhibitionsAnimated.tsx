"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Exhibition } from "../../../lib/wordpress";

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
  exhibitionSlug: string;
  imageUrl: string;
}

export default function RandomExhibitionsAnimated({
  exhibitions,
  scale = 1,
}: {
  exhibitions: Exhibition[];
  scale?: number;
}) {
  const [positions, setPositions] = useState<Position[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Helper: find first valid image ---
  function getFirstImage(exhibition: Exhibition): string | null {
    for (let i = 1; i <= 10; i++) {
      const img = exhibition.acf?.[`image_${i}`];
      if (img && (img.url || img.source_url)) return img.url || img.source_url;
    }
    return null;
  }

  function overlapRatio(r1: Position, r2: Position) {
    const x_overlap = Math.max(
      0,
      Math.min(r1.left + r1.width, r2.left + r2.width) -
        Math.max(r1.left, r2.left)
    );
    const y_overlap = Math.max(
      0,
      Math.min(r1.top + r1.height, r2.top + r2.height) -
        Math.max(r1.top, r2.top)
    );
    const overlapArea = x_overlap * y_overlap;
    return overlapArea / (r2.width * r2.height);
  }

  function shuffleArray<T>(arr: T[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function placeExhibitions(container: HTMLElement) {
    if (!exhibitions || exhibitions.length === 0) return;

    const valid = exhibitions.filter((e) => getFirstImage(e));
    if (!valid.length) return;

    const selected = shuffleArray(valid).slice(0, 5);

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    const placed: Position[] = [];

    selected.forEach((exhibition) => {
      const imageUrl = getFirstImage(exhibition)!;

      const artW = containerWidth * 0.25 * scale;
      const artH = artW * 0.66;

      let left = 0,
        top = 0,
        attempts = 0;

      while (attempts < 100) {
        left = Math.random() * (containerWidth - artW);
        top = Math.random() * (containerHeight - artH);
        const candidate: Position = {
          top,
          left,
          width: artW,
          height: artH,
          exhibitionSlug: exhibition.slug,
          imageUrl,
        };
        const overlap = placed.some((r) => overlapRatio(r, candidate) > 0.1);
        if (!overlap) break;
        attempts++;
      }

      placed.push({
        top,
        left,
        width: artW,
        height: artH,
        exhibitionSlug: exhibition.slug,
        imageUrl,
      });
    });

    setPositions(placed);
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return; // ✅ guard against null

    placeExhibitions(container);

    const observer = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return; // ✅ safe null check
      placeExhibitions(el);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [exhibitions, scale]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[25vh] overflow-hidden"
    >
      {positions.map((p) => {
        const container = containerRef.current;
        const initialTop = container
          ? container.offsetHeight / 2 - p.height / 2
          : p.top;
        const initialLeft = container
          ? container.offsetWidth / 2 - p.width / 2
          : p.left;

        return (
          <motion.div
            key={p.exhibitionSlug}
            initial={{ opacity: 0, top: initialTop, left: initialLeft }}
            whileInView={{ opacity: 1, top: p.top, left: p.left }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              width: p.width,
              height: p.height,
            }}
          >
            <Link href={`/exhibitions/${p.exhibitionSlug}`}>
              <Image
                src={p.imageUrl}
                alt={p.exhibitionSlug}
                fill
                className="object-cover"
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

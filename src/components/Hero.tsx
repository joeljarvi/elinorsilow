"use client";

import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function Hero() {
  const { featuredWorks, allWorks } = useWorks();
  const { featuredExhibitions } = useExhibitions();

  const featuredWork = featuredWorks[0] ?? null;
  const featuredExhibition = featuredExhibitions[0] ?? null;
  const drawing = allWorks.find((w) => w.acf.category === "drawing") ?? null;

  const layout = useMemo(
    () => ({
      drawColW: rand(42, 55),  // drawing column width as % of total
      workFlex: rand(40, 62),  // flex-grow for work (exhibition gets the rest)
      drawOnLeft: Math.random() > 0.5,
    }),
    [],
  );

  const drawingCol = drawing?.image_url ? (
    <Link
      href="/works"
      className="relative overflow-hidden"
      style={{ width: `${layout.drawColW}%` }}
    >
      <Image
        src={drawing.image_url}
        alt={drawing.title.rendered}
        fill
        className="object-cover"
      />
    </Link>
  ) : null;

  const sideCol = (
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      {featuredWork?.image_url && (
        <Link
          href="/works"
          className="relative overflow-hidden"
          style={{ flex: layout.workFlex }}
        >
          <Image
            src={featuredWork.image_url}
            alt={featuredWork.title.rendered}
            fill
            className="object-cover"
          />
        </Link>
      )}
      {featuredExhibition?.acf.image_1?.url && (
        <Link
          href="/exhibitions"
          className="relative overflow-hidden"
          style={{ flex: 100 - layout.workFlex }}
        >
          <Image
            src={featuredExhibition.acf.image_1.url}
            alt={featuredExhibition.title.rendered}
            fill
            className="object-cover"
          />
        </Link>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Mobile: only drawing, at bottom */}
      <div className="flex lg:hidden h-[85vw] items-end justify-center px-8 pb-4">
        {drawing?.image_url && (
          <Link href="/works" className="relative block w-[80%] aspect-square">
            <Image
              src={drawing.image_url}
              alt={drawing.title.rendered}
              fill
              className="object-contain object-bottom"
            />
          </Link>
        )}
      </div>

      {/* Desktop: masonry 2-column layout, drawing side randomised */}
      <div className="hidden lg:flex w-full h-[82vh] gap-4 px-8">
        {layout.drawOnLeft ? (
          <>
            {drawingCol}
            {sideCol}
          </>
        ) : (
          <>
            {sideCol}
            {drawingCol}
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { Exhibition } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { Card, CardContent } from "@/components/ui/card";
import { RevealImage } from "@/components/RevealImage";

interface ExhibitionCardProps {
  ex: Exhibition;
  index: number;
  onOpen: () => void;
}

export default function ExhibitionCard({
  ex,
  index,
  onOpen,
}: ExhibitionCardProps) {
  const { setHoveredItemTitle } = useUI();
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Card
      ref={cardRef}
      className="scroll-mt-[9px] lg:scroll-mt-[44px] w-full lg:h-auto flex justify-start items-start shadow-none border-none bg-transparent gap-0 mx-0 relative"
      onMouseEnter={() => setHoveredItemTitle(ex.title.rendered)}
      onMouseLeave={() => setHoveredItemTitle(null)}
    >
      <CardContent className="w-full p-0 flex flex-col">
        {ex.acf.image_1 && (
          <button
            className="flex-1 min-h-0 min-w-0 cursor-pointer max-w-2xl"
            onClick={onOpen}
          >
            <RevealImage
              src={ex.acf.image_1.url}
              alt={ex.title.rendered}
              width={0}
              height={0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              revealIndex={index}
              className="w-full h-auto lg:h-full object-contain opacity-100 hover:opacity-30"
              style={{ objectPosition: "top-left" }}
            />
          </button>
        )}
      </CardContent>
    </Card>
  );
}

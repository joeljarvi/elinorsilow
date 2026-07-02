"use client";

import { Exhibition } from "../../lib/sanity";
import { Card } from "@/components/ui/card";
import { RevealImage } from "@/components/RevealImage";

interface ExhibitionCardProps {
  ex: Exhibition;
  index: number;
  onOpen: () => void;
  onTapOutside?: () => void;
  onCardClick?: () => void;
}

export default function ExhibitionCard({
  ex,
  index,
  onOpen,
  onTapOutside,
  onCardClick,
}: ExhibitionCardProps) {
  function handleCardClick() {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      onCardClick?.();
    } else {
      onTapOutside?.();
    }
  }

  const imageUrl = ex.acf.image_1?.url;

  return (
    <Card
      className="w-full h-dvh lg:h-full bg-transparent border-0 shadow-none rounded-none flex items-center justify-center scroll-mt-[64px] lg:scroll-mt-[45px]"
      onClick={handleCardClick}
    >
      <button
        className="w-full flex items-center justify-center cursor-zoom-in p-0 lg:p-16"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        aria-label={`Open ${ex.title.rendered}`}
      >
        {imageUrl && (
          <RevealImage
            src={imageUrl}
            alt={ex.title.rendered}
            width={0}
            height={0}
            sizes="(max-width: 1024px) 90vw, 60vw"
            revealIndex={index}
            className="w-auto h-auto max-h-[80dvh]  lg:max-h-full object-contain"
          />
        )}
      </button>
    </Card>
  );
}

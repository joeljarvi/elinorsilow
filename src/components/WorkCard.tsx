"use client";

import { Work } from "../../lib/sanity";
import { Card } from "@/components/ui/card";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";

interface WorkCardProps {
  work: Work;
  onOpen: () => void;
  onTapOutside?: () => void;
  onCardClick?: () => void;
  revealIndex?: number;
  imageClassName?: string;
}

export default function WorkCard({
  work,
  onOpen,
  onTapOutside,
  onCardClick,
  revealIndex = 0,
  imageClassName = "",
}: WorkCardProps) {
  function handleCardClick() {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      onCardClick?.();
    } else {
      onTapOutside?.();
    }
  }

  return (
    <Card
      className="w-full h-dvh lg:h-full bg-transparent border-0 shadow-none rounded-none flex items-center justify-center scroll-mt-[64px] lg:scroll-mt-[45px]"
      onClick={handleCardClick}
    >
      <button
        className="w-full flex items-center justify-center cursor-zoom-in"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        aria-label={`Open ${work.title.rendered}`}
      >
        {work.image_url && (
          <ProportionalWorkImage
            src={work.image_url}
            alt={work.title.rendered}
            revealIndex={revealIndex}
            noScaleY
            dimensions={work.acf.dimensions}
            objectPosition="center"
            className={`max-h-[80dvh] lg:max-h-full ${imageClassName}`}
          />
        )}
      </button>
    </Card>
  );
}

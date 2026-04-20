"use client";

import { RevealImage } from "./RevealImage";

interface Props {
  src: string;
  alt: string;
  dimensions: string;
  proportional?: boolean;
  fillWidth?: boolean;
  className?: string;
  revealIndex?: number;
  objectPosition?: string;
  noScaleY?: boolean;
}

/**
 * Parses dimension strings like "100 x 80 cm", "10x15cm", "100 × 80 cm"
 */
function parseDimensions(dims: string): { w: number; h: number } | null {
  const match = dims.match(/(\d+(?:[.,]\d+)?)\s*[x×X]\s*(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  return {
    w: parseFloat(match[1].replace(",", ".")),
    h: parseFloat(match[2].replace(",", ".")),
  };
}

// A REF_CM-wide artwork targets TARGET_VH of viewport width.
// Height is derived via aspect-ratio, so both dimensions scale together.
// When the resulting height exceeds the max-height passed via className,
// the browser reduces width proportionally — making taller works appear smaller.
const REF_CM = 150;
const TARGET_VH = 65;

export default function ProportionalWorkImage({
  src,
  alt,
  dimensions,
  proportional = true,
  fillWidth = false,
  className = "",
  revealIndex = 0,
  objectPosition = "top left",
  noScaleY = false,
}: Props) {
  const parsed = parseDimensions(dimensions);

  // Fill full width, use aspect ratio for height
  if (fillWidth && parsed) {
    const { w, h } = parsed;
    return (
      <div
        className={`w-full ${className}`}
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <div className="relative w-full h-full bg-transparent">
          <RevealImage
            src={src}
            alt={alt}
            fill
            revealIndex={revealIndex}
            noScaleY={noScaleY}
            className="object-contain"
            style={{ objectPosition }}
          />
        </div>
      </div>
    );
  }

  if (!proportional || !parsed) {
    return (
      <div className={`relative w-full aspect-[4/3] ${className}`}>
        <RevealImage
          src={src}
          alt={alt}
          fill
          revealIndex={revealIndex}
          className="object-contain"
          style={{ objectPosition }}
        />
      </div>
    );
  }

  const { w, h } = parsed;

  // Target width in vh: a REF_CM-wide work → TARGET_VH vw.
  // Using vh (not %) means the size is absolute relative to the viewport,
  // so aspect-ratio + maxHeight from className can clamp both axes together.
  const wVh = (w / REF_CM) * TARGET_VH;

  return (
    <div
      className={`relative ${className}`}
      style={{
        aspectRatio: `${w} / ${h}`,
        width: "100%",
        maxWidth: `min(${wVh}vh, 95%)`,
        minWidth: `min(20rem, 90%)`,
      }}
    >
      <div className="relative w-full h-full">
        <RevealImage
          src={src}
          alt={alt}
          fill
          revealIndex={revealIndex}
          noScaleY={noScaleY}
          className="object-contain"
          style={{ objectPosition }}
        />
      </div>
    </div>
  );
}

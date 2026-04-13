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

// 150 cm maps to 100% width, with a floor of 55% so tiny works are still visible
const REF_CM = 150;
const MIN_WIDTH = 0.55;
const MAX_WIDTH = 1.0;

function proportionalWidth(widthCm: number): number {
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, widthCm / REF_CM));
}

export default function ProportionalWorkImage({
  src,
  alt,
  dimensions,
  proportional = true,
  fillWidth = false,
  className = "",
  revealIndex = 0,
  objectPosition = "center",
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
  const widthFraction = proportionalWidth(w);
  const aspectRatio = w / h;

  return (
    <div
      className={`max-h-[85vh] ${className}`}
      style={{
        width: `${widthFraction * 100}%`,
        aspectRatio: `${aspectRatio}`,
      }}
    >
      <div className="relative w-full h-full">
        <RevealImage
          src={src}
          alt={alt}
          fill
          revealIndex={revealIndex}
          className="object-contain"
            style={{ objectPosition }}
        />
      </div>
    </div>
  );
}

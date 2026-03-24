"use client";

import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  dimensions: string;
  proportional?: boolean;
  className?: string;
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

// 200 cm maps to 100% width, with a floor of 20% so tiny works are still visible
const REF_CM = 200;
const MIN_WIDTH = 0.2;
const MAX_WIDTH = 1.0;

function proportionalWidth(widthCm: number): number {
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, widthCm / REF_CM));
}

export default function ProportionalWorkImage({
  src,
  alt,
  dimensions,
  proportional = true,
  className = "",
}: Props) {
  const parsed = parseDimensions(dimensions);

  if (!proportional || !parsed) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center lg:object-left-top"
        />
      </div>
    );
  }

  const { w, h } = parsed;
  const widthFraction = proportionalWidth(w);
  const aspectRatio = w / h;

  return (
    <div
      className={`max-h-[75vh] ${className}`}
      style={{
        width: `${widthFraction * 100}%`,
        aspectRatio: `${aspectRatio}`,
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-top lg:object-left-top"
        />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`;

export default function BlurredWorkBg({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Image
        src={imageUrl}
        alt=""
        fill
        sizes="100vw"
        className="object-cover blur-2xl"
        style={{ transform: "scale(3)", transformOrigin: "center" }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: "256px 256px" }}
      />
    </div>
  );
}

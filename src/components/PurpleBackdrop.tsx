"use client";

import { useState } from "react";
import Image from "next/image";

// Film grain: SVG fractal noise, desaturated, tiled over the image.
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

// Full-viewport fixed backdrop: a portrait purple image (es_purp_10011.jpg
// by default) turned 90°, with grain on top.
// The frame is viewport-sized with width/height swapped, then rotated about
// its center, so the landscape result covers the screen.
// `fadeIn`: the image starts at opacity-0 and fades in (over
// BACKDROP_FADE_MS) once it has loaded; `onLoad` fires at that moment.
export const BACKDROP_FADE_MS = 1000;

export default function PurpleBackdrop({
  src = "/es_purp_10011.jpg",
  className,
  fadeIn = false,
  onLoad,
}: {
  src?: string;
  className?: string;
  fadeIn?: boolean;
  onLoad?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const opacity = src.includes("es_purp_10011") ? "opacity-100" : "opacity-30";

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className ?? ""}`}
    >
      {/* es_purp_10011 shows at full strength; other images are faded. */}
      <div
        className={`absolute left-1/2 top-1/2 h-[100vw] w-[100vh] -translate-x-1/2 -translate-y-1/2 rotate-90 ${fadeIn ? `transition-opacity duration-[1000ms] ${loaded ? opacity : "opacity-0"}` : opacity}`}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          sizes="100vh"
          className="object-cover"
          onLoad={() => {
            setLoaded(true);
            onLoad?.();
          }}
        />
      </div>
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "200px 200px" }}
      />
    </div>
  );
}

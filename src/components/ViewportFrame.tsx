"use client";

import { useEffect, useState } from "react";

const D = 8; // diamond half-diagonal (diamond spans 2D × 2D)
const TARGET_GAP = 4; // approximate spacing between diamond centres

function diamond(cx: number, cy: number) {
  return `${cx},${cy - D} ${cx + D},${cy} ${cx},${cy + D} ${cx - D},${cy}`;
}

export default function ViewportFrame() {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    function update() {
      setDims({ w: window.innerWidth, h: window.innerHeight });
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!dims) return null;
  const { w, h } = dims;

  // Snap to integer count so diamonds are evenly spaced with no half-gaps at edges
  const countH = Math.round(w / TARGET_GAP);
  const countV = Math.round(h / TARGET_GAP);
  const gapH = w / countH;
  const gapV = h / countV;

  const hPoints = Array.from({ length: countH }, (_, i) => (i + 0.5) * gapH);
  const vPoints = Array.from({ length: countV }, (_, i) => (i + 0.5) * gapV);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {hPoints.map((x, i) => (
          <polygon key={`t${i}`} points={diamond(x, D)} fill="currentColor" />
        ))}
        {hPoints.map((x, i) => (
          <polygon
            key={`b${i}`}
            points={diamond(x, h - D)}
            fill="currentColor"
          />
        ))}
        {vPoints.map((y, i) => (
          <polygon key={`l${i}`} points={diamond(D, y)} fill="currentColor" />
        ))}
        {vPoints.map((y, i) => (
          <polygon
            key={`r${i}`}
            points={diamond(w - D, y)}
            fill="currentColor"
          />
        ))}
      </svg>
    </div>
  );
}

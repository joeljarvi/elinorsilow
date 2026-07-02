"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function useWheelTilt() {
  const target = useMotionValue(0);
  const rotateY = useSpring(target, { stiffness: 50, damping: 12, mass: 0.6 });
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function decay() {
      velocityRef.current *= 0.92;
      target.set(target.get() + velocityRef.current);
      if (Math.abs(velocityRef.current) > 0.05) {
        rafRef.current = requestAnimationFrame(decay);
      }
    }

    function onWheel(e: WheelEvent) {
      velocityRef.current += e.deltaY * 0.04;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(decay);
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return rotateY;
}

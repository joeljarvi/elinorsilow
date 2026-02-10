"use client";

import { ReactLenis } from "lenis/react";
import { useRef, useEffect } from "react";
import { cancelFrame, frame } from "framer-motion";
import type { LenisRef } from "lenis/react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  useEffect(() => {
    if (!lenisRef.current?.lenis) return;
    // expose to framer motion
    (window as any).__lenis = lenisRef.current.lenis;
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        smoothWheel: true,
        duration: 1.15,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      }}
      className="h-screen overflow-y-scroll scrollbar-hide pointer-events-auto"
    >
      {children}
    </ReactLenis>
  );
}

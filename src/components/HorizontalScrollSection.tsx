"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Horizontal x transform only on desktop
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const panels = Array.from({ length: 5 });

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${isDesktop ? "h-[300vh]" : "h-auto"}`}
    >
      <div className={`sticky top-0 h-screen w-full overflow-hidden`}>
        <motion.div
          ref={trackRef}
          style={isDesktop ? { x } : undefined}
          className={`flex w-full ${isDesktop ? "flex-row" : "flex-col"}`}
        >
          {panels.map((_, i) => (
            <div
              key={i}
              className={`w-full h-screen flex items-center justify-center text-6xl font-bold ${
                isDesktop ? "border-r" : "border-b"
              }`}
            >
              Panel {i + 1}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

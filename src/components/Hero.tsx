"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useWorks } from "@/context/WorksContext";

export default function Hero() {
  const { allWorks } = useWorks();
  const [bgIndex, setBgIndex] = useState(0);

  const worksWithImages = allWorks.filter((w) => w.image_url).slice(0, 10);

  useEffect(() => {
    if (worksWithImages.length <= 1) return;
    const interval = setInterval(
      () => setBgIndex((i) => (i + 1) % worksWithImages.length),
      3000,
    );
    return () => clearInterval(interval);
  }, [worksWithImages.length]);

  return (
    <div className="relative flex flex-col h-full min-h-screen lg:min-h-0 overflow-hidden">
      {/* Blurred crossfade background */}
      {worksWithImages.map((work, i) => (
        <div
          key={work.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIndex ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={work.image_url!}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-xl scale-110"
            priority={i === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-background/50" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-[18px] lg:px-[32px] text-center gap-y-1">
        <p className="text-[14px] lg:text-[18px] max-w-xl no-hide-text font-timesNewRoman">
          <span className="font-medium">Elinor Silow</span> (b. 1993, Malmö,
          Sweden) is a Stockholm-based artist working with painting, sculpture,
          and textile. Her work explores raw emotion through material, gesture,
          and form. For collaborations or inquiries:
        </p>
        <Link
          href="mailto:elinor.silow@gmail.com"
          className="text-blue-600 font-timesNewRomanWide font-bold"
        >
          (elinor.silow@gmail.com)
        </Link>
        .
      </div>
    </div>
  );
}

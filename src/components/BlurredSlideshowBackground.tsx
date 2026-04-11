"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Props = {
  urls: string[];
  interval?: number;
  overlay?: boolean;
  bottomFade?: boolean;
};

export default function BlurredSlideshowBackground({
  urls,
  interval = 3000,
  overlay = true,
  bottomFade = true,
}: Props) {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    if (urls.length <= 1) return;
    setBgIndex(0);
    const timer = setInterval(
      () => setBgIndex((i) => (i + 1) % urls.length),
      interval,
    );
    return () => clearInterval(timer);
  }, [urls, interval]);

  return (
    <>
      {urls.map((url, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIndex ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={url}
            alt=""
            fill
            sizes="100vw"
            className="object-cover blur-xl lg:blur-3xl object-left-top"
            priority={i === 0}
          />
        </div>
      ))}
      {overlay && <div className="absolute inset-0 bg-background/40" />}
      {bottomFade && (
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      )}
    </>
  );
}

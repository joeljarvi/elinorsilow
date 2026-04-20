"use client";

import Image from "next/image";

export default function BlurredWorkBg({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Image
        src={imageUrl}
        alt=""
        fill
        sizes="100vw"
        className="object-cover blur-2xl hue-rotate-45 "
        style={{ transform: "scale(4)", transformOrigin: "center" }}
      />
    </div>
  );
}

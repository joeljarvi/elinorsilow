"use client";

import Image from "next/image";

export default function UnderConstruction() {
  return (
    <div className="flex items-center justify-center w-full h-screen p-8 gap-8">
      <Image
        src="/nav_loading.svg"
        alt="Sleeping head"
        width={98}
        height={98}
      />
      <p className="text-lg font-directorLight">
        This page is under construction. Please check back later.
      </p>
    </div>
  );
}

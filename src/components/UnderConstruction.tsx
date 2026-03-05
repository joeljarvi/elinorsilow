"use client";

import Image from "next/image";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-center w-full h-screen p-8 gap-0 lg:gap-8">
      <Image
        src="/nav_loading.svg"
        alt="Sleeping head"
        width={98}
        height={98}
      />
      <p className="text-2xl font-bookish">
        This page is under construction. Please check back later.
      </p>
    </div>
  );
}

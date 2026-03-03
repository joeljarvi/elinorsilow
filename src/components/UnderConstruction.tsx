"use client";

import Image from "next/image";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-directorLight">Under construction</h1>
        <p className="text-lg font-directorLight">
          This page is under construction. Please check back later.
        </p>
        <Image
          src="/nav_loading.svg"
          alt="Sleeping head"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}

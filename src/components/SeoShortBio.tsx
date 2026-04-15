"use client";

import { useInfo } from "@/context/InfoContext";

const FALLBACK = "Elinor Silow — Stockholm-based painter and mixed media artist.";

export default function SeoShortBio() {
  const { shortBio } = useInfo();
  return (
    <span className="sr-only" aria-hidden="false">
      {shortBio || FALLBACK}
    </span>
  );
}

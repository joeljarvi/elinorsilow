"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function UnderConstruction() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <button
        onClick={() => setOpen(false)}
        className="fixed top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <div className="flex flex-col items-center gap-6 max-w-md w-full mx-4">
        <Image
          src="/nav_loading.svg"
          alt="Sleeping head"
          width={98}
          height={98}
        />
        <p className="text-center text-lg font-bookish">
          This page is under construction. Please check back later.
        </p>
      </div>
    </div>
  );
}

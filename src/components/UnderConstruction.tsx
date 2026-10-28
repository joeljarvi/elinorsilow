"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// "Under construction" — a full-screen purple-100 panel over the whole site
// (z-90, above ESNav's z-80) with the notice in the center and a × top
// right that closes it (until the next page load).
export default function UnderConstruction() {
  const [open, setOpen] = useState(true);
  // Not over Sanity Studio.
  const pathname = usePathname();
  if (!open || pathname.startsWith("/studio")) return null;
  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-purple-100 text-primary font-gtAmericaCondensed uppercase text-sm">
      <p className="max-w-sm">
        this website is under construction. <br /> get in touch with elinor
        silow at{" "}
        <Link
          className="text-primary/50 hover:text-primary cursor-pointer"
          href="instagram.com/elinorsilow"
        >
          instagram
        </Link>{" "}
        or{" "}
        <Link
          className="text-primary/50 hover:text-primary cursor-pointer"
          href="mailto:elinorsilow@gmail.com"
        >
          email
        </Link>
      </p>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close"
        className="absolute top-0 right-0 h-9 px-3 lg:px-4 flex items-center cursor-pointer"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

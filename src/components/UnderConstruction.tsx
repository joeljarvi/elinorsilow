"use client";

import { useState } from "react";
import { useUI, REVEAL_MS, NAV_AFTER_MS } from "@/context/UIContext";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// "Under construction" — a full-screen purple-100 panel over the whole site
// (z-90, above ESNav's z-80) with the notice in the center and a × top
// right that closes it (until the next page load). Closing it starts the
// site's reveal (siteReveal): the list rows, then the featured work, then
// the nav.
export default function UnderConstruction() {
  const [open, setOpen] = useState(true);
  const { setSiteReveal } = useUI();
  const close = () => {
    setOpen(false);
    setSiteReveal("rows");
    setTimeout(() => setSiteReveal("done"), REVEAL_MS);
    setTimeout(() => setSiteReveal("nav"), REVEAL_MS + NAV_AFTER_MS);
  };
  // Not over Sanity Studio.
  const pathname = usePathname();
  if (!open || pathname.startsWith("/studio")) return null;
  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-purple-100 text-primary font-gtAmericaCondensed uppercase text-sm">
      <p className="max-w-xs lg:max-w-sm">
        this website is under construction. <br /> get in touch with elinor
        silow at{" "}
        <Link
          className="text-primary/50 hover:text-primary cursor-pointer"
          href="https://instagram.com/elinorsilow"
        >
          instagram
        </Link>{" "}
        or{" "}
        <Link
          className="text-primary/50 hover:text-primary cursor-pointer"
          href="mailto:elinor.silow@gmail.com"
        >
          email
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute top-0 right-0 h-9 px-3 lg:px-4 flex items-center cursor-pointer"
      >
        <X className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

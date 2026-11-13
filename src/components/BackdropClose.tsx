"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

// A page that closes like a modal: clicking anywhere but its image (or a
// link) goes back — to where the visitor came from on the site, else to
// `fallback` (as the nav's Back).
export default function BackdropClose({
  fallback,
  className,
  children,
}: {
  fallback: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <main
      className={className}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("img, a, button")) return;
        if (document.referrer.startsWith(window.location.origin)) router.back();
        else router.push(fallback);
      }}
    >
      {children}
    </main>
  );
}

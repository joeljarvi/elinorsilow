"use client";

import { useEffect, useState } from "react";

// "Back to top": scrolls the page smoothly to the top. Shown only once the
// page is scrolled to the bottom (within a few pixels).
export default function ScrollToTop({ className = "" }: { className?: string }) {
  const [atBottom, setAtBottom] = useState(false);
  useEffect(() => {
    const check = () =>
      setAtBottom(
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 8,
      );
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  if (!atBottom) return null;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`cursor-pointer ${className}`}
    >
      Back to top
    </button>
  );
}

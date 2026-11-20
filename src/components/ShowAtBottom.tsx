"use client";

import { useEffect, useState, type ReactNode } from "react";

// Its children, shown only once the page is scrolled to the bottom (within
// a few pixels).
export default function ShowAtBottom({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
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
  return <div className={className}>{children}</div>;
}

"use client";

import { useEffect, useState } from "react";

const TEXTS = [
  "NEWS: Currently on display at Restaurant Nobis.",
  "Thinking about love and loving it...",
  "Stockholm",
];

export function NavTypewriter() {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  const current = TEXTS[textIndex];

  useEffect(() => {
    if (paused) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < current.length) {
            setDisplayText(current.slice(0, charIndex + 1));
            setCharIndex((i) => i + 1);
          } else {
            setPaused(true);
            setTimeout(() => {
              setPaused(false);
              setIsDeleting(true);
            }, 1800);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(current.slice(0, charIndex - 1));
            setCharIndex((i) => i - 1);
          } else {
            setIsDeleting(false);
            setTextIndex((i) => (i + 1) % TEXTS.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, current, paused]);

  return (
    <span className="hidden lg:inline text-sm font-bookish text-muted-foreground pl-1 select-none">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

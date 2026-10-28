"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// A title spread across the box it's placed in (className — e.g. a grid
// cell over an image), on top of what's under it (it lets clicks through). It fades in
// after `delay` seconds as plain centered text, then spreads out: the
// width is split into equal columns — one per word, with an empty column
// between each word — and each word's letters are spaced out across its
// column (justify-between). A single word fills the whole width. The
// letters move into place (layout animation). Mobile: plain left-aligned
// text (no centering, no spreading).
export default function ESTitle({
  title,
  delay = 0,
  className = "",
}: {
  title: string;
  delay?: number;
  // Placement; the title fills that box's width.
  className?: string;
}) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  // word, empty, word, empty, … word
  const columns = Math.max(words.length * 2 - 1, 1);
  // Centered at first; spread once it has faded in.
  const [spread, setSpread] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSpread(true), (delay + 0.4) * 1000);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`relative hidden z-10 pointer-events-none ${className}`}
    >
      <div
        className={`w-full text-sm leading-none font-gtAmericaCondensed uppercase text-primary flex justify-start gap-x-[0.3em] ${spread ? "lg:grid lg:gap-x-0" : "lg:justify-center"}`}
        style={
          spread
            ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
            : undefined
        }
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            layout
            transition={{ duration: 0.8, ease: EASE }}
            className={`flex ${spread ? "lg:justify-between" : ""}`}
            // Spread: words in columns 1, 3, 5…; the columns between stay
            // empty.
            style={spread ? { gridColumn: i * 2 + 1 } : undefined}
          >
            {[...word].map((letter, j) => (
              <motion.span
                key={j}
                layout="position"
                transition={{ duration: 0.8, ease: EASE }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

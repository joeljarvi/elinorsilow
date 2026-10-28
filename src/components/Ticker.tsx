"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

// Pixels per second the text moves, and the space between its copies.
const SPEED = 40;
const GAP = 32;

// One line of text that, when it doesn't fit its box, scrolls sideways as
// a ticker instead of being cut off: the text, a gap, the text again,
// moving left in a seamless loop (the es-ticker keyframes, globals.css).
// Fits: plain text, no motion. Re-measures when the box or text resizes.
export default function Ticker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const box = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  // The text's width when it overflows the box, else 0.
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!box.current || !text.current) return;
      const w = text.current.offsetWidth;
      setWidth(w > box.current.clientWidth + 1 ? w : 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (box.current) observer.observe(box.current);
    if (text.current) observer.observe(text.current);
    return () => observer.disconnect();
  }, [children]);

  const shift = width + GAP;
  return (
    <span
      ref={box}
      className={`block min-w-0 overflow-hidden whitespace-nowrap ${className}`}
    >
      <span
        className="inline-flex"
        style={
          width
            ? ({
                animation: `es-ticker ${shift / SPEED}s linear infinite`,
                "--ticker-shift": `-${shift}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <span ref={text} className="inline-block">
          {children}
        </span>
        {width > 0 && (
          <span aria-hidden className="inline-block" style={{ paddingLeft: GAP }}>
            {children}
          </span>
        )}
      </span>
    </span>
  );
}

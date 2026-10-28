"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const O_IMAGE = "/O/ogubbe_frilagd_new.png";

// A static page is often already `complete` by the time React hydrates, so the
// spin would end before it ever painted. Hold it for at least this long.
const MIN_SPIN_MS = 700;

/**
 * True until the document has finished loading. Starts true on both server and
 * client so hydration matches, then flips once `load` fires.
 */
function usePageLoading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const done = () => {
      timer = setTimeout(() => setLoading(false), MIN_SPIN_MS);
    };

    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", done);
    };
  }, []);

  return loading;
}

/**
 * Renders text with every "o" swapped for the ogubbe PNG. The gubbe spins while
 * the page is loading and settles once it is done.
 */
export function OGubbeText({
  text,
  className,
  oClassName,
  spinning,
}: {
  text: string;
  className?: string;
  /** Sizing for the gubbe itself — override to scale it against the text. */
  oClassName?: string;
  /** Overrides the page-load state — pass true to keep it spinning. */
  spinning?: boolean;
}) {
  const loading = usePageLoading();
  const spin = spinning ?? loading;

  // Capturing split: the "o" separators stay in the array alongside the runs
  // of ordinary letters around them.
  const parts = useMemo(() => String(text ?? "").split(/([oO])/), [text]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      {parts.map((part, i) =>
        part === "o" || part === "O" ? (
          // Explicit width/height rather than `fill`: fill needs a sized,
          // positioned parent and collapses to nothing when that doesn't
          // resolve. The intrinsic size here is only an aspect-ratio hint —
          // the em classes below do the real sizing.
          //
          // 2.4em, not 1em: the artwork is a thin pencil line sitting inside a
          // lot of empty canvas, so at the height of a lowercase o its strokes
          // fall below a pixel and read as blank. The negative margin pulls the
          // extra width back so it still sits like a letter.
          <Image
            key={i}
            src={O_IMAGE}
            alt={part}
            width={128}
            height={128}
            className={cn(
              "inline-block shrink-0 object-contain",
              oClassName ?? "h-[1.5em] w-[1.5em] -mx-[0.5em]",
              spin && "animate-spin",
            )}
          />
        ) : (
          // whitespace-pre so the spaces between words survive the flex row.
          <span key={i} className="whitespace-pre tracking-widest">
            {part}
          </span>
        ),
      )}
    </span>
  );
}

export default OGubbeText;

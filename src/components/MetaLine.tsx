import type { ReactNode } from "react";

// Metadata parts stacked one per line (empty parts dropped). `children` are
// appended after the parts.
export default function MetaLine({
  parts,
  className = "",
  children,
}: {
  parts: (string | number | null | undefined)[];
  className?: string;
  children?: ReactNode;
}) {
  const shown = parts.filter((p) => p !== null && p !== undefined && p !== "");
  if (shown.length === 0 && !children) return null;
  return (
    <span
      className={`flex flex-col gap-x-1 font-gtAlpina font-normal text-sm tracking-wide leading-snug text-left ${className}`}
    >
      {shown.map((p, i) => (
        // whitespace-normal: long parts (e.g. a work's materials) wrap even
        // inside a nowrap ancestor.
        <span key={i} className="whitespace-normal">
          {p}
        </span>
      ))}
      {children}
    </span>
  );
}

"use client";

import { ReactNode, useEffect, useRef } from "react";

interface DynamicGridProps {
  items: { id: string | number; node: ReactNode }[];
  gridCols: number;
  gridRows: number;
  className?: string;
  /** Called with the index of the topmost visible item whenever it changes. */
  onTopVisibleChange?: (index: number) => void;
}

export default function DynamicGrid({
  items,
  gridCols,
  gridRows,
  className = "",
  onTopVisibleChange,
}: DynamicGridProps) {
  // Separate ref arrays for mobile and desktop layouts.
  // Each layout hides the other via Tailwind (lg:hidden / hidden lg:grid),
  // so display:none elements never trigger IntersectionObserver — meaning
  // whichever layout is visible will correctly report its topmost item.
  const mobileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const visibleSet = useRef<Set<number>>(new Set());
  const callbackRef = useRef(onTopVisibleChange);
  callbackRef.current = onTopVisibleChange;

  useEffect(() => {
    if (!onTopVisibleChange) return;

    visibleSet.current.clear();
    const observers: IntersectionObserver[] = [];

    const observe = (el: HTMLDivElement | null, i: number) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSet.current.add(i);
          } else {
            visibleSet.current.delete(i);
          }
          if (visibleSet.current.size > 0) {
            callbackRef.current?.(Math.min(...visibleSet.current));
          }
        },
        { threshold: 0.1 },
      );
      obs.observe(el);
      observers.push(obs);
    };

    mobileRefs.current.forEach((el, i) => observe(el, i));
    desktopRefs.current.forEach((el, i) => observe(el, i));

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, onTopVisibleChange != null]);

  const colStyle = {
    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
  };
  const rowHeight = `${100 / gridRows}dvh`;

  return (
    <div
      className={`w-full overflow-y-auto px-[18px] lg:px-[32px] ${className}`}
      style={{ minHeight: "100dvh" }}
    >
      {/* Mobile: single column */}
      <div className="lg:hidden flex flex-col gap-y-[32px] py-[18px]">
        {items.map(({ id, node }, i) => (
          <div
            key={id}
            ref={(el) => {
              mobileRefs.current[i] = el;
            }}
            className="w-full h-[calc(100dvh-64px)] flex flex-col items-center justify-center"
          >
            {node}
          </div>
        ))}
      </div>

      {/* Desktop: configurable grid */}
      <div
        className="hidden lg:grid gap-x-[18px] gap-y-[18px] py-[18px]"
        style={colStyle}
      >
        {items.map(({ id, node }, i) => (
          <div
            key={id}
            ref={(el) => {
              desktopRefs.current[i] = el;
            }}
            className="flex items-center justify-center"
            style={{ minHeight: rowHeight }}
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}

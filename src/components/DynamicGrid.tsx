"use client";

import { ReactNode, useEffect, useRef } from "react";
import { motion, LayoutGroup } from "framer-motion";

interface DynamicGridProps<T extends { id: string | number }> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  gridCols: number;
  gridRows: number;
  className?: string;
  /** Called with the index of the topmost visible item whenever it changes. */
  onTopVisibleChange?: (index: number) => void;
}

export default function DynamicGrid<T extends { id: string | number }>({
  items,
  renderItem,
  gridCols,
  gridRows,
  className = "",
  onTopVisibleChange,
}: DynamicGridProps<T>) {
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
      className={`w-full overflow-y-auto pl-[9px]  pt-[42px] pr-[9px] lg:px-[9px] lg:pt-[44px]   ${className}`}
      style={{ minHeight: "100dvh" }}
    >
      {/* Mobile: single column */}
      <div className="lg:hidden flex flex-col justify-start items-start gap-y-[9px] ">
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              mobileRefs.current[i] = el;
            }}
            className="w-full min-h-dvh flex flex-col items-start justify-start"
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {/* Desktop: configurable grid */}
      <LayoutGroup>
        <div
          className="hidden lg:grid gap-x-[9px] gap-y-[9px] "
          style={colStyle}
        >
          {items.map((item, i) => (
            <motion.div
              layout
              key={item.id}
              ref={(el) => {
                desktopRefs.current[i] = el;
              }}
              className="flex items-start justify-start"
              style={{ height: rowHeight }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            >
              {renderItem(item, i)}
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}

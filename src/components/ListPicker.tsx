"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// A straight-list version of an option wheel: the page doesn't scroll —
// the list moves under a fixed line instead, with the same tactile feel:
// - a position that eases toward its target (frame-rate independent
//   exponential smoothing), snapping to whole items when input stops;
// - mouse wheel: one item per notch; touchpad: continuous, then snaps;
// - drag (once moved > 4px, so clicks still reach the rows);
// - ↑/↓ keys;
// - a row's scrollable area (data-picker-scroll) scrolls natively under the
//   wheel / drag while it can, before the list moves;
// - rows fade and blur with their distance from the current position.
// The selected row (the one at the line) is reported via onChange; the
// parent opens it. Rows can differ in height (the open one is tall), so the
// list offset is interpolated between the measured tops of the two rows
// around the current position; a row with an anchor (data-picker-anchor) is
// placed so the anchor sits in the vertical center of the viewport.

type Api = {
  // Ref for row i, so the picker can measure and style it.
  rowRef: (i: number) => (el: HTMLElement | null) => void;
  // Move to row i (e.g. on click).
  goTo: (i: number) => void;
};

const SMOOTHING_MS = 200; // easing time constant
const STEP_PX = 40; // wheel / drag distance per item
const FADE = 0.3; // opacity lost per item of distance
const MIN_OPACITY = 0.12;
const BLUR = 0.8; // px of blur per item of distance
// Rows keep resizing for a moment after the selection changes (the open
// row's drop-down animation), so keep laying out for this long after it.
const LAYOUT_SETTLE_MS = 1300;

export default function ListPicker({
  count,
  onChange,
  onNearEnd,
  line = 0.15,
  className = "",
  children,
}: {
  count: number;
  onChange: (index: number) => void;
  // Called when the selection gets close to the last row (load more).
  onNearEnd?: () => void;
  // Where the selected row's top sits, as a fraction of the screen height.
  line?: number;
  className?: string;
  children: (api: Api) => ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLElement | null)[]>([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const selectedRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const busyUntilRef = useRef(0);
  const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragRef = useRef<{ y: number; start: number; id: number } | null>(
    null,
  );
  const dragMovedRef = useRef(false);
  const cfgRef = useRef({ count, line, onChange, onNearEnd });
  cfgRef.current = { count, line, onChange, onNearEnd };

  const layout = useCallback((pos: number) => {
    const rows = rowsRef.current;
    const inner = innerRef.current;
    if (!inner) return;
    const n = cfgRef.current.count;
    const i0 = Math.max(0, Math.min(n - 1, Math.floor(pos)));
    const f = Math.max(0, Math.min(1, pos - i0));
    const top0 = rows[i0]?.offsetTop ?? 0;
    const top1 = rows[i0 + 1]?.offsetTop ?? top0;
    const offset = top0 + (top1 - top0) * f;
    // Where a row's top goes: every row is centered vertically in the
    // viewport — a row that is (or contains) an anchor (data-picker-anchor:
    // the open row) by its anchor (from its top if it's taller than the
    // screen), other rows by their own box.
    const vh = window.innerHeight;
    const base = vh * cfgRef.current.line;
    const lineFor = (el: HTMLElement | null | undefined) => {
      if (!el) return base;
      const anchor = el.hasAttribute("data-picker-anchor")
        ? el
        : el.querySelector<HTMLElement>("[data-picker-anchor]");
      // No anchor: center the row itself in the viewport.
      if (!anchor) return vh / 2 - el.offsetHeight / 2;
      const rowBox = el.getBoundingClientRect();
      const box = anchor.getBoundingClientRect();
      // Anchor's top within the row (unaffected by the list's transform,
      // which moves both boxes alike).
      const anchorTop = box.top - rowBox.top;
      // Too tall to center: show it from its top, just below the edge.
      if (box.height >= vh) return 16 - anchorTop;
      return vh / 2 - (anchorTop + box.height / 2);
    };
    const line0 = lineFor(rows[i0]);
    const line1 = rows[i0 + 1] ? lineFor(rows[i0 + 1]) : line0;
    const lineY = line0 + (line1 - line0) * f;
    inner.style.transform = `translate3d(0, ${(lineY - offset).toFixed(2)}px, 0)`;
    for (let i = 0; i < n; i++) {
      const el = rows[i];
      if (!el) continue;
      const dist = Math.abs(i - pos);
      el.style.opacity = String(Math.max(MIN_OPACITY, 1 - dist * FADE));
      el.style.filter =
        dist > 0.01 ? `blur(${(Math.min(dist, 4) * BLUR).toFixed(2)}px)` : "";
    }
  }, []);

  const frame = useCallback(
    (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.05);
      lastRef.current = now;
      const k = 1 - Math.exp(-dt / (SMOOTHING_MS / 1000));
      const target = targetRef.current;
      let next = posRef.current + (target - posRef.current) * k;
      const settled =
        Math.abs(target - next) < 0.001 && now > busyUntilRef.current;
      if (Math.abs(target - next) < 0.001) next = target;
      posRef.current = next;
      layout(next);
      rafRef.current = settled ? null : requestAnimationFrame(frame);
    },
    [layout],
  );

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(frame);
  }, [frame]);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const { count: n, onChange: change, onNearEnd: nearEnd } =
        cfgRef.current;
      let v = Math.min(Math.max(value, 0), Math.max(n - 1, 0));
      if (snap) v = Math.round(v);
      targetRef.current = v;
      const idx = Math.round(v);
      if (idx !== selectedRef.current) {
        selectedRef.current = idx;
        busyUntilRef.current = performance.now() + LAYOUT_SETTLE_MS;
        change(idx);
        if (idx >= n - 4) nearEnd?.();
      }
      startLoop();
    },
    [startLoop],
  );

  // Mouse wheel / touchpad (non-passive, so the page itself never scrolls).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Inside a scrollable area of a row (data-picker-scroll) that can
      // still scroll this way: let it scroll natively instead.
      const area = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-picker-scroll]",
      );
      if (
        area &&
        ((e.deltaY > 0 &&
          area.scrollTop + area.clientHeight < area.scrollHeight - 1) ||
          (e.deltaY < 0 && area.scrollTop > 0))
      ) {
        return;
      }
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      // At most one item per event: a notchy wheel moves exactly one item
      // per click, a touchpad still glides.
      const step = Math.max(-1, Math.min(1, delta / STEP_PX));
      applyTarget(targetRef.current + step, false);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(
        () => applyTarget(targetRef.current, true),
        140,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  // ↑/↓ keys anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, [contenteditable=true]")) return;
      let d = 0;
      if (e.key === "ArrowDown") d = 1;
      else if (e.key === "ArrowUp") d = -1;
      if (!d) return;
      e.preventDefault();
      applyTarget(Math.round(targetRef.current) + d, true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [applyTarget]);

  // Re-lay out whenever the rows change size — a row opening or closing,
  // its image switching S / M / L, images loading — so the view stays on
  // the open row.
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const observer = new ResizeObserver(() => {
      busyUntilRef.current = performance.now() + LAYOUT_SETTLE_MS;
      startLoop();
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, [startLoop]);

  // Re-lay out on resize and whenever the rows change (count, content).
  useEffect(() => {
    busyUntilRef.current = performance.now() + LAYOUT_SETTLE_MS;
    startLoop();
    const onResize = () => {
      busyUntilRef.current = performance.now() + LAYOUT_SETTLE_MS;
      startLoop();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [count, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const api: Api = {
    rowRef: (i) => (el) => {
      rowsRef.current[i] = el;
    },
    goTo: (i) => {
      // A click right after a drag is the end of the drag, not a pick.
      if (dragMovedRef.current) return;
      applyTarget(i, true);
    },
  };

  return (
    <div
      ref={rootRef}
      className={`fixed inset-0 overflow-hidden touch-none select-none ${className}`}
      onPointerDown={(e) => {
        // Dragging inside a scrollable area scrolls it, not the list.
        if ((e.target as HTMLElement).closest("[data-picker-scroll]")) return;
        dragRef.current = {
          y: e.clientY,
          start: targetRef.current,
          id: e.pointerId,
        };
        dragMovedRef.current = false;
      }}
      onPointerMove={(e) => {
        const drag = dragRef.current;
        if (!drag) return;
        const dy = e.clientY - drag.y;
        if (!dragMovedRef.current && Math.abs(dy) > 4) {
          dragMovedRef.current = true;
          // Capture only once it's really a drag, so clicks still work.
          rootRef.current?.setPointerCapture(drag.id);
        }
        if (dragMovedRef.current) {
          applyTarget(drag.start - dy / STEP_PX, false);
        }
      }}
      onPointerUp={() => {
        if (!dragRef.current) return;
        dragRef.current = null;
        if (dragMovedRef.current) applyTarget(targetRef.current, true);
        // Let this pointer's click see dragMoved, then reset.
        setTimeout(() => (dragMovedRef.current = false), 0);
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        applyTarget(targetRef.current, true);
      }}
    >
      <div ref={innerRef} className="will-change-transform">
        {children(api)}
      </div>
    </div>
  );
}

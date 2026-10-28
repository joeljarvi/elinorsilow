"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import TrumpetNav from "./TrumpetNav";

// Idle time before the screen saver shows, and how fast the trumpet plays.
const IDLE_MS = 10_000;
const FRAME_MS = 1000;
// Frames 1 → 2 → 3 → 2 → 1 → …
const PINGPONG = [0, 1, 2, 1];

// Screen saver: after IDLE_MS without the mouse moving (or any other
// input), the cursor is hidden and one trumpet (TrumpetNav, frames 1–3, a
// frame a second, h-18) appears, scaling up from its center, where the mouse
// cursor last was (desktop), or at the bottom right (mobile, or before the
// mouse has moved: bottom-6 right-6). text-primary, above everything
// (z-100); any input hides it.
export default function ESScreenSaver() {
  const pathname = usePathname();
  const [idle, setIdle] = useState(false);
  const [tick, setTick] = useState(0);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  // The cursor's last position (null until the mouse has moved).
  const cursor = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const sleep = () => setIdle(true);
    let timer = setTimeout(sleep, IDLE_MS);
    const wake = (e: Event) => {
      if (e instanceof MouseEvent)
        cursor.current = { x: e.clientX, y: e.clientY };
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(sleep, IDLE_MS);
    };
    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "wheel",
      "touchstart",
    ] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
    };
  }, []);

  // Animate only while shown.
  useEffect(() => {
    if (!idle) return;
    const t = setInterval(() => setTick((n) => n + 1), FRAME_MS);
    return () => clearInterval(t);
  }, [idle]);

  // Not over Sanity Studio.
  if (!idle || pathname.startsWith("/studio")) return null;

  const at = desktop ? cursor.current : null;
  return (
    <div
      aria-hidden
      className={`fixed z-100 pointer-events-none text-primary ${at ? "-translate-x-1/2 -translate-y-1/2" : "bottom-6 right-6"}`}
      style={at ? { left: at.x, top: at.y } : undefined}
    >
      {/* No cursor while it shows. */}
      <style>{"*{cursor:none!important}"}</style>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <TrumpetNav
          frame={PINGPONG[tick % PINGPONG.length]}
          className="h-18 w-auto"
        />
      </motion.div>
    </div>
  );
}

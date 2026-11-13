"use client";

import { useEffect, type RefObject } from "react";

// Keeps a CSS variable on <html> (e.g. --nav-h) set to an element's height
// in px while it's mounted (0px once it's gone), so other parts of the page
// can size themselves around it: calc(100dvh - var(--nav-h)).
export function useCssHeightVar(
  ref: RefObject<HTMLElement | null>,
  name: string,
  active = true,
) {
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!active || !el) {
      root.style.setProperty(name, "0px");
      return;
    }
    const sync = () =>
      root.style.setProperty(name, `${el.getBoundingClientRect().height}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty(name, "0px");
    };
  }, [ref, name, active]);
}

"use client";

import { useEffect, useState } from "react";

// True only for components mounted with the site's first page load (not
// after a client-side navigation) — for the load reveal, so it doesn't
// replay (e.g. when zooming back out of a work to the feed).
let loaded = false;

export function useFirstLoad() {
  const [first] = useState(() => !loaded);
  useEffect(() => {
    loaded = true;
  }, []);
  return first;
}

// The load reveal's steps (globals.css .es-reveal): the title and metadata
// fade in first (REVEAL_TITLE, TITLE_MS); once that's done (TYPED_EVENT),
// the images, then the nav bar, then the filter. Each is hidden
// (REVEAL_WAIT) until then.
export const TITLE_MS = 800;
export const TYPED_EVENT = "es-typed";
export const REVEAL_WAIT = "invisible";
export const REVEAL_TITLE = "es-reveal";
export const REVEAL_IMAGES = "es-reveal";
export const REVEAL_NAV = "es-reveal [animation-delay:600ms]";
export const REVEAL_FILTER = "es-reveal [animation-delay:1200ms]";

// Whether the title has finished typing (true at once when not waiting).
// A fallback (TYPED_FALLBACK_MS) ends the wait anyway — e.g. if there's no
// title to type (nothing to show, or the data didn't load).
const TYPED_FALLBACK_MS = 5000;
export function useTyped(waiting: boolean) {
  const [typed, setTyped] = useState(!waiting);
  useEffect(() => {
    if (!waiting) return;
    const done = () => setTyped(true);
    window.addEventListener(TYPED_EVENT, done);
    const fallback = setTimeout(done, TYPED_FALLBACK_MS);
    return () => {
      window.removeEventListener(TYPED_EVENT, done);
      clearTimeout(fallback);
    };
  }, [waiting]);
  return typed;
}

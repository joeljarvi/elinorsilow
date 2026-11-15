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

// The load reveal's steps (globals.css .es-reveal): the images, then the
// title and metadata, then the nav bar and filters.
export const REVEAL_IMAGES = "es-reveal";
export const REVEAL_TITLE = "es-reveal [animation-delay:600ms]";
export const REVEAL_NAV = "es-reveal [animation-delay:1200ms]";

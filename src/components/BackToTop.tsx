"use client";

import { useLenis } from "lenis/react";

// "Back to top" — the last line of a page, a list row's height (h-9) on
// the 12-col grid, in the title column (col 3). Scrolls smoothly to the
// top: through Lenis where the page uses it, natively otherwise.
export default function BackToTop() {
  const lenis = useLenis();
  return (
    <div className="grid grid-cols-4 lg:grid-cols-12 gap-x-2 lg:gap-x-4 px-6 lg:px-0 h-9 items-center font-stix text-sm leading-none text-primary">
      <button
        type="button"
        onClick={() =>
          lenis
            ? lenis.scrollTo(0)
            : window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="col-span-2 lg:col-start-3 justify-self-start italic underline underline-offset-4 decoration-[0.5px] cursor-pointer"
      >
        Back to top
      </button>
    </div>
  );
}

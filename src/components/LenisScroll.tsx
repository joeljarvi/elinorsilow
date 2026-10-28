"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Pauses Lenis while a modal is open (useModalOpen sets data-modal-open on
// <body>): Lenis scrolls programmatically, which overflow:hidden doesn't
// block, so the page behind would scroll. Stopped, it also leaves wheel
// events alone, so the modal's own scroll areas work natively.
function PauseWhileModalOpen() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const sync = () =>
      "modalOpen" in document.body.dataset ? lenis.stop() : lenis.start();
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-modal-open"],
    });
    return () => observer.disconnect();
  }, [lenis]);
  return null;
}

// Smooth (Lenis) scrolling for the page it's rendered on.
export default function LenisScroll() {
  return (
    <ReactLenis root>
      <PauseWhileModalOpen />
    </ReactLenis>
  );
}

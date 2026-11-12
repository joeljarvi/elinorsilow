"use client";

import { useEffect, useState } from "react";
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

// Smooth (Lenis) scrolling for the page it's rendered on — desktop only
// (lg+); mobile keeps the browser's native scrolling.
export default function LenisScroll() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  if (!desktop) return null;
  return (
    <ReactLenis root>
      <PauseWhileModalOpen />
    </ReactLenis>
  );
}

import { useEffect } from "react";

// Number of modals currently open. Modals can nest (a work opened from an
// exhibition), so the inner one closing must not unlock the page or drop
// the flag while the outer one is still open.
let openCount = 0;

// Locks page scroll and sets `data-modal-open` on <body> while a modal is
// mounted. ESNav keys off that attribute to switch to `fixed` on desktop, so
// the nav stays visible above the modal even when the page underneath is
// scrolled.
export default function useModalOpen() {
  useEffect(() => {
    openCount++;
    document.body.style.overflow = "hidden";
    document.body.dataset.modalOpen = "";
    return () => {
      openCount--;
      if (openCount > 0) return;
      document.body.style.overflow = "";
      delete document.body.dataset.modalOpen;
    };
  }, []);
}

"use client";
import { useEffect } from "react";

export default function ScrollRevealInit() {
  useEffect(() => {
    const observed = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.color = "var(--color-foreground)";
          } else if (entry.boundingClientRect.top > window.innerHeight / 2) {
            // Element is below center — not yet read
            el.style.color = "var(--color-muted-foreground)";
          }
          // Element above center — already read, keep foreground
        });
      },
      { rootMargin: "0px 0px -40% 0px" },
    );

    let timer: ReturnType<typeof setTimeout> | null = null;

    function scan() {
      document
        .querySelectorAll<HTMLElement>(".font-timesNewRoman")
        .forEach((el) => {
          if (observed.has(el)) return;

          observed.add(el);
          el.style.transition = "color 0.5s ease";
          el.style.color = "var(--color-muted-foreground)";
          io.observe(el);
        });
    }

    scan();

    const mo = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(scan, 80);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return null;
}

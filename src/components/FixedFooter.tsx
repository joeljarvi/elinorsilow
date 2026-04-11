"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const COPYRIGHT_TEXT =
  "© 2026 Elinor Silow. All rights reserved. No artworks may be reproduced in any form or by any means without permission.";

export default function FixedFooter() {
  const [phase, setPhase] = useState<"cookie" | "typing" | "done">("cookie");
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setPhase("typing"), 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (charIndex >= COPYRIGHT_TEXT.length) {
      setPhase("done");
      return;
    }
    const t = setTimeout(() => {
      setDisplayText(COPYRIGHT_TEXT.slice(0, charIndex + 1));
      setCharIndex((i) => i + 1);
    }, 40);
    return () => clearTimeout(t);
  }, [phase, charIndex]);

  const handleLinkInteract = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  return (
    <div className=" hidden fixed bottom-0 left-0 right-0 z-[100]  items-start justify-center bg-background py-[9px] px-[9px] no-hide-text shadow-xl">
      <p className="p-small text-foreground text-center">
        {phase === "cookie" ? (
          <>
            This website uses cookies. By using this website you consent to the
            use of these cookies. Read more in{" "}
            <Link className="underline" href="/" onClick={handleLinkInteract}>
              privacy policy
            </Link>
            .
          </>
        ) : (
          <>
            {displayText}
            {phase === "typing" && <span className="animate-pulse">|</span>}
          </>
        )}
      </p>
    </div>
  );
}

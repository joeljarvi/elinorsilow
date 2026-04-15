"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function FixedCookieAccept() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex items-start justify-start bg-background py-[9px] px-[9px]">
      <p className="p-small text-foreground w-full flex flex-wrap gap-x-2">
        This website uses cookies. By using this website you consent to the use
        of these cookies. Read more in{" "}
        <Link className="underline" href="/">
          privacy policy
        </Link>
        .
        <button
          onClick={() => {
            localStorage.setItem("cookiesAccepted", "true");
            setVisible(false);
          }}
          className="underline ml-0"
        >
          OK
        </button>
      </p>
    </div>
  );
}

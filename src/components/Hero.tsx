"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col h-full min-h-screen lg:min-h-0 items-center justify-center px-[18px] lg:px-[32px] text-center gap-y-1">
      <p className="text-[18px] lg:text-[18px] max-w-xl no-hide-text font-timesNewRoman">
        <span className="font-medium">Elinor Silow</span> (b. 1993, Malmö,
        Sweden) is a Stockholm-based artist working with painting, sculpture,
        and textile. Her work explores raw emotion through material, gesture,
        and form. For collaborations or inquiries:
      </p>
      <Link
        href="mailto:elinor.silow@gmail.com"
        className="text-blue-600 font-timesNewRomanWide font-bold"
      >
        (elinor.silow@gmail.com)
      </Link>
      .
    </div>
  );
}

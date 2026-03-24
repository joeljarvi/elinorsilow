"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 px-[32px] relative z-10 mb-[18px] items-center justify-center lg:h-screen">
      <p className="p text-[18px] pl-[18px] pr-[32px] leading-snug lg:max-w-xl lg:px-0 no-hide-text">
        <span className="font-medium">Elinor Silow</span> (b. 1993, Malmö,
        Sweden) is a Stockholm-based artist working with painting, sculpture,
        and textile. Her work explores raw emotion through material, gesture,
        and form.
        <span className="indent-6 block">
          For further information, including CV and background, visit the info
          page. For collaborations or inquiries:{" "}
          <Link
            href="mailto:hej@elinorsilow.com"
            className="text-blue-600 hover:underline hover:underline-offset-4 hover:decoration-1"
          >
            hej@elinorsilow.com
          </Link>
          .
        </span>
      </p>
    </div>
  );
}

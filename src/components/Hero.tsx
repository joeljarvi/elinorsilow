"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <div className="p-4 lg:p-8 relative z-10">
      <p className="font-bookish text-xl leading-snug max-w-2xl">
        <span className="font-medium">Elinor Silow</span> (b. 1993, Malmö,
        Sweden) is a Stockholm-based artist working with painting, sculpture,
        and textile. Her work explores raw emotion through material, gesture,
        and form. Discover her works, or see exhibitions where the work has
        been presented publicly.{" "}
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

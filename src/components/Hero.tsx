"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import NavSearch from "./NavSearch";

export default function Hero() {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div className=" px-0  relative z-10 mb-[18px] ">
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />

      <p className="p text-[18px] pl-[18px] pr-[32px] leading-snug  lg:max-w-xl lg:px-0 no-hide-text">
        <span className="font-medium">Elinor Silow</span> (b. 1993, Malmö,
        Sweden) is a Stockholm-based artist working with painting, sculpture,
        and textile. Her work explores raw emotion through material, gesture,
        and form.
        <span className="indent-6 block ">
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

      <nav className="grid grid-cols-2 items-start justify-start mt-8">
        {[
          { href: "/works", label: "Works" },
          { href: "/exhibitions", label: "Exhibitions" },
          { href: "/info", label: "Information" },
          { href: "/contact", label: "Contact" },
        ].map(({ href, label }) => (
          <Button
            key={href}
            variant="link"
            className="justify-start"
            size="controls"
            asChild
          >
            <Link href={href}>{label}</Link>
          </Button>
        ))}
        <Button
          variant="link"
          className="justify-start"
          size="controls"
          onClick={() => setOpenSearch(true)}
        >
          Search
        </Button>
        <DarkModeToggle className="justify-start" />
      </nav>
    </div>
  );
}

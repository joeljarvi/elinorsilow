"use client";

import Link from "next/link";
import { useUI } from "@/context/UIContext";

const LINKS = [
  { href: "/index/works", label: "Works" },
  { href: "/index/exhibitions", label: "Exhibitions" },
  { href: "/index/info", label: "Info" },
];

// The home page: one column in the middle of the screen — the name, the bio
// (justified), then the links to the three views spread across its width.
export default function HomeLayoutClient({ bio }: { bio: string }) {
  const { siteReveal } = useUI();
  // Hidden behind the "under construction" overlay; fades in when it closes.
  const fade = `transition-opacity duration-1000 ${siteReveal === "covered" ? "opacity-0" : "opacity-100"}`;
  return (
    <main
      className={`${fade} min-h-dvh flex items-center justify-center px-3 py-12 text-neutral-800 font-gensco text-[18px] lg:text-[21px] leading-tight`}
    >
      <div className="flex flex-col gap-y-12 w-full max-w-sm lg:max-w-xl">
        <h1 className="text-[18px] lg:text-[21px] text-center">Elinor Silow</h1>
        {bio && (
          <p className=" text-[18px] lg:text-[21px] text-justify whitespace-pre-line">
            {bio}
          </p>
        )}
        <nav className="flex justify-between">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}

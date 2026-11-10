"use client";

import Link from "next/link";
import { useUI } from "@/context/UIContext";

const LINKS = [
  { href: "/works", label: "Works" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/info", label: "Info" },
];

// The home page: one column in the middle of the screen — the name, the bio
// (justified), then the links to the three views spread across its width —
// over a background image from Sanity (Hero).
export default function HomeLayoutClient({
  bio,
  hero,
}: {
  bio: string;
  // The background image (from the Hero document in Sanity), if any.
  hero: { url: string; alt: string } | null;
}) {
  const { siteReveal } = useUI();
  // Hidden behind the "under construction" overlay; fades in when it closes.
  const fade = `transition-opacity duration-1000 ${siteReveal === "covered" ? "opacity-0" : "opacity-100"}`;
  return (
    <main
      className={`${fade} min-h-dvh flex items-center justify-center px-3 py-12 text-neutral-800 font-gensco text-[18px] lg:text-[21px] leading-tight`}
    >
      {/* The background: one of the Hero images, covering the screen. */}
      {hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${hero.url}?w=2400&auto=format`}
          alt={hero.alt}
          className="fixed inset-0 -z-10 w-full h-full object-cover"
        />
      )}
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

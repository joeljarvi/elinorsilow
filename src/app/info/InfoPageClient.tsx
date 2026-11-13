"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { useIndex } from "@/context/IndexContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import type { Press } from "../../../lib/sanity";
import type { ReactNode } from "react";
import TitleBlock from "@/components/TitleBlock";

const byYearDesc =
  <T,>(year: (t: T) => number | string) =>
  (a: T, b: T) =>
    Number(year(b)) - Number(year(a));

// "kunstkritikk.se" from "https://kunstkritikk.se/hjartats-energi/".
function siteName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// One entry: its first part (the title, maybe a link), then the rest joined
// with commas.
function Entry({
  first,
  rest,
}: {
  first: ReactNode;
  rest: (string | number | undefined | null | ReactNode)[];
}) {
  const parts = rest.filter((p) => p !== undefined && p !== null && p !== "");
  return (
    <p>
      {first}
      {parts.map((p, i) => (
        <span key={i}>, {p}</span>
      ))}
    </p>
  );
}

const LINK = "underline underline-offset-4 decoration-1";

type Section = {
  key: string;
  title: string;
  // The heading as a link (e.g. "Elinor Silow" → home).
  href?: string;
  count?: number;
  body: ReactNode;
};

// The info page: its title at the top left (where the works / exhibitions
// pages have theirs), then contact and the sections in one column,
// 24px: the bio, then everything dated (exhibitions, grants, press)
// grouped by year, newest first, then education, then the colophon.
export default function InfoPageClient({
  bio = "",
  press = [],
}: {
  bio?: string;
  press?: Press[];
}) {
  const { educations, grants } = useInfo();
  const { exhibitions, exhibitionList } = useExhibitions();
  // The shared index search filters the lists by any of their text.
  const { search } = useIndex();
  const q = search.trim().toLowerCase();
  const matches = (...parts: (string | number | undefined | null)[]) =>
    !q || parts.filter(Boolean).join(" ").toLowerCase().includes(q);

  // Exhibition history: every exhibition ever — those with pages (the title
  // opens it) and the archive ones from the CV, newest first; an archive
  // entry with the same title as an exhibition is left out (same show).
  const norm = (t: string) => t.trim().toLowerCase();
  const titles = new Set(exhibitions.map((e) => norm(e.title.rendered)));
  const type = (t?: string) =>
    t ? `${t.replace(/ Exhibition$/i, "")} Exhibition` : "";
  const history = [
    ...exhibitions.map((e) => ({
      id: `ex-${e.id}`,
      year: e.acf.year,
      title: e.title.rendered,
      venue: e.acf.location,
      city: e.acf.city,
      type: type(e.acf.exhibition_type),
      slug: e.slug as string | undefined,
    })),
    ...exhibitionList
      .filter((e) => !titles.has(norm(e.title.rendered)))
      .map((e) => ({
        id: `archive-${e.id}`,
        year: e.acf.year,
        title: e.title.rendered,
        venue: e.acf.venue,
        city: e.acf.city,
        type: type(e.acf.exhibition_type),
        slug: undefined as string | undefined,
      })),
  ]
    .filter((e) => matches(e.title, e.venue, e.city, e.type, e.year))
    .sort(byYearDesc((e) => e.year));
  const shownGrants = grants
    .filter((g) => matches(g.acf.title, g.acf.institution, g.acf.year))
    .sort(byYearDesc((g) => g.acf.year));
  const shownEducations = educations
    .filter((e) =>
      matches(e.acf.school, e.acf.city, e.acf.start_year, e.acf.end_year),
    )
    .sort(byYearDesc((e) => e.acf.end_year));
  const shownPress = press.filter((p) =>
    matches(p.title, p.author, p.link, p.year),
  );

  // Everything with a year — exhibitions, grants, press — in one list,
  // newest year first; each entry says what it is (exhibitions by their
  // type).
  const dated: { id: string; year: number; node: ReactNode }[] = [
    ...history.map((e) => ({
      id: e.id,
      year: Number(e.year),
      node: (
        <Entry
          key={e.id}
          first={
            e.slug ? (
              <Link href={`/exhibitions/${e.slug}`} className={LINK}>
                {e.title}
              </Link>
            ) : (
              e.title
            )
          }
          rest={[e.venue, e.city, e.type]}
        />
      ),
    })),
    ...shownGrants.map((g) => ({
      id: `grant-${g.id}`,
      year: Number(g.acf.year),
      node: (
        <Entry
          key={`grant-${g.id}`}
          first={g.acf.title}
          rest={[g.acf.institution, "Grant"]}
        />
      ),
    })),
    ...shownPress.map((p) => ({
      id: `press-${p.id}`,
      year: Number(p.year),
      node: (
        <Entry
          key={`press-${p.id}`}
          first={p.title}
          rest={[
            p.author,
            p.link && (
              <Link href={p.link} className={LINK}>
                {siteName(p.link)}
              </Link>
            ),
            "Press",
          ]}
        />
      ),
    })),
  ].filter((d) => d.year > 0);
  // Grouped by year, newest first.
  const years = [...new Set(dated.map((d) => d.year))].sort((a, b) => b - a);

  // The sections, in order: the bio, then one per year (the year as its
  // header, everything from that year below), then education, then the
  // colophon; empty ones
  // are left out.
  const sections = [
    bio && {
      key: "about",
      title: "Elinor Silow",
      href: "/works",
      body: (
        <>
          <p className=" whitespace-pre-line">{bio}</p>
        </>
      ),
    },
    ...years.map((y) => ({
      key: `year-${y}`,
      title: String(y),
      body: dated.filter((d) => d.year === y).map((d) => d.node),
    })),
    // Education: its own section, after the years (newest first).
    shownEducations.length > 0 && {
      key: "education",
      title: "Education",
      body: shownEducations.map((e) => (
        <Entry
          key={`edu-${e.id}`}
          first={e.acf.school}
          rest={[
            e.acf.city,
            [e.acf.start_year, e.acf.end_year].filter(Boolean).join("–"),
          ]}
        />
      )),
    },
    {
      key: "colophon",
      title: "Colophon",
      body: (
        <>
          <Entry
            first="Design & code"
            rest={[
              <Link key="j" href="/" className={LINK}>
                Joel Järvi
              </Link>,
            ]}
          />
          <Entry first="Typefaces" rest={["Gensco"]} />
        </>
      ),
    },
  ].filter(Boolean) as Section[];

  return (
    <section className="relative w-full min-h-dvh bg-background text-neutral-800">
      {/* The page's title, at the top left (where the works and
          exhibitions pages have theirs), scrolling with the page. */}

      {/* Everything below the title — contact, then the sections — in one
          column, 24px. */}
      <div className="flex flex-col max-w-4xl pl-3 pr-12 lg:px-6 pt-3 lg:pt-6 pb-24 font-gensco text-[18px] lg:text-[24px] leading-tight">
        {sections.map((section) => (
          <div key={section.key} className="flex flex-col mb-6">
            <h2 className="font-gensco normal-case text-[18px] lg:text-[24px] leading-tight indent-0 mb-3 lg:indent-0 lg:mb-3">
              {section.href ? (
                <Link href={section.href}>{section.title}</Link>
              ) : (
                section.title
              )}
            </h2>
            {section.body}
          </div>
        ))}
      </div>
    </section>
  );
}

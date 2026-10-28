"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { useIndex } from "@/context/IndexContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import type { Press } from "../../../lib/sanity";
import { useState, type ReactNode } from "react";
import BackToTop from "@/components/BackToTop";

function groupByYear<T extends { acf: { year: number | string } }>(
  items: T[],
): [string, T[]][] {
  const map = new Map<string, T[]>();
  const sorted = [...items].sort(
    (a, b) => Number(b.acf.year) - Number(a.acf.year),
  );
  for (const item of sorted) {
    const y = item.acf.year.toString();
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(item);
  }
  return Array.from(map.entries());
}

// "kunstkritikk.se" from "https://kunstkritikk.se/hjartats-energi/".
function siteName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// A line split into columns on the 12-col grid. Desktop: each cell at its
// given cols. Mobile (4 cols): the first cell cols 1–2, then one col each;
// cells marked mobileHidden are left out there.
function Cols({
  cells,
}: {
  cells: { content: ReactNode; className: string; mobileHidden?: boolean }[];
}) {
  return (
    <div className="h-9 hover:bg-purple-200 transition-colors duration-300 grid grid-cols-4 lg:grid-cols-12 gap-x-4 items-center leading-none">
      {cells.map((c, i) => (
        <span
          key={i}
          className={`${i === 0 ? "col-span-2" : "col-span-1"} truncate ${c.mobileHidden ? "hidden lg:block" : ""} ${c.className}`}
        >
          {c.content}
        </span>
      ))}
    </div>
  );
}

// Exhibition history: every exhibition ever, text only — the exhibitions
// with pages (title opens the exhibition) and the archive ones from the CV,
// newest year first; an archive entry with the same title as an exhibition
// is left out (same show). Columns (desktop): title (3–5; opens it when
// it has a page), venue (6–7), city (8–9), type (10–11), year (12).
function ExhibitionHistory({ query = "" }: { query?: string }) {
  const { setOpen } = useUI();
  const { exhibitions, exhibitionList, setActiveExhibitionSlug } =
    useExhibitions();
  const norm = (t: string) => t.trim().toLowerCase();
  const titles = new Set(exhibitions.map((e) => norm(e.title.rendered)));
  const entries = [
    ...exhibitions.map((e) => ({
      id: `ex-${e.id}`,
      year: e.acf.year,
      title: e.title.rendered,
      venue: e.acf.location,
      city: e.acf.city,
      type: e.acf.exhibition_type
        ? `${e.acf.exhibition_type.replace(/ Exhibition$/i, "")} Exhibition`
        : "",
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
        type: e.acf.exhibition_type
          ? `${e.acf.exhibition_type.replace(/ Exhibition$/i, "")} Exhibition`
          : "",
        slug: undefined as string | undefined,
      })),
  ].filter(
    (e) =>
      !query ||
      [e.title, e.venue, e.city, e.type, e.year]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
  );
  return (
    <>
      {groupByYear(entries.map((e) => ({ ...e, acf: { year: e.year } }))).map(
        ([, es]) =>
          es.map((e) => (
            <Cols
              key={e.id}
              cells={[
                {
                  className: "lg:col-start-3 lg:col-span-3",
                  content: e.slug ? (
                    <button
                      type="button"
                      className="text-left italic underline underline-offset-4 decoration-[0.5px] cursor-pointer"
                      onClick={() => {
                        setActiveExhibitionSlug(e.slug!);
                        setOpen(false);
                      }}
                    >
                      {e.title}
                    </button>
                  ) : (
                    e.title
                  ),
                },
                {
                  className: "lg:col-start-6 lg:col-span-2",
                  content: e.venue,
                },
                {
                  className: "lg:col-start-8 lg:col-span-2",
                  content: e.city,
                  mobileHidden: true,
                },
                {
                  className: "lg:col-start-10 lg:col-span-2",
                  content: e.type,
                  mobileHidden: true,
                },
                {
                  className: "lg:col-start-12 lg:col-span-1 tabular-nums",
                  content: e.year,
                },
              ]}
            />
          )),
      )}
    </>
  );
}

type Section = {
  key: string;
  title: string;
  count?: number;
  body: ReactNode;
  // Desktop: the header's columns (default col 3 onward); the body goes on
  // the line below it.
  headerCols?: string;
  // Desktop: something in cols 1–2 on the header's line (the search).
  lead?: ReactNode;
};

// Text sizes for the page's S / M / L setting.
const TEXT_SIZES = { S: "text-sm", M: "text-lg", L: "text-2xl" } as const;

// One section of the info page — the same type as the works and
// exhibitions lists, always open and full width (col-span-12): its title
// (and how many entries), then its content.
function InfoRow({
  section,
  textSize,
}: {
  section: Section;
  textSize: string;
}) {
  return (
    <div
      className={`grid grid-cols-12 gap-x-4 gap-y-9 font-stix leading-[1] text-primary ${textSize}`}
    >
      {section.lead && (
        <div className="hidden lg:block lg:col-start-1 lg:col-span-2 lg:row-start-1 ">
          {section.lead}
        </div>
      )}
      {section.title && (
        <h2
          className={`col-span-12 ${section.headerCols ?? " font-gtAmericaCondensed uppercase lg:col-start-3 lg:col-span-10"} lg:row-start-1 h-9 flex items-center whitespace-pre `}
        >
          {section.title}
        </h2>
      )}
      {/* Desktop: the header in col 3 (where the lists start), the content
          on the line below; a section without a header starts on the first
          line. Mobile: the header above the content. */}
      <div
        // List sections: rows h-9 (Cols), alternating page background /
        // purple-100 like the works and exhibitions lists.
        className={`col-span-12 lg:col-start-1 ${section.title ? "lg:row-start-2" : "lg:row-start-1"} flex flex-col ${section.title ? "[&>*:nth-child(even):not(:hover)]:bg-purple-100" : ""}`}
      >
        {section.body}
      </div>
    </div>
  );
}

export default function InfoPageClient({
  bio = "",
  press = [],
}: {
  bio?: string;
  press?: Press[];
}) {
  const { educations, grants } = useInfo();
  // Search (the nav's field, col 4 — the shared index search): filters the
  // lists by any of their text.
  const { search } = useIndex();
  const q = search.trim().toLowerCase();
  const matches = (...parts: (string | number | undefined | null)[]) =>
    !q || parts.filter(Boolean).join(" ").toLowerCase().includes(q);
  const shownGrants = grants.filter((g) =>
    matches(g.acf.title, g.acf.institution, g.acf.year),
  );
  const shownEducations = educations.filter((e) =>
    matches(e.acf.school, e.acf.city, e.acf.start_year, e.acf.end_year),
  );
  const shownPress = press.filter((p) =>
    matches(p.title, p.author, p.link, p.year),
  );

  // The sections, in order; empty ones are left out.
  const sections: Section[] = [
    bio && {
      key: "about",
      // No header: just the bio.
      title: "",
      // Desktop: cols 3–6.
      body: (
        <div className="grid grid-cols-12 gap-x-4">
          <p className="col-span-12 lg:col-start-3 lg:col-span-5 text-sm whitespace-pre-line leading-snug lg:leading-relaxed font-stix  ">
            {bio}
          </p>
        </div>
      ),
    },
    {
      key: "exhibition-history",
      title: "Exhibition history",
      body: <ExhibitionHistory query={q} />,
    },
    shownGrants.length > 0 && {
      key: "grants",
      title: "Grants",
      count: shownGrants.length,
      body: groupByYear(shownGrants).map(([, gs]) =>
        gs.map((grant) => (
          <Cols
            key={grant.id}
            cells={[
              {
                className: "lg:col-start-3 lg:col-span-4",
                content: grant.acf.title,
              },
              { className: "lg:col-span-3", content: grant.acf.institution },
              {
                className: "lg:col-start-10 lg:col-span-1 tabular-nums",
                content: grant.acf.year,
              },
            ]}
          />
        )),
      ),
    },
    shownEducations.length > 0 && {
      key: "education",
      title: "Education",
      count: shownEducations.length,
      body: [...shownEducations]
        .sort((a, b) => Number(b.acf.end_year) - Number(a.acf.end_year))
        .map((edu) => (
          // School (3–6), city (7–9), years (10–11) — under the exhibition
          // history's type column.
          <Cols
            key={edu.id}
            cells={[
              {
                className: "lg:col-start-3 lg:col-span-4",
                content: edu.acf.school,
              },
              { className: "lg:col-span-3", content: edu.acf.city },
              {
                className:
                  "lg:col-start-10 lg:col-span-2 tabular-nums whitespace-nowrap",
                content: [edu.acf.start_year, edu.acf.end_year]
                  .filter(Boolean)
                  .join("–"),
              },
            ]}
          />
        )),
    },
    shownPress.length > 0 && {
      key: "press",
      title: "Press",
      count: shownPress.length,
      // Title, author (3–6), site (7–9), year (11).
      body: shownPress.map((item) => (
        <Cols
          key={item.id}
          cells={[
            {
              className: "lg:col-start-3 lg:col-span-4",
              content: [item.title, item.author].filter(Boolean).join(", "),
            },
            {
              className: "lg:col-span-3",
              content: item.link && (
                <Link
                  className="italic underline underline-offset-4 decoration-[0.5px]"
                  href={item.link}
                >
                  {siteName(item.link)}
                </Link>
              ),
            },
            {
              className: "lg:col-start-11 lg:col-span-1 tabular-nums",
              content: item.year,
            },
          ]}
        />
      )),
    },
    {
      key: "colophon",
      title: "Colophon",
      body: (
        // Label (3–6), value (7–11).
        <>
          <Cols
            cells={[
              {
                className: "lg:col-start-3 lg:col-span-4",
                content: "Design & code",
              },
              {
                className: "lg:col-span-5",
                content: (
                  <Link
                    className="italic underline underline-offset-4 decoration-[0.5px]"
                    href="/"
                  >
                    Joel Järvi
                  </Link>
                ),
              },
            ]}
          />
          <Cols
            cells={[
              {
                className: "lg:col-start-3 lg:col-span-4",
                content: "Typefaces",
              },
              {
                className: "lg:col-span-5",
                content: "STIX Two Text, GT America, GT Alpina",
              },
            ]}
          />
        </>
      ),
    },
  ].filter(Boolean) as Section[];

  // Text size for this page only: S / M / L (not the site-wide image size).
  const [textSize, setTextSize] = useState<keyof typeof TEXT_SIZES>("S");

  // A plain page that scrolls normally (desktop and mobile): every section
  // open, one after another.
  return (
    <section className="text-foreground relative w-full min-h-dvh bg-background">
      {/* Text size S / M / L — fixed top right, like the image size on the
          works and exhibitions pages. */}

      {/* Desktop: starts a quarter of the screen down, level with the fixed
          view links (Works / Exhibitions / Info), so the first line of the
          about text shares the "Works" link's baseline. */}
      <div className="flex flex-col gap-y-18  pb-18 mt-18 px-0 lg:px-0">
        {sections.map((section) => (
          <InfoRow
            key={section.key}
            section={section}
            textSize={TEXT_SIZES[textSize]}
          />
        ))}
        <BackToTop />
      </div>
    </section>
  );
}

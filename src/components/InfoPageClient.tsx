"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { InfoRow } from "@/components/InfoBox";
import HDivider from "@/components/HDivider";

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

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 lg:top-8 z-10 pt-4 bg-background">
      <div className="mx-4 flex items-center font-bookish text-sm border border-border">
        <span className="h3 px-3 py-1.5 text-muted-foreground">{children}</span>
      </div>
    </div>
  );
}

export default function InfoPageClient() {
  const { educations, grants, soloExhibitions, groupExhibitions } = useInfo();
  const { setOpen } = useUI();
  const { findExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  function ExhibitionList({ items }: { items: typeof soloExhibitions }) {
    return (
      <div className="flex flex-col px-4 mb-4">
        {groupByYear(items).map(([year, exs]) => (
          <div key={year}>
            <div className="flex flex-row items-baseline font-bookish border-x border-border">
              <span className="h3 py-1.5 px-2 text-muted-foreground">
                {year}
              </span>
            </div>
            <HDivider />
            {exs.map((ex) => {
              const slug = findExhibitionSlug(ex.title.rendered);
              return (
                <div
                  key={ex.id}
                  className="flex flex-wrap items-baseline gap-x-1 h3 px-3 py-1.5  border-x border-b border-border"
                >
                  {slug ? (
                    <Button
                      variant="ghost"
                      size="controls"
                      className="h3 p-0 h-auto underline underline-offset-4 decoration-1 hover:no-underline justify-start"
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                    >
                      {ex.title.rendered},
                    </Button>
                  ) : (
                    <span className="h3">{ex.title.rendered},</span>
                  )}
                  <span className="h3">
                    {ex.acf.venue}, {ex.acf.city}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="relative w-full mt-0">
      {/* Mobile: single column */}
      <div className="lg:hidden flex flex-col mb-36 ">
        <SectionHeader>About</SectionHeader>
        <div className="px-8 py-4 font-bookish flex flex-col gap-y-3 mb-4">
          <p className="h3">
            Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based artist
            who explores raw emotion through painting, sculpture and textile.
          </p>
          <p className="h3">
            Please contact{" "}
            <Link
              href="mailto:hej@elinorsilow.com"
              className="underline underline-offset-4 decoration-1 hover:no-underline"
            >
              hej@elinorsilow.com
            </Link>{" "}
            for collaborations and inquiries.
          </p>
        </div>

        {soloExhibitions.length > 0 && (
          <>
            <SectionHeader>Solo Exhibitions</SectionHeader>
            <ExhibitionList items={soloExhibitions} />
          </>
        )}
        {groupExhibitions.length > 0 && (
          <>
            <SectionHeader>Group Exhibitions</SectionHeader>
            <ExhibitionList items={groupExhibitions} />
          </>
        )}
        {educations.length > 0 && (
          <>
            <SectionHeader>Education</SectionHeader>
            <div className="flex flex-col px-4 mb-4">
              {educations.map((edu) => (
                <InfoRow
                  key={edu.id}
                  label={`${edu.acf.start_year}–${edu.acf.end_year}`}
                >
                  <span className="h3">
                    {edu.acf.school}, {edu.acf.city}
                  </span>
                </InfoRow>
              ))}
            </div>
          </>
        )}
        {grants.length > 0 && (
          <>
            <SectionHeader>Grants</SectionHeader>
            <div className="flex flex-col px-4">
              {groupByYear(grants).map(([year, gs]) =>
                gs.map((grant) => (
                  <InfoRow key={grant.id} label={year}>
                    <span className="h3">{grant.acf.title}</span>
                  </InfoRow>
                )),
              )}
            </div>
          </>
        )}
      </div>

      {/* Desktop: 3 fixed scrolling columns */}
      <div
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0"
        style={{ top: "calc(var(--nav-height, 0px) + 0px)" }}
      >
        {/* Col 1: About + Solo Exhibitions */}
        <div className="flex-1 overflow-y-auto h-full border-r border-border flex flex-col">
          <SectionHeader>About</SectionHeader>
          <div className="px-4 py-4 font-bookish flex flex-col gap-y-3 mb-4">
            <p className="h3">
              Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based
              artist who explores raw emotion through painting, sculpture and
              textile.
            </p>
            <p className="h3">
              Please contact{" "}
              <Link
                href="mailto:hej@elinorsilow.com"
                className="underline underline-offset-4 decoration-1 hover:no-underline"
              >
                hej@elinorsilow.com
              </Link>{" "}
              for collaborations and inquiries.
            </p>
          </div>

          {soloExhibitions.length > 0 && (
            <>
              <SectionHeader>Solo Exhibitions</SectionHeader>
              <ExhibitionList items={soloExhibitions} />
            </>
          )}
        </div>

        {/* Col 2: Group Exhibitions + Education + Grants + Press + Colophon */}
        <div className="flex-1 overflow-y-auto h-full flex flex-col">
          {groupExhibitions.length > 0 && (
            <>
              <SectionHeader>Group Exhibitions</SectionHeader>
              <ExhibitionList items={groupExhibitions} />
            </>
          )}
          {educations.length > 0 && (
            <>
              <SectionHeader>Education</SectionHeader>
              <div className="flex flex-col px-4 mb-4">
                <HDivider />
                {educations.map((edu) => (
                  <InfoRow
                    key={edu.id}
                    label={`${edu.acf.start_year}–${edu.acf.end_year}`}
                  >
                    <span className="h3">
                      {edu.acf.school}, {edu.acf.city}
                    </span>
                  </InfoRow>
                ))}
              </div>
            </>
          )}

          {grants.length > 0 && (
            <>
              <SectionHeader>Grants</SectionHeader>
              <div className="flex flex-col px-4 mb-4">
                <HDivider />
                {groupByYear(grants).map(([year, gs]) =>
                  gs.map((grant) => (
                    <InfoRow key={grant.id} label={year}>
                      <span className="h3">{grant.acf.title}</span>
                    </InfoRow>
                  )),
                )}
              </div>
            </>
          )}

          <SectionHeader>Press</SectionHeader>
          <div className="flex flex-col px-4 mb-4">
            <HDivider />
            <InfoRow label="2022">
              <span className="h3 flex flex-wrap gap-x-1">
                <span>Hjärtat,</span>
                <span>Lappalainen Hjertström, L-E,</span>
                <Link
                  className="underline underline-offset-4 decoration-1 hover:no-underline"
                  href="https://kunstkritikk.se/hjartats-energi/"
                >
                  kunstkritikk.se
                </Link>
              </span>
            </InfoRow>
            <InfoRow label="2025">
              <span className="h3 flex flex-wrap gap-x-1">
                <span>Gameplay,</span>
                <span>Slöör, S, Omkonst,</span>
                <Link
                  className="underline underline-offset-4 decoration-1 hover:no-underline"
                  href="https://omkonst.se/25-gameplay.shtml"
                >
                  omkonst.se
                </Link>
              </span>
            </InfoRow>
          </div>

          <SectionHeader>Colophon</SectionHeader>
          <div className="flex flex-col px-4 mb-4">
            <HDivider />
            <InfoRow label="Design & code">
              <Link
                className="h3 underline underline-offset-4 decoration-1 hover:no-underline"
                href="/"
              >
                Joel Järvi
              </Link>
            </InfoRow>
            <InfoRow label="Typeface">
              <span className="h3">Bookish, Helsinki Type Studio</span>
            </InfoRow>
          </div>

          <div className="px-4 py-4">
            <p className="h3 text-muted-foreground">
              All content on this site, including images, text, and design, is
              the intellectual property of Elinor Silow unless otherwise stated.
              No part of this website may be copied, reproduced, distributed, or
              used without explicit written permission from the copyright
              holder.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { InfoRow } from "@/components/InfoBox";
import { PageHeader } from "@/components/PageHeader";

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
    <div className="flex items-center px-[18px] lg:px-[32px] py-[9px]">
      <span className="font-timesNewRoman italic text-[14px] text-muted-foreground">{children}</span>
    </div>
  );
}

export default function InfoPageClient() {
  const { educations, grants, soloExhibitions, groupExhibitions } = useInfo();
  const { setOpen, navVisible } = useUI();
  const { findExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  function ExhibitionList({ items }: { items: typeof soloExhibitions }) {
    return (
      <div className="flex flex-col px-[18px] lg:px-[32px] mb-4">
        {groupByYear(items).map(([year, exs]) => (
          <div key={year}>
            <div className="flex flex-row items-baseline mt-2">
              <span className="font-timesNewRoman text-[16px] py-1.5 px-2 text-muted-foreground italic">
                {year}
              </span>
            </div>
            {exs.map((ex) => {
              const slug = findExhibitionSlug(ex.title.rendered);
              return (
                <div
                  key={ex.id}
                  className="flex flex-wrap items-baseline gap-x-1 font-timesNewRoman text-[16px] px-3 py-1.5"
                >
                  {slug ? (
                    <Button
                      variant="ghost"
                      size="controls"
                      className="font-timesNewRoman text-[16px] p-0 h-auto underline underline-offset-4 decoration-1 hover:no-underline justify-start"
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                    >
                      {ex.title.rendered},
                    </Button>
                  ) : (
                    <span className="font-timesNewRoman text-[16px]">{ex.title.rendered},</span>
                  )}
                  <span className="font-timesNewRoman text-[16px]">
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
    <section
      className="relative w-full transition-[padding-top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{ paddingTop: navVisible ? "var(--nav-height, 0px)" : "0px" }}
    >
      <PageHeader title="Info" />
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Col 1: About + Solo Exhibitions */}
        <div className="flex flex-col">
          <SectionHeader>About</SectionHeader>
          <div className="px-[18px] lg:px-[32px] py-4 flex flex-col gap-y-3 mb-4">
            <p className="font-timesNewRoman text-[16px] leading-snug">
              Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based artist
              who explores raw emotion through painting, sculpture and textile.
            </p>
            <p className="font-timesNewRoman text-[16px] leading-snug">
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
        <div className="flex flex-col">
          {groupExhibitions.length > 0 && (
            <>
              <SectionHeader>Group Exhibitions</SectionHeader>
              <ExhibitionList items={groupExhibitions} />
            </>
          )}
          {educations.length > 0 && (
            <>
              <SectionHeader>Education</SectionHeader>
              <div className="flex flex-col px-[18px] lg:px-[32px] mb-4">
                {educations.map((edu) => (
                  <InfoRow key={edu.id} label={`${edu.acf.start_year}–${edu.acf.end_year}`}>
                    <span className="font-timesNewRoman text-[16px]">{edu.acf.school}, {edu.acf.city}</span>
                  </InfoRow>
                ))}
              </div>
            </>
          )}

          {grants.length > 0 && (
            <>
              <SectionHeader>Grants</SectionHeader>
              <div className="flex flex-col px-[18px] lg:px-[32px] mb-4">
                {groupByYear(grants).map(([year, gs]) =>
                  gs.map((grant) => (
                    <InfoRow key={grant.id} label={year}>
                      <span className="font-timesNewRoman text-[16px]">{grant.acf.title}</span>
                    </InfoRow>
                  )),
                )}
              </div>
            </>
          )}

          <SectionHeader>Press</SectionHeader>
          <div className="flex flex-col px-[18px] lg:px-[32px] mb-4">
            <InfoRow label="2022">
              <span className="font-timesNewRoman text-[16px] flex flex-wrap gap-x-1">
                <span>Hjärtat,</span>
                <span>Lappalainen Hjertström, L-E,</span>
                <Link className="underline underline-offset-4 decoration-1 hover:no-underline" href="https://kunstkritikk.se/hjartats-energi/">
                  kunstkritikk.se
                </Link>
              </span>
            </InfoRow>
            <InfoRow label="2025">
              <span className="font-timesNewRoman text-[16px] flex flex-wrap gap-x-1">
                <span>Gameplay,</span>
                <span>Slöör, S, Omkonst,</span>
                <Link className="underline underline-offset-4 decoration-1 hover:no-underline" href="https://omkonst.se/25-gameplay.shtml">
                  omkonst.se
                </Link>
              </span>
            </InfoRow>
          </div>

          <SectionHeader>Colophon</SectionHeader>
          <div className="flex flex-col px-[18px] lg:px-[32px] mb-4">
            <InfoRow label="Design & code">
              <Link className="font-timesNewRoman text-[16px] underline underline-offset-4 decoration-1 hover:no-underline" href="/">
                Joel Järvi
              </Link>
            </InfoRow>
            <InfoRow label="Typeface">
              <span className="font-timesNewRoman text-[16px]">Bookish, Helsinki Type Studio</span>
            </InfoRow>
          </div>

          <div className="px-[18px] lg:px-[32px] py-4">
            <p className="font-timesNewRoman text-[16px] text-muted-foreground leading-snug">
              All content on this site, including images, text, and design, is
              the intellectual property of Elinor Silow unless otherwise stated.
              No part of this website may be copied, reproduced, distributed, or
              used without explicit written permission from the copyright holder.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

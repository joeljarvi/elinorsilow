"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { InfoRow } from "@/components/InfoBox";
import { HeroText } from "@/components/HeroText";
import { OGubbeText } from "@/components/OGubbeText";
import { useEffect, useState } from "react";

function ScrollHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    const onScroll = () => setVisible(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <p
      className="lg:hidden fixed inset-0 flex items-center justify-center z-[50] pointer-events-none font-timesNewRoman font-bold text-[16px] lg:text-[19px] bg-transparent"
      style={{ opacity: visible ? 0.3 : 0, transition: "opacity 0.7s ease" }}
    >
      scroll
    </p>
  );
}

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

export default function InfoPageClient() {
  const { educations, grants, soloExhibitions, groupExhibitions } = useInfo();
  const { setOpen } = useUI();
  const { findExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  function ExhibitionList({ items }: { items: typeof soloExhibitions }) {
    return (
      <div className="flex flex-col mb-[64px]">
        {groupByYear(items).map(([year, exs]) =>
          exs.map((ex, idx) => {
            const slug = findExhibitionSlug(ex.title.rendered);
            return (
              <div
                key={ex.id}
                className="flex flex-row items-baseline gap-x-[16px] pt-[9px] no-hide-text"
              >
                <span className="shrink-0 text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman text-foreground ">
                  {idx === 0 ? year : ""}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-1 text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman whitespace-normal">
                  {slug ? (
                    <Button
                      variant="link"
                      size="controls"
                      className="text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman p-0 h-auto underline underline-offset-4 decoration-1 hover:no-underline justify-start"
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                    >
                      {ex.title.rendered},
                    </Button>
                  ) : (
                    <span>{ex.title.rendered},</span>
                  )}
                  <span>
                    {ex.acf.venue}, {ex.acf.city}
                  </span>
                </div>
              </div>
            );
          }),
        )}
      </div>
    );
  }

  return (
    <section className="mt-[48px] relative w-full">
      <ScrollHint />
      {/* Fixed page header */}

      <div className="flex flex-col w-full lg:grid lg:grid-cols-12 pt-[32px] lg:gap-x-[18px] px-[18px] lg:px-[18px]">
        {/* Col 1: About + Solo Exhibitions */}

        <div className="flex flex-col lg:col-start-1 lg:col-span-10 mb-[18px] ">
          <HeroText />
        </div>
        <div className="flex flex-col col-start-1 lg:col-span-4">
          {groupExhibitions.length > 0 && (
            <>
              <OGubbeText
                text="Group Exhibitions"
                lettersOnly
                sizes="19px"
                className="text-[16px] lg:text-[19px] mb-[18px]  justify-start  font-timesNewRoman font-bold tracking-wider"
              />
              <ExhibitionList items={groupExhibitions} />
            </>
          )}
        </div>
        <div className="flex flex-col lg:col-span-4 lg:col-start-5 ">
          {soloExhibitions.length > 0 && (
            <>
              <OGubbeText
                text="Solo Exhibitions"
                lettersOnly
                sizes="16px"
                className="text-[16px] lg:text-[19px] mb-[18px]  justify-start  font-timesNewRoman font-bold tracking-wider"
              />

              <ExhibitionList items={soloExhibitions} />
            </>
          )}
        </div>

        {/* Col 2: Group Exhibitions + Education + Grants + Press + Colophon */}

        <div className="flex flex-col lg:col-span-4 mb-[18px]">
          {educations.length > 0 && (
            <>
              <OGubbeText
                text="Education"
                lettersOnly
                sizes="24px"
                className="text-[16px] lg:text-[19px]  justify-start  font-timesNewRoman font-bold tracking-wider mb-[18px]"
              />
              <div className="flex flex-col  mb-4">
                {educations.map((edu) => (
                  <InfoRow labelClassName="text-foreground"
                    key={edu.id}
                    label={`${edu.acf.start_year}–${edu.acf.end_year}`}
                  >
                    <span className="text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman">
                      {edu.acf.school}, {edu.acf.city}
                    </span>
                  </InfoRow>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col lg:col-span-4 lg:col-start-1 mb-[32px] ">
          {grants.length > 0 && (
            <>
              <OGubbeText
                text="Grants"
                lettersOnly
                sizes="16px"
                className="text-[16px] lg:text-[19px]  justify-start px-[9px] font-timesNewRoman font-bold tracking-wider"
              />
              <div className="flex flex-col mt-[18px] mb-4">
                {groupByYear(grants).map(([year, gs]) =>
                  gs.map((grant) => (
                    <InfoRow labelClassName="text-foreground" key={grant.id} label={year}>
                      <span className="text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman">
                        {grant.acf.title}
                      </span>
                    </InfoRow>
                  )),
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col lg:col-span-4">
          <OGubbeText
            text="Press"
            lettersOnly
            sizes="21px"
            className="text-[16px] lg:text-[19px]  justify-start px-[9px] font-timesNewRoman font-bold tracking-wider"
          />
          <div className="flex flex-col mt-[18px] mb-4">
            <InfoRow labelClassName="text-foreground" label="2022">
              <span className="text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman flex flex-wrap gap-x-1">
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
            <InfoRow labelClassName="text-foreground" label="2025">
              <span className="text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman flex flex-wrap gap-x-1">
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
        </div>
        <div className="flex flex-col lg:col-span-4">
          <OGubbeText
            text="Colophon"
            lettersOnly
            sizes="16px"
            className="text-[16px] lg:text-[19px]  justify-start px-[9px] font-timesNewRoman font-bold tracking-wider"
          />
          <div className="flex flex-col mt-[18px] mb-4">
            <InfoRow labelClassName="text-foreground" label="Design & code">
              <Link
                className=" underline underline-offset-4 decoration-1 hover:no-underline text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman"
                href="/"
              >
                Joel Järvi
              </Link>
            </InfoRow>
            <InfoRow labelClassName="text-foreground" label="Typefaces">
              <span className="text-[16px] lg:text-[19px] leading-[1.2] tracking-wide font-timesNewRoman">
                Times New Roman
              </span>
            </InfoRow>
          </div>
        </div>

        <div className="px-[18px] lg:pl-[64px] lg:pr-[32px] py-4 col-span-6">
          <p className="font-timesNewRoman text-[16px] lg:text-[19px] text-muted-foreground leading-snug">
            All content on this site, including images, text, and design, is the
            intellectual property of Elinor Silow unless otherwise stated. No
            part of this website may be copied, reproduced, distributed, or used
            without explicit written permission from the copyright holder.
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import { InfoRow } from "@/components/InfoBox";
import HeroText from "@/components/HeroText";
import { Fragment, useEffect, useState } from "react";
import WigglyButton from "@/components/WigglyButton";
import ScrollRevealInit from "@/components/ScrollRevealInit";

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
      className="lg:hidden fixed inset-0 flex items-center justify-center z-[50] pointer-events-none font-timesNewRoman font-bold text-[16px]  bg-transparent"
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

  function ExhibitionList({
    items,
    title,
  }: {
    items: typeof soloExhibitions;
    title: string;
  }) {
    return (
      <div
        className={`mb-[64px] grid grid-cols-[4ch_1fr] gap-x-[9px] lg:gap-x-[32px]`}
      >
        {/* Heading row: empty year cell + title in col 2 */}
        <span />
        <WigglyButton
          text={title}
          size="text-[16px] lg:text-[16px]"
          className="mb-[9px] lg:mb-[9px] justify-start tracking-wider  px-0"
          active={true}
        />
        {groupByYear(items).map(([year, exs]) =>
          exs.map((ex, idx) => {
            const slug = findExhibitionSlug(ex.title.rendered);
            return (
              <Fragment key={ex.id}>
                <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman no-hide-text">
                  {idx === 0 ? year : ""}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-1 pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman whitespace-normal no-hide-text">
                  {slug ? (
                    <Button
                      variant="link"
                      size="controls"
                      className="text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman font-normal  p-0 h-auto  justify-start"
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
              </Fragment>
            );
          }),
        )}
      </div>
    );
  }

  return (
    <section className="mt-[18px] lg:mt-[54px] relative w-full mb-[64px]">
      <ScrollHint />
      <ScrollRevealInit />

      <div className="text-foreground flex flex-col gap-y-[18px] lg:gap-y-0 w-full lg:grid lg:grid-cols-12 pt-[0px] lg:gap-x-[64px] px-[18px] lg:px-[9px] pb-[64px]">
        <div className="flex flex-col lg:col-start-1 lg:col-span-10 mb-[18px] lg:mb-[32px] mt-[0px]">
          <HeroText />
        </div>

        <div className="flex flex-col col-start-1 lg:col-span-4">
          {groupExhibitions.length > 0 && (
            <ExhibitionList
              items={groupExhibitions}
              title="Group Exhibitions"
            />
          )}
        </div>
        <div className="flex flex-col lg:col-span-4 lg:col-start-5">
          {soloExhibitions.length > 0 && (
            <ExhibitionList items={soloExhibitions} title="Solo Exhibitions" />
          )}
        </div>

        {/* Education */}
        <div className="flex flex-col lg:col-span-4 mb-[18px]">
          {educations.length > 0 && (
            <div className="grid grid-cols-[8ch_1fr] gap-x-[9px] lg:gap-x-[32px] content-start mb-[64px]">
              <span />
              <WigglyButton
                text="Education"
                size="text-[16px]"
                className="mb-[9px] pl-0 justify-start tracking-wider "
                active
              />
              {educations.map((edu) => (
                <Fragment key={edu.id}>
                  <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
                    {`${edu.acf.start_year}–${edu.acf.end_year}`}
                  </span>
                  <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
                    {edu.acf.school}, {edu.acf.city}
                  </span>
                </Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Grants */}
        <div className="flex flex-col lg:col-span-4 lg:col-start-1 mb-[32px]">
          {grants.length > 0 && (
            <div className="grid grid-cols-[4ch_1fr] gap-x-[9px] lg:gap-x-[32px] content-start mb-[64px]">
              <span />
              <WigglyButton
                text="Grants"
                size="text-[16px]"
                className="mb-[9px] pl-0 justify-start tracking-wider "
                active
              />
              {groupByYear(grants).map(([year, gs]) =>
                gs.map((grant) => (
                  <Fragment key={grant.id}>
                    <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
                      {year}
                    </span>
                    <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
                      {grant.acf.title}
                    </span>
                  </Fragment>
                )),
              )}
            </div>
          )}
        </div>

        {/* Press */}
        <div className="flex flex-col lg:col-span-4 mb-[18px]">
          <div className="grid grid-cols-[4ch_1fr] gap-x-[9px] lg:gap-x-[32px] content-start mb-[64px]">
            <span />
            <WigglyButton
              text="Press"
              size="text-[16px]"
              className="mb-[9px] justify-start tracking-wider  pl-0"
              active
            />
            <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
              2022
            </span>
            <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman flex flex-wrap gap-x-1">
              <span>Hjärtat,</span>
              <span>Lappalainen Hjertström, L-E,</span>
              <Link
                className="underline underline-offset-4 decoration-1 hover:no-underline"
                href="https://kunstkritikk.se/hjartats-energi/"
              >
                kunstkritikk.se
              </Link>
            </span>
            <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
              2025
            </span>
            <span className="pt-[9px] text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman flex flex-wrap gap-x-1">
              <span>Gameplay,</span>
              <span>Slöör, S, Omkonst,</span>
              <Link
                className="underline underline-offset-4 decoration-1 hover:no-underline"
                href="https://omkonst.se/25-gameplay.shtml"
              >
                omkonst.se
              </Link>
            </span>
          </div>
        </div>

        {/* Colophon */}
        <div className="flex flex-col lg:col-span-4">
          <WigglyButton
            text="Colophon"
            size="text-[16px] "
            className="mb-[9px] justify-start tracking-wider px-0 "
            active={true}
          />
          <div className="flex flex-col  mb-4">
            <InfoRow
              labelClassName="text-foreground"
              label="Design & code"
            >
              <Link
                className="underline underline-offset-4 decoration-1 hover:no-underline text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman"
                href="/"
              >
                Joel Järvi
              </Link>
            </InfoRow>
            <InfoRow labelClassName="text-foreground" label="Typefaces">
              <span className="text-[16px]  leading-[1.2] tracking-wide font-timesNewRoman">
                Times New Roman
              </span>
            </InfoRow>
          </div>
        </div>

        <div className="px-[0px] py-4 col-span-6 ">
          <p className="font-timesNewRoman text-[16px]  text-foreground leading-snug">
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

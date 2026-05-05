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
import WigglyDivider from "@/components/WigglyDivider";

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
      className="lg:hidden fixed inset-0 flex items-center justify-center z-[50] pointer-events-none font-timesNewRoman font-bold text-[16px] bg-transparent"
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

function HDiv({ className = "" }: { className?: string }) {
  return (
    <WigglyDivider
      text="info"
      size="text-[8px]"
      className={`w-full text-muted-foreground ${className}`}
      active
    />
  );
}

function VDiv() {
  return (
    <WigglyDivider
      vertical
      text="info"
      size="text-[8px]"
      className="hidden lg:flex w-[20px] flex-shrink-0 text-muted-foreground"
      active
    />
  );
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
      <div className="grid grid-cols-[4ch_1fr] gap-x-[9px] lg:gap-x-[32px]">
        <span />
        <WigglyButton
          text={title}
          size="text-[16px]"
          className="mb-[9px] justify-start tracking-wider px-0"
          active
        />
        {groupByYear(items).map(([year, exs]) =>
          exs.map((ex, idx) => {
            const slug = findExhibitionSlug(ex.title.rendered);
            return (
              <Fragment key={ex.id}>
                <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman no-hide-text">
                  {idx === 0 ? year : ""}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-1 pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman whitespace-normal no-hide-text">
                  {slug ? (
                    <Button
                      variant="link"
                      size="controls"
                      className="text-[16px] leading-[1.2] tracking-wide font-timesNewRoman font-normal p-0 h-auto justify-start"
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

      <div className="text-foreground flex flex-col w-full px-[18px] lg:px-[9px] pb-[64px]">
        {/* Hero */}
        <div className="mb-[18px] lg:mb-[32px] lg:max-w-[66%]">
          <HeroText />
        </div>

        <HDiv />

        {/* Row 1: Group Exhibitions | Solo Exhibitions | Education */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 pt-[9px] pb-[18px]">
            {groupExhibitions.length > 0 && (
              <ExhibitionList items={groupExhibitions} title="Group Exhibitions" />
            )}
          </div>
          <HDiv className="lg:hidden" />
          <VDiv />
          <div className="flex-1 pt-[9px] pb-[18px]">
            {soloExhibitions.length > 0 && (
              <ExhibitionList items={soloExhibitions} title="Solo Exhibitions" />
            )}
          </div>
          <HDiv className="lg:hidden" />
          <VDiv />
          <div className="flex-1 pt-[9px] pb-[18px]">
            {educations.length > 0 && (
              <div className="grid grid-cols-[8ch_1fr] gap-x-[9px] lg:gap-x-[32px] content-start">
                <span />
                <WigglyButton
                  text="Education"
                  size="text-[16px]"
                  className="mb-[9px] pl-0 justify-start tracking-wider"
                  active
                />
                {educations.map((edu) => (
                  <Fragment key={edu.id}>
                    <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                      {`${edu.acf.start_year}–${edu.acf.end_year}`}
                    </span>
                    <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                      {edu.acf.school}, {edu.acf.city}
                    </span>
                  </Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        <HDiv />

        {/* Row 2: Grants | Press | Colophon */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 pt-[9px] pb-[18px]">
            {grants.length > 0 && (
              <div className="grid grid-cols-[4ch_1fr] gap-x-[9px] lg:gap-x-[32px] content-start">
                <span />
                <WigglyButton
                  text="Grants"
                  size="text-[16px]"
                  className="mb-[9px] pl-0 justify-start tracking-wider"
                  active
                />
                {groupByYear(grants).map(([year, gs]) =>
                  gs.map((grant) => (
                    <Fragment key={grant.id}>
                      <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                        {year}
                      </span>
                      <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                        {grant.acf.title}
                      </span>
                    </Fragment>
                  )),
                )}
              </div>
            )}
          </div>
          <HDiv className="lg:hidden" />
          <VDiv />
          <div className="flex-1 pt-[9px] pb-[18px]">
            <div className="grid grid-cols-[4ch_1fr] gap-x-[9px] lg:gap-x-[32px] content-start">
              <span />
              <WigglyButton
                text="Press"
                size="text-[16px]"
                className="mb-[9px] justify-start tracking-wider pl-0"
                active
              />
              <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                2022
              </span>
              <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman flex flex-wrap gap-x-1">
                <span>Hjärtat,</span>
                <span>Lappalainen Hjertström, L-E,</span>
                <Link
                  className="underline underline-offset-4 decoration-1 hover:no-underline"
                  href="https://kunstkritikk.se/hjartats-energi/"
                >
                  kunstkritikk.se
                </Link>
              </span>
              <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                2025
              </span>
              <span className="pt-[9px] text-[16px] leading-[1.2] tracking-wide font-timesNewRoman flex flex-wrap gap-x-1">
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
          <HDiv className="lg:hidden" />
          <VDiv />
          <div className="flex-1 pt-[9px] pb-[18px]">
            <WigglyButton
              text="Colophon"
              size="text-[16px]"
              className="mb-[9px] justify-start tracking-wider px-0"
              active
            />
            <div className="flex flex-col mb-4">
              <InfoRow labelClassName="text-foreground" label="Design & code">
                <Link
                  className="underline underline-offset-4 decoration-1 hover:no-underline text-[16px] leading-[1.2] tracking-wide font-timesNewRoman"
                  href="/"
                >
                  Joel Järvi
                </Link>
              </InfoRow>
              <InfoRow labelClassName="text-foreground" label="Typefaces">
                <span className="text-[16px] leading-[1.2] tracking-wide font-timesNewRoman">
                  Times New Roman
                </span>
              </InfoRow>
            </div>
          </div>
        </div>

        <HDiv />

        {/* Copyright */}
        <div className="py-4">
          <p className="font-timesNewRoman text-[16px] text-foreground leading-snug">
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

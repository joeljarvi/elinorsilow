"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
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
      className="lg:hidden fixed inset-0 flex items-center justify-center z-[50] pointer-events-none font-timesNewRoman font-bold text-2xl lg:text-3xl bg-transparent"
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
      className={`w-full  ${className}`}
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
      <div className="flex flex-col gap-y-0 pt-0 items-start justify-center w-full">
        <span className="flex flex-col lg:grid grid-cols-3 w-full items-start justify-start gap-x-4">
          <WigglyButton
            text={title}
            size="text-3xl"
            mobileSize="text-2xl"
            className="lowercase col-start-1 col-span-1 justify-start tracking-wider px-0 mb-4 leading-tight"
            bold
            forceBaseline
            anchorFill="currentColor"
            wiggleGradient
            active
          />
          <div className="w-full col-span-2 flex flex-col gap-y-0">
            {groupByYear(items).map(([year, exs]) => (
              <div key={year} className="flex gap-x-4 items-baseline mb-0">
                <WigglyButton
                  text={year}
                  size="text-3xl"
                  mobileSize="text-2xl"
                  className="tracking-wide leading-tight px-0"
                  forceBaseline
                  anchorFill="currentColor"
                />
                <div className="flex flex-col gap-y-0">
                  {exs.map((ex) => {
                    const slug = findExhibitionSlug(ex.title.rendered);
                    return (
                      <div
                        key={ex.id}
                        className="flex flex-wrap items-baseline gap-x-0 text-2xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman px-0"
                      >
                        {slug ? (
                          <WigglyButton
                            text={ex.title.rendered}
                            size="text-3xl"
                            mobileSize="text-2xl"
                            className="tracking-wide leading-tight items-baseline whitespace-normal px-0"
                            forceBaseline
                            onClick={() => {
                              setActiveExhibitionSlug(slug);
                              setOpen(false);
                            }}
                            bold
                            anchorFill="currentColor"
                          />
                        ) : (
                          <WigglyButton
                            text={ex.title.rendered}
                            size="text-3xl"
                            mobileSize="text-2xl"
                            className="tracking-wide leading-tight whitespace-normal px-0"
                            forceBaseline
                            anchorFill="currentColor"
                          />
                        )}
                        <span className="font-timesNewRoman text-2xl lg:text-3xl leading-[1.1]">
                          ,{" "}
                        </span>
                        <span className="leading-[1.1] whitespace-normal">
                          {ex.acf.venue}, {ex.acf.city}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </span>
      </div>
    );
  }

  return (
    <section className="text-foreground relative w-full min-h-dvh px-6 lg:px-4 pt-36">
      <div className="text-foreground flex flex-col w-full">
        {/* Hero */}
        <div id="bio" className="lg:max-w-[66%] lg:mx-auto mb-8 ">
          <HeroText />
        </div>

        {/* Row 1: Group Exhibitions | Solo Exhibitions | Education */}
        <div className="flex flex-col justify-start gap-y-0 w-full">
          <div id="group-exhibitions" className="flex-1 w-full mb-8">
            {groupExhibitions.length > 0 && (
              <ExhibitionList
                items={groupExhibitions}
                title="group exhibitions"
              />
            )}
          </div>

          <div id="solo-exhibitions" className="flex-1 mb-8">
            {soloExhibitions.length > 0 && (
              <ExhibitionList
                items={soloExhibitions}
                title="solo exhibitions"
              />
            )}
          </div>

          <div id="education" className="flex-1 mb-8">
            {educations.length > 0 && (
              <div className="flex flex-col gap-y-0 items-start justify-start">
                <span className="flex flex-col lg:grid grid-cols-3 w-full items-start justify-start gap-x-4">
                  <WigglyButton
                    text="education"
                    size="text-3xl"
                    mobileSize="text-2xl"
                    className="lowercase justify-start tracking-wider px-0 mb-2 leading-tight"
                    bold
                    forceBaseline
                  />
                  <div className="w-full col-span-2 ">
                    {educations.map((edu) => (
                      <div
                        key={edu.id}
                        className="flex lg:grid grid-cols-3 gap-x-4 items-baseline mb-1 "
                      >
                        <WigglyButton
                          text={`${edu.acf.start_year}-${edu.acf.end_year}`}
                          size="text-3xl"
                          mobileSize="text-2xl"
                          className="col-span-1 tracking-wide leading-tight lowercase shrink-0 px-0 w-36"
                          forceBaseline
                        />
                        <span className="text-2xl lg:text-3xl tracking-wide font-timesNewRoman leading-tight col-span-3">
                          {edu.acf.school}, {edu.acf.city}
                        </span>
                      </div>
                    ))}
                  </div>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Grants | Press | Colophon */}
        <div className="flex flex-col gap-y-0 mb-4 lg:mt-8">
          <div id="grants" className="flex-1 mb-4">
            {grants.length > 0 && (
              <div className="flex flex-col gap-y-0 items-start justify-center">
                <span className="lg:grid grid-cols-3 w-full items-start justify-start gap-x-4">
                  <WigglyButton
                    text="grants"
                    size="text-3xl"
                    mobileSize="text-2xl"
                    className="lowercase justify-start tracking-wider px-0 mb-2 leading-tight"
                    bold
                  />
                  <div className="w-full col-span-2">
                    {groupByYear(grants).map(([year, gs]) =>
                      gs.map((grant) => (
                        <div
                          key={grant.id}
                          className="flex gap-x-6 items-baseline mb-1"
                        >
                          <WigglyButton
                            text={year}
                            size="text-3xl"
                            mobileSize="text-2xl"
                            className="tracking-wide leading-tight lowercase shrink-0 px-0 "
                            forceBaseline
                          />
                          <span className="text-2xl lg:text-3xl tracking-wide font-timesNewRoman leading-tight">
                            {grant.acf.title}
                          </span>
                        </div>
                      )),
                    )}
                  </div>
                </span>
              </div>
            )}
          </div>

          <div id="press" className="flex-1 mb-4">
            <div className="flex flex-col items-start justify-center">
              <span className="lg:grid grid-cols-3 w-full items-start justify-start gap-x-4">
                <WigglyButton
                  text="press"
                  size="text-3xl"
                  mobileSize="text-2xl"
                  className="lowercase justify-start tracking-wider px-0 mb-2 leading-tight"
                  bold
                />
                <div className="w-full col-span-2">
                  <div className="flex gap-x-6 items-baseline mb-1">
                    <WigglyButton
                      text="2022"
                      size="text-3xl"
                      mobileSize="text-2xl"
                      className="tracking-wide leading-tight lowercase shrink-0 px-0"
                      forceBaseline
                    />
                    <div className="flex flex-wrap items-baseline gap-x-1 text-2xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman">
                      <span>Hjärtat,</span>
                      <span>Lappalainen Hjertström, L-E,</span>
                      <Link
                        className="underline underline-offset-4 decoration-1 hover:no-underline"
                        href="https://kunstkritikk.se/hjartats-energi/"
                      >
                        kunstkritikk.se
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-x-6 items-baseline">
                    <WigglyButton
                      text="2025"
                      size="text-3xl"
                      mobileSize="text-2xl"
                      className="tracking-wide leading-tight lowercase shrink-0 px-0"
                      forceBaseline
                    />
                    <div className="flex flex-wrap items-baseline gap-x-1 text-2xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman">
                      <span>Gameplay,</span>
                      <span>Slöör, S, Omkonst,</span>
                      <Link
                        className="underline underline-offset-4 decoration-1 hover:no-underline"
                        href="https://omkonst.se/25-gameplay.shtml"
                      >
                        omkonst.se
                      </Link>
                    </div>
                  </div>
                </div>
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col items-start justify-center">
              <span className="lg:grid grid-cols-3 w-full items-start justify-start gap-x-4">
                <WigglyButton
                  text="colophon"
                  size="text-3xl"
                  mobileSize="text-2xl"
                  className="lowercase justify-start tracking-wider px-0 mb-2 leading-tight"
                  bold
                />
                <div className="col-span-2 flex flex-col gap-y-0">
                  <div className="flex flex-wrap items-baseline gap-x-1 text-2xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman">
                    <span className="text-foreground">Design & code:</span>
                    <Link
                      className="underline underline-offset-4 decoration-1 hover:no-underline"
                      href="/"
                    >
                      Joel Järvi
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-1 text-2xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman">
                    <span className="text-foreground">Typefaces:</span>
                    <span>Times New Roman</span>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>

        <HDiv />

        {/* Copyright */}
        <div className="pt-4 pb-8">
          <p className="font-timesNewRoman text-foreground text-2xl leading-[1.1] lg:text-3xl text-left lg:text-center">
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

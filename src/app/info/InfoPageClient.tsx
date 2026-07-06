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
      className="lg:hidden fixed inset-0 flex items-center justify-center z-[50] pointer-events-none font-timesNewRoman font-bold text-xl lg:text-3xl bg-transparent"
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

export default function InfoPageClient({ bio = "" }: { bio?: string }) {
  const { educations, grants, soloExhibitions, groupExhibitions } = useInfo();
  const { setOpen } = useUI();
  const { findExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  const stack = "flex flex-col items-start lg:items-center";
  const centerText = "justify-start lg:justify-center text-left lg:text-center";

  function ExhibitionList({
    items,
    title,
  }: {
    items: typeof soloExhibitions;
    title: string;
  }) {
    return (
      <div className={`${stack} ${centerText} w-full`}>
        <WigglyButton
          text={title}
          size="text-3xl"
          mobileSize="text-xl"
          className={`lowercase ${centerText} tracking-wider px-0 mb-4 leading-tight`}
          bold
          forceBaseline
          anchorFill="currentColor"
          wiggleGradient
          active
        />
        <div className={`${stack} w-full `}>
          {groupByYear(items).map(([year, exs]) => (
            <div
              key={year}
              className={`flex flex-col items-start lg:flex-col  leading-tight justify-center lg:items-center ${centerText} gap-x-4 w-full mb-8`}
            >
              <WigglyButton
                text={year}
                size="text-3xl"
                mobileSize="text-xl"
                className={`tracking-wide leading-tight px-0 justify-start ${centerText}`}
                forceBaseline
                bold
                anchorFill="currentColor"
              />
              <div className={`w-full ${stack}`}>
                {exs.map((ex) => {
                  const slug = findExhibitionSlug(ex.title.rendered);
                  return (
                    <div
                      key={ex.id}
                      className={`flex flex-wrap items-baseline gap-x-0 text-xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman  whitespace-normal justify-start  ${centerText}`}
                    >
                      <span className="inline-flex items-baseline whitespace-nowrap">
                        {slug ? (
                          <WigglyButton
                            text={ex.title.rendered}
                            size="text-3xl"
                            mobileSize="text-xl"
                            className="tracking-wide leading-tight items-baseline whitespace-normal px-0"
                            forceBaseline
                            onClick={() => {
                              setActiveExhibitionSlug(slug);
                              setOpen(false);
                            }}
                            active
                            anchorFill="currentColor"
                          />
                        ) : (
                          <WigglyButton
                            text={ex.title.rendered}
                            size="text-3xl"
                            mobileSize="text-xl"
                            className="tracking-wide leading-tight whitespace-normal px-0 text-foreground"
                            forceBaseline
                            anchorFill="currentColor"
                          />
                        )}
                        <span className="mr-1.5 lg:mr-2">, </span>
                      </span>
                      <span className="leading-tight whitespace-normal ">
                        {ex.acf.venue}, {ex.acf.city}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="text-foreground relative w-full min-h-dvh px-6 lg:px-4 ">
      <div className="text-foreground flex flex-col w-full">
        {/* Hero */}
        <div id="bio" className="lg:max-w-[66%] lg:mx-auto mb-16 ">
          <HeroText bio={bio} />
        </div>

        {/* Row 1: Exhibitions | Education */}
        <div className="flex flex-col justify-start gap-y-0 w-full">
          <div id="exhibitions" className="flex-1 w-full mb-16">
            {(soloExhibitions.length > 0 || groupExhibitions.length > 0) && (
              <ExhibitionList
                items={[...soloExhibitions, ...groupExhibitions]}
                title="all exhibitions"
              />
            )}
          </div>

          <div id="education" className="flex-1 mb-16">
            {educations.length > 0 && (
              <div className="flex flex-col gap-y-0 pt-0 items-start lg:items-center justify-start w-full text-left lg:text-center">
                <span className="flex flex-col w-full items-start lg:items-center justify-start gap-x-4 gap-y-0">
                  <WigglyButton
                    text="education"
                    size="text-3xl"
                    mobileSize="text-xl"
                    className="lowercase col-start-1 col-span-1 justify-start lg:justify-center lg:text-center tracking-wider px-0 mb-4 leading-tight"
                    bold
                    forceBaseline
                    anchorFill="currentColor"
                    wiggleGradient
                    active
                  />
                  <div className="w-full col-span-2 flex flex-col gap-y-0 items-start lg:items-center justify-start">
                    {[...educations]
                      .sort(
                        (a, b) =>
                          Number(b.acf.end_year) - Number(a.acf.end_year),
                      )
                      .map((edu) => (
                        <div
                          key={edu.id}
                          className="flex flex-col items-start justify-start lg:flex-row lg:items-baseline lg:justify-center gap-x-4 mb-8 w-full text-left lg:text-center"
                        >
                          <WigglyButton
                            text={`${edu.acf.start_year}–${edu.acf.end_year}`}
                            size="text-3xl"
                            mobileSize="text-xl"
                            className="tracking-wide leading-tight mb-0 px-0 justify-start lg:justify-center"
                            forceBaseline
                            bold
                            anchorFill="currentColor"
                          />
                          <div className="flex flex-col gap-y-0 items-start lg:items-center">
                            <div className="flex flex-wrap items-baseline gap-x-0 text-xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman px-0 justify-start lg:justify-center text-left lg:text-center">
                              <span className="leading-[1.1] whitespace-normal">
                                {edu.acf.school}, {edu.acf.city}
                              </span>
                            </div>
                          </div>
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
          <div id="grants" className="flex-1 mb-16">
            {grants.length > 0 && (
              <div className="flex flex-col gap-y-0 items-start lg:items-center justify-start lg:justify-center w-full text-left lg:text-center">
                <span className="flex flex-col w-full items-start lg:items-center gap-x-4 gap-y-0">
                  <WigglyButton
                    text="grants"
                    size="text-3xl"
                    mobileSize="text-xl"
                    className="lowercase justify-start lg:justify-center tracking-wider px-0 mb-8 leading-tight"
                    bold
                  />
                  <div className="w-full col-span-2 flex flex-col gap-y-0 items-start lg:items-center">
                    {groupByYear(grants).map(([year, gs]) => (
                      <div
                        key={year}
                        className="flex flex-col items-start justify-start lg:items-center lg:justify-center gap-x-6 mb-8 w-full text-left lg:text-center"
                      >
                        <WigglyButton
                          text={year}
                          size="text-3xl"
                          mobileSize="text-xl"
                          className="tracking-wide leading-tight lowercase shrink-0 px-0 justify-start mb-0 lg:justify-center"
                          forceBaseline
                          bold
                        />
                        <div className="flex flex-col gap-y-0 items-start lg:items-center">
                          {gs.map((grant) => (
                            <span
                              key={grant.id}
                              className="text-xl lg:text-3xl tracking-wide font-timesNewRoman leading-tight"
                            >
                              {grant.acf.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </span>
              </div>
            )}
          </div>

          <div id="press" className="flex-1 mb-16">
            <div className="flex flex-col items-start lg:items-center justify-start lg:justify-center w-full text-left lg:text-center">
              <span className="flex flex-col w-full items-start lg:items-center gap-x-4 gap-y-0">
                <WigglyButton
                  text="press"
                  size="text-3xl"
                  mobileSize="text-xl"
                  className="lowercase justify-start lg:justify-center tracking-wider px-0 mb-4 leading-tight"
                  bold
                />
                <div className="w-full col-span-2 flex flex-col gap-y-0 items-start lg:items-center">
                  <div className="flex flex-col items-start justify-start lg:flex-row lg:items-baseline lg:justify-center gap-x-6 mb-0 w-full text-left lg:text-center">
                    <WigglyButton
                      text="2022"
                      size="text-3xl"
                      mobileSize="text-xl"
                      className="tracking-wide leading-tight lowercase mb-0 shrink-0 px-0 justify-start lg:justify-center"
                      forceBaseline
                      bold
                    />
                    <div className="flex flex-wrap items-baseline gap-x-1 text-xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman justify-start  mb-8 lg:justify-center">
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
                  <div className="flex flex-col items-start justify-start lg:flex-row lg:items-baseline lg:justify-center gap-x-6 w-full text-left lg:text-center">
                    <WigglyButton
                      text="2025"
                      size="text-3xl"
                      mobileSize="text-xl"
                      className="tracking-wide leading-tight lowercase shrink-0 px-0 mb-0 justify-start lg:justify-center"
                      forceBaseline
                      bold
                    />
                    <div className="flex flex-wrap items-baseline gap-x-1 text-xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman justify-start mb-8 lg:justify-center">
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

          <div className="flex-1 mb-16">
            <div className="flex flex-col items-start lg:items-center justify-start lg:justify-center w-full text-left lg:text-center">
              <span className="flex flex-col w-full items-start lg:items-center gap-x-4 gap-y-0">
                <WigglyButton
                  text="colophon"
                  size="text-3xl"
                  mobileSize="text-xl"
                  className="lowercase justify-start lg:justify-center tracking-wider px-0 mb-4 leading-tight"
                  bold
                />
                <div className="col-span-2 flex flex-col gap-y-0 items-start lg:items-center">
                  <div className="flex flex-wrap items-baseline gap-x-1 text-xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman justify-start lg:justify-center">
                    <span className="text-foreground">Design & code:</span>
                    <Link
                      className="underline underline-offset-4 decoration-1 hover:no-underline"
                      href="/"
                    >
                      Joel Järvi
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-1 text-xl lg:text-3xl leading-tight tracking-wide font-timesNewRoman justify-start lg:justify-center">
                    <span className="text-foreground">Typefaces:</span>
                    <span>Times New Roman</span>
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 pb-8">
          <p className="font-timesNewRoman text-foreground text-xl leading-[1.2] lg:leading-[1.1] lg:text-3xl text-left lg:text-center lg:max-w-[66%] lg:mx-auto">
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

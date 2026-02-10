"use client";
import { useState } from "react";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import Staggered from "@/components/Staggered";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";

export default function InfoPageClient() {
  const {
    educations,
    grants,
    exhibitionList,
    soloExhibitions,
    groupExhibitions,
  } = useInfo();

  const { open, setOpen } = useUI();

  const { findExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  return (
    <div className="w-full flex flex-col items-start justify-start px-4 pt-36">
      {/* LEFT COLUMN */}

      {/* About Section */}
      <div className="w-full flex flex-col items-start justify-start ">
        <h2 className="h3 mb-2">About</h2>
        <p className="p text-left mb-4">
          Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based artist
          who explores raw emotion through painting, sculpture and textile.
        </p>
        <div className="p text-left">
          <p>
            Gösta Ekmans väg 10 <br />
            129 35 Hägersten
          </p>
          <Link href="mailto:elinor.silow@gmail.com" className="text-blue-600">
            elinor.silow@gmail.com
          </Link>
        </div>
      </div>

      {/* Solo Exhibitions */}
      {soloExhibitions.length > 0 && (
        <section className="flex flex-col items-start justify-start w-full mb-12">
          <h3 className="h3 ">Solo Exhibitions</h3>
          <Staggered
            items={soloExhibitions}
            className="w-full flex flex-col items-stretch justify-start space-y-1"
            renderItem={(ex) => {
              const slug = findExhibitionSlug(ex.title.rendered);
              return (
                <div
                  key={ex.id}
                  className="flex flex-wrap items-center justify-start"
                >
                  {slug ? (
                    <Button
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                      className=" text-blue-600  mr-1"
                      variant="link"
                    >
                      {ex.title.rendered},
                    </Button>
                  ) : (
                    <span className=" mr-1">{ex.title.rendered},</span>
                  )}
                  {ex.acf.year}, {ex.acf.venue}, {ex.acf.city}
                </div>
              );
            }}
          />
        </section>
      )}

      {groupExhibitions.length > 0 && (
        <section className="flex flex-col items-start justify-start w-full ">
          <h3 className="h3 mb-4">All exhibitions</h3>
          <Staggered
            items={groupExhibitions}
            className="w-full flex flex-col items-stretch justify-start space-y-1"
            renderItem={(ex) => {
              const slug = findExhibitionSlug(ex.title.rendered);
              return (
                <div
                  key={ex.id}
                  className="flex flex-wrap justify-start items-center "
                >
                  {slug ? (
                    <Button
                      variant="link"
                      className=""
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                    >
                      {ex.title.rendered}
                    </Button>
                  ) : (
                    <span className="">{ex.title.rendered}</span>
                  )}
                  {ex.acf.venue}, {ex.acf.city} ({ex.acf.year})
                </div>
              );
            }}
          />
        </section>
      )}

      {grants.length > 0 && (
        <section className="flex flex-col items-start justify-start w-full">
          <h3 className="h3  ">Grants</h3>
          <Staggered
            items={grants}
            className="flex flex-col items-stretch justify-start w-full space-y-1"
            renderItem={(grant) => (
              <div
                key={grant.id}
                className="flex flex-wrap items-center justify-start"
              >
                <span className="">{grant.acf.title}</span> ({grant.acf.year})
              </div>
            )}
          />
        </section>
      )}

      {educations.length > 0 && (
        <section className="flex flex-col items-start justify-start w-full">
          <h3 className="h3 f">Education</h3>
          <Staggered
            items={educations}
            className="flex flex-col items-stretch justify-start w-full "
            renderItem={(edu) => (
              <div
                key={edu.id}
                className=" flex flex-wrap items-center justify-start"
              >
                <span className="">{edu.acf.school}</span>
                {edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year})
              </div>
            )}
          />
        </section>
      )}

      <div className="flex flex-col items-stretch justify-start w-full">
        <h3 className="h3 ">Press</h3>
        <div className="flex flex-wrap items-center justify-start ">
          <span className="1">Hjärtat</span>
          <p>Lappalainen Hjertström, L-E (2022)</p>
          <p className="f">Kunstkritikk</p>
          <Link
            className="text-blue-600 ml-1"
            href="https://kunstkritikk.se/hjartats-energi/"
          >
            Link
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-start  gap-x-1">
          <span className="">Gameplay</span>
          <p>Slöör, S (2025)</p>
          <p className="">Omkonst</p>
          <Link
            className="text-blue-600 "
            href="https://omkonst.se/25-gameplay.shtml"
          >
            Link
          </Link>
        </div>
      </div>

      {/* Colophon */}
      <div className="w-full  ">
        <h3 className="h3 ">Colophon</h3>
        <div className="">
          <p>
            Design & code:{" "}
            <Link className="font-EBGaramondItalic text-blue-600" href="/">
              Joel Järvi
            </Link>
          </p>
          <p>
            Fonts: <span className="">Ginto</span> by Dinamo Typefaces and{" "}
            <span className="">EB Garamond</span> (12)
          </p>
        </div>
      </div>

      {/* Copyright Full Width Footer inside Info */}
      <div className="">
        <p className="">
          All content on this site, including images, text, and design, is the
          intellectual property of <span className="">Elinor Silow</span> unless
          otherwise stated. No part of this website may be copied, reproduced,
          distributed, or used without explicit written permission from the
          copyright holder.
        </p>
      </div>
    </div>
  );
}

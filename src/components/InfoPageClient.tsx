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
    <div className="mt-10 lg:mt-[25vh ]w-full flex flex-col items-start justify-start lg:grid lg:grid-cols-6 lg:gap-4 px-4 pb-8  ">
      {/* LEFT COLUMN */}

      {/* About Section */}
      <div className="mt-4 col-start-1 col-span-2 w-full flex flex-col items-start justify-start mb-16">
        <p className="p text-left mb-4">
          Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based artist
          who explores raw emotion through painting, sculpture and textile.
        </p>
        <div className="p text-left">
          <p>
            Please contact
            <Link
              href="mailto:elinor.silow@gmail.com"
              className="text-blue-600 mx-2"
            >
              hej@elinorsilow.com
            </Link>
            for collaborations and inquires.
          </p>
        </div>
      </div>

      {/* Solo Exhibitions */}
      {soloExhibitions.length > 0 && (
        <section className="col-start-1 col-span-5  flex flex-col items-start justify-start w-full mb-8">
          <h3 className="h3 mb-4">Solo Exhibitions</h3>
          <Staggered
            items={soloExhibitions}
            className="w-full flex flex-col items-stretch justify-start space-y-0"
            renderItem={(ex) => {
              const slug = findExhibitionSlug(ex.title.rendered);
              return (
                <div
                  key={ex.id}
                  className="flex flex-wrap items-baseline justify-start h3"
                >
                  {slug ? (
                    <Button
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                      className=" text-blue-600  mr-1"
                      variant="link"
                      size="linkSize"
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
        <section className="col-start-1  col-span-3 flex flex-col items-start justify-start w-full mb-8 ">
          <h3 className="h3 mb-4">All exhibitions</h3>
          <Staggered
            items={groupExhibitions}
            className="w-full flex flex-col items-stretch justify-start space-y-0"
            renderItem={(ex) => {
              const slug = findExhibitionSlug(ex.title.rendered);
              return (
                <div
                  key={ex.id}
                  className="flex flex-wrap justify-start items-baseline h3 "
                >
                  {slug ? (
                    <Button
                      variant="link"
                      size="linkSize"
                      className=" text-blue-600  mr-1"
                      onClick={() => {
                        setActiveExhibitionSlug(slug);
                        setOpen(false);
                      }}
                    >
                      {ex.title.rendered},
                    </Button>
                  ) : (
                    <span className="mr-3 ">{ex.title.rendered}</span>
                  )}
                  {ex.acf.venue}, {ex.acf.city} ({ex.acf.year})
                </div>
              );
            }}
          />
        </section>
      )}

      {grants.length > 0 && (
        <section className="col-start-1 col-span-6 flex flex-col items-start justify-start w-full mb-8">
          <h3 className="h3 mb-4 ">Grants</h3>
          <Staggered
            items={grants}
            className="flex flex-col items-stretch justify-start w-full space-y-0 h3"
            renderItem={(grant) => (
              <div
                key={grant.id}
                className="flex flex-wrap items-center justify-start"
              >
                <span className="mr-1">{grant.acf.title}, </span>
                {grant.acf.year}
              </div>
            )}
          />
        </section>
      )}

      {educations.length > 0 && (
        <section className="col-start-1 col-span-6 flex flex-col items-start justify-start w-full mb-8">
          <h3 className="h3 mb-4">Education</h3>
          <Staggered
            items={educations}
            className="flex flex-col items-stretch justify-start w-full gap-y-0 "
            renderItem={(edu) => (
              <div
                key={edu.id}
                className=" flex flex-wrap items-center justify-start h3"
              >
                <span className="">{edu.acf.school}</span>
                {edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year})
              </div>
            )}
          />
        </section>
      )}

      <div className="col-start-1 col-span-5 flex flex-col items-stretch justify-start w-full gap-y-0 mb-8">
        <h3 className="h3 mb-4">Press</h3>
        <div className="flex flex-wrap items-center justify-start h3 ">
          <span className="mr-1">Hjärtat,</span>
          <p className="mr-1">Lappalainen Hjertström, L-E (2022),</p>
          <Link
            className="text-blue-600 "
            href="https://kunstkritikk.se/hjartats-energi/"
          >
            "https://kunstkritikk.se/hjartats-energi/"
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-start  h3">
          <span className="mr-1">Gameplay, </span>
          <p className="mr-1">Slöör, S (2025)</p>
          <p className="mr-1">Omkonst, </p>
          <Link
            className="text-blue-600 "
            href="https://omkonst.se/25-gameplay.shtml"
          >
            "https://omkonst.se/25-gameplay.shtml"
          </Link>
        </div>
      </div>

      {/* Colophon */}
      <div className="w-full col-start-1 col-span-5  flex flex-col gap-y-0 mb-8 ">
        <h3 className="h3 mb-4">Colophon</h3>
        <div className="h3 ">
          <p>
            Design & code:{" "}
            <Link className="text-blue-600" href="/">
              Joel Järvi
            </Link>
          </p>
          <p>
            Font: <span className="">Director</span> from Velvetyne Type Foundry
          </p>
        </div>
      </div>

      {/* Copyright Full Width Footer inside Info */}
      <div className="col-start-1 col-span-2">
        <p className="p">
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

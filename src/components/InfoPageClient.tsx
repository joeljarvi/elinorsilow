"use client";
import Link from "next/link";
import { useInfo } from "@/context/InfoContext";
import Staggered from "@/components/Staggered";
import { Button } from "@/components/ui/button";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";

const textCls = "font-bookish text-base lg:text-xl";
const headingCls = `${textCls} mb-4`;

export default function InfoPageClient() {
  const { educations, grants, soloExhibitions, groupExhibitions } = useInfo();
  const { setOpen } = useUI();
  const { findExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  return (
    <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-3 lg:gap-x-8">

      {/* COL 1: About + Solo Exhibitions */}
      <div className="flex flex-col gap-y-12">

        <section className={textCls}>
          <p className="mb-4">
            Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based artist
            who explores raw emotion through painting, sculpture and textile.
          </p>
          <p>
            Please contact{" "}
            <Link
              href="mailto:elinor.silow@gmail.com"
              className="underline underline-offset-4 decoration-1 text-blue-600 hover:no-underline"
            >
              hej@elinorsilow.com
            </Link>{" "}
            for collaborations and inquiries.
          </p>
        </section>

        {soloExhibitions.length > 0 && (
          <section>
            <h3 className={headingCls}>Solo Exhibitions</h3>
            <Staggered
              items={soloExhibitions}
              className={`flex flex-col ${textCls}`}
              renderItem={(ex) => {
                const slug = findExhibitionSlug(ex.title.rendered);
                return (
                  <div key={ex.id} className="flex flex-wrap items-baseline">
                    {slug ? (
                      <Button
                        onClick={() => { setActiveExhibitionSlug(slug); setOpen(false); }}
                        className="underline underline-offset-4 decoration-1 text-blue-600 hover:no-underline p-0 h-auto text-base lg:text-xl font-bookish mr-1"
                        variant="link"
                      >
                        {ex.title.rendered},
                      </Button>
                    ) : (
                      <span className="mr-1">{ex.title.rendered},</span>
                    )}
                    <span>{ex.acf.year}, {ex.acf.venue}, {ex.acf.city}</span>
                  </div>
                );
              }}
            />
          </section>
        )}

        {educations.length > 0 && (
          <section>
            <h3 className={headingCls}>Education</h3>
            <Staggered
              items={educations}
              className={`flex flex-col ${textCls}`}
              renderItem={(edu) => (
                <div key={edu.id} className="flex flex-wrap items-baseline">
                  <span className="mr-1">{edu.acf.school},</span>
                  <span>{edu.acf.city} ({edu.acf.start_year}–{edu.acf.end_year})</span>
                </div>
              )}
            />
          </section>
        )}
      </div>

      {/* COL 2: Group Exhibitions */}
      <div className="flex flex-col gap-y-12 mt-12 lg:mt-0">

        {groupExhibitions.length > 0 && (
          <section>
            <h3 className={headingCls}>Group Exhibitions</h3>
            <Staggered
              items={groupExhibitions}
              className={`flex flex-col ${textCls}`}
              renderItem={(ex) => {
                const slug = findExhibitionSlug(ex.title.rendered);
                return (
                  <div key={ex.id} className="flex flex-wrap items-baseline">
                    {slug ? (
                      <Button
                        variant="link"
                        onClick={() => { setActiveExhibitionSlug(slug); setOpen(false); }}
                        className="underline underline-offset-4 decoration-1 text-blue-600 hover:no-underline p-0 h-auto text-base lg:text-xl font-bookish mr-1"
                      >
                        {ex.title.rendered},
                      </Button>
                    ) : (
                      <span className="mr-1">{ex.title.rendered},</span>
                    )}
                    <span>{ex.acf.venue}, {ex.acf.city} ({ex.acf.year})</span>
                  </div>
                );
              }}
            />
          </section>
        )}
      </div>

      {/* COL 3: Grants + Press + Colophon + Copyright */}
      <div className="flex flex-col gap-y-12 mt-12 lg:mt-0">

        {grants.length > 0 && (
          <section>
            <h3 className={headingCls}>Grants</h3>
            <Staggered
              items={grants}
              className={`flex flex-col ${textCls}`}
              renderItem={(grant) => (
                <div key={grant.id} className="flex flex-wrap items-baseline">
                  <span className="mr-1">{grant.acf.title}</span>
                  <span>({grant.acf.year})</span>
                </div>
              )}
            />
          </section>
        )}

        <section>
          <h3 className={headingCls}>Press</h3>
          <div className={`flex flex-col gap-y-1 ${textCls}`}>
            <div className="flex flex-wrap items-baseline">
              <span className="mr-1">Hjärtat,</span>
              <span className="mr-1">Lappalainen Hjertström, L-E (2022),</span>
              <Link
                className="underline underline-offset-4 decoration-1 text-blue-600 hover:no-underline"
                href="https://kunstkritikk.se/hjartats-energi/"
              >
                kunstkritikk.se
              </Link>
            </div>
            <div className="flex flex-wrap items-baseline">
              <span className="mr-1">Gameplay,</span>
              <span className="mr-1">Slöör, S (2025), Omkonst,</span>
              <Link
                className="underline underline-offset-4 decoration-1 text-blue-600 hover:no-underline"
                href="https://omkonst.se/25-gameplay.shtml"
              >
                omkonst.se
              </Link>
            </div>
          </div>
        </section>

        <section className={textCls}>
          <h3 className={headingCls}>Colophon</h3>
          <p>
            Design & code:{" "}
            <Link
              className="underline underline-offset-4 decoration-1 text-blue-600 hover:no-underline"
              href="/"
            >
              Joel Järvi
            </Link>
          </p>
          <p>Typeface: Bookish from Helsinki Type Studio</p>
        </section>

        <p className={textCls}>
          All content on this site, including images, text, and design, is the
          intellectual property of Elinor Silow unless otherwise stated. No part
          of this website may be copied, reproduced, distributed, or used without
          explicit written permission from the copyright holder.
        </p>
      </div>

    </div>
  );
}

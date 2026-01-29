"use client";

import { useExhibitions } from "@/context/ExhibitionsContext";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import VDivider from "@/components/VDivider";
import Staggered from "@/components/Staggered";
import HDivider from "@/components/HDivider";
import { Loader } from "@/components/Loader";
import { Exhibition, Exhibition_list } from "../../../lib/wordpress";

export default function ExhibitionsList() {
  const RandomExhibitionsAnimated = dynamic(
    () => import("./RandomExhibitionsAnimated"),
    { ssr: false, loading: () => <Loader /> }
  );

  const { fullExhibitionList, filteredExhibitions } = useExhibitions();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fullExhibitionList?.length) setLoading(false);
  }, [fullExhibitionList]);

  if (loading) return <Loader />;

  const exhibitionList: Exhibition_list[] = (fullExhibitionList || []).map(
    (exh) => ({
      id: exh.id,
      slug: exh.slug,
      title: exh.title,
      date: exh.date,
      acf: {
        year: exh.acf.year,
        exhibition_type: exh.acf.exhibition_type,
        venue: exh.acf.venue,
        city: exh.acf.city,
        description: exh.acf.description,
      },
    })
  );

  if (!exhibitionList.length) {
    return <p className="p-8 text-gray-500">No exhibitions available.</p>;
  }

  // --- Group by year ---
  const groupedByYear: Record<string, Exhibition_list[]> =
    exhibitionList.reduce((acc, exhibition) => {
      const year = exhibition.acf?.year || "Unknown";
      if (!acc[year]) acc[year] = [];
      acc[year].push(exhibition);
      return acc;
    }, {} as Record<string, Exhibition_list[]>);

  const sortedYears = Object.keys(groupedByYear).sort(
    (a, b) => Number(b) - Number(a)
  );

  const animatedExhibitions: Exhibition[] = filteredExhibitions || [];

  return (
    <>
      <Header />
      <section className="relative px-8 pb-8 pt-36 w-full min-h-screen font-pressura">
        <VDivider loading={loading} />
        <Staggered
          className="relative"
          items={sortedYears}
          loading={loading}
          renderItem={(year) => {
            const exhibitionsForYear = groupedByYear[year];

            return (
              <div key={year} className="relative">
                <h2 className="text-sm font-pressura p-4">{year}</h2>
                <HDivider loading={loading} />

                <div className="grid grid-cols-2">
                  {/* Textual list */}
                  <div className="pt-6 px-4 pb-6 flex flex-col justify-start">
                    <ul className="space-y-4">
                      {exhibitionsForYear.map((exhibition) => {
                        const title = exhibition.title?.rendered || "Untitled";
                        const venue = exhibition.acf?.venue || "";
                        const city = exhibition.acf?.city || "";
                        return (
                          <li key={exhibition.id}>
                            <Link
                              href={`/exhibitions/${exhibition.slug}`}
                              className="text-sm hover:text-blue-600 transition flex flex-col"
                            >
                              {title}
                              {(venue || city) && (
                                <span className="flex flex-col">
                                  {venue} {city}
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Animated display */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                  >
                    <Suspense fallback={<Loader />}>
                      <RandomExhibitionsAnimated
                        exhibitions={animatedExhibitions.filter((ex) =>
                          exhibitionsForYear.some((e) => e.id === ex.id)
                        )}
                        scale={1}
                      />
                    </Suspense>
                  </motion.div>
                </div>
              </div>
            );
          }}
        />
      </section>
    </>
  );
}

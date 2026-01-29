"use client";

import React from "react";
import { InfoProvider, useInfo } from "@/context/InfoContext";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import { useExhibitions } from "@/context/ExhibitionsContext";
import VDivider from "@/components/VDivider";
import HDivider from "@/components/HDivider";

function InfoPageContent() {
  const { biography, educations, grants, exhibitionList, loading } = useInfo();
  const { filteredExhibitions } = useExhibitions();

  if (loading) return <Loader />;

  return (
    <>
      <div className="mt-36 px-8 w-full grid grid-cols-1 md:grid-cols-2 min-h-screen font-pressura text-sm ">
        <VDivider loading={loading} />
        <div className="flex flex-col w-full">
          {/* Biography */}
          {biography && (
            <div className="flex flex-col     ">
              <h2 className="  font-pressura  pt-6 pl-4 lg:pl-6 pr-6 pb-4">
                Biography
              </h2>
              <HDivider />
              <div
                className="pt-6 pl-4 lg:pl-6 pr-6 pb-4"
                dangerouslySetInnerHTML={{ __html: biography.acf.bio }}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col  w-full">
          <h2 className="  font-pressura  pt-6 pl-4 lg:pl-6 pr-6 pb-4">
            Exhibitions
          </h2>
          <HDivider />
          <ul className="w-full flex flex-col pt-6 pl-4 lg:pl-6 pr-6 pb-4 gap-y-4">
            {exhibitionList.map((ex, i) => {
              // Find a matching exhibition by title
              const match = filteredExhibitions?.find(
                (realEx) =>
                  realEx.title.rendered.trim().toLowerCase() ===
                  ex.title.rendered.trim().toLowerCase()
              );

              return (
                <li key={i} className="flex justify-between ">
                  <h3 className="max-w-xs lg:max-w-lg flex flex-col ">
                    {match ? (
                      <Link
                        href={`/exhibitions/${match.slug}`}
                        className="  hover:underline"
                      >
                        {ex.title.rendered}
                      </Link>
                    ) : (
                      <span className="">{ex.title.rendered}</span>
                    )}
                    {ex.acf.venue}, {ex.acf.exhibition_type}
                  </h3>
                  <h3>{ex.acf.year}</h3>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Grants */}
        <div className=" flex flex-col  w-full">
          <h2 className="  pt-6 pl-4 lg:pl-6 pr-6 pb-4 font-pressura ">
            Grants
          </h2>
          <HDivider />
          <ul className="w-full flex flex-col pt-6 pl-4 lg:pl-6 pr-6 pb-4">
            {grants.map((grant, i) => (
              <li key={i} className="flex justify-between w-full">
                <h3 className="max-w-xs lg:max-w-lg">{grant.acf.title}</h3>
                <h3 className="text-left">{grant.acf.year}</h3>
              </li>
            ))}
          </ul>
        </div>
        {/* Education */}
        <div className="w-full flex flex-col ">
          <h2 className="  pt-6 pl-4 lg:pl-6 pr-6 pb-4 font-pressura ">
            Education
          </h2>
          <HDivider />
          <ul className="w-full flex flex-col pt-6 pl-4 lg:pl-6 pr-6 pb-16">
            {educations.map((edu, i) => (
              <li key={i} className="flex justify-between w-full">
                <h3 className="max-w-xs lg:max-w-lg flex flex-col">
                  {edu.acf.school}
                  {edu.acf.city}
                </h3>
                <h3>
                  {edu.acf.start_year}-{edu.acf.end_year}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default function InfoPageClient() {
  return <InfoPageContent />;
}

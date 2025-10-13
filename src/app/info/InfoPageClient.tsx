"use client";

import React from "react";
import { InfoProvider, useInfo } from "@/context/InfoContext";
import Header from "@/components/Header";
import { Loader } from "@/components/Loader";
import Link from "next/link";
import { useExhibitions } from "@/context/ExhibitionsContext";

function InfoPageContent() {
  const { biography, educations, grants, exhibitionList, loading } = useInfo();
  const { filteredExhibitions } = useExhibitions();

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <div className="mt-[25vh] w-full flex flex-col lg:flex-row flex-wrap  justify-start items-start font-hershey text-2xl lg:text-xl h-auto gap-6 lg:gap-0 lg:gap-y-6  max-w-5xl ">
        <div className="flex flex-col p-3">
          {/* Biography */}
          {biography && (
            <div className="w-full flex flex-col">
              <h2 className="mb-3 uppercase min-w-xs max-w-xs lg:min-w-lg lg:max-w-lg">
                Biography
              </h2>
              <div dangerouslySetInnerHTML={{ __html: biography.acf.bio }} />
            </div>
          )}
        </div>

        <div className="flex flex-col p-3 w-full">
          <h2 className="mb-3 uppercase">Exhibitions</h2>
          <ul className="w-full flex flex-col gap-3">
            {exhibitionList.map((ex, i) => {
              // Find a matching exhibition by title
              const match = filteredExhibitions?.find(
                (realEx) =>
                  realEx.title.rendered.trim().toLowerCase() ===
                  ex.title.rendered.trim().toLowerCase()
              );

              return (
                <li key={i} className="flex justify-between">
                  <h3 className="max-w-xs lg:max-w-lg flex flex-col">
                    {match ? (
                      <Link
                        href={`/exhibitions/${match.slug}`}
                        className="font-hershey uppercase font-normal hover:underline"
                      >
                        {ex.title.rendered}
                      </Link>
                    ) : (
                      <span className="font-hershey uppercase font-normal">
                        {ex.title.rendered}
                      </span>
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
        <div className=" flex flex-col p-3 w-full">
          <h2 className="mb-2 uppercase">Grants</h2>
          <ul className="w-full">
            {grants.map((grant, i) => (
              <li key={i} className="flex justify-between w-full">
                <h3 className="max-w-xs lg:max-w-lg">{grant.acf.title}</h3>
                <h3 className="text-left">{grant.acf.year}</h3>
              </li>
            ))}
          </ul>
        </div>

        {/* Education */}
        <div className="w-full flex flex-col p-3 font-hershey text-2xl lg:text-xl mb-12">
          <h2 className="mb-3 uppercase">Education</h2>
          <ul className="w-full">
            {educations.map((edu, i) => (
              <li key={i} className="flex justify-between w-full">
                <h3 className="max-w-xs lg:max-w-lg flex flex-col">
                  <strong className="font-hershey uppercase font-normal">
                    {edu.acf.school}
                  </strong>
                  {edu.acf.city}
                </h3>
                <h3>
                  {edu.acf.start_year} - {edu.acf.end_year}
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
  return (
    <InfoProvider>
      <InfoPageContent />
    </InfoProvider>
  );
}

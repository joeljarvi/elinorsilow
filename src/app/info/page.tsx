"use client";

import React, { useEffect, useState } from "react";
import {
  getBiography,
  getAllEducations,
  getAllGrants,
  Biography,
  Education,
  Grant,
} from "../../../lib/wordpress";
import Header from "@/components/Header";
import { Loader } from "@/components/Loader";

export default function InfoPage() {
  const [biography, setBiography] = useState<Biography | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bio, edu, gr] = await Promise.all([
          getBiography(),
          getAllEducations(),
          getAllGrants(),
        ]);
        setBiography(bio);
        setEducations(edu);
        setGrants(gr);
      } catch (error) {
        console.error("Error fetching info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col px-4.5 mt-[25%] lg:mt-[12.5%]  font-hershey text-2xl">
        <div className="flex flex-col  mb-[25%] lg:mb-[12.5%] w-full gap-3">
          <a
            href="mailto:elinor.silow@gmail.com"
            className="uppercase hover:underline underline-offset-4"
          >
            <h2>Email</h2>
          </a>
          <a
            href="instagram.com/elinorsilow"
            className=" uppercase hover:underline underline-offset-4"
          >
            <h2>INSTAGRAM</h2>
          </a>
        </div>
        <div className="flex flex-col lg:flex-row justify-start lg:justify-between items-start lg:items-center h-full  w-full gap-8 lg:gap-6  ">
          <div className="flex flex-col items-start justify-start w-sm lg:w-1/3">
            {biography && (
              <>
                <h2 className="mb-3  uppercase">Biography</h2>
                <div dangerouslySetInnerHTML={{ __html: biography.acf.bio }} />
              </>
            )}
          </div>

          <div className="flex flex-col items-start justify-start  w-full lg:w-1/3">
            <h2 className=" mb-3 uppercase ">Education</h2>
            <ul className="w-full">
              {educations.map((edu, index) => (
                <li
                  className="flex justify-between items-center  w-full"
                  key={index}
                >
                  <h3 className="max-w-sm ">{edu.acf.title}</h3>
                  <h3 className="text-left">
                    {edu.acf.start_year}-{edu.acf.end_year}
                  </h3>
                  <h3 className="">{edu.acf.city}</h3>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start justify-start  w-full lg:w-1/3">
            <h2 className="mb-2 uppercase">Grants</h2>
            <ul className="w-full">
              {grants.map((grant, index) => (
                <li
                  className="flex justify-between items-start w-full"
                  key={index}
                >
                  <h3 className="max-w-3/4">{grant.acf.title}</h3>
                  <h3 className="text-left">{grant.acf.year}</h3>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

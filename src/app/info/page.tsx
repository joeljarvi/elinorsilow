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
      <div className="fixed z-20 top-0 right-0 flex gap-3 p-3 h-auto lg:right-auto lg:left-0 lg:grid lg:grid-rows-4  lg:h-full font-hershey text-2xl lg:text-xl">
        <a
          href="mailto:elinor.silow@gmail.com"
          className="uppercase hover:underline underline-offset-4 row-start-2"
        >
          <h2>Email</h2>
        </a>
        <a
          href="instagram.com/elinorsilow"
          className=" uppercase hover:underline underline-offset-4 row-start-3"
        >
          <h2>INSTAGRAM</h2>
        </a>
      </div>
      <div className=" grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-4  p-3 font-hershey text-2xl lg:text-xl w-full gap-12 h-full lg:h-screen">
        <div className="mt-24 lg:col-start-2 lg:row-start-2 flex flex-col items-start justify-start ">
          {biography && (
            <>
              <h2 className="mb-3  uppercase">Biography</h2>
              <div dangerouslySetInnerHTML={{ __html: biography.acf.bio }} />
            </>
          )}
        </div>
        <div className="lg:col-start-3 lg:col-span-2 lg:row-start-2 flex flex-col items-start justify-start ">
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
        <div className="lg:col-start-2 lg:col-span-3 lg:row-start-4 flex flex-col items-start justify-start ">
          <h2 className=" mb-3 uppercase ">Education</h2>
          <ul className="w-full">
            {educations.map((edu, index) => (
              <li
                className="flex justify-between items-center  w-full"
                key={index}
              >
                <h3 className="max-w-sm ">{edu.acf.school}</h3>
                <h3 className="text-left">
                  {edu.acf.start_year}-{edu.acf.end_year}
                </h3>
                <h3 className="">{edu.acf.city}</h3>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-screen"></div>
      </div>
    </>
  );
}

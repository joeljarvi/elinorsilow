"use client";

import { useState } from "react";
import { Work } from "../../../lib/wordpress";
import WorkModal from "./WorkModal";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type AllWorksProps = {
  works: Work[];
  showInfo?: boolean;
};

export default function AllWorks({ works, showInfo = false }: AllWorksProps) {
  const [selectedWorkSlug, setSelectedWorkSlug] = useState<string | null>(null);

  const sortedWorks = works
    .slice()
    .sort((a, b) => Number(b.acf.year) - Number(a.acf.year));

  return (
    <div className=" ">
      <ul
        className="
   grid
    grid-cols-1
    md:grid-cols-3
    lg:grid-cols-6
    gap-y-16
    gap-x-12
    col-start-1
    lg:col-start-2
    lg:col-span-5

  "
      >
        {sortedWorks.map((work) => {
          return (
            <li
              key={work.id}
              className={`
   col-span-2 w-1/2 col-start-auto
      `}
            >
              <div
                onClick={() => setSelectedWorkSlug(work.slug)}
                className="group cursor-pointer"
              >
                {work.image_url && (
                  <Image
                    src={work.image_url}
                    alt={work.title.rendered}
                    width={1200}
                    height={1600}
                    className="w-full h-auto object-contain object-left "
                  />
                )}

                {showInfo && (
                  <div className="mt-2 text-sm font-fraunces font-light px-2">
                    <div className="font-gintoMedium">
                      {work.title.rendered}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {selectedWorkSlug && (
        <WorkModal
          slug={selectedWorkSlug}
          onClose={() => setSelectedWorkSlug(null)}
        />
      )}
    </div>
  );
}

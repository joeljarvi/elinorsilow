"use client";

import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useState, useRef, useEffect } from "react";
import { Work } from "../../../lib/wordpress";
import { motion, useScroll, useTransform } from "framer-motion";
import HDivider from "@/components/HDivider";
import { Button } from "@/components/ui/button";

export default function WorksPageClient() {
  const { filteredWorks, setActiveWorkSlug, getWorkSizeClass } = useWorks();
  const router = useRouter();
  const { setOpen } = useUI();
  const { showInfo } = useUI();

  return (
    <section className="relative w-full  ">
      {/* Scroll container */}
      <motion.div className="min-h-screen flex flex-col gap-y-4 lg:grid lg:grid-cols-6 p-0  lg:p-0">
        {filteredWorks.map((work: Work, idx: number) => (
          <motion.div
            key={work.id}
            className="h-screen lg:h-[75vh] flex flex-col bg-background   "
          >
            <div className="flex lg:hidden relative w-full  pointer-events-none">
              <div className="flex flex-col items-center justify-center  p-4  pointer-events-auto w-full  ">
                <span className="h1 font-directorBold uppercase mb-2 mt-2 ">
                  {work.title.rendered}
                </span>
                <div className="flex flex-col justify-center items-center text-sm font-directorLight gap-x-2 ">
                  {work.acf.year && (
                    <span className="">Year: {work.acf.year}</span>
                  )}
                  {work.acf.materials && (
                    <span className="text-center">
                      Materials: {work.acf.materials}{" "}
                    </span>
                  )}
                  {work.acf.dimensions && (
                    <span>Dimensions: {work.acf.dimensions}</span>
                  )}
                  {work.acf.exhibition && (
                    <span>Part of exhibition: {work.acf.exhibition}</span>
                  )}
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setActiveWorkSlug(work.slug);
                setOpen(false);
                router.push(`/?work=${work.slug}`);
              }}
              className="relative cursor-pointer w-full flex justify-center"
            >
              {/* Image box */}
              <div
                className={`relative mx-auto h-[80vh] lg:h-[50vh] ${getWorkSizeClass(
                  work.acf.dimensions
                )}`}
              >
                {work.image_url && (
                  <Image
                    src={work.image_url}
                    alt={work.title.rendered}
                    fill
                    className="object-contain object-top lg:object-top-left"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Flowing Caption */}
    </section>
  );
}

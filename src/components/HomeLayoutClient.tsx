"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Work, ActivityEntry } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";

import InfoBox from "./InfoBox";
import HistoryClient from "./HistoryClient";
import FixedCookieAccept from "./FixedCookieAccept";

const SCULPTURE_COLORS = ["#f97316"]; // orange-500

export default function HomeLayoutClient({
  recentWorks,
  updates,
}: {
  recentWorks: Work[];
  updates: ActivityEntry[];
}) {
  const { moreFun, moreFunBg, refreshMoreFunBg } = useUI();
  const [workIndex, setWorkIndex] = useState(0);
  const [sculptureBg, setSculptureBg] = useState<string | null>(null);

  const work = recentWorks[workIndex] ?? null;

  const advance = useCallback(() => {
    setWorkIndex((idx) => {
      const nextIndex = idx < recentWorks.length - 1 ? idx + 1 : 0;
      const nextWork = recentWorks[nextIndex] ?? null;
      if (nextWork?.acf?.category === "sculpture") {
        setSculptureBg(
          SCULPTURE_COLORS[Math.floor(Math.random() * SCULPTURE_COLORS.length)],
        );
      } else {
        setSculptureBg(null);
      }
      return nextIndex;
    });
    if (moreFun) refreshMoreFunBg();
  }, [recentWorks, moreFun, refreshMoreFunBg]);

  useEffect(() => {
    const id = setInterval(advance, 3000);
    return () => clearInterval(id);
  }, [advance]);

  return (
    <div
      className="h-dvh w-full flex flex-col px-4 pt-4 cursor-pointer transition-colors duration-300"
      style={{
        backgroundColor: sculptureBg ?? (moreFun ? moreFunBg : undefined),
      }}
      onClick={advance}
    >
      <div className=" relative w-full hidden">
        <HistoryClient updates={updates} />
      </div>
      {/* Image — centered in available space between nav and InfoBox */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ perspective: "800px" }}
      >
        {work?.image_url && (
          <motion.img
            src={work.image_url}
            alt={work.title.rendered}
            className="max-h-[50dvh] lg:max-h-[66.6dvh] max-w-full object-contain"
            style={{}}
          />
        )}
      </div>

      {work && (
        <div className="flex justify-center lg:justify-center px-2 lg:px-0 py-2">
          <InfoBox work={work} centered />
        </div>
      )}
    </div>
  );
}

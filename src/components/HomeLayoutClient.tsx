"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Work, ActivityEntry } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";

import Image from "next/image";
import InfoBox from "./InfoBox";
import HistoryClient from "./HistoryClient";

export default function HomeLayoutClient({
  recentWorks,
  updates,
}: {
  recentWorks: Work[];
  updates: ActivityEntry[];
}) {
  const { moreFun, refreshMoreFunBg, setHomeBg } = useUI();
  const [workIndex, setWorkIndex] = useState(0);
  const [trumpetFrame, setTrumpetFrame] = useState(1);

  const work = recentWorks[workIndex] ?? null;

  const advance = useCallback(() => {
    setWorkIndex((idx) => (idx < recentWorks.length - 1 ? idx + 1 : 0));
    if (moreFun) refreshMoreFunBg();
  }, [recentWorks.length, moreFun, refreshMoreFunBg]);

  const retreat = useCallback(() => {
    setWorkIndex((idx) => (idx > 0 ? idx - 1 : recentWorks.length - 1));
    if (moreFun) refreshMoreFunBg();
  }, [recentWorks.length, moreFun, refreshMoreFunBg]);

  useEffect(() => {
    const id = setInterval(advance, 3000);
    return () => clearInterval(id);
  }, [advance]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") advance();
      else if (e.key === "ArrowLeft") retreat();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advance, retreat]);

  useEffect(() => {
    return () => setHomeBg(null);
  }, [setHomeBg]);

  return (
    <div
      className="h-dvh w-full flex flex-col px-6 pt-4 cursor-pointer transition-colors duration-300"
      onClick={advance}
    >
      <div className=" relative w-full hidden">
        <HistoryClient updates={updates} />
      </div>
      {/* Image — centered in available space between nav and InfoBox */}
      <div
        className="fixed top-0 left-0 flex items-start justify-start lg:justify-center w-full h-dvh pt-[var(--nav-height,0px)] pl-6 lg:pl-0"
        style={{ perspective: "800px" }}
      >
        {work?.image_url && (
          <motion.img
            src={work.image_url}
            alt={work.title.rendered}
            className="max-h-[50dvh] lg:max-h-[66.6dvh] pb-8 object-contain object-top pt-8 lg:pt-8"
            style={{}}
          />
        )}
      </div>

      {work && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-start lg:justify-center px-6 lg:px-4 pb-6 lg:pb-4 w-full">
          <InfoBox work={work} />
        </div>
      )}

      <button
        className="hidden  fixed top-8 right-8 z-10 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          setTrumpetFrame((f) => (f % 3) + 1);
          advance();
        }}
        aria-label="Next work"
      >
        <Image
          src={`/trumpet_${trumpetFrame}_NAV.svg`}
          alt="Next"
          width={60}
          height={60}
        />
      </button>
    </div>
  );
}

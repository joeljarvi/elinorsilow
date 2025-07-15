"use client";

import React from "react";

type ToolboxProps = {
  sortBy: string;
  setSortBy: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  allWorks: any[];

  showDescription: boolean;
  setShowDescription: (val: boolean) => void;
};

export function Toolbox({
  sortBy,
  setSortBy,
  selectedYear,
  setSelectedYear,
  selectedCategory,
  setSelectedCategory,
  allWorks,

  showDescription,
  setShowDescription,
}: ToolboxProps) {
  const categoryCounts = allWorks.reduce((acc, work) => {
    const mediums = Array.isArray(work.acf.medium)
      ? work.acf.medium
      : [work.acf.medium].filter(Boolean);
    mediums.forEach((medium) => {
      acc[medium] = (acc[medium] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center  z-50 w-full h-full lg:max-w-md lg:h-auto pt-16 pb-16 px-6 lg:p-3 pointer-events-auto">
      <div className="flex flex-col items-baseline justify-center mt-0 lg:justify-start lg:mt-12 rounded-2xl p-6 w-full ">
        <div className="flex items-baseline justify-center lg:justify-start font-serif w-full  mix-blend-difference text-md gap-3 ">
          <h2 className="text-sm font-sans uppercase">sort by:</h2>
          <span className="flex items-baseline gap-1.5">
            <button
              onClick={() => setSortBy("latest")}
              className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
                sortBy === "latest" ? "text-black opacity-30" : ""
              }`}
            >
              Latest
            </button>
            /
            <button
              onClick={() => setSortBy("az")}
              className={`font-serif cursor-pointer hover:opacity-30 transition-opacity  ${
                sortBy === "az" ? "text-black opacity-30" : ""
              }`}
            >
              A—Ö
            </button>
            /
            <button
              onClick={() => setSortBy("random")}
              className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
                sortBy === "random" ? "text-black opacity-30" : ""
              }`}
            >
              Random
            </button>
          </span>
        </div>
        <div className="flex items-baseline justify-center lg:justify-start font-serif w-full  mix-blend-difference text-md gap-3">
          <h2 className="text-sm font-sans uppercase">category:</h2>

          {Object.entries(categoryCounts).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
                selectedCategory === cat ? "text-black opacity-30" : ""
              }`}
            >
              {cat} {`(${count})`}
            </button>
          ))}
          <button
            onClick={() => setSelectedCategory("all")}
            className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
              selectedCategory === "all" ? "text-black opacity-30" : ""
            }`}
          >
            Show all
          </button>
        </div>

        <div className="flex flex-wrap items-baseline justify-center lg:justify-start w-full mix-blend-difference text-md gap-3  ">
          <h2 className="text-sm font-sans uppercase">Year:</h2>

          {[...new Set(allWorks.map((w) => w.acf.year))].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`font-serif cursor-pointer hover:opacity-30 transition-opacity  ${
                selectedYear === year ? "text-black opacity-30" : ""
              }`}
            >
              {year}
            </button>
          ))}
          <button
            onClick={() => setSelectedYear("all")}
            className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
              selectedYear === "all" ? "text-black opacity-30" : ""
            }`}
          >
            Show all
          </button>
        </div>
        <div className="flex items-baseline justify-center lg:justify-start  font-serif w-full  mix-blend-difference text-md gap-3  ">
          <h2 className="text-sm font-sans uppercase">description:</h2>
          <button
            className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
              showDescription ? "text-black opacity-30" : ""
            }`}
            onClick={() => setShowDescription(!showDescription)}
          >
            Show
          </button>
          /
          <button
            className={`font-serif cursor-pointer hover:opacity-30 transition-opacity ${
              !showDescription ? "text-black opacity-30" : ""
            }`}
            onClick={() => setShowDescription(!showDescription)}
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}

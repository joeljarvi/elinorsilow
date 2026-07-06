"use client";

import { useState, useEffect, useRef } from "react";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useIndex } from "@/context/IndexContext";
import { Work, Exhibition } from "../../lib/sanity";
import WorkModal from "./WorkModal";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";

type GridItem =
  | { kind: "work"; data: Work; year: number }
  | { kind: "exhibition"; data: Exhibition; year: number };

function getTitle(item: GridItem) {
  return item.data.title.rendered.toLowerCase();
}

function hash(id: number | string) {
  return typeof id === "string"
    ? [...id].reduce((a, c) => a + c.charCodeAt(0), 0)
    : id;
}

function jitter(id: number | string): { x: number; y: number } {
  const n = hash(id);
  const x = ((n * 127 + 31) % 61) - 30;
  const y = ((n * 311 + 71) % 49) - 24;
  return { x, y };
}

const BATCH = 24;

function GridItem({
  baseOffset,
  className,
  onClick,
  children,
}: {
  baseOffset: { x: number; y: number };
  className: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      style={{ transform: `translate(${baseOffset.x}px, ${baseOffset.y}px)` }}
    >
      {children}
    </button>
  );
}

export default function IndexPageClient() {
  const { mode, sort, tidy, search, zoom } = useIndex();
  const WORKS_COLS = [
    "grid-cols-1 lg:grid-cols-2",
    "grid-cols-2 lg:grid-cols-4",
    "grid-cols-2 lg:grid-cols-8",
    "grid-cols-4 lg:grid-cols-8",
    "grid-cols-6 lg:grid-cols-12",
  ];
  const EXHIBITION_COLS = [
    "grid-cols-2 lg:grid-cols-2",
    "grid-cols-2 lg:grid-cols-4",
    "grid-cols-2 lg:grid-cols-2",
    "grid-cols-4 lg:grid-cols-8",
    "grid-cols-6 lg:grid-cols-12",
  ];
  const [workSlug, setWorkSlug] = useState<string | null>(null);
  const [exhibitionSlug, setExhibitionSlug] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { filteredWorks } = useWorks();
  const { filteredExhibitions } = useExhibitions();

  function applySort<T>(
    arr: T[],
    byDate: (t: T) => string,
    byArtYear: (t: T) => number,
    byTitle: (t: T) => string,
  ): T[] {
    const copy = [...arr];
    if (sort === "a-z")
      return copy.sort((a, b) => byTitle(a).localeCompare(byTitle(b)));
    if (sort === "year")
      return copy.sort((a, b) => byArtYear(b) - byArtYear(a));
    return copy.sort((a, b) => byDate(b).localeCompare(byDate(a)));
  }

  const sortedWorks = applySort(
    filteredWorks,
    (w) => w.date,
    (w) => w.acf.year ?? 0,
    (w) => w.title.rendered,
  );

  const sortedExhibitions = applySort(
    filteredExhibitions,
    (e) => e.date,
    (e) => parseInt(e.acf.year) || 0,
    (e) => e.title.rendered,
  );

  const allItems: GridItem[] = applySort(
    [
      ...filteredWorks.map((w) => ({
        kind: "work" as const,
        data: w,
        year: w.acf.year ?? 0,
      })),
      ...filteredExhibitions.map((e) => ({
        kind: "exhibition" as const,
        data: e,
        year: parseInt(e.acf.year) || 0,
      })),
    ],
    (i) => i.data.date,
    (i) => i.year,
    (i) => getTitle(i),
  );

  const q = search.toLowerCase();
  function applyFilters<T>(arr: T[], getTitle: (t: T) => string): T[] {
    return arr.filter((t) => !q || getTitle(t).toLowerCase().includes(q));
  }

  const visibleWorks = applyFilters(sortedWorks, (w) => w.title.rendered);
  const visibleExhibitions = applyFilters(
    sortedExhibitions,
    (e) => e.title.rendered,
  );
  const visibleAll = applyFilters(allItems, (i) => i.data.title.rendered);

  useEffect(() => {
    setVisibleCount(BATCH);
  }, [
    mode,
    sort,
    visibleWorks.length,
    visibleExhibitions.length,
    visibleAll.length,
  ]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((c) => c + BATCH);
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offset = (id: number | string) => (tidy ? { x: 0, y: 0 } : jitter(id));

  return (
    <>
      {/* Grid */}
      <div className=" ">
        {mode === "works" && (
          <div
            className={`grid px-4 lg:px-6 py-2 lg: pt-6 gap-y-2 lg:gap-0  mx-auto ${WORKS_COLS[zoom]} `}
          >
            {visibleWorks.slice(0, visibleCount).map((work, i) => (
              <GridItem
                key={`${work.id}-${i}`}
                baseOffset={offset(i)}
                className="aspect-square overflow-hidden cursor-zoom-in  p-12 lg:p-12  "
                onClick={() => setWorkSlug(work.slug)}
              >
                {work.image_url && (
                  <img
                    src={work.image_url}
                    alt={work.title.rendered}
                    className="w-full h-full object-contain object-center lg:object-center "
                  />
                )}
              </GridItem>
            ))}
          </div>
        )}

        {mode === "exhibitions" && (
          <div
            className={`grid ${EXHIBITION_COLS[zoom]} grid px-4 lg:px-6 py-2 lg: pt-6 gap-y-2 lg:gap-0  mx-auto`}
          >
            {visibleExhibitions.slice(0, visibleCount).map((ex, i) => (
              <GridItem
                key={`${ex.id}-${i}`}
                baseOffset={offset(i)}
                className="col-span-1 row-span-1 items-center justify-center aspect-square overflow-hidden block p-12 lg:p-12 "
                onClick={() => setExhibitionSlug(ex.slug)}
              >
                {ex.acf.image_1?.url && (
                  <img
                    src={ex.acf.image_1.url}
                    alt={ex.title.rendered}
                    className="w-full h-full object-contain object-center"
                  />
                )}
              </GridItem>
            ))}
          </div>
        )}

        {mode === "all" && (
          <div
            className={`grid ${WORKS_COLS[zoom]} grid px-4 lg:px-6 py-2 lg: pt-6 gap-y-2 lg:gap-0  mx-auto`}
          >
            {visibleAll.slice(0, visibleCount).map((item, i) =>
              item.kind === "work" ? (
                <GridItem
                  key={`work-${item.data.id}-${i}`}
                  baseOffset={offset(i)}
                  className="aspect-square overflow-hidden cursor-zoom-in p-12 lg:p-12"
                  onClick={() => setWorkSlug(item.data.slug)}
                >
                  {item.data.image_url && (
                    <img
                      src={item.data.image_url}
                      alt={item.data.title.rendered}
                      className="w-full h-full object-contain object-center"
                    />
                  )}
                </GridItem>
              ) : (
                <GridItem
                  key={`ex-${item.data.id}-${i}`}
                  baseOffset={offset(i)}
                  className="col-span-2 aspect-square  block p-12 lg:p-12"
                  onClick={() => setExhibitionSlug(item.data.slug)}
                >
                  {item.data.acf.image_1?.url && (
                    <img
                      src={item.data.acf.image_1.url}
                      alt={item.data.title.rendered}
                      className="w-full h-full object-contain object-center"
                    />
                  )}
                </GridItem>
              ),
            )}
          </div>
        )}
        <div ref={sentinelRef} className="h-1" />
      </div>

      {workSlug && (
        <WorkModal slug={workSlug} onClose={() => setWorkSlug(null)} showInfo />
      )}
      {exhibitionSlug && (
        <ExhibitionModal
          slug={exhibitionSlug}
          onClose={() => setExhibitionSlug(null)}
        />
      )}
    </>
  );
}

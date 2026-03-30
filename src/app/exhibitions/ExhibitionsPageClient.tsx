"use client";

import { useState, useEffect, useRef } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/InfoBox";
import { RevealImage } from "@/components/RevealImage";
import CornerFrame from "@/components/CornerFrame";
import RowSlide from "@/components/RowSlide";

type ExCategory = "all" | "solo" | "group";
type ExSort = "year-latest" | "year-oldest" | "title";

const EX_CATEGORIES: ExCategory[] = ["all", "solo", "group"];
const EX_SORTS: ExSort[] = ["year-latest", "year-oldest", "title"];
const CATEGORY_LABELS: Record<ExCategory, string> = {
  all: "all exhibitions",
  solo: "solo",
  group: "group",
};
const SORT_LABELS: Record<ExSort, string> = {
  "year-latest": "latest",
  "year-oldest": "oldest",
  title: "A–Z",
};
const CAT_TO_TYPE: Record<ExCategory, string | null> = {
  all: null,
  solo: "Solo",
  group: "Group",
};

function ExhibitionCard({
  ex,
  index,
  showInfo,
  onClick,
}: {
  ex: Exhibition;
  index: number;
  showInfo: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="flex flex-col "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {showInfo && (
        <div className="px-3 pb-2">
          <InfoBox exhibition={ex} />
        </div>
      )}
      <button
        onClick={onClick}
        className="relative h-[75vh] aspect-video w-full overflow-hidden cursor-none p-3 pt-2"
        aria-label={`Show exhibition: ${ex.title.rendered}`}
      >
        <CornerFrame />
        {ex.acf.image_1 && (
          <RevealImage
            src={ex.acf.image_1.url}
            alt={ex.title.rendered}
            fill
            sizes="50vw"
            revealIndex={index}
            className="object-contain object-top "
          />
        )}
      </button>
      {hovered && (
        <div
          className="hidden lg:block fixed pointer-events-none z-[100] font-universNextProExt font-extrabold text-[16px]"
          style={{
            left: mousePos.x + 14,
            top: mousePos.y,
            transform: "translateY(-50%)",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            Click to enlarge
          </motion.span>
        </div>
      )}
    </div>
  );
}

export default function ExhibitionsPageClient() {
  const [exCat, setExCat] = useState<ExCategory>("all");
  const [exSort, setExSort] = useState<ExSort>("year-latest");
  const [asList, setAsList] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const pageHeaderRef = useRef<HTMLDivElement>(null);

  const {
    exhibitions,
    setActiveExhibitionSlug,
    activeExhibitionSlug,
    exLoading,
  } = useExhibitions();
  const { setOpen, showInfo, setShowInfo } = useUI();

  useEffect(() => {
    if (!exLoading) setDataLoaded(true);
  }, [exLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => setInitialAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  useEffect(() => {
    const el = pageHeaderRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty(
        "--page-header-height",
        `${entry.contentRect.height}px`,
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const loading = !initialAnimDone || !dataLoaded;

  const cycleCategory = () =>
    setExCat(
      (prev) =>
        EX_CATEGORIES[(EX_CATEGORIES.indexOf(prev) + 1) % EX_CATEGORIES.length],
    );

  const cycleSort = () =>
    setExSort(
      (prev) => EX_SORTS[(EX_SORTS.indexOf(prev) + 1) % EX_SORTS.length],
    );

  function getSortedExhibitions(): Exhibition[] {
    const typeFilter = CAT_TO_TYPE[exCat];
    const filtered = typeFilter
      ? exhibitions.filter((e) => e.acf.exhibition_type === typeFilter)
      : exhibitions;
    switch (exSort) {
      case "year-latest":
        return [...filtered].sort(
          (a, b) => Number(b.acf.year) - Number(a.acf.year),
        );
      case "year-oldest":
        return [...filtered].sort(
          (a, b) => Number(a.acf.year) - Number(b.acf.year),
        );
      case "title":
        return [...filtered].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv"),
        );
      default:
        return filtered;
    }
  }

  const items = getSortedExhibitions();

  function openExhibition(ex: Exhibition) {
    setActiveExhibitionSlug(ex.slug);
    setOpen(false);
    window.history.pushState(null, "", `/exhibitions?exhibition=${ex.slug}`);
  }

  return (
    <section className="relative w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page header */}
        <div
          ref={pageHeaderRef}
          className="sticky bottom-0 z-[60] pointer-events-none flex flex-row flex-wrap items-center justify-start gap-x-4 gap-y-1 px-[18px] py-[18px] lg:py-[18px] w-full"
        >
          {showSettings && (
            <>
              <Button
                variant="link"
                size="controls"
                className="pointer-events-auto px-0"
                onClick={cycleSort}
              >
                ({SORT_LABELS[exSort]})
              </Button>
              <Button
                variant="link"
                size="controls"
                className="pointer-events-auto px-0"
                onClick={cycleCategory}
              >
                ({CATEGORY_LABELS[exCat]})
              </Button>
              <Button
                variant="link"
                size="controls"
                className="pointer-events-auto px-0"
                onClick={() => setAsList((v) => !v)}
              >
                {asList ? "(list)" : "(grid)"}
              </Button>
              <Button
                variant="link"
                size="controls"
                className="pointer-events-auto px-0 flex lg:hidden"
                onClick={() => setShowInfo(!showInfo)}
              >
                {showInfo ? "(text)" : "(no text)"}
              </Button>
              <Button
                variant="link"
                size="controls"
                className="hidden lg:flex pointer-events-auto px-0"
                onClick={() => setShowInfo(!showInfo)}
              >
                {showInfo ? "(show text)" : "(hide text)"}
              </Button>
            </>
          )}
          <Button
            variant="link"
            size="controls"
            className="pointer-events-auto px-0 text-muted-foreground"
            onClick={() => setShowSettings((v) => !v)}
          >
            <span className="lg:hidden">
              {showSettings ? "(close)" : "(settings)"}
            </span>
            <span className="hidden lg:inline">
              {showSettings ? "(hide settings)" : "(settings)"}
            </span>
          </Button>
        </div>

        {asList ? (
          <div className="flex flex-col pt-4">
            {items.map((ex) => (
              <RowSlide key={ex.id}>
                <Button
                  variant="ghost"
                  size="controls"
                  onClick={() => openExhibition(ex)}
                  className="w-full rounded-none justify-center font-universNextProExt font-extrabold text-[14px] lg:text-[18px]"
                >
                  {ex.title.rendered}
                </Button>
              </RowSlide>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop: rows of 2 */}
            <div className="hidden lg:block pr-[32px]">
              {Array.from(
                { length: Math.ceil(items.length / 3) },
                (_, rowIndex) => {
                  const row = items.slice(rowIndex * 2, rowIndex * 3 + 3);
                  return (
                    <RowSlide
                      key={rowIndex}
                      className="grid grid-cols-3 gap-x-[18px]"
                    >
                      {row.map((ex, colIndex) => (
                        <div key={ex.id} className="w-full">
                          <ExhibitionCard
                            ex={ex}
                            index={rowIndex * 2 + colIndex}
                            showInfo={showInfo}
                            onClick={() => openExhibition(ex)}
                          />
                        </div>
                      ))}
                    </RowSlide>
                  );
                },
              )}
            </div>
            {/* Mobile: one per row */}
            <div className="lg:hidden flex flex-col">
              {items.map((ex, i) => (
                <RowSlide key={ex.id}>
                  <ExhibitionCard
                    ex={ex}
                    index={i}
                    showInfo={showInfo}
                    onClick={() => openExhibition(ex)}
                  />
                </RowSlide>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => {
            setActiveExhibitionSlug(null);
            setOpen(true);
          }}
        />
      )}
    </section>
  );
}

"use client";

import { RevealImage } from "@/components/RevealImage";
import { useState, useEffect } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";

type ExCategory = "all" | "solo" | "group";
type ExSort = "year-latest" | "year-oldest" | "title";

const EX_CATEGORIES: ExCategory[] = ["all", "solo", "group"];
const EX_SORTS: ExSort[] = ["year-latest", "year-oldest", "title"];
const CATEGORY_LABELS: Record<ExCategory, string> = { all: "all exhibitions", solo: "solo", group: "group" };
const SORT_LABELS: Record<ExSort, string> = { "year-latest": "latest", "year-oldest": "oldest", title: "A–Z" };
const CAT_TO_TYPE: Record<ExCategory, string | null> = { all: null, solo: "Solo", group: "Group" };

function ExhibitionCard({
  ex,
  index,
  onClick,
}: {
  ex: Exhibition;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div
      className="group relative w-full flex flex-col mb-[32px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={onClick}
        className="relative h-[75vh] w-full overflow-hidden p-4 cursor-pointer"
        aria-label={`Show exhibition: ${ex.title.rendered}`}
      >
        <CornerFrame />
        {ex.acf.image_1 && (
          <div className="absolute inset-0">
            <RevealImage
              src={ex.acf.image_1.url}
              alt={ex.title.rendered}
              fill
              sizes="50vw"
              revealIndex={index}
              className="object-contain object-top"
            />
          </div>
        )}
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-out px-3 ${
          infoOpen ? "max-h-[120px]" : "max-h-0"
        }`}
      >
        <InfoBox exhibition={ex} revealed={infoOpen} />
      </div>
      <div className="flex justify-center py-2">
        <button
          className={`font-timesNewRomanWide font-bold text-[14px] lg:text-[18px] text-foreground transition-opacity duration-300 pointer-events-auto ${hovered || infoOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setInfoOpen((v) => !v)}
        >
          {infoOpen ? "(less)" : "(more info)"}
        </button>
      </div>
    </div>
  );
}

export default function ExhibitionsPageClient() {
  const [exCat, setExCat] = useState<ExCategory>("all");
  const [exSort, setExSort] = useState<ExSort>("year-latest");
  const [asList, setAsList] = useState(false);
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [atExhibitions, setAtExhibitions] = useState(false);

  const { exhibitions, setActiveExhibitionSlug, activeExhibitionSlug, exLoading } = useExhibitions();
  const { setOpen, showInfo, setShowInfo, navVisible } = useUI();

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
    const onScroll = () => setAtExhibitions(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const loading = !initialAnimDone || !dataLoaded;

  const cycleCategory = () =>
    setExCat((prev) => EX_CATEGORIES[(EX_CATEGORIES.indexOf(prev) + 1) % EX_CATEGORIES.length]);

  const cycleSort = () =>
    setExSort((prev) => EX_SORTS[(EX_SORTS.indexOf(prev) + 1) % EX_SORTS.length]);

  function getSortedExhibitions(): Exhibition[] {
    const typeFilter = CAT_TO_TYPE[exCat];
    const filtered = typeFilter
      ? exhibitions.filter((e) => e.acf.exhibition_type === typeFilter)
      : exhibitions;
    switch (exSort) {
      case "year-latest": return [...filtered].sort((a, b) => Number(b.acf.year) - Number(a.acf.year));
      case "year-oldest": return [...filtered].sort((a, b) => Number(a.acf.year) - Number(b.acf.year));
      case "title": return [...filtered].sort((a, b) => a.title.rendered.localeCompare(b.title.rendered, "sv"));
      default: return filtered;
    }
  }

  const items = getSortedExhibitions();
  const col1Items = items.filter((_, i) => i % 2 === 0);
  const col2Items = items.filter((_, i) => i % 2 === 1);

  function openExhibition(ex: Exhibition) {
    setActiveExhibitionSlug(ex.slug);
    setOpen(false);
    window.history.pushState(null, "", `/exhibitions?exhibition=${ex.slug}`);
  }

  return (
    <section
      className="relative w-full transition-[padding-top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{ paddingTop: navVisible ? "var(--nav-height, 0px)" : "0px" }}
    >
      {/* Page header — fixed bottom bar, same style as works page */}
      <AnimatePresence>
        {atExhibitions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[85] pointer-events-none flex flex-row flex-nowrap items-center gap-x-8 px-[18px] w-full justify-between top-0 lg:left-0 lg:bottom-0 lg:top-auto lg:justify-center lg:pb-[18px] mix-blend-difference text-background"
          >
            <p className="text-[14px] lg:text-[18px] whitespace-nowrap">
              <button
                className="hidden lg:block font-universNextProExt font-extrabold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
                onClick={cycleCategory}
              >
                {CATEGORY_LABELS[exCat]}
              </button>{" "}
              <span className="font-timesNewRomanWide font-bold lg:ml-2">
                ({loading ? "—" : items.length})
              </span>
            </p>

            <p className="text-[14px] lg:text-[18px] whitespace-nowrap">
              <span className="hidden lg:inline font-universNextProExt font-extrabold">
                sorted by{" "}
              </span>
              <button
                className="font-timesNewRomanWide font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto lg:ml-2"
                onClick={cycleSort}
              >
                ({SORT_LABELS[exSort]})
              </button>
            </p>

            <button
              className="font-timesNewRomanWide font-bold text-[14px] lg:text-[18px] hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
              onClick={() => setAsList((v) => !v)}
            >
              {asList ? "(grid)" : "(list)"}
            </button>

            <button
              className="font-timesNewRomanWide font-bold text-[14px] lg:text-[18px] hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "(hide text)" : "(show text)"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Columns */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 pt-[18px] lg:pt-[18px]">
        <div className="px-[18px] pt-[18px] lg:px-[32px] lg:pt-[32px]">
          {asList ? (
            <div className="flex flex-col">
              {col1Items.map((ex) => (
                <Button key={ex.id} variant="ghost" size="controls" onClick={() => openExhibition(ex)} className="w-full rounded-none justify-center font-universNextProExt font-extrabold text-[14px] lg:text-[18px]">
                  {ex.title.rendered}
                </Button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {col1Items.map((ex, i) => (
                <ExhibitionCard key={ex.id} ex={ex} index={i * 2} onClick={() => openExhibition(ex)} />
              ))}
            </motion.div>
          )}
        </div>

        <div className="hidden lg:block px-[32px] pt-[32px]">
          {asList ? (
            <div className="flex flex-col">
              {col2Items.map((ex) => (
                <Button key={ex.id} variant="ghost" size="controls" onClick={() => openExhibition(ex)} className="w-full rounded-none justify-center font-universNextProExt font-extrabold text-[14px] lg:text-[18px]">
                  {ex.title.rendered}
                </Button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="flex flex-col"
            >
              {col2Items.map((ex, i) => (
                <ExhibitionCard key={ex.id} ex={ex} index={i * 2 + 1} onClick={() => openExhibition(ex)} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => { setActiveExhibitionSlug(null); setOpen(true); }}
        />
      )}
    </section>
  );
}

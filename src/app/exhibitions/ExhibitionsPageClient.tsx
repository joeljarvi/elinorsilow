"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion, AnimatePresence } from "framer-motion";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExCategory = "all" | "solo" | "group";
type ExSort = "year-latest" | "year-oldest" | "title";

const EX_CATEGORIES: ExCategory[] = ["all", "solo", "group"];
const EX_SORTS: ExSort[] = ["year-latest", "year-oldest", "title"];
const CATEGORY_LABELS: Record<ExCategory, string> = { all: "all exhibitions", solo: "solo", group: "group" };
const SORT_LABELS: Record<ExSort, string> = { "year-latest": "latest", "year-oldest": "oldest", title: "A–Z" };
const CAT_TO_TYPE: Record<ExCategory, string | null> = { all: null, solo: "Solo", group: "Group" };

export default function ExhibitionsPageClient() {
  const [exCat, setExCat] = useState<ExCategory>("all");
  const [exSort, setExSort] = useState<ExSort>("year-latest");
  const [showFilter, setShowFilter] = useState(false);
  const [asList, setAsList] = useState(false);
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

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

  function renderItem(ex: Exhibition) {
    return (
      <button
        key={ex.id}
        onClick={() => openExhibition(ex)}
        className="group relative cursor-pointer w-full flex flex-col gap-y-[18px] mb-[32px]"
        aria-label={`Show exhibition: ${ex.title.rendered}`}
      >
        <div className="relative h-[75vh] w-full overflow-hidden">
          <CornerFrame />
          {ex.acf.image_1 && (
            <div className="absolute inset-0 flex items-end">
              <Image
                src={ex.acf.image_1.url}
                alt={ex.title.rendered}
                fill
                sizes="50vw"
                className="object-contain object-bottom-left"
              />
            </div>
          )}
        </div>
        {showInfo && <InfoBox exhibition={ex} />}
      </button>
    );
  }

  const categorySelect = (
    <Select value={exCat} onValueChange={(v) => setExCat(v as ExCategory)}>
      <SelectTrigger className="border-0 shadow-none bg-secondary text-neutral-600 dark:text-neutral-400 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="solo">Solo</SelectItem>
        <SelectItem value="group">Group</SelectItem>
      </SelectContent>
    </Select>
  );

  const sortSelect = (
    <Select value={exSort} onValueChange={(v) => setExSort(v as ExSort)}>
      <SelectTrigger className="border-0 shadow-none bg-secondary text-neutral-600 dark:text-neutral-400 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="year-latest">Newest First</SelectItem>
        <SelectItem value="year-oldest">Oldest First</SelectItem>
        <SelectItem value="title">Title A–Z</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <section
      className="relative w-full transition-[padding-top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{ paddingTop: navVisible ? "var(--nav-height, 0px)" : "0px" }}
    >
      {/* Fixed page header */}
      <div
        className="fixed z-[70] w-full pointer-events-none flex flex-col items-center lg:grid lg:grid-cols-4 lg:items-start px-[18px] lg:px-0 pt-[18px] lg:pt-[12px] gap-y-0.5 lg:gap-y-0"
        style={{ top: "var(--nav-height, 64px)" }}
      >
        {/* Col 1 — category + count */}
        <p className="lg:pl-[33px] text-[16px] font-timesNewRoman">
          <button
            className="font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
            onClick={cycleCategory}
          >
            {CATEGORY_LABELS[exCat]}
          </button>{" "}
          ({loading ? "—" : items.length})
        </p>
        {/* Col 3 — sort */}
        <p className="lg:col-start-3 lg:pl-[15px] text-[16px] font-timesNewRoman">
          Sorted by{" "}
          <button
            className="font-bold hover:underline underline-offset-2 cursor-pointer pointer-events-auto"
            onClick={cycleSort}
          >
            {SORT_LABELS[exSort]}
          </button>
        </p>
      </div>

      {/* Mobile bottom controls */}
      <div className="lg:hidden fixed bottom-0 left-0 z-20 flex items-center gap-x-8 px-[18px] py-[12px] bg-transparent">
        <Button
          variant="link"
          size="controls"
          className="px-0"
          onClick={() => setShowFilter((v) => !v)}
        >
          {showFilter ? <><Cross1Icon className="mr-1" />Filter</> : "Filter"}
        </Button>
        <Button
          variant="link"
          size="controls"
          className="px-0"
          onClick={() => setAsList((v) => !v)}
        >
          {asList ? "Back to Thumbnails" : "List"}
        </Button>
      </div>

      {/* Desktop bottom controls */}
      <div className="hidden lg:flex fixed bottom-0 left-1/2 -translate-x-1/2 z-50 items-center gap-x-4 px-[32px] py-[12px] bg-transparent drop-shadow-[var(--shadow-ui)]">
        <Button variant="link" size="controls" onClick={() => setAsList((v) => !v)}>
          {asList ? "Thumbnails" : "List"}
        </Button>
        <Button variant="link" onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? "Hide text" : "Show text"}
        </Button>
      </div>

      {/* Columns */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 pt-[48px] lg:pt-[36px]">
        <div className="px-[18px] pt-[18px] lg:px-[32px] lg:pt-[32px]">
          {asList ? (
            <div className="flex flex-col">
              {col1Items.map((ex) => (
                <Button key={ex.id} variant="ghost" size="controls" onClick={() => openExhibition(ex)} className="w-full rounded-none justify-start">
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
              {col1Items.map((ex) => <div key={ex.id}>{renderItem(ex)}</div>)}
            </motion.div>
          )}
        </div>

        <div className="hidden lg:block px-[32px] pt-[32px]">
          {asList ? (
            <div className="flex flex-col">
              {col2Items.map((ex) => (
                <Button key={ex.id} variant="ghost" size="controls" onClick={() => openExhibition(ex)} className="w-full rounded-none justify-start">
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
              {col2Items.map((ex) => <div key={ex.id}>{renderItem(ex)}</div>)}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter slide-up */}
      <AnimatePresence>
        {showFilter && (
          <>
            <div className="lg:hidden fixed inset-0 z-[59]" onClick={() => setShowFilter(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] p-4 bg-background border-t border-foreground/[0.06] flex flex-col gap-y-2"
            >
              {categorySelect}
              {sortSelect}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => { setActiveExhibitionSlug(null); setOpen(true); }}
        />
      )}
    </section>
  );
}

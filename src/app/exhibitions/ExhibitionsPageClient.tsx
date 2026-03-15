"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InfoRow } from "@/components/InfoBox";
import Staggered from "@/components/Staggered";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ExhibitionsPageClient() {
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [col1Sort, setCol1Sort] = useState<ExhibitionSort>("year");
  const [col2Sort, setCol2Sort] = useState<ExhibitionSort>("year");
  const [col3Sort, setCol3Sort] = useState<ExhibitionSort>("year");
  const [col1Type, setCol1Type] = useState("Solo");
  const [col2Type, setCol2Type] = useState("Group");
  const [col3Type, setCol3Type] = useState("all");
  const [col1Min, setCol1Min] = useState(false);
  const [col2Min, setCol2Min] = useState(false);
  const [col3Min, setCol3Min] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [proportional, setProportional] = useState(false);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  const {
    exhibitions,
    setActiveExhibitionSlug,
    activeExhibitionSlug,
    exLoading,
  } = useExhibitions();

  const { setOpen } = useUI();

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

  function sortExhibitions(
    list: Exhibition[],
    sort: ExhibitionSort,
  ): Exhibition[] {
    switch (sort) {
      case "year":
        return [...list].sort((a, b) => Number(b.acf.year) - Number(a.acf.year));
      case "title":
        return [...list].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv"),
        );
      default:
        return list;
    }
  }

  const col1Exhibitions = sortExhibitions(
    col1Type === "all"
      ? exhibitions
      : exhibitions.filter((e) => e.acf.exhibition_type === col1Type),
    col1Sort,
  );
  const col2Exhibitions = sortExhibitions(
    col2Type === "all"
      ? exhibitions
      : exhibitions.filter((e) => e.acf.exhibition_type === col2Type),
    col2Sort,
  );
  const col3Exhibitions = sortExhibitions(
    col3Type === "all"
      ? exhibitions
      : exhibitions.filter((e) => e.acf.exhibition_type === col3Type),
    col3Sort,
  );

  function openExhibition(ex: Exhibition) {
    setActiveExhibitionSlug(ex.slug);
    setOpen(false);
    window.history.pushState(null, "", `/exhibitions?exhibition=${ex.slug}`);
  }

  function renderExhibitionItem(ex: Exhibition) {
    return (
      <button
        key={ex.id}
        onClick={() => openExhibition(ex)}
        className="relative cursor-pointer w-full flex flex-col shadow-[0_0_60px_rgba(255,255,255,0.15)]"
        aria-label={`Show exhibition: ${ex.title.rendered}`}
      >
        <div
          className="relative w-full overflow-hidden"
          style={
            proportional && ex.acf.image_1?.width && ex.acf.image_1?.height
              ? { aspectRatio: `${ex.acf.image_1.width} / ${ex.acf.image_1.height}` }
              : { aspectRatio: "16 / 9" }
          }
        >
          {ex.acf.image_1 && (
            <div className="absolute inset-2">
              <Image
                src={ex.acf.image_1.url}
                alt={ex.title.rendered}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
        {showInfo && (
          <div className="relative w-full font-bookish text-sm">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            <InfoRow label="Title" value={ex.title.rendered} />
            <InfoRow label="Year" value={ex.acf.year} />
            <InfoRow label="Location" value={ex.acf.location} />
            <InfoRow label="City" value={ex.acf.city} />
          </div>
        )}
      </button>
    );
  }

  function TypeSelect({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Solo">Solo</SelectItem>
          <SelectItem value="Group">Group</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  function SortSelect({
    value,
    onChange,
  }: {
    value: ExhibitionSort;
    onChange: (v: ExhibitionSort) => void;
  }) {
    return (
      <Select
        value={value}
        onValueChange={(v) => onChange(v as ExhibitionSort)}
      >
        <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
          <SelectItem value="year">Latest added</SelectItem>
          <SelectItem value="title">Title</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <section className="relative w-full mt-0">
      {/* Mobile: single staggered list */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-50 bg-transparent px-4 py-3 flex items-center gap-x-2 font-bookish text-sm">
          <SortSelect value={col1Sort} onChange={setCol1Sort} />
          <Button variant="ghost" size="sm" onClick={() => setProportional(!proportional)} className={`rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm ${proportional ? "line-through decoration-1" : ""}`}>P</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} className={`rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm ${showInfo ? "" : "line-through decoration-1"}`}>T</Button>
        </div>
        <Staggered
          items={sortExhibitions(exhibitions, col1Sort)}
          getKey={(ex) => ex.id}
          loading={loading}
          className="flex flex-col"
          renderItem={(ex: Exhibition) => renderExhibitionItem(ex)}
        />
      </div>

      {/* Desktop: three fixed scrolling columns */}
      <div
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0"
        style={{ top: "calc(var(--nav-height, 0px) + 0px)" }}
      >
        {/* Restore pills + global controls */}
        <div className="absolute right-2 top-2 flex items-center gap-x-2 z-50">
          {col1Min && <Button variant="ghost" size="sm" onClick={() => setCol1Min(false)} className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm">+ {col1Type === "all" ? "All" : col1Type}</Button>}
          {col2Min && <Button variant="ghost" size="sm" onClick={() => setCol2Min(false)} className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm">+ {col2Type === "all" ? "All" : col2Type}</Button>}
          {col3Min && <Button variant="ghost" size="sm" onClick={() => setCol3Min(false)} className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm">+ {col3Type === "all" ? "All" : col3Type}</Button>}
          <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} className={`rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm ${showInfo ? "line-through decoration-1" : ""}`}>T</Button>
        </div>

        {!col1Min && (
          <div ref={col1Ref} className="flex-1 overflow-y-auto h-full border-r border-border flex flex-col">
            <div className="sticky top-0 z-10 flex items-center gap-x-2 px-4 pt-2 pb-2 bg-transparent font-bookish text-sm">
              <TypeSelect value={col1Type} onChange={setCol1Type} />
              <SortSelect value={col1Sort} onChange={setCol1Sort} />
              <Button variant="ghost" size="sm" onClick={() => setCol1Min(true)} className="shrink-0 rounded-full w-7 h-7 p-0 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-base leading-none">−</Button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.5 }} className="flex flex-col">
              {col1Exhibitions.map((ex) => renderExhibitionItem(ex))}
            </motion.div>
          </div>
        )}
        {!col2Min && (
          <div ref={col2Ref} className="flex-1 overflow-y-auto h-full border-r border-border flex flex-col">
            <div className="sticky top-0 z-10 flex items-center gap-x-2 px-4 pt-2 pb-2 bg-transparent font-bookish text-sm">
              <TypeSelect value={col2Type} onChange={setCol2Type} />
              <SortSelect value={col2Sort} onChange={setCol2Sort} />
              <Button variant="ghost" size="sm" onClick={() => setCol2Min(true)} className="shrink-0 rounded-full w-7 h-7 p-0 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-base leading-none">−</Button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.5, delay: 0.06 }} className="flex flex-col">
              {col2Exhibitions.map((ex) => renderExhibitionItem(ex))}
            </motion.div>
          </div>
        )}
        {!col3Min && (
          <div ref={col3Ref} className="flex-1 overflow-y-auto h-full flex flex-col">
            <div className="sticky top-0 z-10 flex items-center gap-x-2 px-4 pt-2 pb-2 bg-transparent font-bookish text-sm">
              <TypeSelect value={col3Type} onChange={setCol3Type} />
              <SortSelect value={col3Sort} onChange={setCol3Sort} />
              <Button variant="ghost" size="sm" onClick={() => setCol3Min(true)} className="shrink-0 rounded-full w-7 h-7 p-0 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-base leading-none">−</Button>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: loading ? 0 : 1 }} transition={{ duration: 0.5, delay: 0.12 }} className="flex flex-col">
              {col3Exhibitions.map((ex) => renderExhibitionItem(ex))}
            </motion.div>
          </div>
        )}
      </div>

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

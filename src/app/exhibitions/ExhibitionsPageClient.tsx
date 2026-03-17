"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Exhibition } from "../../../lib/sanity";
import { useUI } from "@/context/UIContext";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";
import { motion } from "framer-motion";
import { Cross1Icon, Half2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";
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
  const [col2Type, setCol2Type] = useState("all");
  const [col1Min, setCol1Min] = useState(false);
  const [col2Min, setCol2Min] = useState(false);
  const [col1Dark, setCol1Dark] = useState(false);
  const [col2Dark, setCol2Dark] = useState(false);
  const [col1AsList, setCol1AsList] = useState(false);
  const [col2AsList, setCol2AsList] = useState(false);
  const [mobileAsList, setMobileAsList] = useState(false);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  const {
    exhibitions,
    setActiveExhibitionSlug,
    activeExhibitionSlug,
    exLoading,
  } = useExhibitions();

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        setMobileHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current + 5) {
        setMobileHeaderVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loading = !initialAnimDone || !dataLoaded;

  function sortExhibitions(
    list: Exhibition[],
    sort: ExhibitionSort,
  ): Exhibition[] {
    switch (sort) {
      case "year":
        return [...list].sort(
          (a, b) => Number(b.acf.year) - Number(a.acf.year),
        );
      case "year-oldest":
        return [...list].sort(
          (a, b) => Number(a.acf.year) - Number(b.acf.year),
        );
      case "title":
        return [...list].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv"),
        );
      default:
        return list;
    }
  }

  function filterByType(list: Exhibition[], type: string): Exhibition[] {
    return type === "all" ? list : list.filter((e) => e.acf.exhibition_type === type);
  }

  // Left col: all types, user-controlled sort
  const col1Exhibitions = sortExhibitions(exhibitions, col1Sort);
  // Right col: user-controlled type filter, sorted newest first
  const col2Exhibitions = sortExhibitions(filterByType(exhibitions, col2Type), "year");

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
        className="group relative cursor-pointer w-full flex flex-col"
        aria-label={`Show exhibition: ${ex.title.rendered}`}
      >
        {ex.acf.image_1 && (
          <div className="lg:hidden relative w-full p-4 pb-0">
            <CornerFrame />
            <Image
              src={ex.acf.image_1.url}
              alt={ex.title.rendered}
              width={ex.acf.image_1.width ?? 800}
              height={ex.acf.image_1.height ?? 600}
              style={{ width: "100%", height: "auto" }}
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}
        <div className="hidden lg:block relative h-[75vh] w-full overflow-hidden p-4 pb-0">
          <CornerFrame />
          {ex.acf.image_1 && (
            <div className="absolute inset-4 flex items-end">
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

  function colStyle(dark: boolean) {
    return {
      column: dark ? "bg-black text-white" : "bg-background text-foreground",
      header: dark ? "bg-black" : "bg-background",
      headerRow: `shadow-[var(--shadow-ui)] [&>*+*]:border-l [&>*+*]:border-foreground/8`,
      trigger: `border-0 shadow-none px-2 h-auto font-bookish text-sm focus:ring-0 rounded-none gap-2 py-1.5 w-full ${dark ? "bg-black text-white" : "bg-background text-neutral-600 dark:text-neutral-400"}`,
      content: `bg-background text-foreground font-bookish rounded-none text-sm w-[var(--radix-select-trigger-width)] shadow-[var(--shadow-md)]`,
      item: `rounded-none text-foreground focus:bg-foreground/10 focus:text-foreground`,
    };
  }
  const c1 = colStyle(col1Dark);
  const c2 = colStyle(col2Dark);

  return (
    <section className="relative w-full mt-0">
      {/* Mobile: single staggered list */}
      <div className="lg:hidden relative z-40 bg-background">
        {/* Mobile fixed header — hide on scroll down, show on scroll up */}
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-background shadow-[var(--shadow-nav)]"
          style={{ paddingTop: "var(--nav-height, 0px)" }}
          animate={{ y: mobileHeaderVisible ? 0 : "-100%" }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex items-center p-4 font-bookish text-sm">
            <Select
              value={col1Sort}
              onValueChange={(v) => setCol1Sort(v as ExhibitionSort)}
            >
              <SelectTrigger className="shadow-[var(--shadow-ui)] px-3 h-auto font-bookish focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-neutral-600 dark:text-neutral-400 w-full text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground font-bookish rounded-none text-sm w-[var(--radix-select-trigger-width)]">
                <SelectItem
                  value="year"
                  className="text-foreground focus:bg-foreground/10 focus:text-foreground rounded-none"
                >
                  Exhibitions — Newest First
                </SelectItem>
                <SelectItem
                  value="year-oldest"
                  className="text-foreground focus:bg-foreground/10 focus:text-foreground"
                >
                  Exhibitions — Oldest First
                </SelectItem>
                <SelectItem
                  value="title"
                  className="text-foreground focus:bg-foreground/10 focus:text-foreground"
                >
                  Exhibitions — Title A–Z
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="controls"
              onClick={() => setMobileAsList((v) => !v)}
              className="shrink-0 shadow-[var(--shadow-ui)]"
            >
              {mobileAsList ? "Thumbnails" : "List"}
            </Button>
          </div>
        </motion.div>
        {/* Spacer */}
        <motion.div
          animate={{ height: mobileHeaderVisible ? "calc(var(--nav-height, 0px) + 52px)" : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        />
        {mobileAsList ? (
          <div className="p-4">
            <div className="border-t border-x border-border">
              {sortExhibitions(exhibitions, col1Sort).map((ex: Exhibition) => (
                <button
                  key={ex.id}
                  onClick={() => openExhibition(ex)}
                  className="w-full flex items-baseline font-bookish h3 py-1.5 px-3 text-left hover:bg-foreground/10 transition-colors"
                  aria-label={`Show exhibition: ${ex.title.rendered}`}
                >
                  {ex.title.rendered}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Staggered
            items={sortExhibitions(exhibitions, col1Sort)}
            getKey={(ex) => ex.id}
            loading={loading}
            className="flex flex-col"
            renderItem={(ex: Exhibition) => renderExhibitionItem(ex)}
          />
        )}
      </div>

      {/* Desktop: two fixed scrolling columns */}
      <div
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0 transition-[top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ top: navVisible ? "var(--nav-height, 0px)" : "0px" }}
      >
        {/* Restore pills */}
        <div className="absolute right-2 top-8 flex items-center gap-x-2 z-50">
          {col1Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol1Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm shadow-[var(--shadow-ui)]"
            >
              + Exhibitions
            </Button>
          )}
          {col2Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol2Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm shadow-[var(--shadow-ui)]"
            >
              + {col2Type === "all" ? "All Types" : col2Type}
            </Button>
          )}
        </div>

        {/* Left col: sort only */}
        {!col1Min && (
          <div
            ref={col1Ref}
            className={`flex-1 overflow-y-auto h-full flex flex-col shadow-[var(--shadow-col-left)] ${c1.column}`}
          >
            <div className={`sticky top-0 z-10 shadow-[var(--shadow-col-left)] ${c1.header}`}>
              <div className={`mx-4 flex items-center gap-x-0 font-bookish text-sm ${c1.headerRow}`}>
                <Select
                  value={col1Sort}
                  onValueChange={(v) => setCol1Sort(v as ExhibitionSort)}
                >
                  <SelectTrigger className={c1.trigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={c1.content}>
                    <SelectItem value="year" className={c1.item}>
                      Exhibitions — Newest First
                    </SelectItem>
                    <SelectItem value="year-oldest" className={c1.item}>
                      Exhibitions — Oldest First
                    </SelectItem>
                    <SelectItem value="title" className={c1.item}>
                      Exhibitions — Title A–Z
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="controls"
                  onClick={() => setCol1AsList((v) => !v)}
                >
                  {col1AsList ? "Thumbnails" : "List"}
                </Button>
                <Button
                  variant="ghost"
                  className="hidden"
                  size="controlsIcon"
                  onClick={() => setCol1Dark((d) => !d)}
                  aria-label="Toggle dark background"
                >
                  <Half2Icon />
                </Button>
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  onClick={() => setCol1Min(true)}
                  className="no-hide-text"
                >
                  <Cross1Icon />
                </Button>
              </div>
            </div>
            {col1AsList ? (
              <div className="p-4">
                <div className="shadow-[var(--shadow-md)]">
                  {col1Exhibitions.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => openExhibition(ex)}
                      className="w-full flex items-baseline font-bookish h3 py-1.5 px-3 text-left hover:bg-foreground/10 transition-colors"
                      aria-label={`Show exhibition: ${ex.title.rendered}`}
                    >
                      {ex.title.rendered}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col"
              >
                {col1Exhibitions.map((ex) => renderExhibitionItem(ex))}
              </motion.div>
            )}
          </div>
        )}

        {(!col1Min && !col2Min) && <div className="w-px bg-foreground/10 self-stretch flex-none" />}
        {/* Right col: type filter only */}
        {!col2Min && (
          <div
            ref={col2Ref}
            className={`flex-1 overflow-y-auto h-full flex flex-col shadow-[var(--shadow-col-right)] ${c2.column}`}
          >
            <div className={`sticky top-0 z-10 shadow-[var(--shadow-col-right)] ${c2.header}`}>
              <div className="mx-4 flex items-center gap-x-4 font-bookish text-sm">
                <div className={`flex w-full items-center gap-0 ${c2.headerRow}`}>
                  <Select value={col2Type} onValueChange={setCol2Type}>
                    <SelectTrigger className={c2.trigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={c2.content}>
                      <SelectItem value="all" className={c2.item}>
                        Exhibitions — All Types
                      </SelectItem>
                      <SelectItem value="Solo" className={c2.item}>
                        Exhibitions — Solo
                      </SelectItem>
                      <SelectItem value="Group" className={c2.item}>
                        Exhibitions — Group
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="controls"
                    onClick={() => setCol2AsList((v) => !v)}
                  >
                    {col2AsList ? "Thumbnails" : "List"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    className="hidden"
                    onClick={() => setCol2Dark((d) => !d)}
                    aria-label="Toggle dark background"
                  >
                    <Half2Icon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setCol2Min(true)}
                    className="no-hide-text"
                  >
                    <Cross1Icon />
                  </Button>
                </div>
                <div className="flex items-center gap-0 border border-border [&>*+*]:border-l [&>*+*]:border-border">
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setShowInfo(!showInfo)}
                    className={showInfo ? "line-through decoration-1" : ""}
                    aria-label={showInfo ? "Hide text" : "Show text"}
                  >
                    T
                  </Button>
                </div>
              </div>
            </div>
            {col2AsList ? (
              <div className="p-4">
                <div className="shadow-[var(--shadow-md)]">
                  {col2Exhibitions.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => openExhibition(ex)}
                      className="w-full flex items-baseline font-bookish h3 py-1.5 px-3 text-left hover:bg-foreground/10 transition-colors"
                      aria-label={`Show exhibition: ${ex.title.rendered}`}
                    >
                      {ex.title.rendered}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.06 }}
                className="flex flex-col"
              >
                {col2Exhibitions.map((ex) => renderExhibitionItem(ex))}
              </motion.div>
            )}
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

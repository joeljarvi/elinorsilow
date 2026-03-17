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

function TIcon({ active }: { active: boolean }) {
  return (
    <span className={`font-serif text-sm ${!active ? " " : "line-through"}`}>
      T
    </span>
  );
}

export default function ExhibitionsPageClient() {
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [col1Sort, setCol1Sort] = useState<ExhibitionSort>("year");
  const [col2Sort, setCol2Sort] = useState<ExhibitionSort>("year");
  const [col1Type, setCol1Type] = useState("Solo");
  const [col2Type, setCol2Type] = useState("Group");
  const [col1Min, setCol1Min] = useState(false);
  const [col2Min, setCol2Min] = useState(false);
  const [col1Dark, setCol1Dark] = useState(false);
  const [col2Dark, setCol2Dark] = useState(false);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

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
        {/* Mobile: hug image height */}
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
        {/* Desktop: fixed tall container */}
        <div className="hidden lg:block relative h-[75vh] w-full overflow-hidden p-4 pb-0">
          <CornerFrame />
          {ex.acf.image_1 && (
            <div className="absolute inset-4 flex items-end">
              <Image
                src={ex.acf.image_1.url}
                alt={ex.title.rendered}
                fill
                sizes="50vw"
                className="object-contain"
              />
            </div>
          )}
        </div>
        {showInfo && <InfoBox exhibition={ex} />}
      </button>
    );
  }

  const selectTriggerClass =
    "border-0 shadow-none px-2 h-auto font-bookish text-sm focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-foreground w-full";
  const selectContentClass =
    "bg-background text-foreground border border-border font-bookish rounded-none shadow-none text-sm w-[var(--radix-select-trigger-width)]";
  const selectItemClass =
    "text-foreground focus:bg-foreground/10 focus:text-foreground rounded-none";

  return (
    <section className="relative w-full mt-0">
      {/* Mobile: single staggered list */}
      <div className="lg:hidden relative z-40 bg-transparent">
        <div className="sticky top-0 lg:top-8 z-50 bg-background w-full pt-0 pb-0">
          <div className="mx-0 flex items-stretch font-bookish text-sm gap-x-0 border-x-0 border-border border-t-0 [&>*+*]:border-l [&>*+*]:border-border">
            <div className="flex items-center gap-x-2 w-1/2">
              <Select
                value={col1Sort}
                onValueChange={(v) => setCol1Sort(v as ExhibitionSort)}
              >
                <SelectTrigger className="border border-border border-x-0 shadow-none px-2 h-auto font-bookish focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-foreground w-full text-base lg:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="year" className={selectItemClass}>
                    Year
                  </SelectItem>
                  <SelectItem value="title" className={selectItemClass}>
                    Title
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center flex-1 w-full gap-x-2">
              <Select value={col1Type} onValueChange={setCol1Type}>
                <SelectTrigger className="border border-border border-x-0 shadow-none px-2 h-auto font-bookish focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-foreground w-full text-base lg:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="all" className={selectItemClass}>
                    All
                  </SelectItem>
                  <SelectItem value="Solo" className={selectItemClass}>
                    Solo
                  </SelectItem>
                  <SelectItem value="Group" className={selectItemClass}>
                    Group
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="border border-border border-x-0 shadow-none px-3 h-auto font-bookish text-sm focus:ring-0 rounded-none pb-1 bg-background pt-2 text-muted-foreground"
                onClick={() => setShowInfo(!showInfo)}
                aria-label={showInfo ? "Hide text" : "Show text"}
              >
                <TIcon active={showInfo} />
              </Button>
            </div>
          </div>
        </div>
        <Staggered
          items={sortExhibitions(exhibitions, col1Sort)}
          getKey={(ex) => ex.id}
          loading={loading}
          className="flex flex-col"
          renderItem={(ex: Exhibition) => renderExhibitionItem(ex)}
        />
      </div>

      {/* Desktop: two fixed scrolling columns */}
      <div
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0"
        style={{ top: "calc(var(--nav-height, 0px) + 0px)" }}
      >
        {/* Restore pills */}
        <div className="absolute right-2 top-8 flex items-center gap-x-2 z-50">
          {col1Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol1Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm border border-border"
            >
              + {col1Type === "all" ? "All" : col1Type}
            </Button>
          )}
          {col2Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol2Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm border border-border"
            >
              + {col2Type === "all" ? "All" : col2Type}
            </Button>
          )}
        </div>

        {!col1Min && (
          <div
            ref={col1Ref}
            className={`flex-1 overflow-y-auto h-full border-r border-border flex flex-col ${col1Dark ? "bg-black text-white" : "bg-background text-foreground"}`}
          >
            <div
              className={`sticky top-0 z-10 pt-4 ${col1Dark ? "bg-black" : "bg-background"}`}
            >
              <div className="mx-4 flex items-center gap-x-0 font-bookish text-sm border border-border [&>*+*]:border-l [&>*+*]:border-border">
                <Select value={col1Type} onValueChange={setCol1Type}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="all" className={selectItemClass}>
                      All
                    </SelectItem>
                    <SelectItem value="Solo" className={selectItemClass}>
                      Solo
                    </SelectItem>
                    <SelectItem value="Group" className={selectItemClass}>
                      Group
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={col1Sort}
                  onValueChange={(v) => setCol1Sort(v as ExhibitionSort)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    <SelectItem value="year" className={selectItemClass}>
                      Year
                    </SelectItem>
                    <SelectItem value="title" className={selectItemClass}>
                      Title
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
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
                >
                  <Cross1Icon />
                </Button>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              {col1Exhibitions.map((ex) => renderExhibitionItem(ex))}
            </motion.div>
          </div>
        )}

        {!col2Min && (
          <div
            ref={col2Ref}
            className={`flex-1 overflow-y-auto h-full flex flex-col ${col2Dark ? "bg-black text-white" : "bg-background text-foreground"}`}
          >
            <div
              className={`sticky top-0 z-10 pt-4 ${col2Dark ? "bg-black" : "bg-background"}`}
            >
              <div className="mx-4 flex items-center gap-x-4 font-bookish text-sm">
                <div className="flex w-full items-center gap-0 border border-border [&>*+*]:border-l [&>*+*]:border-border">
                  <Select value={col2Type} onValueChange={setCol2Type}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="all" className={selectItemClass}>
                        All
                      </SelectItem>
                      <SelectItem value="Solo" className={selectItemClass}>
                        Solo
                      </SelectItem>
                      <SelectItem value="Group" className={selectItemClass}>
                        Group
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={col2Sort}
                    onValueChange={(v) => setCol2Sort(v as ExhibitionSort)}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value="year" className={selectItemClass}>
                        Year
                      </SelectItem>
                      <SelectItem value="title" className={selectItemClass}>
                        Title
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setCol2Dark((d) => !d)}
                    aria-label="Toggle dark background"
                  >
                    <Half2Icon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setCol2Min(true)}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loading ? 0 : 1 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="flex flex-col"
            >
              {col2Exhibitions.map((ex) => renderExhibitionItem(ex))}
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

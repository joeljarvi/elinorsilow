"use client";

import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion } from "framer-motion";
import HDivider from "@/components/HDivider";
import { WidthIcon, Cross1Icon, Half2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Staggered from "@/components/Staggered";
import WorkModal from "@/app/works/WorkModal";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";
import { DarkModeToggle } from "@/components/DarkModeToggle";
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

export default function WorksPageClient() {
  const {
    allWorks,
    filteredWorks,
    setActiveWorkSlug,
    activeWorkSlug,
    workSort,
    setWorkSort,
    categoryFilter,
    setCategoryFilter,
  } = useWorks();

  const [col1Filter, setCol1Filter] = useState<CategoryFilter>("all");
  const [col2Filter, setCol2Filter] = useState<CategoryFilter>("all");
  const [col1Sort, setCol1Sort] = useState<WorkSort>("year-latest");
  const [col2Sort, setCol2Sort] = useState<WorkSort>("title");
  const [col1Min, setCol1Min] = useState(false);
  const [col2Min, setCol2Min] = useState(false);
  const [col1Dark, setCol1Dark] = useState(false);
  const [col2Dark, setCol2Dark] = useState(false);

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && ["painting", "drawing", "sculpture", "textile"].includes(cat)) {
      setCategoryFilter(cat as CategoryFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const { workLoading } = useWorks();
  const {
    setOpen,
    proportionalImages,
    setProportionalImages,
    showAsList,
    setShowAsList,
    showInfo,
    setShowInfo,
  } = useUI();

  useEffect(() => {
    if (!workLoading) setDataLoaded(true);
  }, [workLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => setInitialAnimDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  const loading = !initialAnimDone || !dataLoaded;

  function filterAndSort(filter: CategoryFilter, sort: WorkSort): Work[] {
    const filtered =
      filter === "all"
        ? allWorks
        : allWorks.filter((w) => w.acf.category === filter);
    switch (sort) {
      case "year-latest":
        return [...filtered].sort((a, b) => b.acf.year - a.acf.year);
      case "year-oldest":
        return [...filtered].sort((a, b) => a.acf.year - b.acf.year);
      case "title":
        return [...filtered].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv"),
        );
      default:
        return filtered;
    }
  }

  const col1Works = filterAndSort(col1Filter, col1Sort);
  const col2Works = filterAndSort(col2Filter, col2Sort);

  function colStyle(active: boolean) {
    return {
      column: active
        ? "bg-red-600 text-background"
        : "bg-background text-foreground",
      header: active ? "bg-red-600" : "bg-background",
      headerRow: active
        ? "border-background [&>*+*]:border-l [&>*+*]:border-background"
        : "border-border [&>*+*]:border-l [&>*+*]:border-border",
      trigger: `border-0 shadow-none px-2 h-auto font-bookish text-sm focus:ring-0 rounded-none gap-2 py-1.5 w-full ${active ? "bg-red-600 text-background" : "bg-background text-foreground"}`,
      content: `${active ? "bg-red-600 text-background border-background/40" : "bg-background text-foreground border border-border"} font-bookish rounded-none shadow-none text-sm w-[var(--radix-select-trigger-width)]`,
      item: `rounded-none ${active ? "text-background focus:bg-background/20 focus:text-background" : "text-foreground focus:bg-foreground/10 focus:text-foreground"}`,
    };
  }
  const c1 = colStyle(col1Dark);
  const c2 = colStyle(col2Dark);

  function openWork(work: Work) {
    setActiveWorkSlug(work.slug);
    setOpen(false);
    window.history.pushState(null, "", `/works?work=${work.slug}`);
  }

  function renderWorkItem(work: Work) {
    return (
      <button
        onClick={() => openWork(work)}
        className="group relative cursor-pointer w-full flex flex-col "
        aria-label={`Show work: ${work.title.rendered}`}
      >
        <div className="relative h-[75vh] w-full overflow-hidden p-4 pb-0">
          <CornerFrame />
          {work.image_url && (
            <div className="absolute inset-4 flex items-end">
              <ProportionalWorkImage
                src={work.image_url}
                alt={work.title.rendered}
                dimensions={work.acf.dimensions}
                proportional={proportionalImages}
              />
            </div>
          )}
        </div>
        {showInfo && <InfoBox work={work} />}
      </button>
    );
  }

  return (
    <section className="relative w-full mt-0">
      {/* Mobile: single scroll */}
      <div className="lg:hidden relative z-40 bg-transparent">
        {/* Mobile sticky header */}
        <div className="sticky top-0 lg:top-8 z-50 bg-background w-full pt-0 pb-0">
          <div className="mx-0 flex items-stretch font-bookish text-sm gap-x-0 border-x-0 border-border border-t-0 [&>*+*]:border-l border-b-0 [&>*+*]:border-border">
            <div className="flex items-center gap-x-2 w-1/2">
              <Select
                value={workSort}
                onValueChange={(v) => setWorkSort(v as WorkSort)}
              >
                <SelectTrigger className="border border-border border-x-0 shadow-none pl-3 pr-2 h-auto font-bookish focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-foreground w-full text-base lg:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground border border-border font-bookish rounded-none shadow-none text-sm w-[var(--radix-select-trigger-width)]">
                  <SelectItem
                    value="year-latest"
                    className="text-foreground focus:bg-foreground/10 focus:text-foreground rounded-none"
                  >
                    Latest added
                  </SelectItem>
                  <SelectItem
                    value="year-oldest"
                    className="text-foreground focus:bg-foreground/10 focus:text-foreground"
                  >
                    Oldest added
                  </SelectItem>
                  <SelectItem
                    value="title"
                    className="text-foreground focus:bg-foreground/10 focus:text-foreground"
                  >
                    Title
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center flex-1 w-full gap-x-2">
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}
              >
                <SelectTrigger className="border border-border border-x-0 shadow-none px-2 h-auto font-bookish focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-foreground w-full text-base lg:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground border border-border font-bookish rounded-none shadow-none text-sm w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="drawing">Drawing</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="controlsIcon"
                className="border border-border border-x-0 shadow-none px-3 h-auto font-bookish text-sm focus:ring-0 rounded-none pb-1 bg-background pt-2  text-muted-foreground"
                onClick={() => setShowInfo(!showInfo)}
                aria-label={showInfo ? "Hide text" : "Show text"}
              >
                <TIcon active={showInfo} />
              </Button>
            </div>
          </div>
        </div>
        {showAsList ? (
          <div className="p-4">
            <div className="grid grid-cols-1 gap-x-4">
              {[...filteredWorks]
                .sort((a, b) =>
                  a.title.rendered.localeCompare(b.title.rendered, "sv"),
                )
                .map((work: Work) => (
                  <Button
                    key={work.id}
                    variant="link"
                    size="lg"
                    onClick={() => openWork(work)}
                    className="justify-start"
                    aria-label={`Show work: ${work.title.rendered}`}
                  >
                    <span className="font-bookish text-2xl">
                      {work.title.rendered}
                    </span>
                  </Button>
                ))}
            </div>
          </div>
        ) : (
          <Staggered
            items={filteredWorks}
            getKey={(w) => w.id}
            loading={loading}
            className="min-h-screen flex flex-col gap-y-0"
            renderItem={(work: Work) => (
              <div className="">{renderWorkItem(work)}</div>
            )}
          />
        )}
      </div>

      {/* Desktop: three independently scrolling columns */}
      <div
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0"
        style={{ top: "calc(var(--nav-height, 0px) + 0px)" }}
      >
        {/* Global controls + restore pills */}
        <div className="absolute right-2 top-12 flex items-center gap-x-2 z-50">
          {col1Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol1Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm border border-border"
            >
              +{" "}
              {col1Filter === "all"
                ? "All"
                : col1Filter.charAt(0).toUpperCase() + col1Filter.slice(1)}
            </Button>
          )}
          {col2Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol2Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm border border-border"
            >
              +{" "}
              {col2Filter === "all"
                ? "All"
                : col2Filter.charAt(0).toUpperCase() + col2Filter.slice(1)}
            </Button>
          )}
        </div>

        {!col1Min && (
          <div
            ref={col1Ref}
            className={`flex-1 overflow-y-auto h-full border-r flex flex-col ${col1Dark ? "border-background" : "border-border"} ${c1.column}`}
          >
            <div className={`sticky top-0 z-10 pt-4 ${c1.header}`}>
              <div className={`mx-4 flex items-center gap-x-0 font-bookish text-sm border ${c1.headerRow}`}>
                <Select
                  value={col1Filter}
                  onValueChange={(v) => setCol1Filter(v as CategoryFilter)}
                >
                  <SelectTrigger className={c1.trigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={c1.content}>
                    <SelectItem value="all" className={c1.item}>All</SelectItem>
                    <SelectItem value="painting" className={c1.item}>Painting</SelectItem>
                    <SelectItem value="drawing" className={c1.item}>Drawing</SelectItem>
                    <SelectItem value="sculpture" className={c1.item}>Sculpture</SelectItem>
                    <SelectItem value="textile" className={c1.item}>Textile</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={col1Sort}
                  onValueChange={(v) => setCol1Sort(v as WorkSort)}
                >
                  <SelectTrigger className={c1.trigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={c1.content}>
                    <SelectItem value="year-latest" className={c1.item}>Year — latest</SelectItem>
                    <SelectItem value="year-oldest" className={c1.item}>Year — oldest</SelectItem>
                    <SelectItem value="title" className={c1.item}>Title</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  onClick={() => setCol1Dark((d) => !d)}
                  aria-label="Toggle color mode"
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
            {showAsList ? (
              <div className="p-0">
                {col1Works.map((work) => (
                  <Button
                    key={work.id}
                    variant="link"
                    size="lg"
                    onClick={() => openWork(work)}
                    className="justify-start w-full"
                    aria-label={`Show work: ${work.title.rendered}`}
                  >
                    <span className="font-bookish text-2xl">
                      {work.title.rendered}
                    </span>
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
                {col1Works.map((work) => (
                  <div key={work.id}>{renderWorkItem(work)}</div>
                ))}
              </motion.div>
            )}
          </div>
        )}
        {!col2Min && (
          <div
            ref={col2Ref}
            className={`flex-1 overflow-y-auto h-full flex flex-col ${c2.column}`}
          >
            <div className={`sticky top-0 z-10 pt-4 ${c2.header}`}>
              <div className="mx-4 flex items-center gap-x-4 font-bookish text-sm ">
                <div className={`flex w-full items-center gap-0 border ${c2.headerRow}`}>
                  <Select
                    value={col2Filter}
                    onValueChange={(v) => setCol2Filter(v as CategoryFilter)}
                  >
                    <SelectTrigger className={c2.trigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={c2.content}>
                      <SelectItem value="all" className={c2.item}>All</SelectItem>
                      <SelectItem value="painting" className={c2.item}>Painting</SelectItem>
                      <SelectItem value="drawing" className={c2.item}>Drawing</SelectItem>
                      <SelectItem value="sculpture" className={c2.item}>Sculpture</SelectItem>
                      <SelectItem value="textile" className={c2.item}>Textile</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={col2Sort}
                    onValueChange={(v) => setCol2Sort(v as WorkSort)}
                  >
                    <SelectTrigger className={c2.trigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={c2.content}>
                      <SelectItem value="year-latest" className={c2.item}>Year — latest</SelectItem>
                      <SelectItem value="year-oldest" className={c2.item}>Year — oldest</SelectItem>
                      <SelectItem value="title" className={c2.item}>Title</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setCol2Dark((d) => !d)}
                    aria-label="Toggle color mode"
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
                    size="controls"
                    onClick={() => setShowAsList(!showAsList)}
                  >
                    {showAsList ? "Thumbnails" : "List"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setShowInfo(!showInfo)}
                    className={showInfo ? "line-through decoration-1" : ""}
                    aria-label={showInfo ? "Hide text" : "Show text"}
                  >
                    T
                  </Button>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    onClick={() => setProportionalImages(!proportionalImages)}
                    aria-label={
                      proportionalImages ? "Full width" : "Proportional"
                    }
                  >
                    <WidthIcon />
                  </Button>
                </div>
              </div>
            </div>
            {showAsList ? (
              <div className="p-0">
                {col2Works.map((work) => (
                  <Button
                    key={work.id}
                    variant="link"
                    size="lg"
                    onClick={() => openWork(work)}
                    className="justify-start w-full"
                    aria-label={`Show work: ${work.title.rendered}`}
                  >
                    <span className="font-bookish text-2xl">
                      {work.title.rendered}
                    </span>
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
                {col2Works.map((work) => (
                  <div key={work.id}>{renderWorkItem(work)}</div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => {
            setActiveWorkSlug(null);
            setOpen(true);
          }}
        />
      )}
    </section>
  );
}

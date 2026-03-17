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

  const [col2Filter, setCol2Filter] = useState<CategoryFilter>("all");
  const [col1Sort, setCol1Sort] = useState<WorkSort>("year-latest");
  const [col1Min, setCol1Min] = useState(false);
  const [col2Min, setCol2Min] = useState(false);
  const [col1Dark, setCol1Dark] = useState(false);
  const [col2Dark, setCol2Dark] = useState(false);
  const [col1AsList, setCol1AsList] = useState(false);
  const [col2AsList, setCol2AsList] = useState(false);
  const [mobileAsList, setMobileAsList] = useState(false);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

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
    showInfo,
    setShowInfo,
    navVisible,
  } = useUI();

  useEffect(() => {
    if (!workLoading) setDataLoaded(true);
  }, [workLoading]);

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
      case "category":
        return [...filtered].sort((a, b) => {
          const cat = (a.acf.category ?? "").localeCompare(
            b.acf.category ?? "",
            "sv",
          );
          if (cat !== 0) return cat;
          return a.title.rendered.localeCompare(b.title.rendered, "sv");
        });
      default:
        return filtered;
    }
  }

  const col1Works = filterAndSort("all", col1Sort);
  const col2Works = filterAndSort(col2Filter, "category");

  function colStyle(active: boolean) {
    return {
      column: active
        ? "bg-red-600 text-background"
        : "bg-secondary text-foreground",
      header: active ? "bg-red-600" : "bg-secondary",
      headerRow: active
        ? "[&>*+*]:border-l [&>*+*]:border-background/20"
        : "[&>*+*]:border-l [&>*+*]:border-foreground/8",
      trigger: `border-0 shadow-none px-2 h-auto font-bookish text-sm focus:ring-0 rounded-none gap-2 py-1.5 w-full ${active ? "bg-red-600 text-background" : "bg-secondary text-foreground"}`,
      content: `${active ? "bg-red-600 text-background" : "bg-background text-foreground"} font-bookish rounded-none text-sm w-[var(--radix-select-trigger-width)] shadow-[var(--shadow-md)]`,
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
      <div className="lg:hidden relative z-40 bg-secondary">
        {/* Mobile fixed header — hide on scroll down, show on scroll up */}
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-background shadow-[var(--shadow-nav)]"
          style={{ paddingTop: "var(--nav-height, 0px)" }}
          animate={{ y: mobileHeaderVisible ? 0 : "-100%" }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex items-center p-4 gap-x-2 font-bookish text-sm">
            <Select
              value={workSort}
              onValueChange={(v) => setWorkSort(v as WorkSort)}
            >
              <SelectTrigger className="shadow-[var(--shadow-ui)] px-3 h-auto font-bookish focus:ring-0 rounded-none gap-2 py-1.5 bg-background text-foreground w-full text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background text-foreground font-bookish rounded-none text-sm w-[var(--radix-select-trigger-width)]">
                <SelectItem
                  value="year-latest"
                  className="text-foreground focus:bg-foreground/10 focus:text-foreground rounded-none"
                >
                  Works — Newest First
                </SelectItem>
                <SelectItem
                  value="year-oldest"
                  className="text-foreground focus:bg-foreground/10 focus:text-foreground"
                >
                  Works — Oldest First
                </SelectItem>
                <SelectItem
                  value="title"
                  className="text-foreground focus:bg-foreground/10 focus:text-foreground"
                >
                  Works — Title A–Z
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
        {/* Spacer so content doesn't sit under fixed header */}
        <motion.div
          animate={{
            height: mobileHeaderVisible
              ? "calc(var(--nav-height, 0px) + 52px)"
              : 0,
          }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        />
        {mobileAsList ? (
          <div className="p-4">
            <div className="border-t border-x border-border">
              {filteredWorks.map((work: Work) => (
                <button
                  key={work.id}
                  onClick={() => openWork(work)}
                  className="w-full flex items-baseline font-bookish h3 py-1.5 px-3 text-left hover:bg-foreground/10 transition-colors"
                  aria-label={`Show work: ${work.title.rendered}`}
                >
                  {work.title.rendered}
                </button>
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
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0 transition-[top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ top: navVisible ? "var(--nav-height, 0px)" : "0px" }}
      >
        {/* Global controls + restore pills */}
        <div className="absolute right-2 top-12 flex items-center gap-x-2 z-50">
          {col1Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol1Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm shadow-[var(--shadow-ui)]"
            >
              + Works
            </Button>
          )}
          {col2Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol2Min(false)}
              className="rounded-none px-3 h-auto py-1.5 bg-background hover:bg-foreground/10 font-bookish text-sm shadow-[var(--shadow-ui)]"
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
            className={`flex-1 overflow-y-auto h-full flex flex-col shadow-[var(--shadow-col-left)] ${c1.column}`}
          >
            <div className={`sticky top-0 z-10 pt-4 ${c1.header}`}>
              <div
                className={`mx-4 flex items-center gap-x-0 font-bookish text-sm shadow-[var(--shadow-ui)] ${c1.headerRow}`}
              >
                <Select
                  value={col1Sort}
                  onValueChange={(v) => setCol1Sort(v as WorkSort)}
                >
                  <SelectTrigger className={c1.trigger}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={c1.content}>
                    <SelectItem value="year-latest" className={c1.item}>
                      Works — Newest First
                    </SelectItem>
                    <SelectItem value="year-oldest" className={c1.item}>
                      Works — Oldest First
                    </SelectItem>
                    <SelectItem value="title" className={c1.item}>
                      Works — Title A–Z
                    </SelectItem>
                    <SelectItem value="category" className={c1.item}>
                      Works — Category A–Z
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
            {col1AsList ? (
              <div className="p-4">
                <div className="shadow-[var(--shadow-md)]">
                  {col1Works.map((work) => (
                    <button
                      key={work.id}
                      onClick={() => openWork(work)}
                      className="w-full flex items-baseline font-bookish h3 py-1.5 px-3 text-left hover:bg-foreground/10 transition-colors"
                      aria-label={`Show work: ${work.title.rendered}`}
                    >
                      {work.title.rendered}
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
            className={`flex-1 overflow-y-auto h-full flex flex-col shadow-[var(--shadow-col-right)] ${c2.column}`}
          >
            <div className={`sticky top-0 z-10 pt-4 ${c2.header}`}>
              <div className="mx-4 flex items-center gap-x-4 font-bookish text-sm ">
                <div
                  className={`flex w-full items-center gap-0 shadow-[var(--shadow-ui)] ${c2.headerRow}`}
                >
                  <Select
                    value={col2Filter}
                    onValueChange={(v) => setCol2Filter(v as CategoryFilter)}
                  >
                    <SelectTrigger className={c2.trigger}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={c2.content}>
                      <SelectItem value="all" className={c2.item}>
                        Works — All Categories
                      </SelectItem>
                      <SelectItem value="painting" className={c2.item}>
                        Works — Categories — Painting
                      </SelectItem>
                      <SelectItem value="drawing" className={c2.item}>
                        Works — Categories — Drawing
                      </SelectItem>
                      <SelectItem value="sculpture" className={c2.item}>
                        Works — Categories — Sculpture
                      </SelectItem>
                      <SelectItem value="textile" className={c2.item}>
                        Works — Categories — Textile
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="controlsIcon"
                    className="hidden"
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
                <div className="flex items-center gap-0 shadow-[var(--shadow-ui)] [&>*+*]:border-l [&>*+*]:border-foreground/8">
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
            {col2AsList ? (
              <div className="p-4">
                <div className="shadow-[var(--shadow-md)]">
                  {col2Works.map((work) => (
                    <button
                      key={work.id}
                      onClick={() => openWork(work)}
                      className="w-full flex items-baseline font-bookish h3 py-1.5 px-3 text-left hover:bg-foreground/10 transition-colors"
                      aria-label={`Show work: ${work.title.rendered}`}
                    >
                      {work.title.rendered}
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

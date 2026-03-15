"use client";

import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useUI } from "@/context/UIContext";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Work } from "../../../lib/sanity";
import { motion } from "framer-motion";
import HDivider from "@/components/HDivider";
import { Button } from "@/components/ui/button";
import Staggered from "@/components/Staggered";
import WorkModal from "@/app/works/WorkModal";
import ProportionalWorkImage from "@/components/ProportionalWorkImage";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function TIcon({ active }: { active: boolean }) {
  return (
    <span className={`font-serif text-sm${!active ? " line-through" : ""}`}>
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
  const [col3Filter, setCol3Filter] = useState<CategoryFilter>("all");
  const [col1Sort, setCol1Sort] = useState<WorkSort>("year-latest");
  const [col2Sort, setCol2Sort] = useState<WorkSort>("title");
  const [col3Sort, setCol3Sort] = useState<WorkSort>("year-oldest");
  const [col1Min, setCol1Min] = useState(false);
  const [col2Min, setCol2Min] = useState(false);
  const [col3Min, setCol3Min] = useState(false);

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

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
  const col3Works = filterAndSort(col3Filter, col3Sort);

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
        <div className="relative h-[75vh] w-full overflow-hidden p-4">
          {/* <CornerFrame /> */}
          {work.image_url && (
            <div className="absolute inset-2 flex items-end">
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
        <div className="sticky top-0 z-50 bg-transparent px-4 py-3 flex items-stretch font-bookish text-sm w-full gap-x-2">
          <div className="flex items-center gap-x-2 w-1/2">
            <Select
              value={workSort}
              onValueChange={(v) => setWorkSort(v as WorkSort)}
            >
              <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm  focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
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
              <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
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
              size="sm"
              className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground"
              onClick={() => setShowInfo(!showInfo)}
              aria-label={showInfo ? "Hide text" : "Show text"}
            >
              <TIcon active={showInfo} />
            </Button>
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
        <div className="absolute right-2 top-2 flex items-center gap-x-2 z-50">
          {col1Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol1Min(false)}
              className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm"
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
              className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm"
            >
              +{" "}
              {col2Filter === "all"
                ? "All"
                : col2Filter.charAt(0).toUpperCase() + col2Filter.slice(1)}
            </Button>
          )}
          {col3Min && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCol3Min(false)}
              className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm"
            >
              +{" "}
              {col3Filter === "all"
                ? "All"
                : col3Filter.charAt(0).toUpperCase() + col3Filter.slice(1)}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProportionalImages(!proportionalImages)}
            className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm whitespace-nowrap"
          >
            {proportionalImages ? "Full width" : "Proportional"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAsList(!showAsList)}
            className="rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm"
          >
            {showAsList ? "Grid" : "List"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className={`rounded-full px-3 h-7 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-sm ${showInfo ? "line-through decoration-1" : ""}`}
            aria-label={showInfo ? "Hide text" : "Show text"}
          >
            T
          </Button>
        </div>

        {!col1Min && (
          <div
            ref={col1Ref}
            className="flex-1 overflow-y-auto h-full border-r border-border flex flex-col"
          >
            <div className="sticky top-0 z-10 flex items-center gap-x-2 px-4 pt-2 pb-2 bg-transparent font-bookish text-sm">
              <Select
                value={col1Filter}
                onValueChange={(v) => setCol1Filter(v as CategoryFilter)}
              >
                <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="drawing">Drawing</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={col1Sort}
                onValueChange={(v) => setCol1Sort(v as WorkSort)}
              >
                <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
                  <SelectItem value="year-latest">Year — latest</SelectItem>
                  <SelectItem value="year-oldest">Year — oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCol1Min(true)}
                className="shrink-0 rounded-full w-7 h-7 p-0 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-base leading-none"
              >
                −
              </Button>
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
            className="flex-1 overflow-y-auto h-full border-r border-border flex flex-col"
          >
            <div className="sticky top-0 z-10 flex items-center gap-x-2 px-4 pt-2 pb-2 bg-transparent font-bookish text-sm">
              <Select
                value={col2Filter}
                onValueChange={(v) => setCol2Filter(v as CategoryFilter)}
              >
                <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="drawing">Drawing</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={col2Sort}
                onValueChange={(v) => setCol2Sort(v as WorkSort)}
              >
                <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
                  <SelectItem value="year-latest">Year — latest</SelectItem>
                  <SelectItem value="year-oldest">Year — oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCol2Min(true)}
                className="shrink-0 rounded-full w-7 h-7 p-0 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-base leading-none"
              >
                −
              </Button>
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
        {!col3Min && (
          <div
            ref={col3Ref}
            className="flex-1 overflow-y-auto h-full flex flex-col"
          >
            <div className="sticky top-0 z-10 flex items-center gap-x-2 px-4 pt-2 pb-2 bg-transparent font-bookish text-sm">
              <Select
                value={col3Filter}
                onValueChange={(v) => setCol3Filter(v as CategoryFilter)}
              >
                <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="painting">Painting</SelectItem>
                  <SelectItem value="drawing">Drawing</SelectItem>
                  <SelectItem value="sculpture">Sculpture</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={col3Sort}
                onValueChange={(v) => setCol3Sort(v as WorkSort)}
              >
                <SelectTrigger className="border-none shadow-none px-4 h-auto font-bookish text-sm focus:ring-0 rounded-full gap-2 py-1.5 backdrop-blur-sm bg-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-md bg-background/80 text-foreground border-none font-bookish rounded-2xl shadow-lg text-sm">
                  <SelectItem value="year-latest">Year — latest</SelectItem>
                  <SelectItem value="year-oldest">Year — oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCol3Min(true)}
                className="shrink-0 rounded-full w-7 h-7 p-0 backdrop-blur-sm bg-foreground/10 hover:bg-foreground/20 font-bookish text-base leading-none"
              >
                −
              </Button>
            </div>
            {showAsList ? (
              <div className="p-0">
                {col3Works.map((work) => (
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
                transition={{ duration: 0.5, delay: 0.12 }}
                className="flex flex-col"
              >
                {col3Works.map((work) => (
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

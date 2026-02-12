"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import HDivider from "./HDivider";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import Image from "next/image";
import { sortAZ } from "@/lib/sort-az";

import Staggered from "./Staggered";
import { DarkModeToggle } from "./DarkModeToggle";
import WorksFilter from "./WorksFilter";
import StaggeredList from "./StaggeredList";
import ExFilter from "./ExFilter";
import NavSearch from "./NavSearch";
type WorkSort = "year-latest" | "year-oldest" | "year" | "title";

type CategoryFilter = "all" | "painting" | "drawing" | "sculpture" | "textile";
type ExhibitionItem = {
  id: number;
  title: { rendered: string };
  slug?: string;
  __type: "exhibition";
};

type ExhibitionListItem = {
  id: number;
  title: { rendered: string };
  __type: "list";
};

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const lastScroll = useRef(0);
  const [navOffset, setNavOffset] = useState(0);
  const navHeight = 145; // height of your nav in px

  const {
    allWorks,

    applyFilters: applyWorksFilters,
    clearFilters: clearWorksFilters,
    isApplyingFilters: isApplyingWorksFilters,

    setActiveWorkSlug,
    workLoading,
    openWork,
    uniqueYears,
  } = useWorks();

  const {
    exhibitions,

    setActiveExhibitionSlug,
    exLoading,
    openExhibition,

    filteredExhibitions,
  } = useExhibitions();

  const { infoLoading, exhibitionList } = useInfo();

  const {
    setShowWorksMenu,

    setShowExhibitionsMenu,

    setShowContact,

    setShowWorksFilter,

    setShowExhibitionsFilter,
    showInfo,
    setShowInfo,

    setShowSettings,
  } = useUI();

  const {
    handleOpenWorksMenu,

    handleOpenExhibitionsMenu,
  } = useUI();

  const router = useRouter();

  const allExhibitionsMap = new Map<
    string,
    ExhibitionItem | ExhibitionListItem
  >();

  exhibitions.forEach((ex) =>
    allExhibitionsMap.set(ex.title.rendered, { ...ex, __type: "exhibition" })
  );

  exhibitionList.forEach((ex) => {
    if (!allExhibitionsMap.has(ex.title.rendered)) {
      allExhibitionsMap.set(ex.title.rendered, { ...ex, __type: "list" });
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll.current;

      if (delta > 0 && currentScroll > 50) setScrollDir("down");
      else if (delta < 0) setScrollDir("up");

      // Gradual offset
      if (scrollDir === "down" && !openSearch) {
        setNavOffset((prev) => Math.min(prev + delta, navHeight));
      } else if (scrollDir === "up" || openSearch) {
        setNavOffset((prev) => Math.max(prev - Math.abs(delta), 0));
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDir, openSearch]);
  return (
    <>
      <div className="fixed top-0 left-0 w-full  z-40     lg:flex flex-col items-baseline justify-start   gap-x-4 no-hide-text     ">
        {/* LEFT MENU (MAIN) */}

        <h1 className="h1 flex items-baseline justify-start pt-2 lg:pt-4 bg-background w-full pb-2 z-50 no-hide-text">
          <Button
            asChild
            variant="link"
            size="sm"
            onClick={() => {
              setActiveWorkSlug(null);
              setActiveExhibitionSlug(null);
              setShowWorksFilter(false);
              setShowExhibitionsFilter(false);
              setShowContact(false);
              setShowExhibitionsMenu(false);
              setShowWorksMenu(false);
              setShowSettings(false);
            }}
            className="h-full no-hide-text whitespace-nowrap"
          >
            <Link href="/">Elinor Silow</Link>
          </Button>
        </h1>

        {/* Nav slides in/out */}

        <motion.nav
          style={{ y: -navOffset }}
          className={` hidden lg:grid
   
    grid-cols-6
    grid-rows-[1.5rem_minmax(0,1fr)]
    gap-x-4
    w-full pt-4 
    overflow-hidden  bg-background ${openSearch ? "pb-4" : "pb-4"}`}
        >
          <Button
            variant="link"
            size="sm"
            asChild
            onClick={() => {
              setActiveWorkSlug(null);
              setActiveExhibitionSlug(null);
              handleOpenWorksMenu();
              setShowWorksFilter(false);
              setShowExhibitionsFilter(false);
              setShowContact(false);
              setShowExhibitionsMenu(false);
            }}
            className=" row-start-1 col-start-1 col-span-1 justify-start gap-x-4 no-hide-text "
          >
            <Link href="/works">Verk </Link>
          </Button>
          <Button
            variant="link"
            size="sm"
            asChild
            onClick={() => {
              setActiveWorkSlug(null);
              setActiveExhibitionSlug(null);
              setShowWorksFilter(false);
              setShowExhibitionsFilter(false);
              setShowContact(false);
              setShowWorksMenu(false);
              handleOpenExhibitionsMenu();
            }}
            className="col-start-1 row-start-2 col-span-1 justify-start gap-x-4 no-hide-text"
          >
            <Link href="/exhibitions">Utställningar </Link>
          </Button>
          <Button
            variant="link"
            size="sm"
            asChild
            onClick={() => {
              setActiveWorkSlug(null);
              setActiveExhibitionSlug(null);
              setShowWorksFilter(false);
              setShowExhibitionsFilter(false);
              setShowContact(false);
              setShowExhibitionsMenu(false);
              setShowWorksMenu(false);
            }}
            className="col-start-1 row-start-3 col-span-1 justify-start no-hide-text"
          >
            <Link href="/info">Information</Link>
          </Button>

          <Button
            variant="link"
            size="sm"
            className="col-start-2 col-span-1 row-start-1 justify-start no-hide-text "
            asChild
          >
            <Link href="mailto:elinor.silow@gmail.com">Kontakt</Link>
          </Button>
          <Button
            variant="link"
            size="sm"
            className="col-start-2 col-span-1 row-start-2 justify-start no-hide-text"
            asChild
          >
            <Link href="instagram.com/elinor.silow">Instagram</Link>
          </Button>
          <div className="col-start-2 col-span-1 row-start-3 h-min no-hide-text">
            <DarkModeToggle />
          </div>
          <Button
            variant="link"
            size="sm"
            className="justify-start col-start-3 col-span-1 row-start-1 nav-toggle no-hide-text"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? "Göm text" : "Visa text"}
          </Button>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setActiveWorkSlug(null);
              setActiveExhibitionSlug(null);
              setOpenSearch((prev) => !prev);
            }}
            className="justify-start col-start-3 col-span-1 row-start-2 no-hide-text"
          >
            {openSearch ? "Stäng (x)" : "Sök"}
          </Button>
        </motion.nav>

        {/* Search nav with layout animation */}
        <AnimatePresence>
          {openSearch && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full  bg-background px-0 pt-4 z-50"
            >
              <NavSearch />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

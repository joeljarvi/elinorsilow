"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(true);

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
    showWorksMenu,
    setShowWorksMenu,
    showExhibitionsMenu,
    setShowExhibitionsMenu,
    showContact,
    setShowContact,
    showAllWorksList,
    showAllExhibitionsList,
    showWorksFilter,
    setShowWorksFilter,
    showExhibitionsFilter,
    setShowExhibitionsFilter,
    showInfo,
    setShowInfo,
    showSettings,
    setShowSettings,
    handleShowSettings,
  } = useUI();

  const {
    handleOpenWorksMenu,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenAllExhibitionsList,
    handleOpenExhibitionsMenu,
    handleOpenExhibitionsFilter,
    handleOpenContact,
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

  const exhibitionIndex: (ExhibitionItem | ExhibitionListItem)[] = sortAZ(
    Array.from(allExhibitionsMap.values())
  );

  const findExhibitionSlug = (title: string) => {
    const match = filteredExhibitions.find((ex) => ex.title.rendered === title);
    return match?.slug;
  };

  const openWorksOnly = () => {
    if (!showWorksMenu) handleOpenWorksMenu();
    if (showExhibitionsMenu) handleOpenExhibitionsMenu();
    if (showContact) handleOpenContact();
  };

  const openExhibitionsOnly = () => {
    if (!showExhibitionsMenu) handleOpenExhibitionsMenu();
    if (showWorksMenu) handleOpenWorksMenu();
    if (showContact) handleOpenContact();
  };

  const openContactOnly = () => {
    if (!showContact) handleOpenContact();
    if (showWorksMenu) handleOpenWorksMenu();
    if (showExhibitionsMenu) handleOpenExhibitionsMenu();
  };

  const openWorksIndex = () => {
    if (!showAllWorksList) handleOpenAllWorksList();
    if (showWorksFilter) handleOpenWorksFilter();
  };

  const openWorksFilters = () => {
    if (!showWorksFilter) handleOpenWorksFilter();
    if (showAllWorksList) handleOpenAllWorksList();
  };

  const openExIndex = () => {
    handleOpenAllExhibitionsList();
    if (showExhibitionsFilter) handleOpenExhibitionsFilter();
  };

  const openExFilters = () => {
    handleOpenExhibitionsFilter();
    if (showAllExhibitionsList) handleOpenAllExhibitionsList();
  };

  const handleOpenMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full  z-50     lg:flex flex-col items-baseline justify-start   gap-x-4  overflow-y-scroll   ">
        {/* LEFT MENU (MAIN) */}

        <h1 className="h1 flex items-baseline justify-start pt-2 lg:pt-0 ">
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
            className="h-full no-hide-text"
          >
            <Link href="/">Elinor Silow</Link>
          </Button>
        </h1>

        {/* NAV */}
        <nav
          className=" hidden lg:grid
   
    grid-cols-6
    grid-rows-[1.5rem_minmax(0,1fr)]
    gap-x-4
    w-full
    overflow-hidden
  mb-1 "
        >
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
            className="col-start-1 col-span-1 justify-start no-hide-text"
          >
            <Link href="/info">Info</Link>
          </Button>

          <Button
            variant="link"
            size="sm"
            onClick={() => {
              handleOpenContact();
              setShowExhibitionsFilter(false);
              setShowWorksFilter(false);
              setShowWorksMenu(false);
              setShowExhibitionsMenu(false);
            }}
            className="col-start-2 col-span-1 w-min justify-start gap-x-4 no-hide-text"
          >
            Kontakt{" "}
            <span
              className={`text-xs ${
                showContact ? "rotate-90 transition-all" : ""
              } `}
            >
              ▶
            </span>
          </Button>

          {showContact && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=" col-start-2 col-span-1 row-start-2 w-full flex flex-col items-start justify-start "
              >
                <Button
                  variant="link"
                  size="sm"
                  className="no-hide-text"
                  asChild
                >
                  <Link href="mailto:elinor.silow@gmail.com">Email</Link>
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  className="no-hide-text"
                  asChild
                >
                  <Link href="instagram.com/elinor.silow">Instagram</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          )}

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
            className=" col-start-3 col-span-1 justify-start gap-x-4 no-hide-text "
          >
            <Link href="/works">
              Verk{" "}
              <span
                className={`text-xs ${
                  showWorksMenu ? "rotate-90 transition-all" : ""
                } `}
              >
                ▶
              </span>
            </Link>
          </Button>

          {showWorksMenu && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="col-start-3 row-start-2 col-span-2 w-full flex flex-col items-start justify-start  "
              >
                <Button
                  variant="link"
                  size="sm"
                  className="no-hide-text"
                  onClick={handleOpenAllWorksList}
                >
                  Lista
                </Button>

                {showAllWorksList && (
                  <StaggeredList
                    items={allWorks}
                    loading={workLoading}
                    isDesktop={isDesktop}
                    setOpen={setOpen}
                    onSelect={(work) => openWork(work.slug)}
                    getKey={(w) => w.slug}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {showWorksFilter && <WorksFilter />}

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
            className="col-start-4 col-span-1 justify-start gap-x-4 no-hide-text"
          >
            <Link href="/exhibitions">
              Utställningar{" "}
              <span
                className={`text-xs ${
                  showExhibitionsMenu ? "rotate-90 transition-all" : ""
                } `}
              >
                ▶
              </span>
            </Link>
          </Button>
          {showExhibitionsMenu && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=" col-start-4 col-span-2 row-start-2 w-full flex flex-col items-start justify-start "
              >
                <Button
                  className="no-hide-text"
                  variant="link"
                  size="sm"
                  onClick={openExIndex}
                >
                  Lista
                </Button>

                {showAllExhibitionsList && (
                  <StaggeredList
                    items={exhibitionIndex}
                    isDesktop={isDesktop}
                    setOpen={setOpen}
                    getKey={(e) => e.id}
                    onSelect={(item) => {
                      if (item.__type === "exhibition") {
                        openExhibition(item.slug);
                      } else {
                        const slug = findExhibitionSlug(item.title.rendered);
                        if (slug) openExhibition(slug);
                      }
                    }}
                  />
                )}

                {/* Filter / Sort */}
              </motion.div>
            </AnimatePresence>
          )}
          {showExhibitionsFilter && <ExFilter />}

          <Button
            onClick={() => {
              handleShowSettings();
              setShowWorksMenu(false);
              setShowExhibitionsMenu(false);
              setShowContact(false);
              setShowWorksFilter(false);
              setShowExhibitionsFilter(false);
            }}
            className="col-start-5 col-span-1 justify-start w-min gap-x-4 no-hide-text"
            variant="link"
            size="sm"
          >
            Inställningar
            <span
              className={`text-xs ${
                showSettings ? "rotate-90 transition-all" : ""
              } `}
            >
              ▶
            </span>
          </Button>

          {showSettings && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=" col-start-5 col-span-2 row-start-2 w-full flex flex-col items-start justify-start "
              >
                <DarkModeToggle />

                <Button
                  variant="link"
                  size="sm"
                  className="nav-toggle no-hide-text"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  {showInfo ? "Göm text" : "Visa text"}
                </Button>
              </motion.div>
            </AnimatePresence>
          )}
        </nav>
        {/* <div className="px-6 lg:px-4 w-full ">
          <HDivider className="" />
        </div> */}
      </div>
    </>
  );
}

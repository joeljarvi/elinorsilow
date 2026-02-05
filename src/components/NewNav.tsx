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

export default function NewNav() {
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [open, setOpen] = useState(true);

  const {
    allWorks,

    stagedWorkSort,
    setStagedWorkSort,
    stagedSelectedYear,
    setStagedSelectedYear,
    stagedCategoryFilter,
    setStagedCategoryFilter,
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
  const { viewLoading, goToView, view } = useNav();
  const {
    showWorksMenu,
    showExhibitionsMenu,
    showContact,
    showAllWorksList,
    showAllExhibitionsList,
    showWorksFilter,
    showExhibitionsFilter,
    showInfo,
    setShowInfo,
    handleOpenWorksMenu,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenAllExhibitionsList,
    handleOpenExhibitionsMenu,
    handleOpenExhibitionsFilter,
    handleOpenContact,
  } = useUI();

  const router = useRouter();

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }

    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  const initialAppLoading = !initialLoaded;
  const showNavLoader = initialAppLoading || viewLoading;

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
      <div className="hidden lg:fixed top-0 left-0 w-full  z-10 pt-2 px-4 font-gintoRegular text-sm   items-start justify-start  lg:grid lg:grid-cols-2 gap-x-2 lg:gap-x-4 max-w-7xl overflow-y-scroll bg-gradient-to-b from-background to-transparent via-background ">
        {/* LEFT MENU (MAIN) */}
        <div className="flex flex-col items-start justify-start  w-full gap-x-8 ">
          <div className="flex justify-start items-center w-full gap-x-8 ">
            <h1 className="whitespace-nowrap nav-toggle">
              <Link href="/">Elinor Silow</Link>
            </h1>

            {/* NAV */}
            <span className="flex items-center justify-start gap-x-0 w-full">
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  router.push("/?view=works", { scroll: false });
                  goToView("works");
                  setActiveWorkSlug(null);
                  setActiveExhibitionSlug(null);
                  openWorksOnly();
                }}
                className={
                  view === "works"
                    ? "font-gintoRegularItalic"
                    : "font-gintoRegular"
                }
              >
                Works
              </Button>
              ,{" "}
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  router.push("/?view=exhibitions", { scroll: false });
                  goToView("exhibitions");
                  setActiveWorkSlug(null);
                  setActiveExhibitionSlug(null);
                  openExhibitionsOnly();
                }}
                className={`ml-1 ${
                  view === "exhibitions"
                    ? "font-gintoRegularItalic"
                    : "font-gintoRegular "
                }`}
              >
                Exhibitions
              </Button>
              ,
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  router.push("/?view=information", { scroll: false });
                  goToView("info");
                  setActiveWorkSlug(null);
                  setActiveExhibitionSlug(null);
                  if (!isDesktop) setOpen(false);
                }}
                className={`ml-1 ${
                  view === "info"
                    ? "font-gintoRegularItalic"
                    : "font-gintoRegular"
                }}`}
              >
                Information
              </Button>
              ,{" "}
              <Button
                variant="link"
                size="sm"
                onClick={handleOpenContact}
                className="font-gintoRegular ml-1"
              >
                Contact
              </Button>
            </span>
          </div>

          {/* SUB MENUS */}
          {showWorksMenu && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden lg:flex mb-2 w-full  flex-col items-start justify-start gap-x-8 "
              >
                <div className="flex justify-start items-center gap-x-8 w-full ">
                  <Button
                    size="sm"
                    variant="link"
                    onClick={openWorksIndex}
                    className={`text-sm ${
                      showAllWorksList
                        ? "font-gintoRegularItalic"
                        : "font-gintoRegular"
                    }`}
                  >
                    Index
                  </Button>

                  <Button
                    size="sm"
                    variant="link"
                    onClick={openWorksFilters}
                    className={`text-sm ${
                      showWorksFilter
                        ? "font-gintoRegularItalic"
                        : "font-gintoRegular"
                    }`}
                  >
                    Filters
                  </Button>
                </div>

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
                {showWorksFilter && <WorksFilter />}
              </motion.div>
            </AnimatePresence>
          )}
          {showExhibitionsMenu && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mb-2 w-full flex flex-col items-start justify-start gap-x-8"
              >
                <div className="flex justify-start items-center gap-x-8 w-full">
                  {/* Index button */}

                  <Button
                    size="sm"
                    variant="link"
                    onClick={openExIndex}
                    className={`text-sm ${
                      showAllExhibitionsList
                        ? "font-gintoRegularItalic"
                        : "font-gintoRegular"
                    }`}
                  >
                    Index
                  </Button>

                  <Button
                    size="sm"
                    variant="link"
                    onClick={openExFilters}
                    className={`text-sm ${
                      showExhibitionsFilter
                        ? "font-gintoRegularItalic"
                        : "font-gintoRegular"
                    }`}
                  >
                    Filters
                  </Button>
                </div>

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

                {showExhibitionsFilter && <ExFilter />}
              </motion.div>
            </AnimatePresence>
          )}
          {showContact && (
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mb-2 w-full flex flex-col items-start justify-start gap-x-8"
              >
                <div className="flex justify-start items-center gap-x-8 w-full">
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className={`text-sm 
             text-blue-600
              font-gintoRegular

           `}
                  >
                    <Link href="mailto:elinor.silow@gmail.com">Email</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className={`text-sm 
             
              font-gintoRegular text-blue-600

           `}
                  >
                    <Link href="https://www.instagram.com/elinorsilow/">
                      Instagram
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        {/* RIGHT MENU */}
        <div className="flex items-center justify-start w-full gap-x-8  ">
          <Button variant="link" size="sm" asChild>
            <Link href="instagram.com/elinorsilow">Instagram</Link>
          </Button>
          <Button
            variant="link"
            size="sm"
            className="nav-toggle"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? "Hide Text" : "Show Text"}
          </Button>

          <DarkModeToggle />
        </div>
      </div>
      {/* <button
        className="fixed lg:hidden bottom-8 right-8 top-auto z-50  flex items-center justify-center w-24 h-24 "
        onClick={handleOpenMenu}
      >
        {showNavLoader ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0.6, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              opacity: { duration: 0.4, ease: "easeOut" },
            }}
            className="relative w-24 h-24 mr-4"
          >
            <Image
              src="/ogubbe_frilagd_new.png"
              alt={"loading"}
              fill
              sizes="96px"
              className="h-full w-auto object-contain cursor-pointer dark:invert"
              priority
            />
          </motion.div>
        ) : (
          <motion.div
            key="static"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "linear",
            }}
            className="relative w-24 h-24 mr-2 "
          >
            <Image
              src="/elli_trumpetgubbe_new_frilagd.png"
              alt="Elinor Silow"
              fill
              sizes="96px"
              className="h-full w-auto object-contain cursor-pointer dark:invert"
              priority
            />
          </motion.div>
        )}
      </button> */}
    </>
  );
}

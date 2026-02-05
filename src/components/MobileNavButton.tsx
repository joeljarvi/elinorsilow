"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useUI } from "@/context/UIContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Staggered from "@/components/Staggered";
import HDivider from "@/components/HDivider";
import Link from "next/link";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { DarkModeToggle } from "./DarkModeToggle";
import Nav from "./Nav";
import WorksFilter from "./WorksFilter";
import StaggeredList from "./StaggeredList";
import ExFilter from "./ExFilter";
import { sortAZ } from "@/lib/sort-az";

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

const container: Variants = {
  hidden: {
    transition: { staggerChildren: 0.06, staggerDirection: -1 },
  },
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

function MobileNavOverlay() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  const { allWorks, workLoading, openWork, setActiveWorkSlug } = useWorks();
  const {
    setActiveExhibitionSlug,
    openExhibition,
    exhibitionList,
    filteredExhibitions,
  } = useExhibitions();
  const { viewLoading, goToView, view } = useNav();
  const {
    open,
    setOpen,
    handleOpen,
    showWorksMenu,
    showAllWorksList,
    showWorksFilter,
    handleOpenWorksMenu,
    handleOpenContact,
    handleOpenAllExhibitionsList,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenExhibitionsFilter,
    handleOpenExhibitionsMenu,
    showExhibitionsMenu,
    showContact,
    showAllExhibitionsList,
    showExhibitionsFilter,
  } = useUI();

  const allExhibitionsMap = new Map<
    string,
    ExhibitionItem | ExhibitionListItem
  >();

  const exhibitionIndex: (ExhibitionItem | ExhibitionListItem)[] = sortAZ(
    Array.from(allExhibitionsMap.values())
  );

  const findExhibitionSlug = (title: string) => {
    const match = filteredExhibitions.find((ex) => ex.title.rendered === title);
    return match?.slug;
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed lg:hidden inset-0 z-30 h-screen w-full bg-background flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* <Button
            className="  absolute top-4 left-1/2 -translate-x-1/2 z-40"
            size="sm"
            variant="link"
            onClick={handleOpen}
          >
            Back
          </Button> */}

          {/* TOP: MENU NAV */}
          <div className="flex flex-col items-center justify-center w-full h-[50vh] p-2">
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                router.push("/?view=works", { scroll: false });
                goToView("works");
                setActiveWorkSlug(null);
                setActiveExhibitionSlug(null);
                handleOpenWorksMenu();
              }}
            >
              Works
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                router.push("/?view=exhibitions", { scroll: false });
                goToView("exhibitions");
                setActiveWorkSlug(null);
                setActiveExhibitionSlug(null);
              }}
            >
              Exhibitions
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                router.push("/?view=information", { scroll: false });
                goToView("info");
                setActiveWorkSlug(null);
                setActiveExhibitionSlug(null);
              }}
            >
              Information
            </Button>
            <Button
              variant="link"
              size="sm"
              onClick={handleOpenContact}
              className="font-gintoRegular ml-1"
            >
              Contact
            </Button>
          </div>

          {/* BOTTOM DROPDOWN FILTERS */}
          <div className="flex flex-col items-center justify-start w-full h-[50vh] p-2">
            {showWorksMenu && (
              <AnimatePresence>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex mb-2 w-full  flex-col items-center justify-start gap-x-8 bg-green-700"
                >
                  <div className="flex justify-center items-center gap-x-8 w-full ">
                    <Button
                      size="sm"
                      variant="link"
                      onClick={handleOpenAllWorksList}
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
                  className="mb-2 w-full flex flex-col items-center justify-start gap-x-8"
                >
                  <div className="flex justify-center items-center gap-x-8 w-full">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NavButton() {
  const { infoLoading } = useInfo();
  const { viewLoading } = useNav();
  const { open, handleOpen } = useUI();

  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }

    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  const initialAppLoading = !initialLoaded;
  const showNavLoader = initialAppLoading || viewLoading;

  return (
    <>
      <button
        className="fixed lg:hidden bottom-8 left-1/2 -translate-x-1/2 top-auto z-50  flex items-center justify-center w-24 h-24 "
        onClick={handleOpen}
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
      </button>
      {open && <MobileNavOverlay />}
    </>
  );
}

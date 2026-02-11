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
import { PlusIcon, MinusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { DarkModeToggle } from "./DarkModeToggle";

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

  const {
    open,
    setOpen,
    handleOpen,
    showWorksMenu,
    setShowWorksMenu,
    showWorksFilter,
    setShowWorksFilter,
    showAllWorksList,

    handleOpenWorksMenu,
    handleOpenContact,
    handleOpenAllExhibitionsList,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenExhibitionsFilter,
    handleOpenExhibitionsMenu,
    showExhibitionsMenu,
    setShowExhibitionsMenu,
    showContact,
    setShowContact,
    showAllExhibitionsList,
    showExhibitionsFilter,
    setShowExhibitionsFilter,
    showInfo,
    setShowInfo,
    showSettings,
    setShowSettings,
    handleShowSettings,
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-nav"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed lg:hidden inset-0 h-auto z-30  w-full  flex flex-col items-center justify-center pointer-events-auto p-4 backdrop-blur-sm bg-background/80"
        >
          <div className="flex flex-col items-start justify-center w-full    pb-8 pt-4  bg-background ">
            <Button
              variant="link"
              asChild
              onClick={() => {
                setActiveWorkSlug(null);
                setActiveExhibitionSlug(null);
                setShowWorksFilter(false);
                setShowExhibitionsFilter(false);
                setShowContact(false);
                setShowExhibitionsMenu(false);
                setShowWorksMenu(false);
                setShowSettings(false);

                if (!isDesktop) setOpen(false);
              }}
              className="col-start-1 col-span-1 w-min"
            >
              <Link href="/information">Info / CV</Link>
            </Button>
            <Button
              variant="link"
              asChild
              onClick={() => {
                setActiveWorkSlug(null);
                setActiveExhibitionSlug(null);
                handleOpenWorksMenu();
                setShowWorksFilter(false);
                setShowExhibitionsFilter(false);
                setShowContact(false);
                setShowExhibitionsMenu(false);
                setShowSettings(false);
              }}
              className="justify-between w-full"
            >
              <Link href="/works">
                Verk{" "}
                <span
                  className={showWorksMenu ? "rotate-90 transition-all" : ""}
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
                  className="pl-4 w-full flex flex-col items-start justify-start pb-1  "
                >
                  <Button variant="link" onClick={handleOpenAllWorksList}>
                    Index
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
                  <Button
                    variant="link"
                    onClick={() => {
                      handleOpenWorksFilter();
                      setShowExhibitionsFilter(false);
                    }}
                  >
                    Filter
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}

            {showWorksFilter && <WorksFilter />}

            <Button
              variant="link"
              asChild
              onClick={() => {
                setActiveWorkSlug(null);
                setActiveExhibitionSlug(null);
                setShowWorksFilter(false);
                setShowExhibitionsFilter(false);
                setShowContact(false);
                setShowWorksMenu(false);
                handleOpenExhibitionsMenu();
                setShowSettings(false);
              }}
              className=" justify-between w-full"
            >
              <Link href="/exhibitions">
                Utställningar{" "}
                <span
                  className={
                    showExhibitionsMenu ? "rotate-90 transition-all" : ""
                  }
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
                  className="pl-4 w-full flex flex-col items-start justify-start pb-1 "
                >
                  <Button variant="link">Index</Button>

                  <Button
                    variant="link"
                    onClick={() => {
                      handleOpenExhibitionsFilter();
                      setShowWorksFilter(false);
                    }}
                  >
                    Filter
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
              variant="link"
              onClick={() => {
                handleOpenContact();
                setShowExhibitionsFilter(false);
                setShowWorksFilter(false);
                setShowWorksMenu(false);
                setShowExhibitionsMenu(false);
                setShowSettings(false);
              }}
              className="w-full justify-between"
            >
              Kontakt{" "}
              <span className={showContact ? "rotate-90 transition-all" : ""}>
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
                  className="pl-4 w-full flex flex-col items-start justify-start pb-1 "
                >
                  <Button variant="link" asChild>
                    <Link href="mailto:elinor.silow@gmail.com">Email</Link>
                  </Button>
                  <Button variant="link" asChild>
                    <Link href="instagram.com/elinor.silow">Instagram</Link>
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}

            <DarkModeToggle />

            <Button
              variant="link"
              className="nav-toggle no-hide-text"
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo ? "Göm text" : "Visa text"}
            </Button>
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
        className="fixed lg:hidden bottom-8 right-4 top-auto z-50  flex items-center justify-center w-24 h-24 no-hide-text "
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
            className="relative w-24 h-24 mr-4 no-hide-text"
          >
            <Image
              src="/ogubbe_frilagd_new.png"
              alt={"loading"}
              fill
              sizes="96px"
              className="h-full w-auto object-contain cursor-pointer dark:invert no-hide-text"
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
            className="relative w-24 h-24 mr-2 no-hide-text "
          >
            <Image
              src="/elli_trumpetgubbe_new_frilagd.png"
              alt="Elinor Silow"
              fill
              sizes="96px"
              className="h-full w-auto object-contain cursor-pointer dark:invert no-hide-text "
              priority
            />
          </motion.div>
        )}
      </button>
      {open && <MobileNavOverlay />}
    </>
  );
}

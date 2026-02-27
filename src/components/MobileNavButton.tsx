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
import {
  PlusIcon,
  MinusIcon,
  Cross1Icon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { DarkModeToggle } from "./DarkModeToggle";
import NavSearch from "./NavSearch";
import { usePathname } from "next/navigation";

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
    Array.from(allExhibitionsMap.values()),
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
          initial={{ y: "-100%", opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden  inset-0 z-40  w-full  flex flex-col items-center justify-start pointer-events-auto h-min        grid-cols-3 gap-x-0 bg-orange-500 lg:bg-transparent "
        >
          <div className="bg-orange-500 col-start-1 col-span-1 flex flex-col items-start justify-center w-full   p-8  ">
            <div className="flex flex-col items-start justify-start w-full p-4">
              <Link
                onClick={() => {}}
                className="items-baseline  no-hide-text h3 font-directorLight whitespace-normal
   px-0 py
"
                href="/"
              >
                <strong className="font-normal uppercase font-gintoBlack text-base h1 mr-2">
                  Elinor Silow
                </strong>
                (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                explores raw emotion through painting, sculpture and textile.
              </Link>

              <p className="p mt-4 font-directorLight">
                Please contact
                <Link
                  href="mailto:elinor.silow@gmail.com"
                  className="text-blue-700 mx-2 font-directorBold"
                >
                  hej@elinorsilow.com
                </Link>
                for collaborations and inquires.
              </p>
            </div>

            <NavSearch />

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
                handleOpen();
              }}
              className="mt-8 justify-between w-full "
            >
              <Link href="/works">
                Verk{" "}
                <span
                  className={showWorksMenu ? "rotate-90 transition-all" : ""}
                >
                  <ChevronRightIcon />
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
                handleOpen();
              }}
              className=" justify-between w-full mt-2"
            >
              <Link href="/exhibitions">
                Utställningar{" "}
                <span
                  className={
                    showExhibitionsMenu ? "rotate-90 transition-all" : ""
                  }
                >
                  <ChevronRightIcon />
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
                  <Button
                    onClick={() => handleOpenAllExhibitionsList()}
                    variant="link"
                  >
                    Index
                  </Button>

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
                <ChevronRightIcon />
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
                handleOpen();

                if (!isDesktop) setOpen(false);
              }}
              className="col-start-1 col-span-1 w-min "
            >
              <Link href="/info">Info / CV</Link>
            </Button>

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

function NavIcon({ state }: { state: "loading" | "idle" | "open" }) {
  const src =
    state === "loading"
      ? "/nav_loading.svg"
      : state === "open"
        ? "/trumpet_3_NAV.svg"
        : "/trumpet_1_NAV.svg";

  const isLoading = state === "loading";

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: isLoading ? 360 : 0,
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={
        isLoading
          ? {
              rotate: {
                repeat: Infinity,
                duration: 1.6,
                ease: "linear",
              },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }
          : { duration: 0.25, ease: "easeOut" }
      }
      className="relative w-24 h-24 no-hide-text"
    >
      <Image
        src={src}
        alt={state}
        fill
        sizes="96px"
        className="object-contain dark:invert no-hide-text"
        priority
      />
    </motion.div>
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

  type NavVisualState = "loading" | "idle" | "open";

  const navState: NavVisualState = showNavLoader
    ? "loading"
    : open
      ? "open"
      : "idle";

  return (
    <>
      <button
        className="fixed  bottom-8 right-8  left-auto  z-50 lg:z-50  top-auto lg:top-8 lg:left-8  flex items-center justify-center w-20 h-20 no-hide-text"
        onClick={handleOpen}
      >
        <AnimatePresence mode="wait">
          <NavIcon state={navState} />
        </AnimatePresence>
      </button>

      {open && <MobileNavOverlay />}
    </>
  );
}

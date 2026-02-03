"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "@/context/NavContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Staggered from "@/components/Staggered";
import { LenisRef, ReactLenis } from "lenis/react";

import { PlusIcon, MinusIcon, FilePlusIcon } from "@radix-ui/react-icons";
import {
  motion,
  AnimatePresence,
  Variants,
  cancelFrame,
  frame,
} from "framer-motion";
import Link from "next/link";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import HDivider from "@/components/HDivider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useInfo } from "@/context/InfoContext";

type WorkSort = "year-latest" | "year-oldest" | "year" | "title";
type ExhibitionSort = "year" | "title" | "type";
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

export default function Nav() {
  const lenisRef = useRef<LenisRef>(null);

  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
    showInfo,
    setShowInfo,
    workLoading,
    openWork,
    uniqueYears,
  } = useWorks();

  const {
    exhibitions,

    stagedExhibitionSort,
    setStagedExhibitionSort,
    stagedExSelectedYear,
    setStagedExSelectedYear,
    stagedSelectedType,
    setStagedSelectedType,
    applyFilters: applyExhibitionsFilters,
    clearFilters: clearExhibitionsFilters,
    isApplyingFilters: isApplyingExhibitionsFilters,

    setActiveExhibitionSlug,
    exLoading,
    openExhibition,
    uniqueExYears,
    filteredExhibitions,
  } = useExhibitions();

  const { infoLoading, exhibitionList } = useInfo();
  const {
    viewLoading,
    goToView,
    view,
    showWorksMenu,
    open,
    setOpen,
    handleOpen,
    showExhibitionsMenu,

    showContact,
    showAllWorksList,

    showAllExhibitionsList,

    showWorksFilter,

    showExhibitionsFilter,

    handleOpenWorksMenu,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenAllExhibitionsList,
    handleOpenExhibitionsMenu,
    handleOpenExhibitionsFilter,
    handleOpenContact,
  } = useNav();

  const router = useRouter();
  const sortAZ = <T extends { title: { rendered: string } }>(items: T[]) =>
    [...items].sort((a, b) =>
      a.title.rendered.localeCompare(b.title.rendered, "sv", {
        sensitivity: "base",
      })
    );

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }

    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed w-full lg:w-[calc(25%+0.05rem)] z-40 lg:z-30  lg:flex   flex-row   h-screen  bg-transparent pointer-events-none     "
    >
      <button className="hidden lg:absolute z-40 top-0 left-0 lg:flex  items-center justify-center w-24 h-24 mt-4 pointer-events-auto ">
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
            className="relative ml-4 w-18 h-18"
          >
            <Image
              src="/ogubbe_frilagd_new.png"
              alt={"loading"}
              fill
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
            onClick={handleOpen}
            className="relative w-18 h-18"
          >
            <Image
              src="/elli_trumpetgubbe_new_frilagd.png"
              alt="Elinor Silow"
              fill
              className="h-full w-auto object-contain cursor-pointer dark:invert"
              priority
            />
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <ReactLenis
            ref={lenisRef}
            root={false}
            options={{
              smoothWheel: true,
              duration: 1.2,
              wheelMultiplier: 0.9,
              easing: (t) => 1 - Math.pow(1 - t, 4),
            }}
            className={`
           h-full overflow-y-scroll scrollbar-hide flex flex-col w-full pt-24 lg:pt-32 
           scroll-pt-24 lg:scroll-pt-32 bg-background shadow pb-48 pointer-events-auto
         `}
          >
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -500 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                key="bio"
                variants={container}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="max-w-xs mx-auto  lg:mx-0 w-full  snap-start snap-stop-always  "
              >
                <motion.div variants={item} className=" ">
                  <Button
                    asChild
                    variant="default"
                    className="text-xl  text-center justify-center lg:justify-start  lg:text-left  px-4  font-gintoBlack  w-full  "
                    onClick={() => {
                      if (!isDesktop) setOpen(false);
                    }}
                  >
                    <Link href="/">Elinor Silow</Link>
                  </Button>
                </motion.div>
                <motion.div variants={item} className="px-4  ">
                  <p className="p mt-3 mb-4 justify-center  lg:justify-start text-center lg:text-left    ">
                    (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                    explores raw emotion through painting, sculpture and
                    textile.
                  </p>
                </motion.div>
                <motion.div variants={item} className="px-4 ">
                  <p className="p text-center lg:text-left ">
                    Please contact
                    <Button
                      asChild
                      variant="link"
                      size="linkSize"
                      className="text-blue-600 
                       px-1 p text-base"
                    >
                      <Link
                        href="mailto:elinor.silow@gmail.com"
                        className=" p "
                      >
                        elinor.silow@gmail.com
                      </Link>
                    </Button>
                    for collaborations and inquires.
                  </p>
                </motion.div>
              </motion.div>

              {/* MENU */}

              {/* WORKS */}
              <div className=" flex flex-col mt-12 lg:mt-8 snap-start snap-stop-always w-full   ">
                <span className="flex items-center w-full relative">
                  <Button
                    variant="default"
                    onClick={() => {
                      router.push("/?view=works", { scroll: false });
                      goToView("works");
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);

                      handleOpenWorksMenu();
                      if (!isDesktop) setOpen(false);
                    }}
                    className={`${
                      view === "works"
                        ? "opacity-30 font-gintoBlackItalic hover:font-gintoBlack"
                        : "font-gintoBlack hover:font-gintoBlackItalic"
                    } text-xl lg:text-lg justify-center lg:justify-start items-center w-full  `}
                  >
                    Works{" "}
                  </Button>
                  <Button
                    onClick={handleOpenWorksMenu}
                    className=" w-min absolute top-0 right-0 font-EBGaramond   text-sm justify-center lg:justify-start items-center   "
                  >
                    {showWorksMenu ? "[close]" : "[+]"}
                  </Button>
                </span>

                {/* WORKS MENU DROPDOWN */}
                <AnimatePresence>
                  {showWorksMenu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden px-4 mb-2 "
                    >
                      <HDivider />
                      <div className=" pt-2  flex flex-col  gap-0 border-x-foreground border-x  ">
                        <span className="flex justify-between items-center w-full relative ">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              handleOpenAllWorksList();
                            }}
                            className={` text-base justify-start items-center w-full pl-4   ${
                              showAllWorksList
                                ? "font-EBGaramondItalic"
                                : "font-EBGaramond"
                            }`}
                          >
                            Index
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleOpenAllWorksList}
                            className={`w-min absolute top-0 right-0 font-EBGaramond  text-sm justify-center lg:justify-start items-center pr-4  `}
                          >
                            {showAllWorksList ? "[close]" : "[+]"}
                          </Button>
                        </span>
                        {/* <HDivider /> */}
                        {showAllWorksList && (
                          <div
                            className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out     ${
                              showAllWorksList ? "max-h-[200vh]" : "hidden"
                            }`}
                          >
                            <HDivider color="border-blue-600" />
                            <Staggered
                              items={sortAZ(allWorks)}
                              loading={workLoading}
                              className="flex flex-col items-stretch justify-center lg:justify-start   space-y-0 mb-1  "
                              renderItem={(work) => (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    key={work.slug}
                                    onClick={() => {
                                      openWork(work.slug);
                                      if (!isDesktop) setOpen(false);
                                    }}
                                    className="transition-all   font-EBGaramondItalic hover:font-EBGaramond w-full justify-center lg:justify-start text-center  px-8  text-base text-blue-600 hover:text-blue-600 border-b border-b-blue-600"
                                  >
                                    {work.title.rendered}
                                  </Button>
                                </>
                              )}
                            />
                          </div>
                        )}
                        <span className="flex justify-between items-center w-full relative ">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={handleOpenWorksFilter}
                            className={` text-base  w-full justify-start  items-center  pl-4 ${
                              showWorksFilter
                                ? "font-EBGaramondItalic"
                                : "font-EBGaramond"
                            }`}
                          >
                            Filters
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleOpenWorksFilter}
                            className={`w-min font-EBGaramond  text-sm justify-center lg:justify-start items-center  pr-4 `}
                          >
                            {showWorksFilter ? "[close]" : "[+]"}
                          </Button>
                        </span>
                        {showWorksFilter && (
                          <div className=" pt-2 mb-2 ">
                            <HDivider />
                            <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start ">
                              {isApplyingWorksFilters ? (
                                <div className=" pl-0 lg:pl-6 my-2  font-EBGaramondItalic text-base animate-pulse flex items-center">
                                  Applying filters…
                                </div>
                              ) : (
                                <div className=" w-full flex flex-col items-center justify-center lg:items-start lg:justify-start pt-2">
                                  <Select
                                    value={stagedWorkSort}
                                    onValueChange={(v) => {
                                      setStagedWorkSort(v as WorkSort);
                                      if (v !== "year")
                                        setStagedSelectedYear(null);
                                    }}
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className=" w-full pl-4 "
                                    >
                                      <SelectValue placeholder="Sort works" />
                                    </SelectTrigger>

                                    <SelectContent className="w-full">
                                      <SelectItem value="year-latest">
                                        Sort by year (latest)
                                      </SelectItem>
                                      <SelectItem value="year-oldest">
                                        Sort by year (oldest)
                                      </SelectItem>
                                      <SelectItem value="year">
                                        Sort by year (specific)
                                      </SelectItem>
                                      <SelectItem value="title">
                                        Sort by title (a–ö)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {stagedWorkSort === "year" && (
                                    <>
                                      <Select
                                        value={stagedSelectedYear?.toString()}
                                        onValueChange={(v) =>
                                          setStagedSelectedYear(Number(v))
                                        }
                                      >
                                        <SelectTrigger
                                          size="default"
                                          className="font-EBGaramond    w-full pl-4  "
                                        >
                                          <SelectValue placeholder="2024" />
                                        </SelectTrigger>

                                        <SelectContent position="popper">
                                          {uniqueYears.map((year) => (
                                            <SelectItem
                                              key={`work-year-${year}`}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </>
                                  )}

                                  <Select
                                    value={stagedCategoryFilter}
                                    onValueChange={(v) =>
                                      setStagedCategoryFilter(
                                        v as CategoryFilter
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className=" font-EBGaramond    pl-4 w-full  "
                                    >
                                      <SelectValue placeholder="All works" />
                                    </SelectTrigger>

                                    <SelectContent position="popper">
                                      <SelectItem value="all">
                                        All works
                                      </SelectItem>
                                      <SelectItem value="painting">
                                        Paintings
                                      </SelectItem>
                                      <SelectItem value="drawing">
                                        Drawings (Coming soon)
                                      </SelectItem>
                                      <SelectItem value="sculpture">
                                        Sculpture
                                      </SelectItem>
                                      <SelectItem value="textile">
                                        Textile
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <HDivider className="mt-2" />
                                  <div className="flex justify-between  px-4 items-center   w-full py-2  ">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="font-EBGaramond hover:font-EBGaramondItalic text-sm justify-start text-center lg:text-left w-full  "
                                      onClick={async () => {
                                        await applyWorksFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      [apply filters]
                                    </Button>

                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="font-EBGaramond hover:font-EBGaramondItalic text-sm justify-end text-center lg:text-left w-full lg:w-min  "
                                      onClick={async () => {
                                        await clearWorksFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      [clear filters]
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <HDivider />
                          </div>
                        )}
                        <span className="flex items-baseline justify-center lg:justify-start w-full pb-2  ">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setShowInfo(!showInfo);
                            }}
                            className={` text-sm justify-center lg:justify-end font-EBGaramond hover:font-EBGaramondItalic w-full pl-4 pr-4`}
                          >
                            [
                            {showInfo ? "hide description" : "show description"}
                            ]
                          </Button>
                        </span>
                      </div>
                      <HDivider />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EXHIBITIONS */}
              <div className="flex flex-col items-center justify-center lg:justify-start snap-start snap-stop-always w-full px-0   ">
                <span className=" flex items-center w-full relative ">
                  <Button
                    onClick={() => {
                      router.push("/?view=exhibitions", {
                        scroll: false,
                      });
                      goToView("exhibitions");
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);
                      handleOpenExhibitionsMenu();
                      if (!isDesktop) setOpen(false);
                    }}
                    className={`${
                      view === "exhibitions"
                        ? "opacity-30 font-gintoBlackItalic hover:font-gintoBlack"
                        : "font-gintoBlack hover:font-gintoBlackItalic"
                    } text-xl lg:text-lg justify-center lg:justify-start items-center w-full  `}
                  >
                    Exhibitions
                  </Button>
                  <Button
                    onClick={handleOpenExhibitionsMenu}
                    className=" w-min absolute top-0 right-0 font-EBGaramond  text-sm justify-center lg:justify-start items-center "
                  >
                    {showExhibitionsMenu ? "[close]" : "[+]"}
                  </Button>
                </span>

                <AnimatePresence>
                  {showExhibitionsMenu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden w-full px-4 mb-2"
                    >
                      {" "}
                      <HDivider />
                      <div className="pt-2  pb-2 flex flex-col  gap-0 overflow-y-scroll border-x border-x-foreground   ">
                        {/* Index button */}
                        <span className="flex justify-between items-center w-full relative">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleOpenAllExhibitionsList}
                            className={`${
                              showAllExhibitionsList
                                ? "font-EBGaramondItalic hover:font-EBGaramond"
                                : "font-EBGaramond hover:font-EBGaramondItalic"
                            } text-base  pl-4 justify-start hover:font-EBGaramondItalic w-full   }`}
                          >
                            Index
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleOpenAllExhibitionsList}
                            className={`w-min absolute top-0 right-0 px-4 font-EBGaramond `}
                          >
                            {showAllExhibitionsList ? "[close]" : "[+]"}
                          </Button>
                        </span>

                        {showAllExhibitionsList && (
                          <div
                            className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out w-full  ${
                              showAllExhibitionsList
                                ? "max-h-[200vh]"
                                : "hidden"
                            }`}
                          >
                            <HDivider color="border-blue-600" />
                            <Staggered
                              items={exhibitionIndex}
                              className="flex flex-col items-stretch justify-center lg:justify-start space-y-0 pt-1 mb-1 w-full"
                              renderItem={(ex) => {
                                const slug = findExhibitionSlug(
                                  ex.title.rendered
                                );
                                return (
                                  <>
                                    {slug ? (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        key={`ex-${ex.id}`}
                                        onClick={() => {
                                          openExhibition(slug);
                                          if (!isDesktop) setOpen(false);
                                        }}
                                        className="text-base break-inside-avoid font-EBGaramondItalic text-blue-600 hover:font-EBGaramond transition-all cursor-pointer hover:text-blue-600 pl-0  lg:pl-8 lg:hover:pl-10 justify-center lg:justify-start text-center lg:text-left w-full"
                                      >
                                        {ex.title.rendered}
                                      </Button>
                                    ) : (
                                      <span
                                        key={`list-${ex.id}`}
                                        className="block pl-0  lg:pl-8 py-1 font-EBGaramondItalic text-blue-600/30 text-center lg:text-left w-full "
                                      >
                                        {ex.title.rendered}
                                      </span>
                                    )}

                                    <HDivider color="border-blue-600 w-full" />
                                  </>
                                );
                              }}
                            />
                          </div>
                        )}

                        {/* Filter / Sort */}
                        <span className="flex justify-between items-center w-full relative">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleOpenExhibitionsFilter}
                            className={`font-EBGaramond text-base  pl-4   justify-start w-full ${
                              showExhibitionsFilter
                                ? "font-EBGaramondItalic hover:font-EBGaramond"
                                : "font-EBGaramond hover:font-EBGaramondItalic"
                            }   `}
                          >
                            Filters
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleOpenExhibitionsFilter}
                            className={`w-min  px-4 font-EBGaramond `}
                          >
                            {showExhibitionsFilter ? "[close]" : "[+]"}
                          </Button>
                        </span>
                        {showExhibitionsFilter && (
                          <div className="">
                            <HDivider className="mt-1 mb-1" />
                            <div className="pt-2 flex flex-col  justify-center items-center lg:items-start lg:justify-start">
                              {isApplyingExhibitionsFilters ? (
                                <div className="pl-0 lg:pl-8 py-4 font-EBGaramondItalic text-sm animate-pulse text-center lg:text-left">
                                  Applying filters…
                                </div>
                              ) : (
                                <>
                                  {/* Sort by */}

                                  <Select
                                    value={stagedExhibitionSort}
                                    onValueChange={(v) =>
                                      setStagedExhibitionSort(
                                        v as ExhibitionSort
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className="font-EBGaramond w-full text-base px-4 "
                                    >
                                      <SelectValue placeholder="Sort exhibitions" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                      <SelectItem value="year">
                                        Sort by year
                                      </SelectItem>
                                      <SelectItem value="title">
                                        Sort by title (a-ö)
                                      </SelectItem>
                                      <SelectItem value="type">
                                        Sort by solo/group
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  {stagedExhibitionSort === "year" && (
                                    <>
                                      <Select
                                        value={stagedExSelectedYear}
                                        onValueChange={setStagedExSelectedYear}
                                      >
                                        <SelectTrigger
                                          size="default"
                                          className="font-EBGaramond w-full text-base px-4 "
                                        >
                                          <SelectValue placeholder="Filter by year" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                          <SelectItem value="all">
                                            All
                                          </SelectItem>
                                          {uniqueExYears.map((year) => (
                                            <SelectItem
                                              key={`ex-year-${year}`}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </>
                                  )}

                                  {/* Filter by Type */}

                                  <Select
                                    value={stagedSelectedType}
                                    onValueChange={setStagedSelectedType}
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className="font-EBGaramond w-full text-base px-4"
                                    >
                                      <SelectValue placeholder="all exhibitions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">
                                        All exhibitions
                                      </SelectItem>
                                      <SelectItem value="Solo">
                                        solo exhibitions
                                      </SelectItem>
                                      <SelectItem value="Group">
                                        group exhibitions
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>

                                  <HDivider className="mt-2  " />
                                  <div className="flex  px-4 items-center justify-between   w-full pt-2   ">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="w-full font-EBGaramond text-sm  justify-start"
                                      onClick={async () => {
                                        await applyExhibitionsFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      [apply filters]
                                    </Button>
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="w-full font-EBGaramond text-sm  justify-end"
                                      onClick={async () => {
                                        await clearExhibitionsFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      [clear filters]
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <HDivider />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col  snap-start snap-stop-always w-full  ">
                {/* CONTACT */}
                <span className="flex items-center w-full relative">
                  <Button
                    variant="default"
                    className=" text-xl lg:text-lg justify-center lg:justify-start items-center w-full font-gintoBlack hover:font-gintoBlackItalic "
                    onClick={() => {
                      handleOpenContact();
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);
                    }}
                  >
                    Contact
                  </Button>
                  <Button
                    onClick={handleOpenContact}
                    className=" w-min absolute top-0 right-0 font-EBGaramond  text-sm justify-center lg:justify-start items-center "
                  >
                    {showContact ? "[close]" : "[+]"}
                  </Button>
                </span>

                {showContact && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden w-full px-4 mb-2"
                  >
                    <HDivider />
                    <div className="flex flex-col    pt-2  pb-2  border-x border-foreground  ">
                      <Button
                        variant="default"
                        size="sm"
                        className="text-base px-4  justify-center lg:justify-start font-EBGaramond hover:font-EBGaramondItalic w-full text-blue-600   "
                        asChild
                        onClick={() => {
                          if (!isDesktop) setOpen(false);
                        }}
                      >
                        <Link href="mailto:elinor.silow@gmail.com">E-mail</Link>
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        className="text-base px-4  justify-center lg:justify-start font-EBGaramond hover:font-EBGaramondItalic w-full text-blue-600"
                        asChild
                        onClick={() => {
                          if (!isDesktop) setOpen(false);
                        }}
                      >
                        <Link href="https://www.instagram.com/elinorsilow/">
                          Instagram
                        </Link>
                      </Button>
                    </div>
                    <HDivider />
                  </motion.div>
                )}
              </div>
              {/* INFO */}
              <div className=" flex flex-col gap-y-0 snap-start snap-stop-always w-full ">
                <Button
                  variant="default"
                  onClick={() => {
                    router.push("/?view=information", { scroll: false });
                    goToView("info");
                    setActiveWorkSlug(null);
                    setActiveExhibitionSlug(null);
                    if (!isDesktop) setOpen(false);
                  }}
                  className={`${
                    view === "info"
                      ? "opacity-30 font-gintoBlackItalic hover:font-gintoBlack"
                      : "font-gintoBlack hover:font-gintoBlackItalic"
                  } text-xl lg:text-lg justify-center lg:justify-start items-center w-full   `}
                >
                  Information
                </Button>

                <div className="  pb-2">
                  <DarkModeToggle />
                </div>
              </div>
            </motion.div>
          </ReactLenis>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

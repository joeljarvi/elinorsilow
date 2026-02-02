"use client";

import { useState, useEffect, useRef } from "react";
import { useNav } from "@/context/NavContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Staggered from "@/components/Staggered";
import { LenisRef, ReactLenis } from "lenis/react";

import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
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
    workSort,
    setWorkSort,
    categoryFilter,
    setCategoryFilter,
    selectedYear,
    setSelectedYear,

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
    exhibitionSort,
    setExhibitionSort,
    exSelectedYear,
    exSetSelectedYear,
    selectedType,
    setSelectedType,

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
           scroll-pt-24 lg:scroll-pt-32 bg-background shadow pb-24 pointer-events-auto
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
                className="max-w-xs mx-auto  lg:mx-0 w-full  snap-start snap-stop-always "
              >
                <motion.div variants={item} className=" ">
                  <Button
                    asChild
                    variant="nav"
                    size="linkSizeMd"
                    className="h2 text-center justify-center lg:justify-start lg:text-left text-base px-4      "
                    onClick={() => {
                      if (!isDesktop) setOpen(false);
                    }}
                  >
                    <Link href="/">Elinor Silow</Link>
                  </Button>
                </motion.div>
                <motion.div variants={item} className="px-4  ">
                  <p className="p mt-3 mb-4 justify-center  lg:justify-start text-center lg:text-left text-sm   ">
                    (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                    explores raw emotion through painting, sculpture and
                    textile.
                  </p>
                </motion.div>
                <motion.div variants={item} className="px-4 ">
                  <p className="small text-center lg:text-left ">
                    Please contact
                    <Button
                      asChild
                      variant="link"
                      size="linkSize"
                      className="text-blue-600 text-sm px-1"
                    >
                      <Link href="mailto:elinor.silow@gmail.com" className="  ">
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
                <span className="flex items-center justify-between w-full px-4  ">
                  <Button
                    variant="nav"
                    size="linkSize"
                    onClick={() => {
                      router.push("/?view=works", { scroll: false });
                      goToView("works");
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);

                      handleOpenWorksMenu();
                      if (!isDesktop) setOpen(false);
                    }}
                    className="h2 text-base "
                  >
                    Works{" "}
                  </Button>
                  <Button
                    variant="link"
                    size="linkIcon"
                    onClick={() => {
                      handleOpenWorksMenu();
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);
                    }}
                    className=""
                  >
                    {showWorksMenu ? (
                      <MinusIcon className="w-3 h-3" />
                    ) : (
                      <PlusIcon className="w-3 h-3" />
                    )}
                  </Button>
                </span>

                {/* <HDivider /> */}
                {/* WORKS MENU DROPDOWN */}
                <AnimatePresence>
                  {showWorksMenu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1 pb-1 mb-2 flex flex-col  gap-0 ">
                        <Button
                          variant="nav"
                          size="linkSize"
                          onClick={() => {
                            handleOpenAllWorksList();
                          }}
                          className={`p pl-6 pr-5 text-base 
`}
                        >
                          Index
                          <span>
                            {" "}
                            {showAllWorksList ? (
                              <MinusIcon className="w-3 h-3" />
                            ) : (
                              <PlusIcon className="w-3 h-3" />
                            )}
                          </span>
                        </Button>{" "}
                        {/* <HDivider /> */}
                        {showAllWorksList && (
                          <div
                            className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out     ${
                              showAllWorksList ? "max-h-[200vh]" : "hidden"
                            }`}
                          >
                            <Staggered
                              items={sortAZ(allWorks)}
                              loading={workLoading}
                              className="columns-1   space-y-0    "
                              renderItem={(work) => (
                                <>
                                  <Button
                                    variant="nav"
                                    size="linkSize"
                                    key={work.slug}
                                    onClick={() => {
                                      openWork(work.slug);
                                      if (!isDesktop) setOpen(false);
                                    }}
                                    className="break-inside-avoid transition-all pl-8 p font-EBGaramondItalic   hover:pl-10 text-base text-blue-600 hover:text-blue-600"
                                  >
                                    {work.title.rendered}
                                  </Button>
                                  <HDivider color="border-blue-600" />
                                </>
                              )}
                            />
                          </div>
                        )}
                        <Button
                          variant="nav"
                          size="linkSize"
                          onClick={handleOpenWorksFilter}
                          className={`font-EBGaramond text-base pt-0.5 pl-6 pr-5     
`}
                        >
                          Filters
                          <span>
                            {" "}
                            {showWorksFilter ? (
                              <MinusIcon className="w-3 h-3" />
                            ) : (
                              <PlusIcon className="w-3 h-3" />
                            )}
                          </span>
                        </Button>
                        {showWorksFilter && (
                          <div className=" pt-1  ">
                            <div className="flex flex-col gap-y-1 items-start justify-start">
                              <HDivider />
                              {isApplyingWorksFilters ? (
                                <div className="pl-6 py-4 font-EBGaramondItalic text-sm animate-pulse">
                                  Applying filters…
                                </div>
                              ) : (
                                <>
                                  <span className="flex items-baseline justify-start w-full pl-6 ">
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className=" font-gintoRegular text-xs uppercase tracking-wider "
                                      onClick={() =>
                                        setShowInfo((prev) => !prev)
                                      }
                                    >
                                      {showInfo
                                        ? "Hide description"
                                        : "Show description"}
                                    </Button>
                                  </span>
                                  <HDivider />
                                  <span className="flex items-baseline justify-start w-full pl-8 ">
                                    <h3 className="p text-base whitespace-nowrap">
                                      Sort by
                                    </h3>

                                    <Select
                                      value={stagedWorkSort}
                                      onValueChange={(v) => {
                                        setStagedWorkSort(v as WorkSort);
                                        if (v !== "year")
                                          setStagedSelectedYear(null);
                                      }}
                                    >
                                      <SelectTrigger
                                        size="sm"
                                        className="p w-full text-base pt-0.5 pr-5"
                                      >
                                        <SelectValue placeholder="Sort works" />
                                      </SelectTrigger>

                                      <SelectContent
                                        className=""
                                        position="popper"
                                      >
                                        <SelectItem value="year-latest">
                                          year (latest)
                                        </SelectItem>
                                        <SelectItem value="year-oldest">
                                          year (oldest)
                                        </SelectItem>
                                        <SelectItem value="year">
                                          year (specific)
                                        </SelectItem>
                                        <SelectItem value="title">
                                          title (a–ö)
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </span>
                                  {stagedWorkSort === "year" && (
                                    <>
                                      <span className="pl-8 flex items-baseline justify-start w-full">
                                        <h3 className="font-EBGaramond text-base whitespace-nowrap">
                                          Year
                                        </h3>

                                        <Select
                                          value={stagedSelectedYear?.toString()}
                                          onValueChange={(v) =>
                                            setStagedSelectedYear(Number(v))
                                          }
                                        >
                                          <SelectTrigger
                                            size="sm"
                                            className="font-EBGaramond w-full text-base pt-0.5 pr-5"
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
                                      </span>
                                    </>
                                  )}

                                  <span className="pl-8 flex items-baseline justify-start w-full">
                                    <h3 className="font-EBGaramond text-base whitespace-nowrap">
                                      Show
                                    </h3>

                                    <Select
                                      value={stagedCategoryFilter}
                                      onValueChange={(v) =>
                                        setStagedCategoryFilter(
                                          v as CategoryFilter
                                        )
                                      }
                                    >
                                      <SelectTrigger
                                        size="sm"
                                        className="font-EBGaramond w-full text-base pt-0.5 pr-5"
                                      >
                                        <SelectValue placeholder="All works" />
                                      </SelectTrigger>

                                      <SelectContent position="popper">
                                        <SelectItem value="all">
                                          all works
                                        </SelectItem>
                                        <SelectItem value="painting">
                                          paintings
                                        </SelectItem>
                                        <SelectItem value="drawing">
                                          drawings
                                        </SelectItem>
                                        <SelectItem value="sculpture">
                                          sculpture
                                        </SelectItem>
                                        <SelectItem value="textile">
                                          textiles
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </span>
                                  <HDivider />
                                  <div className="flex gap-2 pl-8 items-center justify-start  w-full pr-4">
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="w-full font-gintoRegular text-xs uppercase tracking-wider underline underline-offset-4 justify-start"
                                      onClick={async () => {
                                        await applyWorksFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      Apply Filters
                                    </Button>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="w-full font-gintoRegular text-xs uppercase tracking-wider justify-start"
                                      onClick={async () => {
                                        await clearWorksFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      Clear (X)
                                    </Button>
                                  </div>
                                  <HDivider />
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EXHIBITIONS */}
              <div className="flex flex-col snap-start snap-stop-always w-full  ">
                <span className="flex items-center justify-between w-full  px-4 ">
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
                    className="h2 text-base"
                    variant="nav"
                    size="linkSize"
                  >
                    Exhibitions
                  </Button>
                  <Button
                    variant="link"
                    size="linkIcon"
                    onClick={() => {
                      handleOpenExhibitionsMenu();
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);
                    }}
                    className={``}
                  >
                    {showExhibitionsMenu ? (
                      <MinusIcon className="w-3 h-3" />
                    ) : (
                      <PlusIcon className="w-3 h-3" />
                    )}
                  </Button>
                </span>

                <AnimatePresence>
                  {showExhibitionsMenu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col overflow-y-scroll pt-1 pb-1 mb-2     ">
                        {/* Index button */}
                        <Button
                          variant="nav"
                          size="linkSize"
                          onClick={handleOpenAllExhibitionsList}
                          className={`font-EBGaramond text-base pl-6 pr-5  }`}
                        >
                          Index
                          <span>
                            {" "}
                            {showAllExhibitionsList ? (
                              <MinusIcon className="w-3 h-3" />
                            ) : (
                              <PlusIcon className="w-3 h-3" />
                            )}
                          </span>
                        </Button>

                        {showAllExhibitionsList && (
                          <div
                            className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out  ${
                              showAllExhibitionsList
                                ? "max-h-[200vh]"
                                : "hidden"
                            }`}
                          >
                            <Staggered
                              items={exhibitionIndex}
                              className="columns-1 space-y-0 pt-0 mb-1"
                              renderItem={(ex) => {
                                const slug = findExhibitionSlug(
                                  ex.title.rendered
                                );
                                return (
                                  <>
                                    {slug ? (
                                      <Button
                                        variant="nav"
                                        size="linkSize"
                                        key={`ex-${ex.id}`}
                                        onClick={() => {
                                          openExhibition(slug);
                                          if (!isDesktop) setOpen(false);
                                        }}
                                        className="text-base break-inside-avoid font-EBGaramondItalic text-blue-600 hover:font-EBGaramond transition-all cursor-pointer hover:text-blue-600 pl-8 hover:pl-10"
                                      >
                                        {ex.title.rendered}
                                      </Button>
                                    ) : (
                                      <span
                                        key={`list-${ex.id}`}
                                        className="block pl-8 py-1 font-EBGaramondItalic text-foreground/80"
                                      >
                                        {ex.title.rendered}
                                      </span>
                                    )}

                                    <HDivider color="border-blue-600" />
                                  </>
                                );
                              }}
                            />
                          </div>
                        )}

                        {/* Filter / Sort */}
                        <Button
                          variant="nav"
                          size="linkSize"
                          onClick={handleOpenExhibitionsFilter}
                          className={`font-EBGaramond text-base  pl-6 pr-5     `}
                        >
                          Filters
                          <span>
                            {" "}
                            {showExhibitionsFilter ? (
                              <MinusIcon className="w-3 h-3" />
                            ) : (
                              <PlusIcon className="w-3 h-3" />
                            )}
                          </span>
                        </Button>
                        {showExhibitionsFilter && (
                          <div className="">
                            <HDivider className="mt-1 mb-1" />
                            <div className="pt-1 flex flex-col gap-y-1 items-start justify-start">
                              {isApplyingExhibitionsFilters ? (
                                <div className="pl-8 py-4 font-EBGaramondItalic text-sm animate-pulse">
                                  Applying filters…
                                </div>
                              ) : (
                                <>
                                  {/* Sort by */}
                                  <span className="pl-8 flex items-baseline justify-start w-full">
                                    <h3 className="font-EBGaramond text-base whitespace-nowrap">
                                      Sort by
                                    </h3>
                                    <Select
                                      value={stagedExhibitionSort}
                                      onValueChange={(v) =>
                                        setStagedExhibitionSort(
                                          v as ExhibitionSort
                                        )
                                      }
                                    >
                                      <SelectTrigger
                                        size="sm"
                                        className="font-EBGaramond w-full text-base pt-0.5 pr-5"
                                      >
                                        <SelectValue placeholder="Sort exhibitions" />
                                      </SelectTrigger>
                                      <SelectContent position="popper">
                                        <SelectItem value="year">
                                          year
                                        </SelectItem>
                                        <SelectItem value="title">
                                          title (a-ö)
                                        </SelectItem>
                                        <SelectItem value="type">
                                          solo/group
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </span>

                                  {stagedExhibitionSort === "year" && (
                                    <>
                                      <span className="pl-8 flex items-baseline justify-start w-full">
                                        <h3 className="font-EBGaramond text-base whitespace-nowrap">
                                          Show
                                        </h3>
                                        <Select
                                          value={stagedExSelectedYear}
                                          onValueChange={
                                            setStagedExSelectedYear
                                          }
                                        >
                                          <SelectTrigger
                                            size="sm"
                                            className="font-EBGaramond w-full text-base pt-0.5 pr-5"
                                          >
                                            <SelectValue placeholder="Filter by year" />
                                          </SelectTrigger>
                                          <SelectContent position="popper">
                                            <SelectItem value="all">
                                              all years
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
                                      </span>
                                    </>
                                  )}

                                  {/* Filter by Type */}
                                  <span className="pl-8 flex items-baseline justify-start w-full">
                                    <h3 className="font-EBGaramond text-base whitespace-nowrap">
                                      Show
                                    </h3>
                                    <Select
                                      value={stagedSelectedType}
                                      onValueChange={setStagedSelectedType}
                                    >
                                      <SelectTrigger
                                        size="sm"
                                        className="font-EBGaramond w-full text-base pt-0.5 pr-5"
                                      >
                                        <SelectValue placeholder="all exhibitions" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="all">
                                          all exhibitions
                                        </SelectItem>
                                        <SelectItem value="Solo">
                                          solo exhibitions
                                        </SelectItem>
                                        <SelectItem value="Group">
                                          group exhibitions
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </span>
                                  <HDivider className="mt-1" />
                                  <div className="flex gap-2 pl-8 items-center justify-start  w-full pr-4">
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="w-full font-gintoRegular text-xs uppercase tracking-wider underline underline-offset-4 justify-start"
                                      onClick={async () => {
                                        await applyExhibitionsFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      Apply Filters
                                    </Button>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="w-full font-gintoRegular text-xs uppercase tracking-wider justify-start"
                                      onClick={async () => {
                                        await clearExhibitionsFilters();
                                        if (!isDesktop) setOpen(false);
                                      }}
                                    >
                                      Clear (X)
                                    </Button>
                                  </div>
                                  <HDivider />
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex flex-col  snap-start snap-stop-always w-full  ">
                {/* CONTACT */}
                <span className=" snap-start snap-stop-always   flex items-center justify-between w-full pl-4 pr-3">
                  <Button
                    variant="nav"
                    size="linkSize"
                    className="h2 text-base "
                    onClick={() => {
                      handleOpenContact();
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);
                    }}
                  >
                    Contact
                  </Button>
                  <Button
                    variant="nav"
                    size="linkIcon"
                    onClick={() => {
                      handleOpenContact();
                      setActiveWorkSlug(null);
                      setActiveExhibitionSlug(null);
                    }}
                    className={``}
                  >
                    {showContact ? (
                      <MinusIcon className="w-3 h-3" />
                    ) : (
                      <PlusIcon className="w-3 h-3" />
                    )}
                  </Button>
                </span>

                {showContact && (
                  <>
                    <div className="flex flex-col pt-1  mb-2     ">
                      <Button
                        variant="nav"
                        size="linkSize"
                        className="font-EBGaramond text-base text-blue-600 hover:text-blue-600  pl-6  "
                        asChild
                        onClick={() => {
                          if (!isDesktop) setOpen(false);
                        }}
                      >
                        <Link href="mailto:elinor.silow@gmail.com">E-mail</Link>
                      </Button>

                      <Button
                        variant="nav"
                        size="linkSize"
                        className="font-EBGaramond text-base pl-6 text-blue-600 hover:text-blue-600"
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
                  </>
                )}
              </div>
              {/* INFO */}
              <div className=" flex flex-col gap-y-0 snap-start snap-stop-always w-full">
                <Button
                  variant="nav"
                  size="linkSize"
                  onClick={() => {
                    router.push("/?view=information", { scroll: false });
                    goToView("info");
                    setActiveWorkSlug(null);
                    setActiveExhibitionSlug(null);
                    if (!isDesktop) setOpen(false);
                  }}
                  className="h2 text-left text-base  px-4"
                >
                  Information
                </Button>

                <div className="px-4  pb-2">
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

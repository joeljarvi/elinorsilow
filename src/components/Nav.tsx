"use client";

import { useState, useEffect } from "react";
import { useNav } from "@/context/NavContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Staggered from "@/components/Staggered";

import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import HDivider from "@/components/HDivider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import VDivider from "@/components/VDivider";

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
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [open, setOpen] = useState(true);

  const {
    exhibitions,
    exhibitionSort,
    setExhibitionSort,
    exSelectedYear,
    exSetSelectedYear,
    selectedType,
    setSelectedType,
    availableYears,
    exLoading,
    openExhibition,
  } = useExhibitions();

  const {
    allWorks,
    workSort,
    setWorkSort,
    categoryFilter,
    setCategoryFilter,
    selectedYear,
    setSelectedYear,
    availibleYears,
    showInfo,
    setShowInfo,
    workLoading,
    openWork,
  } = useWorks();

  const { infoLoading } = useInfo();
  const {
    viewLoading,
    goToView,
    showWorksMenu,
    setShowWorksMenu,
    showExhibitionsMenu,
    setShowExhibitionsMenu,
    showContact,
    showAllWorksList,
    setShowAllWorksList,
    showAllExhibitionsList,
    setShowAllExhibitionsList,
    showWorksFilter,
    setShowWorksFilter,
    showExhibitionsFilter,
    setShowExhibitionsFilter,
    handleOpen,
    handleOpenWorksMenu,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenAllExhibitionsList,
    handleOpenExhibitionsMenu,
    handleOpenExhibitionsFilter,
    handleOpenContact,
  } = useNav();

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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hidden lg:fixed w-[calc(25%+0.05rem)] z-30  lg:flex   flex-row     h-screen bg-transparent     "
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="hidden lg:absolute z-40 top-0 left-0 lg:flex  items-center justify-center w-24 h-24 mt-4 "
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
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -500 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="    overflow-y-scroll flex items-start justify-start w-full    "
          >
            <div className="flex flex-col items-start justify-start  w-full mt-36 border-r border-foreground border-y-foreground border-y bg-background ">
              <AnimatePresence mode="wait">
                <motion.div
                  key="bio"
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="max-w-sm w-full mb-2 mt-4"
                >
                  <motion.div variants={item} className=" ">
                    <Button
                      asChild
                      variant="nav"
                      size="linkSizeMd"
                      className="font-gintoBlack text-lg px-4      "
                    >
                      <Link href="/">Elinor Silow</Link>
                    </Button>
                  </motion.div>
                  <motion.div variants={item} className="px-4 ">
                    <p className="font-EBGaramond mt-3 mb-4  ">
                      (b. 1993) in Malmö, Sweden, is a Stockholm based artist
                      who explores raw emotion through painting, sculpture and
                      textile.
                    </p>
                  </motion.div>
                  <motion.div variants={item} className="px-4 ">
                    <p className="font-EBGaramond  ">
                      Please contact
                      <Button
                        asChild
                        variant="link"
                        size="linkSize"
                        className="text-blue-600 text-base px-1"
                      >
                        <Link
                          href="mailto:elinor.silow@gmail.com"
                          className="  "
                        >
                          elinor.silow@gmail.com
                        </Link>
                      </Button>
                      for collaborations and inquires.
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* MENU */}
              <AnimatePresence>
                <motion.div className="w-full  ">
                  {/* WORKS */}
                  <div className=" flex flex-col  pt-2   ">
                    <span className="flex items-center justify-between w-full px-4  ">
                      <Button
                        asChild
                        variant="nav"
                        size="linkSizeMd"
                        className="font-gintoBlack "
                      >
                        <Link
                          href="/"
                          onClick={() => {
                            router.push("/?view=works", { scroll: false });
                            goToView("works");

                            handleOpenWorksMenu();

                            setShowExhibitionsMenu(false);
                            setShowExhibitionsFilter(false);
                            setShowAllExhibitionsList(false);
                          }}
                          className={` `}
                        >
                          Works{" "}
                        </Link>
                      </Button>
                      <Button
                        variant="link"
                        size="linkIcon"
                        onClick={() => {
                          handleOpenWorksMenu();
                          setShowExhibitionsMenu(false);
                          setShowExhibitionsFilter(false);
                          setShowAllExhibitionsList(false);
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

                    <HDivider />
                    {/* WORKS MENU DROPDOWN */}
                    {showWorksMenu && (
                      <>
                        <div className="flex flex-col overflow-y-scroll  gap-0 ">
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            onClick={() => {
                              handleOpenAllWorksList();
                              setShowExhibitionsMenu(false);
                              setShowExhibitionsFilter(false);
                              setShowAllExhibitionsList(false);
                            }}
                            className={`  font-gintoMedium pl-10 pr-5 
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
                          <HDivider />
                          {showAllWorksList && (
                            <div
                              className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out   pl-6   ${
                                showAllWorksList ? "max-h-[200vh]" : "hidden"
                              }`}
                            >
                              <Staggered
                                items={allWorks}
                                className="columns-1   space-y-0  pt-1 pl-8  "
                                renderItem={(work) => (
                                  <>
                                    <Button
                                      variant="nav"
                                      size="linkSize"
                                      key={work.slug}
                                      onClick={() => openWork(work.slug)}
                                      className="break-inside-avoid transition-all font-EBGaramondItalic   hover:pl-2 hover:font-EBGaramond text-base"
                                    >
                                      {work.title.rendered}
                                    </Button>
                                  </>
                                )}
                              />
                            </div>
                          )}
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            onClick={handleOpenWorksFilter}
                            className={`font-gintoMedium pt-0.5 pl-10 pr-5   
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
                            <div className="pl-0 overflow-y-scroll">
                              <HDivider />
                              <div className="flex flex-col items-start justify-start pl-12">
                                <span className=" flex items-baseline justify-start w-full pl-2 border-l border-foreground  ">
                                  <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                    Sort by
                                  </h3>

                                  <Select
                                    value={workSort}
                                    onValueChange={(v) => {
                                      setWorkSort(v as WorkSort);
                                      if (v !== "year") setSelectedYear(null);
                                    }}
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className="font-gintoBlack w-full text-lg pt-0.5 pr-5  "
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
                                <HDivider />
                                {workSort === "year" && (
                                  <>
                                    <span className="pl-2 flex items-baseline justify-start w-full border-l border-foreground  ">
                                      <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                        Year
                                      </h3>

                                      <Select
                                        value={selectedYear?.toString()}
                                        onValueChange={(v) =>
                                          setSelectedYear(Number(v))
                                        }
                                      >
                                        <SelectTrigger
                                          size="default"
                                          className="font-gintoBlack w-full text-lg pt-0.5 pr-5 "
                                        >
                                          <SelectValue placeholder="2024" />
                                        </SelectTrigger>

                                        <SelectContent position="popper">
                                          {availibleYears.map((year) => (
                                            <SelectItem
                                              key={year}
                                              value={year.toString()}
                                            >
                                              {year}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </span>
                                    <HDivider />
                                  </>
                                )}

                                <span className="pl-2 flex items-baseline justify-start border-l border-foreground w-full ">
                                  <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                    Show
                                  </h3>

                                  <Select
                                    value={categoryFilter}
                                    onValueChange={(v) =>
                                      setCategoryFilter(v as CategoryFilter)
                                    }
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className="font-gintoBlack w-full text-lg pt-0.5 pr-5"
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
                                <span className=" flex items-baseline justify-start w-full border-l border-foreground   ">
                                  <Button
                                    variant="nav"
                                    size="linkSizeMd"
                                    className="font-gintoMedium  "
                                    onClick={() => setShowInfo((prev) => !prev)}
                                  >
                                    {showInfo
                                      ? "Hide description"
                                      : "Show description"}
                                  </Button>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <HDivider />
                      </>
                    )}
                  </div>

                  {/* EXHIBITIONS */}
                  <div className="flex flex-col pt-1  ">
                    <span className="flex items-center justify-between w-full  px-4 ">
                      <Button asChild variant="nav" size="linkSizeMd">
                        <Link
                          href="/"
                          onClick={() => {
                            router.push("/?view=exhibitions", {
                              scroll: false,
                            });
                            goToView("exhibitions");

                            handleOpenExhibitionsMenu();
                            setShowWorksMenu(false);
                            setShowWorksFilter(false);
                            setShowAllWorksList(false);
                          }}
                          className={`font-gintoBlack   `}
                        >
                          Exhibitions
                        </Link>
                      </Button>
                      <Button
                        variant="link"
                        size="linkIcon"
                        onClick={() => {
                          goToView("exhibitions");
                          handleOpenExhibitionsMenu();
                          setShowWorksMenu(false);
                          setShowWorksFilter(false);
                          setShowAllWorksList(false);
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
                    <HDivider />

                    {showExhibitionsMenu && (
                      <>
                        <div className="flex flex-col overflow-y-scroll     ">
                          {/* Index button */}
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            onClick={handleOpenAllExhibitionsList}
                            className={`font-gintoMedium pl-10 pr-5  }`}
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
                          <HDivider />
                          {showAllExhibitionsList && (
                            <div
                              className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out  ${
                                showAllExhibitionsList
                                  ? "max-h-[200vh]"
                                  : "hidden"
                              }`}
                            >
                              <Staggered
                                items={exhibitions}
                                className="columns-1 pl-14 pr-8  space-y-0  py-2  "
                                renderItem={(ex) => (
                                  <>
                                    <Button
                                      variant="nav"
                                      size="linkSize"
                                      key={ex.slug}
                                      onClick={() => openExhibition(ex.slug)}
                                      className="text-base break-inside-avoid  font-EBGaramondItalic hover:font-EBGaramond transition-all  cursor-pointer  hover:pl-2"
                                    >
                                      {ex.title.rendered}
                                    </Button>
                                  </>
                                )}
                              />
                              <HDivider />
                            </div>
                          )}

                          {/* Filter / Sort */}
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            onClick={handleOpenExhibitionsFilter}
                            className={`font-gintoMedium font-gintoMedium pl-10 pr-5     `}
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
                            <div className=" pt-0.5">
                              <HDivider />
                              <div className="flex flex-col items-start justify-start  pl-12 ">
                                {/* Sort by */}
                                <span className="pl-2 flex items-baseline justify-start w-full border-l border-foreground  ">
                                  <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                    Sort by
                                  </h3>
                                  <Select
                                    value={exhibitionSort}
                                    onValueChange={(v) =>
                                      setExhibitionSort(v as ExhibitionSort)
                                    }
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className="font-gintoBlack w-full text-lg pt-0.5 pr-5"
                                    >
                                      <SelectValue placeholder="Sort exhibitions" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                      <SelectItem value="year">year</SelectItem>
                                      <SelectItem value="title">
                                        title (a-ö)
                                      </SelectItem>
                                      <SelectItem value="type">
                                        solo/group
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </span>
                                <HDivider />
                                {exhibitionSort === "year" && (
                                  <>
                                    <span className="pl-2 flex items-baseline justify-start w-full border-l border-foreground  ">
                                      <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                        Show
                                      </h3>
                                      <Select
                                        value={exSelectedYear}
                                        onValueChange={exSetSelectedYear}
                                      >
                                        <SelectTrigger
                                          size="default"
                                          className="font-gintoBlack w-full text-lg pt-0.5 pr-5"
                                        >
                                          <SelectValue placeholder="Filter by year" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                          <SelectItem value="all">
                                            all years
                                          </SelectItem>
                                          {availableYears.map((y) => (
                                            <SelectItem key={y} value={y}>
                                              {y}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </span>
                                    <HDivider />
                                  </>
                                )}

                                {/* Filter by Type */}
                                <span className="pl-2 flex border-l border-foreground items-baseline justify-start w-full ">
                                  <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                    Show
                                  </h3>
                                  <Select
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                  >
                                    <SelectTrigger
                                      size="default"
                                      className="font-gintoBlack w-full text-lg pt-0.5 pr-5 "
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
                              </div>
                            </div>
                          )}
                        </div>
                        <HDivider />
                      </>
                    )}

                    {/* CONTACT */}
                    <span className="  pt-0.5 flex items-center justify-between w-full pl-4 pr-3">
                      <Button
                        variant="nav"
                        size="linkSizeMd"
                        className="font-gintoBlack "
                        onClick={handleOpenContact}
                      >
                        Contact
                      </Button>
                      <Button
                        variant="nav"
                        size="linkIcon"
                        onClick={() => {
                          handleOpenContact();
                          setShowWorksMenu(false);
                          setShowWorksFilter(false);
                          setShowAllWorksList(false);
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
                    <HDivider />

                    {showContact && (
                      <>
                        <div className="flex flex-col py-1      ">
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            className="font-gintoMedium  pl-10  "
                            asChild
                          >
                            <Link href="mailto:elinor.silow@gmail.com">
                              E-mail
                            </Link>
                          </Button>
                          <HDivider />
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            className="font-gintoMedium pl-10"
                            asChild
                          >
                            <Link href="https://www.instagram.com/elinorsilow/">
                              Instagram
                            </Link>
                          </Button>
                        </div>
                        <HDivider />
                      </>
                    )}
                    {/* INFO */}
                    <div className="pt-1 flex flex-col gap-y-0 ">
                      <Button
                        variant="nav"
                        size="linkSizeMd"
                        onClick={() => {
                          goToView("info");
                          setShowWorksMenu(false);
                          setShowExhibitionsMenu(false);
                          setShowExhibitionsFilter(false);
                          setShowAllExhibitionsList(false);
                          setShowWorksFilter(false);
                          setShowAllWorksList(false);
                        }}
                        className="font-gintoBlack text-left  px-4"
                      >
                        Information
                      </Button>
                      <HDivider />
                      <div className="px-4 pt-0.5 pb-2">
                        <DarkModeToggle />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useNav } from "@/context/NavContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Staggered from "@/components/Staggered";

import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="">
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hidden lg:fixed w-[calc(25%-0.25rem)]  lg:flex   flex-col     h-screen     "
      >
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="hidden lg:flex  items-center justify-center w-24 h-24 mt-4 mb-4"
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
              className="relative w-24 h-24"
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
              className="relative w-24 h-24"
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
              className="w-full h-full bg-background text-red-600 pt-4 px-4 pb-16 overflow-y-scroll  "
            >
              <div className="mb-6 max-w-sm  ">
                <Button
                  asChild
                  variant="nav"
                  size="linkSizeMd"
                  className="font-gintoBlack text-lg text-red-600      "
                >
                  <Link href="/">Elinor Silow</Link>
                </Button>
                <div className=" px-2  mb-4 text-base leading-snug">
                  <p className="font-EBGaramond mt-3 mb-4  ">
                    (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                    explores raw emotion through painting, sculpture and
                    textile.
                  </p>
                  <p className="font-EBGaramond  ">
                    For inquiries, please contact:{" "}
                    <Button
                      asChild
                      variant="link"
                      size="linkSize"
                      className="text-red-600"
                    >
                      <Link
                        href="mailto:elinor.silow@gmail.com"
                        className="font-gintoRegular text-sm mx-0.5 hover:underline underline-offset-5 text-blue-600"
                      >
                        elinor.silow@gmail.com
                      </Link>
                    </Button>
                    for collaborations and inquires.
                  </p>
                </div>
              </div>

              {/* WORKS */}
              <div className="px-0">
                <div className=" flex flex-col  pt-2  ">
                  <span className="flex items-center justify-between w-full pr-1  ">
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
                          setOpen(false);
                          handleOpenWorksMenu();

                          setShowExhibitionsMenu(false);
                          setShowExhibitionsFilter(false);
                          setShowAllExhibitionsList(false);
                        }}
                        className={`uppercase  `}
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
                      <div className="flex flex-col overflow-y-scroll  gap-0">
                        <Button
                          variant="nav"
                          size="linkSizeMd"
                          onClick={() => {
                            handleOpenAllWorksList();
                            setShowExhibitionsMenu(false);
                            setShowExhibitionsFilter(false);
                            setShowAllExhibitionsList(false);
                          }}
                          className={`  font-gintoMedium 
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
                              className="columns-1   space-y-0 border-l border-foreground pt-1 bg-pink-300  "
                              renderItem={(work) => (
                                <>
                                  <Button
                                    variant="nav"
                                    size="linkSizeMd"
                                    key={work.slug}
                                    onClick={() => openWork(work.slug)}
                                    className="break-inside-avoid transition-all font-EBGaramondItalic   hover:pl-6 hover:font-EBGaramond"
                                  >
                                    {work.title.rendered}
                                  </Button>
                                  <HDivider />
                                </>
                              )}
                            />
                          </div>
                        )}
                        <Button
                          variant="nav"
                          size="linkSizeMd"
                          onClick={handleOpenWorksFilter}
                          className={`font-gintoMedium pt-0.5   
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
                          <div className="pl-6 overflow-y-scroll">
                            <HDivider />
                            <div className="flex flex-col items-start justify-start border-l border-foreground">
                              <span className=" flex items-baseline justify-start w-full pl-2  ">
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
                                    className="font-gintoBlack w-full text-lg pt-0.5 pr-2  "
                                  >
                                    <SelectValue placeholder="Sort works" />
                                  </SelectTrigger>

                                  <SelectContent className="" position="popper">
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
                                  <span className="pl-2 flex items-baseline justify-start w-full ">
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
                                        className="font-gintoBlack w-full text-lg pt-0.5 pr-2 "
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

                              <span className="pl-2 flex items-baseline justify-start w-full ">
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
                                    className="font-gintoBlack w-full text-lg pt-0.5 pr-2"
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
                              <span className=" flex items-baseline justify-start w-full ">
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
                  <span className="flex items-center justify-between w-full gap-x-1 pr-1 ">
                    <Button asChild variant="nav" size="linkSizeMd">
                      <Link
                        href="/"
                        onClick={() => {
                          router.push("/?view=exhibitions", { scroll: false });
                          goToView("exhibitions");
                          setOpen(false);
                          handleOpenExhibitionsMenu();
                          setShowWorksMenu(false);
                          setShowWorksFilter(false);
                          setShowAllWorksList(false);
                        }}
                        className={`font-gintoBlack  uppercase `}
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
                          className={`font-gintoMedium  }`}
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
                            className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out pl-6 ${
                              showAllExhibitionsList
                                ? "max-h-[200vh]"
                                : "hidden"
                            }`}
                          >
                            <Staggered
                              items={exhibitions}
                              className="columns-1   space-y-0 border-l border-foreground   "
                              renderItem={(ex) => (
                                <>
                                  <Button
                                    variant="nav"
                                    size="linkSizeMd"
                                    key={ex.slug}
                                    onClick={() => openExhibition(ex.slug)}
                                    className="break-inside-avoid  font-EBGaramondItalic hover:font-EBGaramond transition-all  cursor-pointer  hover:pl-4"
                                  >
                                    {ex.title.rendered}
                                  </Button>
                                  <HDivider />
                                </>
                              )}
                            />
                          </div>
                        )}

                        {/* Filter / Sort */}
                        <Button
                          variant="nav"
                          size="linkSizeMd"
                          onClick={handleOpenExhibitionsFilter}
                          className={`font-gintoMedium  `}
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
                          <div className="pl-6 pt-0.5">
                            <HDivider />
                            <div className="flex flex-col items-start justify-start border-l border-foreground ">
                              {/* Sort by */}
                              <span className="pl-2 flex items-baseline justify-start w-full ">
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
                                    className="font-gintoBlack w-full text-lg pt-0.5 pr-2"
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
                                  <span className="pl-2 flex items-baseline justify-start w-full  ">
                                    <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                      Show
                                    </h3>
                                    <Select
                                      value={exSelectedYear}
                                      onValueChange={exSetSelectedYear}
                                    >
                                      <SelectTrigger
                                        size="default"
                                        className="font-gintoBlack w-full text-lg pt-0.5 pr-2"
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
                              <span className="pl-2 flex items-baseline justify-start w-full ">
                                <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                  Show
                                </h3>
                                <Select
                                  value={selectedType}
                                  onValueChange={setSelectedType}
                                >
                                  <SelectTrigger
                                    size="default"
                                    className="font-gintoBlack w-full text-lg pt-0.5 pr-2 "
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
                  <span className="  pt-0.5 flex items-center justify-between w-full">
                    <Button
                      variant="nav"
                      size="linkSizeMd"
                      className="font-gintoBlack uppercase"
                      asChild
                      onClick={handleOpenContact}
                    >
                      <Link href="mailto:elinor.silow@gmail.com">Contact</Link>
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
                      <div className="flex flex-col py-1     ">
                        <Button
                          variant="nav"
                          size="linkSizeMd"
                          className="font-gintoMedium   "
                          asChild
                        >
                          <Link href="mailto:elinor.silow@gmail.com">
                            E-mail
                          </Link>
                        </Button>

                        <Button
                          variant="nav"
                          size="linkSizeMd"
                          className="font-gintoMedium "
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
                        setOpen(false);
                        setShowWorksMenu(false);
                        setShowExhibitionsMenu(false);
                        setShowExhibitionsFilter(false);
                        setShowAllExhibitionsList(false);
                        setShowWorksFilter(false);
                        setShowAllWorksList(false);
                      }}
                      className="font-gintoBlack text-left uppercase"
                    >
                      Information
                    </Button>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

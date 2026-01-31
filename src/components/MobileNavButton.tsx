"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks, WorkSort, CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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

function MobileNavOverlay() {
  const {
    open,

    handleOpen,
    goToView,
    showWorksMenu,

    showExhibitionsMenu,
    setShowExhibitionsMenu,
    showContact,
    showAllWorksList,

    showAllExhibitionsList,
    setShowAllExhibitionsList,
    showWorksFilter,

    showExhibitionsFilter,
    setShowExhibitionsFilter,
    handleOpenWorksMenu,
    handleOpenAllWorksList,
    handleOpenWorksFilter,
    handleOpenAllExhibitionsList,
    handleOpenExhibitionsMenu,
    handleOpenExhibitionsFilter,
    handleOpenContact,
  } = useNav();

  const {
    allWorks,
    workSort,
    setWorkSort,
    categoryFilter,
    setCategoryFilter,
    selectedYear,
    setSelectedYear,

    showInfo,
    setShowInfo,
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

    uniqueExYears,
    openExhibition,
    filteredExhibitions,
  } = useExhibitions();

  const { exhibitionList } = useInfo();

  const router = useRouter();
  const sortAZ = <T extends { title: { rendered: string } }>(items: T[]) =>
    [...items].sort((a, b) =>
      a.title.rendered.localeCompare(b.title.rendered, "sv", {
        sensitivity: "base",
      })
    );

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={` fixed inset-0 z-40 min-h-screen  w-full   overflow-y-auto transform   bg-background   ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col items-start justify-start `}
      >
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          exit={{ x: -500 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            overflow-y-scroll scroll-smooth scrollbar-hide flex flex-col w-full pt-8 border-r border-r-foreground
            ${
              showWorksMenu || showExhibitionsMenu || showContact
                ? "snap-y snap-proximity"
                : "snap-none"
            }
            scroll-pt-8
          `}
        >
          <Button
            className="z-50 absolute top-0 right-2 font-EBGaramondAC      transition-all  tracking-wide justify-start items-baseline  rounded  text-base gap-x-1  ml-2 uppercase"
            size="listSize"
            variant="link"
            onClick={handleOpen}
          >
            Back
          </Button>
          <div className="max-w-sm w-full pt-24 mb-8 px-2 snap-start snap-stop-always  ">
            <Button
              asChild
              variant="nav"
              size="linkSize"
              className="font-gintoBlack text-lg px-2     "
            >
              <Link href="/">Elinor Silow</Link>
            </Button>

            <p className="font-EBGaramond mt-2 mb-2 px-4  ">
              (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
              explores raw emotion through painting, sculpture and textile.
            </p>

            <p className="font-EBGaramond  px-4 ">
              Please contact
              <Button
                asChild
                variant="link"
                size="linkSize"
                className="text-blue-600 text-base px-1"
              >
                <Link href="mailto:elinor.silow@gmail.com" className="  ">
                  elinor.silow@gmail.com
                </Link>
              </Button>
              for collaborations and inquires.
            </p>
          </div>

          {/* WORKS */}
          <div className=" flex flex-col  pt-1 snap-start snap-stop-always w-full    ">
            <span className="flex items-center justify-between w-full px-2  ">
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
                    handleOpen();
                    handleOpenWorksMenu();
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
                    className={`  font-gintoMedium pl-4 pr-3 
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
                      className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out     ${
                        showAllWorksList ? "max-h-[200vh]" : "hidden"
                      }`}
                    >
                      <Staggered
                        items={allWorks}
                        className="columns-1   space-y-0  pt-1  "
                        renderItem={(work) => (
                          <>
                            <Button
                              variant="nav"
                              size="linkSize"
                              key={work.slug}
                              onClick={() => openWork(work.slug)}
                              className="break-inside-avoid transition-all pl-6 font-EBGaramondItalic   hover:pl-8 text-blue-600 hover:text-blue-600 hover:font-EBGaramond text-base"
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
                    size="linkSizeMd"
                    onClick={handleOpenWorksFilter}
                    className={`font-gintoMedium pt-0.5 pl-4 pr-3   
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
                      <div className="flex flex-col items-start justify-start ">
                        <span className=" flex items-baseline justify-start w-full pl-6   ">
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
                              className="font-gintoMedium w-full text-lg pt-0.5 pr-3  "
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
                              <SelectItem value="title">title (a–ö)</SelectItem>
                            </SelectContent>
                          </Select>
                        </span>
                        <HDivider />
                        {workSort === "year" && (
                          <>
                            <span className="pl-6 flex items-baseline justify-start w-full  ">
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
                                  className="font-gintoMedium w-full text-lg pt-0.5 pr-3 "
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
                            <HDivider />
                          </>
                        )}

                        <span className="pl-6 flex items-baseline justify-start  w-full ">
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
                              className="font-gintoMedium w-full text-lg pt-0.5 pr-3"
                            >
                              <SelectValue placeholder="All works" />
                            </SelectTrigger>

                            <SelectContent position="popper">
                              <SelectItem value="all">all works</SelectItem>
                              <SelectItem value="painting">
                                paintings
                              </SelectItem>
                              <SelectItem value="drawing">drawings</SelectItem>
                              <SelectItem value="sculpture">
                                sculpture
                              </SelectItem>
                              <SelectItem value="textile">textiles</SelectItem>
                            </SelectContent>
                          </Select>
                        </span>
                        <HDivider />
                        <span className=" flex items-baseline justify-start w-full  pl-6  ">
                          <Button
                            variant="nav"
                            size="linkSizeMd"
                            className="font-gintoMedium  "
                            onClick={() => setShowInfo((prev) => !prev)}
                          >
                            {showInfo ? "Hide description" : "Show description"}
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
          <div className="flex flex-col pt-1 snap-start snap-stop-always w-full   ">
            <span className="flex items-center justify-between w-full  px-2 ">
              <Button asChild variant="nav" size="linkSizeMd">
                <Link
                  href="/"
                  onClick={() => {
                    router.push("/?view=exhibitions", {
                      scroll: false,
                    });
                    goToView("exhibitions");
                    handleOpen();
                    handleOpenExhibitionsMenu();
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
                    className={`font-gintoMedium pl-4 pr-3  }`}
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
                        showAllExhibitionsList ? "max-h-[200vh]" : "hidden"
                      }`}
                    >
                      <Staggered
                        items={exhibitionIndex}
                        className="columns-1 space-y-0 pt-1"
                        renderItem={(ex) => {
                          const slug = findExhibitionSlug(ex.title.rendered);
                          return (
                            <>
                              {slug ? (
                                <Button
                                  variant="nav"
                                  size="linkSize"
                                  key={`ex-${ex.id}`}
                                  onClick={() => openExhibition(slug)}
                                  className="text-base break-inside-avoid font-EBGaramondItalic text-blue-600 hover:font-EBGaramond transition-all cursor-pointer hover:text-blue-600 pl-8 hover:pl-10"
                                >
                                  {ex.title.rendered}
                                </Button>
                              ) : (
                                <span
                                  key={`list-${ex.id}`}
                                  className="block pl-8 py-1 font-EBGaramondItalic text-foreground/80 "
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
                    size="linkSizeMd"
                    onClick={handleOpenExhibitionsFilter}
                    className={`font-gintoMedium  pl-4 pr-3     `}
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
                      <div className="flex flex-col items-start justify-start  ">
                        {/* Sort by */}
                        <span className="pl-6 flex items-baseline justify-start w-full  ">
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
                              className="font-gintoMedium w-full text-lg pt-0.5 pr-3"
                            >
                              <SelectValue placeholder="Sort exhibitions" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="year">year</SelectItem>
                              <SelectItem value="title">title (a-ö)</SelectItem>
                              <SelectItem value="type">solo/group</SelectItem>
                            </SelectContent>
                          </Select>
                        </span>
                        <HDivider />
                        {exhibitionSort === "year" && (
                          <>
                            <span className="pl-6 flex items-baseline justify-start w-full   ">
                              <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                                Show
                              </h3>
                              <Select
                                value={exSelectedYear}
                                onValueChange={exSetSelectedYear}
                              >
                                <SelectTrigger
                                  size="default"
                                  className="font-gintoMedium w-full text-lg pt-0.5 pr-3"
                                >
                                  <SelectValue placeholder="Filter by year" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                  <SelectItem value="all">all years</SelectItem>
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
                            <HDivider />
                          </>
                        )}

                        {/* Filter by Type */}
                        <span className="pl-6 flex  items-baseline justify-start w-full ">
                          <h3 className="font-gintoMedium text-lg whitespace-nowrap">
                            Show
                          </h3>
                          <Select
                            value={selectedType}
                            onValueChange={setSelectedType}
                          >
                            <SelectTrigger
                              size="default"
                              className="font-gintoMedium w-full text-lg pt-0.5 pr-3 "
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
            <span className="  pt-0.5 flex items-center justify-between w-full pl-2 pr-1 snap-start snap-stop-always w-full ">
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
                    className="font-gintoMedium  pl-4  "
                    asChild
                  >
                    <Link href="mailto:elinor.silow@gmail.com">E-mail</Link>
                  </Button>
                  <HDivider />
                  <Button
                    variant="nav"
                    size="linkSizeMd"
                    className="font-gintoMedium pl-4"
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
            <div className="pt-1 flex flex-col gap-y-0 snap-start snap-stop-always w-full  ">
              <Button
                variant="nav"
                size="linkSizeMd"
                onClick={() => {
                  goToView("info");
                  handleOpen();
                }}
                className="font-gintoBlack text-left  px-2"
              >
                Information
              </Button>
              <HDivider />
              <div className="px-2 pt-0.5 pb-2">
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function NavButton() {
  const { infoLoading } = useInfo();
  const { viewLoading, open, handleOpen } = useNav();

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
        className="fixed lg:hidden bottom-0 right-0 left-auto top-auto z-50  flex items-center justify-center w-24 h-24"
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
            className="relative w-24 h-24"
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
            className="relative w-24 h-24"
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

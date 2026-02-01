"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";
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
        className={` fixed inset-0 z-40 h-screen  w-full    transform   bg-background   ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col items-center justify-center `}
      >
        <Button
          className=" absolute top-4 left-1/2 -translate-x-1/2  font-EBGaramondAC flex z-50     transition-all  tracking-wide justify-start items-baseline  rounded  text-base gap-x-1   uppercase"
          size="listSize"
          variant="link"
          onClick={handleOpen}
        >
          Back
        </Button>
        <motion.div
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          exit={{ x: -500 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            overflow-y-scroll scroll-smooth scrollbar-hide
            w-full min-h-screen pt-24 pb-48 bg-background
            ${
              showWorksMenu || showExhibitionsMenu || showContact
                ? "snap-y snap-proximity"
                : "snap-none"
            }
            scroll-pt-24
            `}
        >
          <div className="mx-auto w-full  flex flex-col  justify-center items-center">
            <motion.div
              key="bio"
              variants={container}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-sm w-full mb-2 snap-start snap-stop-always "
            >
              <motion.div variants={item} className=" ">
                <Button
                  asChild
                  variant="link"
                  size="linkSize"
                  className="font-gintoBlack text-lg px-4 justify-center w-full    "
                >
                  <Link href="/">Elinor Silow</Link>
                </Button>
              </motion.div>
              <motion.div variants={item} className="px-4 w-full ">
                <p className="font-EBGaramond mt-3 mb-4  text-center ">
                  (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                  explores raw emotion through painting, sculpture and textile.
                </p>
              </motion.div>
              <motion.div variants={item} className="px-4 ">
                <p className="font-EBGaramond text-center ">
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
              </motion.div>
            </motion.div>

            {/* MENU */}

            {/* WORKS */}
            <div className=" flex flex-col  pt-8 snap-start snap-stop-always w-full   ">
              <span className="flex items-center justify-center  px-4 gap-x-1 ">
                <Button
                  asChild
                  variant="link"
                  size="linkSize"
                  className="font-gintoBlack text-base "
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
                  <div className="flex flex-col justify-center items-center overflow-y-scroll  gap-0 pt-1">
                    <Button
                      variant="link"
                      size="linkSize"
                      onClick={() => {
                        handleOpenAllWorksList();
                      }}
                      className={`  font-EBGaramond  text-lg items-center justify-center 
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
                        className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out flex flex-col w-full justify-center items-center     ${
                          showAllWorksList ? "max-h-[200vh]" : "hidden"
                        }`}
                      >
                        <Staggered
                          items={sortAZ(allWorks)}
                          className="flex flex-col justify-center items-stretch   space-y-0  pt-1 mx-auto w-full "
                          renderItem={(work) => (
                            <div className="w-full text-center">
                              <Button
                                variant="link"
                                size="linkSize"
                                key={work.slug}
                                onClick={() => openWork(work.slug)}
                                className="transition-all font-EBGaramondItalic text-center    hover:font-EBGaramond text-base justify-center text-blue-600 hover:text-blue-600 w-full"
                              >
                                {work.title.rendered}
                              </Button>
                              <HDivider color="border-blue-600 w-full" />
                            </div>
                          )}
                        />
                      </div>
                    )}
                    <Button
                      variant="link"
                      size="linkSizeMd"
                      onClick={handleOpenWorksFilter}
                      className={`font-EBGaramond pt-0.5 gap-x-2 w-full   
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
                      <div className="pl-0 overflow-y-scroll w-full">
                        <HDivider />
                        <div className="flex flex-col items-center justify-center ">
                          <span className=" flex items-baseline justify-center w-full    ">
                            <h3 className="font-EBGaramond text-lg whitespace-nowrap">
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
                                className="font-EBGaramond  text-lg pt-0.5  "
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
                              <span className="flex items-baseline justify-center   ">
                                <h3 className="font-EBGaramond text-lg whitespace-nowrap">
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
                                    className="font-EBGaramond  text-lg pt-0.5  "
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

                          <span className="flex items-baseline justify-center   ">
                            <h3 className="font-EBGaramond text-lg whitespace-nowrap">
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
                                className="font-EBGaramond text-lg pt-0.5 "
                              >
                                <SelectValue placeholder="All works" />
                              </SelectTrigger>

                              <SelectContent position="popper">
                                <SelectItem value="all">all works</SelectItem>
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
                          <span className=" flex items-baseline justify-center w-full  pt-2 pb-1 ">
                            <Button
                              variant="link"
                              size="linkSize"
                              className="font-EBGaramond text-lg  "
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
            <div className="flex flex-col pt-1 snap-start snap-stop-always w-full  ">
              <span className="flex items-center justify-center gap-x-1    ">
                <Button
                  asChild
                  className="font-gintoBlack text-base mb-1 pt-1 "
                  size="linkSize"
                  variant="link"
                >
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
                      variant="link"
                      size="linkSizeMd"
                      onClick={handleOpenAllExhibitionsList}
                      className={`font-EBGaramond   }`}
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
                        className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out w-full flex flex-col items-center justify-center  ${
                          showAllExhibitionsList ? "max-h-[200vh]" : "hidden"
                        }`}
                      >
                        <Staggered
                          items={exhibitionIndex}
                          className="flex flex-col justify-center items-stretch   space-y-0  mx-auto w-full "
                          renderItem={(ex) => {
                            const slug = findExhibitionSlug(ex.title.rendered);
                            return (
                              <>
                                {slug ? (
                                  <Button
                                    variant="link"
                                    size="linkSize"
                                    key={`ex-${ex.id}`}
                                    onClick={() => openExhibition(slug)}
                                    className="text-base break-inside-avoid font-EBGaramondItalic text-blue-600 text-center w-full hover:font-EBGaramond leading-relaxed  pt-1 pb-0.5 transition-all cursor-pointer hover:text-blue-600 "
                                  >
                                    {ex.title.rendered}
                                  </Button>
                                ) : (
                                  <span
                                    key={`list-${ex.id}`}
                                    className="block text-center font-EBGaramondItalic pt-1 pb-0.5 text-foreground/80 w-full"
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
                    <Button
                      variant="link"
                      size="linkSize"
                      onClick={handleOpenExhibitionsFilter}
                      className={`font-EBGaramond text-lg   pt-2      `}
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
                      <div className=" pt-2">
                        <HDivider />
                        <div className="flex flex-col items-center justify-center  ">
                          {/* Sort by */}
                          <span className="flex items-baseline justify-center w-full  ">
                            <h3 className="font-EBGaramond text-lg whitespace-nowrap">
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
                                className="font-EBGaramond text-lg pt-0.5 "
                              >
                                <SelectValue placeholder="Sort exhibitions" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="year">year</SelectItem>
                                <SelectItem value="title">
                                  title (a-ö)
                                </SelectItem>
                                <SelectItem value="type">solo/group</SelectItem>
                              </SelectContent>
                            </Select>
                          </span>
                          <HDivider />
                          {exhibitionSort === "year" && (
                            <>
                              <span className=" flex items-baseline justify-center   ">
                                <h3 className="font-EBGaramond text-lg whitespace-nowrap">
                                  Show
                                </h3>
                                <Select
                                  value={exSelectedYear}
                                  onValueChange={exSetSelectedYear}
                                >
                                  <SelectTrigger
                                    size="default"
                                    className="font-gintoMedium  text-lg pt-0.5 "
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
                              <HDivider />
                            </>
                          )}

                          {/* Filter by Type */}
                          <span className=" flex  items-baseline justify-center  ">
                            <h3 className="font-EBGaramond text-lg whitespace-nowrap">
                              Show
                            </h3>
                            <Select
                              value={selectedType}
                              onValueChange={setSelectedType}
                            >
                              <SelectTrigger
                                size="default"
                                className="font-EBGaramond  text-lg pt-0.5  "
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
            </div>
            <div className="flex flex-col pt-1 snap-start snap-stop-always w-full  ">
              {/* CONTACT */}
              <span className=" snap-start snap-stop-always  pt-0.5 flex items-center justify-center gap-x-2  ">
                <Button
                  variant="link"
                  size="linkSize"
                  className="font-gintoBlack text-base "
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
                  <div className="flex flex-col py-2      ">
                    <Button
                      variant="link"
                      size="linkSize"
                      className="font-EBGaramond text-lg  "
                      asChild
                    >
                      <Link href="mailto:elinor.silow@gmail.com">E-mail</Link>
                    </Button>
                    <HDivider />
                    <Button
                      variant="link"
                      size="linkSize"
                      className="font-EBGaramond text-lg pt-2 "
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
            </div>
            {/* INFO */}
            <div className="pt-1 flex flex-col gap-y-0 snap-start snap-stop-always w-full justify-center items-center ">
              <Button
                variant="link"
                size="linkSize"
                onClick={() => {
                  goToView("info");
                  handleOpen();
                }}
                className="font-gintoBlack text-base text-center "
              >
                Information
              </Button>
              <HDivider />
              <div className=" pt-0.5 pb-2">
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

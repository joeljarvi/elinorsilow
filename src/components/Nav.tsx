"use client";

import { useState } from "react";
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

type WorkSort = "year-latest" | "year-oldest" | "year" | "title";
type ExhibitionSort = "year" | "title" | "type";
type CategoryFilter = "all" | "painting" | "drawing" | "sculpture" | "textile";

export default function Nav() {
  const [showWorksMenu, setShowWorksMenu] = useState(false);
  const [showExhibitionsMenu, setShowExhibitionsMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [showAllExhibitionsList, setShowAllExhibitionsList] = useState(false);
  const [open, setOpen] = useState(false);
  const [showWorksFilter, setShowWorksFilter] = useState(false);
  const [showExhibitionsFilter, setShowExhibitionsFilter] = useState(false);

  const {
    loading: loadingExhibitions,
    exhibitions,
    exhibitionSort,
    setExhibitionSort,
    exSelectedYear,
    exSetSelectedYear,
    selectedType,
    setSelectedType,
    availableYears,
    setActiveExhibitionSlug,
  } = useExhibitions();

  const {
    loading: loadingWorks,
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
    setActiveWorkSlug,
  } = useWorks();
  const router = useRouter();
  const { setView } = useNav();

  const openWork = (slug: string) => {
    setActiveWorkSlug(slug);
    setOpen(false);
  };

  const openExhibition = (slug: string) => {
    setActiveExhibitionSlug(slug);
    setOpen(false);
  };

  const navLoading = loadingWorks || loadingExhibitions;

  return (
    <>
      {/* NAV BUTTON MOBILE */}
      <button
        className=" fixed lg:hidden left-1/2 -translate-x-1/2 bottom-0 right-0 z-50 flex items-center justify-center   p-6    "
        onClick={() => setOpen((prev) => !prev)}
      >
        <AnimatePresence mode="wait">
          {navLoading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center  p-3 rounded-md  "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              }}
              style={{
                transformOrigin: "50% 50%",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <Image
                src="/ogubbe_frilagd.png"
                alt="loading"
                width={2124}
                height={2123}
                priority
                className="h-24 w-auto object-contain cursor-pointer pointer-events-auto dark:invert"
              />
            </motion.div>
          ) : (
            <>
              <span className="sr-only">Open menu</span>
              <motion.div
                key="static"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className="  flex items-center justify-end  p-2  "
              >
                <Image
                  src="/elli_trumpetgubbe_frilagd.png"
                  alt="Elinor Silow"
                  width={1713}
                  height={2697}
                  className="h-24 w-auto  object-contain cursor-pointer pointer-events-auto dark:invert"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </button>

      {/* DESKTOP */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="hidden  lg:flex fixed z-40 col-start-1 col-span-1   flex-col overflow-y-scroll    h-screen pt-4 px-4 pb-16 "
      >
        {/* NAV BUTTON MOBILE */}
        <button
          className=" flex items-center justify-center mt-4 mb-4  w-24 h-24 "
          onClick={() => setOpen((prev) => !prev)}
        >
          <AnimatePresence mode="wait">
            {navLoading ? (
              <motion.div
                key="loading"
                className="w-24 h-24 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.3 },
                  rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                }}
                style={{
                  transformOrigin: "50% 50%",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  src="/ogubbe_frilagd.png"
                  alt="loading"
                  width={2124}
                  height={2123}
                  priority
                  className="h-24 w-auto object-contain cursor-pointer pointer-events-auto dark:invert"
                />
              </motion.div>
            ) : (
              <>
                <span className="sr-only">Open menu</span>
                <motion.div
                  key="static"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="ml-4 w-24 h-24 flex items-center justify-start"
                >
                  <Image
                    src="/elli_trumpetgubbe_frilagd.png"
                    alt="Elinor Silow"
                    width={1713}
                    height={2697}
                    className="h-24 w-auto  object-contain cursor-pointer pointer-events-auto dark:invert"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </button>

        {/* BIO */}
        <div className="mt-8 mb-8 space-y-4 max-w-xs">
          <Button
            asChild
            variant="link"
            size="linkSize"
            className="font-gintoBlack  "
          >
            <Link href="/">Elinor Silow</Link>
          </Button>
          <p className="font-EBGaramond ">
            (b. 1993) in Malmö, Sweden, is a Stockholm based artist who explores
            raw emotion through painting, sculpture and textile.
          </p>
          <p className="font-EBGaramond">
            Please contact her at{" "}
            <Button asChild variant="link" size="linkSize">
              <Link
                href="mailto:elinor.silow@gmail.com"
                className="font-gintoMedium text-xs mx-0.5 hover:underline underline-offset-4"
              >
                elinor.silow@gmail.com
              </Link>
            </Button>
            for collaborations and inquires.
          </p>
        </div>

        {/* WORKS */}
        <div className=" flex flex-col  pt-2   ">
          <span className="flex  justify-between w-full  mb-1">
            <Button asChild variant="link" size="linkSize">
              <Link
                href="/"
                onClick={() => {
                  router.push("/?view=works", { scroll: false });
                  setView("works");
                  setOpen(false);
                  setShowWorksMenu(true);
                  setShowExhibitionsMenu(false);
                  setShowExhibitionsFilter(false);
                  setShowAllExhibitionsList(false);
                }}
                className={`font-gintoBlack text-left  `}
              >
                Works
              </Link>
            </Button>
            <Button
              variant="link"
              size="linkIcon"
              onClick={() => {
                setShowWorksMenu((prev) => !prev);
                setShowExhibitionsMenu(false);
                setShowExhibitionsFilter(false);
                setShowAllExhibitionsList(false);
              }}
              className={``}
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
              <div className="flex flex-col pl-4 py-2">
                <Button
                  variant="link"
                  size="linkSize"
                  onClick={() => setShowAllWorksList((prev) => !prev)}
                  className={`font-gintoMedium text-sm  ${
                    showAllWorksList ? "opacity-30" : ""
                  }
    `}
                >
                  Index{" "}
                </Button>
                {showAllWorksList && (
                  <div
                    className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out  ${
                      showAllWorksList ? "max-h-[200vh]" : "hidden"
                    }`}
                  >
                    <Staggered
                      items={allWorks}
                      className="columns-1  pl-4 space-y-0 mb-2  "
                      renderItem={(work) => (
                        <Button
                          variant="link"
                          size="listSize"
                          key={work.slug}
                          onClick={() => openWork(work.slug)}
                          className="break-inside-avoid text-left font-gintoMedium transition-all text-xs cursor-pointer  hover:pl-2"
                        >
                          {work.title.rendered}
                        </Button>
                      )}
                    />
                  </div>
                )}

                <Button
                  variant="link"
                  size="linkSize"
                  onClick={() => setShowWorksFilter((prev) => !prev)}
                  className={`font-gintoMedium text-sm  
    `}
                >
                  Filter
                </Button>

                {showWorksFilter && (
                  <div className="flex flex-col items-start justify-start">
                    <span className="pl-4 flex items-baseline justify-start w-full ">
                      <h3 className="font-gintoMedium text-sm whitespace-nowrap">
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
                          size="sm"
                          className="font-gintoBlack w-full"
                        >
                          <SelectValue placeholder="Sort works" />
                        </SelectTrigger>

                        <SelectContent position="popper">
                          <SelectItem value="year-latest">
                            year (latest)
                          </SelectItem>
                          <SelectItem value="year-oldest">
                            year (oldest)
                          </SelectItem>
                          <SelectItem value="year">year (specific)</SelectItem>
                          <SelectItem value="title">title (a–ö)</SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                    {workSort === "year" && (
                      <span className="pl-4 flex items-baseline justify-start w-full ">
                        <h3 className="font-gintoMedium text-sm whitespace-nowrap">
                          Year
                        </h3>

                        <Select
                          value={selectedYear?.toString()}
                          onValueChange={(v) => setSelectedYear(Number(v))}
                        >
                          <SelectTrigger
                            size="sm"
                            className="font-gintoBlack w-full"
                          >
                            <SelectValue placeholder="2024" />
                          </SelectTrigger>

                          <SelectContent position="popper">
                            {availibleYears.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </span>
                    )}

                    <span className="pl-4 flex items-baseline justify-start w-full ">
                      <h3 className="font-gintoMedium text-sm whitespace-nowrap">
                        Show
                      </h3>

                      <Select
                        value={categoryFilter}
                        onValueChange={(v) =>
                          setCategoryFilter(v as CategoryFilter)
                        }
                      >
                        <SelectTrigger
                          size="sm"
                          className="font-gintoBlack w-full"
                        >
                          <SelectValue placeholder="All works" />
                        </SelectTrigger>

                        <SelectContent position="popper">
                          <SelectItem value="all">all works</SelectItem>
                          <SelectItem value="painting">paintings</SelectItem>
                          <SelectItem value="drawing">drawings</SelectItem>
                          <SelectItem value="sculpture">sculpture</SelectItem>
                          <SelectItem value="textile">textiles</SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                    <span className="pl-4 flex items-baseline justify-start w-full ">
                      <Button
                        variant="link"
                        size="linkSize"
                        className="font-gintoMedium text-sm "
                        onClick={() => setShowInfo((prev) => !prev)}
                      >
                        {showInfo ? "Hide description" : "Show description"}
                      </Button>
                    </span>
                  </div>
                )}
              </div>
              <HDivider />
            </>
          )}
        </div>

        {/* EXHIBITIONS */}
        <div className="flex flex-col pt-2  ">
          <span className="flex items-center justify-between w-full gap-x-1 mb-1">
            <Button asChild variant="link" size="linkSize">
              <Link
                href="/"
                onClick={() => {
                  router.push("/?view=exhibitions", { scroll: false });
                  setView("exhibitions");
                  setOpen(false);
                  setShowExhibitionsMenu(true);
                  setShowWorksMenu(false);
                  setShowWorksFilter(false);
                  setShowAllWorksList(false);
                }}
                className={`font-gintoBlack  text-left `}
              >
                Exhibitions
              </Link>
            </Button>
            <Button
              variant="link"
              size="linkIcon"
              onClick={() => {
                setShowExhibitionsMenu((prev) => !prev);
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
              <div className="flex flex-col py-2 px-4   ">
                {/* Index button */}
                <Button
                  variant="link"
                  size="linkSize"
                  onClick={() => setShowAllExhibitionsList((prev) => !prev)}
                  className={`font-gintoMedium text-sm  ${
                    showAllExhibitionsList ? "opacity-30" : ""
                  }`}
                >
                  Index
                </Button>
                {showAllExhibitionsList && (
                  <div
                    className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      showAllExhibitionsList ? "max-h-[200vh]" : "hidden"
                    }`}
                  >
                    <Staggered
                      items={exhibitions}
                      className="columns-1  pl-4 space-y-0 mb-2  "
                      renderItem={(ex) => (
                        <Button
                          variant="link"
                          size="listSize"
                          key={ex.slug}
                          onClick={() => openExhibition(ex.slug)}
                          className="break-inside-avoid text-left font-gintoMedium transition-all text-xs cursor-pointer  hover:pl-2"
                        >
                          {ex.title.rendered}
                        </Button>
                      )}
                    />
                  </div>
                )}

                {/* Filter / Sort */}
                <Button
                  variant="link"
                  size="linkSize"
                  onClick={() => setShowExhibitionsFilter((prev) => !prev)}
                  className={`font-gintoMedium text-sm `}
                >
                  Filter
                </Button>
                {showExhibitionsFilter && (
                  <div className="flex flex-col items-start justify-start  ">
                    {/* Sort by */}
                    <span className="pl-4 flex items-baseline justify-start w-full ">
                      <h3 className="font-gintoMedium text-sm whitespace-nowrap">
                        Sort by
                      </h3>
                      <Select
                        value={exhibitionSort}
                        onValueChange={(v) =>
                          setExhibitionSort(v as ExhibitionSort)
                        }
                      >
                        <SelectTrigger
                          size="sm"
                          className="font-gintoBlack w-full"
                        >
                          <SelectValue placeholder="Sort exhibitions" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="year">year</SelectItem>
                          <SelectItem value="title">title (a-ö)</SelectItem>
                          <SelectItem value="type">
                            exhibiton type (solo/group)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                    {exhibitionSort === "year" && (
                      <span className="pl-4 flex items-baseline justify-start w-full ">
                        <h3 className="font-gintoMedium text-sm whitespace-nowrap">
                          Show
                        </h3>
                        <Select
                          value={exSelectedYear}
                          onValueChange={exSetSelectedYear}
                        >
                          <SelectTrigger
                            size="sm"
                            className="font-gintoBlack w-full"
                          >
                            <SelectValue placeholder="Filter by year" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="all">all years</SelectItem>
                            {availableYears.map((y) => (
                              <SelectItem key={y} value={y}>
                                {y}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </span>
                    )}

                    {/* Filter by Type */}
                    <span className="pl-4 flex items-baseline justify-start w-full ">
                      <h3 className="font-gintoMedium text-sm whitespace-nowrap">
                        Show
                      </h3>
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger
                          size="sm"
                          className="font-gintoBlack w-full"
                        >
                          <SelectValue placeholder="all exhibitions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">all exhibitions</SelectItem>
                          <SelectItem value="Solo">solo exhibitions</SelectItem>
                          <SelectItem value="Group">
                            group exhibitions
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </span>
                  </div>
                )}
              </div>
              <HDivider />
            </>
          )}

          {/* CONTACT */}
          <span className="  pt-2 flex items-center justify-between w-full mb-1">
            <Button
              variant="link"
              size="linkSize"
              className="font-gintoBlack"
              asChild
              onClick={() => setShowContact((prev) => !prev)}
            >
              <Link href="mailto:elinor.silow@gmail.com">Contact</Link>
            </Button>
            <Button
              variant="link"
              size="linkIcon"
              onClick={() => {
                setShowContact((prev) => !prev);
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
              <div className="flex flex-col py-2 px-4    ">
                <Button
                  variant="link"
                  size="linkSize"
                  className="font-gintoMedium text-sm  "
                  asChild
                >
                  <Link href="mailto:elinor.silow@gmail.com">E-mail</Link>
                </Button>

                <Button
                  variant="link"
                  size="linkSize"
                  className="font-gintoMedium text-sm"
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
          <div className="pt-2 flex flex-col gap-y-0 ">
            <Button
              variant="link"
              size="linkSize"
              onClick={() => {
                setView("info");
                setOpen(false);
                setShowWorksMenu(false);
                setShowExhibitionsMenu(false);
                setShowExhibitionsFilter(false);
                setShowAllExhibitionsList(false);
                setShowWorksFilter(false);
                setShowAllWorksList(false);
              }}
              className="font-gintoBlack text-left"
            >
              Information
            </Button>
            <DarkModeToggle />
          </div>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY */}
      <motion.div
        className={`fixed inset-0 z-40 lg:hidden bg-background  overflow-y-auto transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex lg:hidden relative lg:fixed col-start-1 col-span-1   flex-col gap-x-4 overflow-y-scroll pt-24  h-screen pb-16 "
        >
          <div className="mb-6 max-w-sm ">
            <Button
              asChild
              variant="nav"
              size="linkSizeMd"
              className="font-gintoNordBlack text-xl uppercase whitespace-normal px-6   "
            >
              <Link href="/">Elinor Silow</Link>
            </Button>
            <div className="px-8  mb-4 text-lg leading-snug">
              <p className="font-EBGaramond mt-3 mb-4  ">
                (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                explores raw emotion through painting, sculpture and textile.
              </p>
              <p className="font-EBGaramond  ">
                For inquiries, please contact:{" "}
                <Button asChild variant="link" size="linkSize">
                  <Link
                    href="mailto:elinor.silow@gmail.com"
                    className="font-gintoMedium text-sm mx-0.5 hover:underline underline-offset-4"
                  >
                    elinor.silow@gmail.com
                  </Link>
                </Button>
                for collaborations and inquires.
              </p>
            </div>
          </div>

          {/* WORKS */}
          <div className=" flex flex-col  pt-2 px-4  ">
            <span className="flex items-center justify-between w-full pr-1  ">
              <Button
                asChild
                variant="nav"
                size="linkSizeMd"
                className="font-gintoBlack"
              >
                <Link
                  href="/"
                  onClick={() => {
                    router.push("/?view=works", { scroll: false });
                    setView("works");
                    setOpen(false);
                    setShowWorksMenu(true);
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
                  setShowWorksMenu((prev) => !prev);
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
                <div className="flex flex-col  gap-0">
                  <Button
                    variant="nav"
                    size="linkSizeMd"
                    onClick={() => {
                      setShowAllWorksList((prev) => !prev);
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
                        className="columns-1   space-y-0 border-l border-foreground pt-1  "
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
                    onClick={() => setShowWorksFilter((prev) => !prev)}
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
                    <div className="pl-6">
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
                              <SelectItem value="title">title (a–ö)</SelectItem>
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
                        <span className=" flex items-baseline justify-start w-full ">
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
          <div className="flex flex-col pt-1 px-4  ">
            <span className="flex items-center justify-between w-full gap-x-1 pr-1 ">
              <Button asChild variant="nav" size="linkSizeMd">
                <Link
                  href="/"
                  onClick={() => {
                    router.push("/?view=exhibitions", { scroll: false });
                    setView("exhibitions");
                    setOpen(false);
                    setShowExhibitionsMenu(true);
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
                  setShowExhibitionsMenu((prev) => !prev);
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
                <div className="flex flex-col     ">
                  {/* Index button */}
                  <Button
                    variant="nav"
                    size="linkSizeMd"
                    onClick={() => setShowAllExhibitionsList((prev) => !prev)}
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
                        showAllExhibitionsList ? "max-h-[200vh]" : "hidden"
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
                    onClick={() => setShowExhibitionsFilter((prev) => !prev)}
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
                              <SelectItem value="title">title (a-ö)</SelectItem>
                              <SelectItem value="type">
                                exhibiton type (solo/group)
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
                                  <SelectItem value="all">all years</SelectItem>
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
                onClick={() => setShowContact((prev) => !prev)}
              >
                <Link href="mailto:elinor.silow@gmail.com">Contact</Link>
              </Button>
              <Button
                variant="nav"
                size="linkIcon"
                onClick={() => {
                  setShowContact((prev) => !prev);
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
                <div className="flex flex-col py-1 px-4    ">
                  <Button
                    variant="nav"
                    size="linkSizeMd"
                    className="font-gintoMedium   "
                    asChild
                  >
                    <Link href="mailto:elinor.silow@gmail.com">E-mail</Link>
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
                  setView("info");
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
        </motion.nav>
      </motion.div>
    </>
  );
}

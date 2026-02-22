"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import HDivider from "./HDivider";
import { useRouter } from "next/navigation";
import { useNav } from "@/context/NavContext";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import Image from "next/image";
import { sortAZ } from "@/lib/sort-az";

import Staggered from "./Staggered";
import { DarkModeToggle } from "./DarkModeToggle";
import WorksFilter from "./WorksFilter";
import StaggeredList from "./StaggeredList";
import ExFilter from "./ExFilter";
import NavSearch from "./NavSearch";
import { Cross1Icon } from "@radix-ui/react-icons";
type WorkSort = "year-latest" | "year-oldest" | "year" | "title";

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

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const lastScroll = useRef(0);
  const [navOffset, setNavOffset] = useState(0);
  const navHeight = 145; // height of your nav in px

  const {
    allWorks,

    applyFilters: applyWorksFilters,
    clearFilters: clearWorksFilters,
    isApplyingFilters: isApplyingWorksFilters,

    setActiveWorkSlug,
    workLoading,
    openWork,
    uniqueYears,
  } = useWorks();

  const {
    exhibitions,

    setActiveExhibitionSlug,
    exLoading,
    openExhibition,

    filteredExhibitions,
  } = useExhibitions();

  const { infoLoading, exhibitionList } = useInfo();
  const [openBio, setOpenBio] = useState(false);
  const {
    setShowWorksMenu,

    setShowExhibitionsMenu,

    setShowContact,

    setShowWorksFilter,

    setShowExhibitionsFilter,
    showInfo,
    setShowInfo,

    setShowSettings,
    open,
    setOpen,
    handleOpen,
  } = useUI();

  const {
    handleOpenWorksMenu,

    handleOpenExhibitionsMenu,
  } = useUI();

  const router = useRouter();

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll.current;

      if (delta > 0 && currentScroll > 50) setScrollDir("down");
      else if (delta < 0) setScrollDir("up");

      // Gradual offset
      if (scrollDir === "down" && !openSearch) {
        setNavOffset((prev) => Math.min(prev + delta, navHeight));
      } else if (scrollDir === "up" || openSearch) {
        setNavOffset((prev) => Math.max(prev - Math.abs(delta), 0));
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDir, openSearch]);
  return (
    <div className="z-50 absolute lg:fixed top-0 left-0 lg:z-0 lg:left-40 lg:top-8   pt-4 px-4 lg:p-0 bg-background w-full flex flex-col items-start justify-start gap-y-4  ">
      {open && (
        <nav className=" max-w-[84vw] lg:max-w-[80vw] flex flex-wrap gap-y-4 lg:gap-y-2 gap-x-0 lg:gap-x-2 no-hide-text  text-3xl lg:text-5xl font-directorLight items-baseline bg-background">
          <Button
            asChild
            onClick={() => setOpenBio(!openBio)}
            variant="link"
            size="linkSizeLg"
          >
            <Link href="/">Elinor Silow</Link>
          </Button>
          ,
          <Button asChild variant="link" size="linkSizeLg" className="ml-2">
            <Link href="/works">Works</Link>
          </Button>
          ,
          <Button asChild variant="link" size="linkSizeLg" className="lg:ml-2">
            <Link href="/exhibitions">Exhibitions</Link>
          </Button>
          ,
          <Button asChild variant="link" size="linkSizeLg" className="">
            <Link href="/info">Information</Link>
          </Button>
          ,
          <Button asChild variant="link" size="linkSizeLg" className="ml-2">
            <Link href="/">Contact</Link>
          </Button>
          ,
          <AnimatePresence>
            {openSearch ? (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=""
              >
                <NavSearch />
              </motion.div>
            ) : (
              <Button
                variant="link"
                size="linkSizeLg"
                className="ml-2"
                onClick={() => {
                  setOpenSearch(true);
                  setOpenBio(false);
                }}
              >
                Search
              </Button>
            )}{" "}
          </AnimatePresence>
        </nav>
      )}
      {/* Search nav with layout animation */}

      {/* <AnimatePresence>
        {openBio && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full relative   bg-background z-50 pt-4 px-2  grid grid-cols-3 max-w-6xl items-baseline gap-x-8"
          >
            <Link
              onClick={() => {}}
              className="items-baseline  no-hide-text h3 font-directorLight whitespace-normal col-span-2
   px-0 py
"
              href="/"
            >
              <strong className="font-normal   mr-2">Elinor Silow</strong>
              (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
              explores raw emotion through painting, sculpture and textile.
            </Link>

            <p className="p mt-4  font-directorLight col-start-1 col-span-2 mb-8">
              Please contact
              <Link
                href="mailto:elinor.silow@gmail.com"
                className="text-blue-700 mx-2 font-directorBold"
              >
                hej@elinorsilow.com
              </Link>
              for collaborations and inquires.
            </p>
            <Button
              variant="ghost"
              className=" top-4 right-4 absolute aspect-square h-auto"
              onClick={() => setOpenBio(false)}
            >
              <Cross1Icon />
            </Button>
            <HDivider className="col-span-3" />
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
}

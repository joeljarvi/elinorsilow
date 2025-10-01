"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { InfoBox } from "./InfoBox";
import { Work, Exhibition } from "../../lib/wordpress";

function MenuOverlay({
  open,
  isWorkSlugPage,
  isInfoPage,
}: {
  open: boolean;
  isWorkSlugPage: boolean;
  isInfoPage: boolean;
}) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed ${
        isWorkSlugPage
          ? "top-1/4 bottom-auto"
          : isInfoPage
          ? "top-3 bottom-auto h-1/4"
          : "top-auto bottom-0 h-3/4"
      } right-0 z-50 lg:h-auto lg:relative lg:bottom-auto lg:right-auto flex flex-col lg:flex-row justify-between items-end lg:justify-between lg:items-baseline font-haas text-base px-3 pb-3 overflow-y-auto uppercase text-white lg:text-xs w-auto rounded-xs lg:px-0 lg:pb-0`}
    >
      <Link href="/">Works</Link>
      <Link href="/exhibitions">Exhibitions</Link>
      <Link href="/info">Information</Link>
    </motion.div>
  );
}

interface HeaderProps {
  initialWorks?: Work[];
  currentWorkIndex?: number;
  currentWork?: Work;
  prevWork?: Work | null;
  nextWork?: Work | null;

  initialExhibitions?: Exhibition[];
  currentExhibitionIndex?: number;
  currentExhibition?: Exhibition;
  prevExhibition?: Exhibition | null;
  nextExhibition?: Exhibition | null;

  min?: boolean;
  showInfo?: boolean;
}

export default function Header({
  initialWorks,
  currentWork,
  currentWorkIndex,
  prevWork,
  nextWork,
  initialExhibitions,
  currentExhibition,
  currentExhibitionIndex,
  prevExhibition,
  nextExhibition,
  showInfo = true,
  min = false,
}: HeaderProps) {
  const [open, setIsOpen] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isWorkSlugPage = segments[0] === "works" && !!segments[1];
  const isExhibitionSlugPage = segments[0] === "exhibitions" && !!segments[1];
  const isInfoPage = pathname === "/info";

  const displayedWork =
    currentWorkIndex !== undefined && initialWorks
      ? initialWorks[currentWorkIndex]
      : currentWork;

  const displayedExhibition =
    currentExhibitionIndex !== undefined && initialExhibitions
      ? initialExhibitions[currentExhibitionIndex]
      : currentExhibition;

  const infoData = displayedWork || displayedExhibition;

  return (
    <div className="w-full fixed top-0 left-0 z-40 text-sm mix-blend-difference text-white">
      <div className="flex flex-col w-full p-3">
        {/* Branding */}
        <Link href="/">
          <Button
            variant="link"
            size="sm"
            className="font-haas text-base lg:text-xs"
          >
            ELINOR SILOW
          </Button>
        </Link>

        <div className="flex gap-3 items-baseline w-full">
          {/* Mobile menu toggle */}
          <Button
            variant="link"
            size="sm"
            className="text-base lg:text-xs flex lg:hidden"
            onClick={() => setIsOpen(!open)}
          >
            {open ? "Close Menu" : "Menu"}
          </Button>

          {/* Desktop nav */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:flex justify-between items-baseline font-haas p-3 overflow-y-auto uppercase text-sm lg:text-xs w-full rounded-xs lg:p-0"
          >
            <Link href="/">Works</Link>
            <Link href="/exhibitions">Exhibitions</Link>
            <Link href="/info">Information</Link>
          </motion.nav>

          {/* Mobile menu overlay */}
          <div className="w-full block lg:hidden">
            <AnimatePresence>
              <MenuOverlay
                isInfoPage={isInfoPage}
                isWorkSlugPage={isWorkSlugPage}
                open={open}
              />
            </AnimatePresence>
          </div>

          {/* InfoBox */}
          <div className="fixed bottom-0 left-0 z-20 w-full">
            <AnimatePresence>
              {showInfo && infoData && (
                <InfoBox data={infoData} showInfo={showInfo} min={min} />
              )}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 items-start justify-start lg:items-start lg:justify-start text-base lg:text-xs">
            {isWorkSlugPage && currentWork && (
              <div className="flex gap-3">
                <Link href={`/?work=${currentWork.slug}`}>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-base lg:text-xs"
                  >
                    Back to works
                  </Button>
                </Link>
                {prevWork && (
                  <Link href={`/works/${prevWork.slug}`}>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-base lg:text-xs"
                    >
                      Prev
                    </Button>
                  </Link>
                )}
                {nextWork && (
                  <Link href={`/works/${nextWork.slug}`}>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-base lg:text-xs"
                    >
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {isExhibitionSlugPage && currentExhibition && (
              <div className="flex gap-3 text-sm lg:text-xs">
                <Link href="/exhibitions">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-base lg:text-xs"
                  >
                    Back to exhibitions
                  </Button>
                </Link>
                {prevExhibition && (
                  <Link href={`/exhibitions/${prevExhibition.slug}`}>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-base lg:text-xs"
                    >
                      Prev
                    </Button>
                  </Link>
                )}
                {nextExhibition && (
                  <Link href={`/exhibitions/${nextExhibition.slug}`}>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-base lg:text-xs"
                    >
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

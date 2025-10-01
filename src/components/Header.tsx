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
          ? "bottom-1/4 top-auto h-3/4 pt-3"
          : isInfoPage
          ? "top-0 bottom-auto h-auto pt-3"
          : "top-0 bottom-auto h-3/4 pt-3"
      } right-0 z-50 lg:h-auto lg:relative lg:bottom-auto lg:right-auto flex flex-col lg:flex-row justify-between items-end lg:justify-between lg:items-baseline font-haas text-base px-3  overflow-y-auto uppercase text-white lg:text-xs w-auto rounded-xs lg:px-0 lg:pb-0`}
    >
      <Link href="/info">Information</Link>
      <Link href="/exhibitions">Exhibitions</Link>

      <Link href="/">Works</Link>
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
    <>
      <div className="font-haas uppercase w-full fixed top-0 left-0 z-40 text-sm mix-blend-difference text-white">
        <div className="flex flex-col w-full justify-start items-start p-3">
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

          <div className="flex justify-start items-start gap-3 w-full">
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex justify-between items-baseline font-haas p-3 overflow-y-auto uppercase text-sm lg:text-xs w-auto lg:w-full rounded-xs lg:p-0"
            >
              <Link href="/">Works</Link>
              <Link href="/exhibitions">Exhibitions</Link>
              <Link href="/info">Information</Link>
            </motion.nav>

            {/* Mobile menu overlay */}

            <AnimatePresence>
              <MenuOverlay
                isInfoPage={isInfoPage}
                isWorkSlugPage={isWorkSlugPage}
                open={open}
              />
            </AnimatePresence>

            {/* InfoBox */}

            <AnimatePresence>
              {showInfo && infoData && (
                <InfoBox data={infoData} showInfo={showInfo} min={min} />
              )}
            </AnimatePresence>

            {/* Controls */}

            {isWorkSlugPage && currentWork && (
              <div className="flex gap-0 lg:gap-3 w-full lg:w-auto justify-between lg:justify-start text-base lg:text-xs">
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
              <div className="flex gap-0 lg:gap-3 w-full lg:w-auto justify-between lg:justify-start text-base lg:text-xs">
                <Link href="/exhibitions">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-base lg:text-xs"
                  >
                    Back
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

      <Button
        variant="link"
        size="sm"
        className="fixed bottom-3 right-3 text-base lg:text-xs flex lg:hidden z-40 mix-blend-difference text-white"
        onClick={() => setIsOpen(!open)}
      >
        {open ? "Close Menu" : "Menu"}
      </Button>
    </>
  );
}

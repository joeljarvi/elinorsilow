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
      } right-0 z-50 lg:h-auto lg:relative lg:bottom-auto lg:right-auto flex flex-col lg:flex-row justify-between items-end lg:justify-between lg:items-baseline px-3 overflow-y-auto uppercase text-white w-auto rounded-xs lg:px-0 lg:pb-0 font-hershey text-2xl`}
    >
      <Link
        className="text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5"
        href="/info"
      >
        Information
      </Link>
      <Link
        className="text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5"
        href="/exhibitions"
      >
        Exhibitions
      </Link>
      <Link
        className="text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5"
        href="/"
      >
        Works
      </Link>
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
  setMin?: (min: boolean) => void;
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
  min,
  setMin,
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
      <div className="font-hershey text-2xl uppercase w-full fixed top-0 left-0 z-40  mix-blend-difference text-white">
        <div className="flex flex-col w-full justify-start items-start p-3">
          <Link href="/">
            <Button variant="link" className="">
              ELINOR SILOW
            </Button>
          </Link>

          <div className="flex justify-start items-start gap-3 w-full">
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex justify-between items-baseline p-3 overflow-y-auto uppercase w-auto lg:w-full rounded-xs lg:p-0"
            >
              <Link
                className="text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5"
                href="/"
              >
                Works
              </Link>
              <Link
                className="text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5"
                href="/exhibitions"
              >
                Exhibitions
              </Link>
              <Link
                className="text-2xl lg:text-xl px-1.5 py-0.5 lg:px-3 lg:py-1.5"
                href="/info"
              >
                Information
              </Link>
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
                <InfoBox
                  data={infoData}
                  showInfo={showInfo}
                  min={min}
                  setMin={setMin}
                />
              )}
            </AnimatePresence>

            {/* Controls */}

            {isWorkSlugPage && currentWork && (
              <div className="flex gap-0 lg:gap-3 w-full lg:w-auto justify-between lg:justify-start ">
                <Link href={`/?work=${currentWork.slug}`}>
                  <Button variant="link" className="">
                    Back to works
                  </Button>
                </Link>
                {prevWork && (
                  <Link href={`/works/${prevWork.slug}`}>
                    <Button variant="link" className="">
                      Prev
                    </Button>
                  </Link>
                )}
                {nextWork && (
                  <Link href={`/works/${nextWork.slug}`}>
                    <Button variant="link" className="">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {isExhibitionSlugPage && currentExhibition && (
              <div className="flex gap-0 lg:gap-3 w-full lg:w-auto justify-between lg:justify-start">
                <Link href="/exhibitions">
                  <Button variant="link" className="">
                    Back to exhibitions
                  </Button>
                </Link>

                {prevExhibition && (
                  <Link href={`/exhibitions/${prevExhibition.slug}`}>
                    <Button variant="link" className="">
                      Prev
                    </Button>
                  </Link>
                )}
                {nextExhibition && (
                  <Link href={`/exhibitions/${nextExhibition.slug}`}>
                    <Button variant="link" className="">
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
        className="fixed bottom-3 right-3 flex lg:hidden z-40 mix-blend-difference text-white"
        onClick={() => setIsOpen(!open)}
      >
        {open ? "Close Menu" : "Menu"}
      </Button>
    </>
  );
}

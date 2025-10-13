"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { InfoBox } from "./InfoBox";
import Image from "next/image";
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
        isWorkSlugPage ? "h-full" : isInfoPage ? "h-full" : "h-full"
      } right-0 top-0 z-50 grid grid-rows-4 p-3 overflow-y-auto uppercase text-white w-auto font-hershey text-2xl text-right`}
    >
      <a
        href="mailto:elinor.silow@gmail.com"
        className="row-start-1 text-2xl lg:text-xl"
      >
        Contact
      </a>

      <Link className="row-start-2 text-2xl lg:text-xl" href="/info">
        Information
      </Link>
      <Link className="row-start-3 text-2xl lg:text-xl" href="/exhibitions">
        Exhibitions
      </Link>
      <Link className="row-start-4 text-2xl lg:text-xl" href="/">
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
      <div className="font-hershey text-2xl uppercase w-full fixed top-0 left-0 z-40 mix-blend-difference text-white">
        <div className="flex flex-col w-full justify-start items-start p-3">
          {/* Header Top Row */}
          <div className="flex flex-col lg:flex-row justify-between items-start w-full">
            <Link href="/">
              <Button variant="link">ELINOR SILOW</Button>
            </Link>

            {/* Works Navigation */}
            {isWorkSlugPage && currentWork && (
              <div className="flex gap-6 w-full justify-between lg:justify-end">
                <Link href={`/?work=${currentWork.slug}`}>
                  <Button variant="link">Back to works</Button>
                </Link>
                <div className="flex gap-6">
                  {prevWork && (
                    <Link href={`/works/${prevWork.slug}`}>
                      <Button variant="link">Prev</Button>
                    </Link>
                  )}
                  {nextWork && (
                    <Link href={`/works/${nextWork.slug}`}>
                      <Button variant="link">Next</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Exhibitions Navigation */}
            {isExhibitionSlugPage && currentExhibition && (
              <div className="flex gap-6 w-full justify-between lg:justify-end">
                <Link href="/exhibitions">
                  <Button variant="link">Back to exhibitions</Button>
                </Link>
                <div className="flex gap-6">
                  {prevExhibition && (
                    <Link href={`/exhibitions/${prevExhibition.slug}`}>
                      <Button variant="link">Prev</Button>
                    </Link>
                  )}
                  {nextExhibition && (
                    <Link href={`/exhibitions/${nextExhibition.slug}`}>
                      <Button variant="link">Next</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="flex justify-start items-start gap-3 w-full mt-2">
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden lg:flex justify-between items-baseline uppercase w-auto lg:w-full"
            >
              <Link href="/">
                <Button variant="link">Works</Button>
              </Link>
              <Link href="/exhibitions">
                <Button variant="link">Exhibitions</Button>
              </Link>
              <Link href="/info">
                <Button variant="link">Information</Button>
              </Link>
              <Link href="/info">
                <Button variant="link">Contact</Button>
              </Link>
            </motion.nav>

            <AnimatePresence>
              <MenuOverlay
                isInfoPage={isInfoPage}
                isWorkSlugPage={isWorkSlugPage}
                open={open}
              />
            </AnimatePresence>

            {/* Info Box */}
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
          </div>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
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

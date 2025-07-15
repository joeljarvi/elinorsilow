"use client";

import Link from "next/link";
import React from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimationContext } from "@/context/AnimationContext";

type HeaderProps = {
  openTools: boolean;
  setOpenTools: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  showSettings?: boolean; //
  titleState?: string; //
};

export function Header({
  openTools,
  setOpenTools,
  openMenu,
  setOpenMenu,
  showSettings = true,
  titleState = "home",
}: HeaderProps) {
  const { isIdle, revealStep, startRevealSequence } = useAnimationContext();

  useEffect(() => {
    startRevealSequence();
  }, [startRevealSequence]);

  function handleOpenTools() {
    setOpenTools((prev) => !prev);
    setOpenMenu(false);
  }

  function handleOpenMenu() {
    setOpenMenu((prev) => !prev);
    setOpenTools(false);
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 w-full flex items-center justify-between lg:justify-between p-3 z-30 mix-blend-difference text-white 
"
      >
        <div className="flex justify-start items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={revealStep >= 1 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex justify-start items-center"
          >
            <Link
              href="/"
              className=" font-serif cursor-pointer text-md underline underline-offset-8 hover:opacity-30 transition-opacity pl-3"
            >
              elinorsilow.com/
            </Link>

            <h2 className="font-serif-italic opacity-30 pr-3">{titleState}</h2>
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={revealStep >= 6 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            {showSettings && (
              <button
                onClick={handleOpenTools}
                className={` font-serif cursor-pointer hover:opacity-30 transition-opacity px-3 ${
                  openTools ? "text-white opacity-30" : ""
                }`}
              >
                {openTools ? "close (x)" : "settings"}
              </button>
            )}
          </motion.span>
        </div>

        {/* Mobile: Menu button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealStep >= 6 ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex lg:hidden"
        >
          <button
            onClick={handleOpenMenu}
            className={`font-sans cursor-pointer hover:underline underline-offset-6 text-sm tracking-tighter p-3 ${
              openMenu ? "text-white opacity-30" : ""
            }`}
          >
            {openMenu ? "CLOSE" : "MENU"}
          </button>
        </motion.div>

        <motion.div
          animate={{ opacity: isIdle ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className=" hidden lg:flex "
        >
          <nav>
            <motion.ul
              initial={{ opacity: 0 }}
              animate={revealStep >= 6 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-end gap-6 uppercase px-3"
            >
              <li>
                <Link
                  href="/worksPage"
                  className="font-sans hover:opacity-30 transition-opacity  "
                >
                  works
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans hover:opacity-30 transition-opacity "
                >
                  exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans hover:opacity-30 transition-opacity "
                >
                  information
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans hover:opacity-30 transition-opacity"
                >
                  contact
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans hover:opacity-30 transition-opacity"
                >
                  dark mode
                </Link>
              </li>
            </motion.ul>
          </nav>
        </motion.div>
      </motion.header>

      {/* Mobile menu overlay */}

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // smooth fade
            className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white pt-16 z-20 overflow-hidden"
          >
            <div className="flex flex-col items-start justify-start p-6 rounded-2xl font-sans w-full h-full pointer-events-auto uppercase">
              <ul className="text-3xl">
                <li>
                  <Link
                    href="/worksPage"
                    className="hover:opacity-30 transition-opacity"
                  >
                    works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/worksPage"
                    className="hover:opacity-30 transition-opacity"
                  >
                    exhibitions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/worksPage"
                    className="hover:opacity-30 transition-opacity"
                  >
                    information
                  </Link>
                </li>
                <li>
                  <Link
                    href="/worksPage"
                    className="hover:opacity-30 transition-opacity"
                  >
                    contact
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
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
  const { isIdle } = useAnimationContext();

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
        className="absolute top-0 w-full flex items-baseline justify-between lg:justify-between p-3 z-60
"
      >
        <div className="flex justify-start items-center">
          <span className="flex justify-start items-center">
            <Link
              href="/"
              className=" font-serif cursor-pointer text-md underline underline-offset-8 hover:opacity-30 transition-opacity pl-3"
            >
              elinorsilow.com/
            </Link>

            <h2 className="font-serif-italic opacity-30 pr-3">{titleState}</h2>
          </span>
          {showSettings && (
            <button
              onClick={handleOpenTools}
              className={` font-serif cursor-pointer hover:opacity-30 transition-opacity px-3 ${
                openTools ? "text-black opacity-30" : ""
              }`}
            >
              {openTools ? "close (x)" : "settings"}
            </button>
          )}
        </div>

        {/* Mobile: Menu button */}
        <div className="flex lg:hidden">
          <button
            onClick={handleOpenMenu}
            className={`font-sans cursor-pointer hover:underline underline-offset-6 text-sm tracking-tighter p-3 ${
              openMenu ? "text-black opacity-30" : ""
            }`}
          >
            {openMenu ? "CLOSE" : "MENU"}
          </button>
        </div>

        <motion.div
          animate={{ opacity: isIdle ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className=" hidden lg:flex "
        >
          <nav>
            <ul className="flex items-center justify-end gap-6">
              <li>
                <Link
                  href="/worksPage"
                  className="font-sans text-xl hover:opacity-30 transition-opacity  "
                >
                  works
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans text-xl hover:opacity-30 transition-opacity "
                >
                  exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans text-xl hover:opacity-30 transition-opacity "
                >
                  information
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans text-xl hover:opacity-30 transition-opacity"
                >
                  contact
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="font-sans text-xl hover:opacity-30 transition-opacity"
                >
                  dark mode
                </Link>
              </li>
            </ul>
          </nav>
        </motion.div>
      </motion.header>

      {/* Mobile menu overlay */}
      {openMenu && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full  z-40">
          <div className="flex flex-col items-center justify-center bg-white p-6 rounded-2xl font-sans w-full h-full pointer-events-auto">
            <ul className="text-center text-4xl">
              <li>
                <Link
                  href="/worksPage"
                  className="text-4xl hover:opacity-30 transition-opacity"
                >
                  works
                </Link>
              </li>
              <li>
                <Link
                  href="/worksPage"
                  className="text-4xl hover:opacity-30 transition-opacity"
                >
                  exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/worksPage"
                  className="text-4xl hover:opacity-30 transition-opacity"
                >
                  information
                </Link>
              </li>
              <li>
                <Link
                  href="/worksPage"
                  className="text-4xl hover:opacity-30 transition-opacity"
                >
                  contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

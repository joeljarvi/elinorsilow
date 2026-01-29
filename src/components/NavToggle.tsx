"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useNav } from "@/context/NavContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useWorks } from "@/context/WorksContext";
import { useEffect } from "react";
import Staggered from "./Staggered";
import Link from "next/link";
import { DarkModeToggle } from "./DarkModeToggle";

import { useRouter } from "next/navigation";

interface NavToggleProps {}

export default function NavToggle({}: NavToggleProps) {
  const {
    open,
    setOpen,
    view,
    setView,
    showAllWorksList,
    setShowAllWorksList,
    setActiveWorkSlug,
    setActiveExhibitionSlug,
  } = useNav();
  const router = useRouter();

  const { exhibitions, loading: exhibitionsLoading } = useExhibitions();
  const { allWorks, loading: worksLoading } = useWorks();

  const loading = exhibitionsLoading || worksLoading;

  // Open modal functions
  const openWork = (slug: string) => {
    setActiveWorkSlug(slug);
    setOpen(false); // close nav
  };

  const openExhibition = (slug: string) => {
    setActiveExhibitionSlug(slug);
    setOpen(false); // close nav
  };
  return (
    <div className="fixed bottom-0 top-auto left-auto right-0 lg:left-0 lg:right-auto lg:top-0 lg:bottom-auto z-50 p-4">
      <div className="fixed bottom-0 right-0 lg:top-0 lg:left-0 z-[999] p-4 pointer-events-none">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.3 },
                rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              }}
            >
              <Image
                src="/ogubbe_frilagd.png"
                alt="loading"
                width={2124}
                height={2123}
                priority
                className="h-12 w-auto object-cover dark:invert"
              />
            </motion.div>
          ) : (
            <motion.button
              key="static"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setOpen(!open)}
              className="w-fit"
            >
              <Image
                src="/elli_trumpetgubbe_frilagd.png"
                alt="Elinor Silow"
                width={1713}
                height={2697}
                className="w-12 h-auto object-contain cursor-pointer pointer-events-auto dark:invert"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background p-4 overflow-y-scroll grid grid-cols-6 gap-x-4"
          >
            {/* LEFT COLUMN: WORKS */}
            <div className="col-span-3 lg:col-start-1 lg:col-span-2 flex flex-col">
              <button
                onClick={() => {
                  setView("works");
                  setOpen(false);
                }}
                className={`font-gintoBlack mb-2 mt-0 lg:mt-[25vh] text-left cursor-pointer ${
                  view === "works" ? "opacity-30" : ""
                }`}
              >
                Works
              </button>

              <div
                className={`relative overflow-hidden transition-[max-height] duration-300 ease-in-out  ${
                  showAllWorksList
                    ? "max-h-[200vh]"
                    : "max-h-[75vh] lg:max-h-[25vh]"
                }`}
              >
                <Staggered
                  items={allWorks}
                  className="columns-1 sm:columns-2 gap-x-4 gap-y-1"
                  renderItem={(work) => (
                    <button
                      key={work.slug}
                      onClick={() => openWork(work.slug)}
                      className="block break-inside-avoid text-left font-EBGaramond hover:font-EBGaramondItalic transition-all text-sm cursor-pointer"
                    >
                      {work.title.rendered}
                    </button>
                  )}
                />

                {/* Fade at bottom */}
                {!showAllWorksList && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
                )}
              </div>

              <button
                onClick={() => setShowAllWorksList((prev) => !prev)}
                className="mt-4 w-fit font-EBGaramondItalic hover:font-EBGaramond flex items-center gap-x-1 underline underline-offset-4 cursor-pointer"
              >
                {showAllWorksList ? "Less works" : "More works"}
              </button>
            </div>

            {/* RIGHT COLUMN: EXHIBITIONS */}
            <div className="col-span-3 lg:col-span-2 flex flex-col mt-0 lg:mt-[25vh]">
              <Link
                href="/"
                onClick={() => {
                  router.push("/?view=exhibitions", { scroll: false });
                  setView("exhibitions");
                  setOpen(false);
                }}
                className={`font-gintoBlack mb-2 text-left ${
                  view === "exhibitions" ? "opacity-30" : ""
                }`}
              >
                Exhibitions
              </Link>

              <Staggered
                items={exhibitions}
                className="columns-1 gap-x-4 gap-y-1"
                renderItem={(ex) => (
                  <Link
                    href={`/exhibitions/${ex.slug}`}
                    key={ex.slug}
                    onClick={() => setOpen(false)}
                    className="block break-inside-avoid text-left font-EBGaramond text-sm  hover:font-EBGaramondItalic transition-all"
                  >
                    {ex.acf.title}
                  </Link>
                )}
              />

              <div className="mt-4 flex flex-col lg:hidden">
                <Link href="/" className="font-gintoBlack">
                  Information
                </Link>
                <Link href="/" className="font-gintoBlack">
                  Press
                </Link>
                <Link
                  href="mailto:elinor.silow@gmail.com"
                  className="font-gintoBlack"
                >
                  Contact
                </Link>
                <DarkModeToggle />
              </div>
            </div>

            {/* INFO / CONTACT / DARKMODE */}
            <div className="lg:mt-[25vh] col-span-3 lg:col-span-1 hidden lg:flex flex-col">
              <Link href="/" className="font-gintoBlack">
                Information
              </Link>
              <Link href="/" className="font-gintoBlack">
                Press
              </Link>
            </div>
            <div className="lg:mt-[25vh] col-span-3 lg:col-span-1  flex-col hidden lg:flex">
              <Link
                href="mailto:elinor.silow@gmail.com"
                className="font-gintoBlack"
              >
                Contact
              </Link>
              <DarkModeToggle />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

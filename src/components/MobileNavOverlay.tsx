"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { HideTextToggle } from "./HideTextToggle";
import NavSearch from "./NavSearch";
import WorksFilter from "./WorksFilter";
import ExFilter from "./ExFilter";
import { Work, Exhibition } from "../../lib/sanity";

function Caret({ open }: { open: boolean }) {
  return (
    <motion.span
      animate={{ rotate: open ? 90 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="inline-block text-xl leading-none"
    >
      ›
    </motion.span>
  );
}

export default function MobileNavOverlay() {
  const pathname = usePathname();
  const {
    open,
    setOpen,
    showWorksFilter,
    handleOpenWorksFilter,
    showExhibitionsFilter,
    handleOpenExhibitionsFilter,
    proportionalImages,
    setProportionalImages,
  } = useUI();

  const { filteredWorks, setActiveWorkSlug } = useWorks();
  const { filteredExhibitions, setActiveExhibitionSlug } = useExhibitions();

  const [openSearch, setOpenSearch] = useState(false);
  const [worksExpanded, setWorksExpanded] = useState(false);
  const [exhibitionsExpanded, setExhibitionsExpanded] = useState(false);
  const [worksListOpen, setWorksListOpen] = useState(false);
  const [exListOpen, setExListOpen] = useState(false);
  const [infoExpanded, setInfoExpanded] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) setOpen(false);
    setWorksExpanded(false);
    setExhibitionsExpanded(false);
    setInfoExpanded(false);
  }, [pathname, setOpen]);

  return (
    <>
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav-overlay"
            className="lg:hidden fixed inset-0 z-20 bg-background overflow-y-auto h-screen "
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <nav className="flex flex-col px-2 pt-4 pb-0 text-2xl font-bookish">
              <div className="flex items-center  mb-8 ">
                <Button
                  variant="link"
                  size="lg"
                  className="justify-start w-full"
                  asChild
                >
                  <Link href="/" onClick={() => setOpen(false)}>
                    Elinor Silow
                  </Link>
                </Button>
              </div>

              {/* Works row */}
              <div className="flex items-center border-b border-foreground">
                <Button
                  variant="link"
                  size="lg"
                  className="justify-start flex-1"
                  asChild
                >
                  <Link href="/works" onClick={() => setOpen(false)}>
                    Works
                  </Link>
                </Button>
                <Button
                  variant="link"
                  size="lg"
                  className="px-4"
                  onClick={() => setWorksExpanded((prev) => !prev)}
                  aria-expanded={worksExpanded}
                  aria-label="Toggle Works submenu"
                >
                  <Caret open={worksExpanded} />
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {worksExpanded && (
                  <motion.div
                    key="works-submenu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col pl-0"
                  >
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start"
                      onClick={() => {
                        if (showExhibitionsFilter)
                          handleOpenExhibitionsFilter();
                        handleOpenWorksFilter();
                      }}
                      aria-expanded={showWorksFilter}
                    >
                      Filter
                    </Button>
                    <AnimatePresence initial={false}>
                      {showWorksFilter && (
                        <motion.div
                          key="works-filter"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <WorksFilter />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start"
                      aria-pressed={proportionalImages}
                      onClick={() => {
                        setProportionalImages(!proportionalImages);
                        setOpen(false);
                      }}
                    >
                      {proportionalImages ? "Full width" : "Proportional"}
                    </Button>
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start border-b border-foreground"
                      aria-expanded={worksListOpen}
                      onClick={() => setWorksListOpen((prev) => !prev)}
                    >
                      List
                    </Button>
                    <AnimatePresence initial={false}>
                      {worksListOpen && (
                        <motion.div
                          key="works-list"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col pl-2 py-1">
                            {[...filteredWorks]
                              .sort((a, b) =>
                                a.title.rendered.localeCompare(
                                  b.title.rendered,
                                  "sv",
                                ),
                              )
                              .map((work: Work) => (
                                <Button
                                  key={work.id}
                                  variant="link"
                                  size="lg"
                                  className="justify-start text-xl"
                                  onClick={() => {
                                    setActiveWorkSlug(work.slug);
                                    setOpen(false);
                                    window.history.pushState(
                                      null,
                                      "",
                                      `/works?work=${work.slug}`,
                                    );
                                  }}
                                >
                                  {work.title.rendered}
                                </Button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Exhibitions row */}
              <div className="flex items-center border-b border-foreground">
                <Button
                  variant="link"
                  size="lg"
                  className="justify-start flex-1"
                  asChild
                >
                  <Link href="/exhibitions" onClick={() => setOpen(false)}>
                    Exhibitions
                  </Link>
                </Button>
                <Button
                  variant="link"
                  size="lg"
                  className="px-4"
                  onClick={() => setExhibitionsExpanded((prev) => !prev)}
                  aria-expanded={exhibitionsExpanded}
                  aria-label="Toggle Exhibitions submenu"
                >
                  <Caret open={exhibitionsExpanded} />
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {exhibitionsExpanded && (
                  <motion.div
                    key="exhibitions-submenu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col "
                  >
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start"
                      onClick={() => {
                        if (showWorksFilter) handleOpenWorksFilter();
                        handleOpenExhibitionsFilter();
                      }}
                      aria-expanded={showExhibitionsFilter}
                    >
                      Filter
                    </Button>
                    <AnimatePresence initial={false}>
                      {showExhibitionsFilter && (
                        <motion.div
                          key="exhibitions-filter"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <ExFilter />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start"
                      aria-expanded={exListOpen}
                      onClick={() => setExListOpen((prev) => !prev)}
                    >
                      List
                    </Button>
                    <AnimatePresence initial={false}>
                      {exListOpen && (
                        <motion.div
                          key="exhibitions-list"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col pl-2 py-1">
                            {[...filteredExhibitions]
                              .sort((a, b) =>
                                a.title.rendered.localeCompare(
                                  b.title.rendered,
                                  "sv",
                                ),
                              )
                              .map((ex: Exhibition) => (
                                <Button
                                  key={ex.id}
                                  variant="link"
                                  size="lg"
                                  className="justify-start text-xl"
                                  onClick={() => {
                                    setActiveExhibitionSlug(ex.slug);
                                    setOpen(false);
                                    window.history.pushState(
                                      null,
                                      "",
                                      `/exhibitions?exhibition=${ex.slug}`,
                                    );
                                  }}
                                >
                                  {ex.title.rendered}
                                </Button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info row */}
              <div className="flex items-center border-b border-foreground">
                <Button
                  variant="link"
                  size="lg"
                  className="justify-start flex-1"
                  asChild
                >
                  <Link href="/info" onClick={() => setOpen(false)}>
                    Information
                  </Link>
                </Button>
              </div>

              {/* Contact row with submenu */}
              <div className="flex items-center border-b border-foreground">
                <Button
                  variant="link"
                  size="lg"
                  className="justify-start flex-1"
                  asChild
                >
                  <Link href="/" onClick={() => setOpen(false)}>
                    Contact
                  </Link>
                </Button>
                <Button
                  variant="link"
                  size="lg"
                  className="px-4"
                  onClick={() => setInfoExpanded((prev) => !prev)}
                  aria-expanded={infoExpanded}
                  aria-label="Toggle Contact submenu"
                >
                  <Caret open={infoExpanded} />
                </Button>
              </div>
              <AnimatePresence initial={false}>
                {infoExpanded && (
                  <motion.div
                    key="contact-submenu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden flex flex-col  border-b border-foreground"
                  >
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start"
                      asChild
                    >
                      <a
                        href="https://www.instagram.com/elinorsilow"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                      >
                        Instagram
                      </a>
                    </Button>
                    <Button
                      variant="link"
                      size="lg"
                      className="justify-start"
                      asChild
                    >
                      <a
                        href="mailto:elinor.silow@gmail.com"
                        onClick={() => setOpen(false)}
                      >
                        Email
                      </a>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="link"
                size="lg"
                className="justify-start border-b border-foreground"
                onClick={() => {
                  setOpen(false);
                  setOpenSearch(true);
                }}
              >
                Search
              </Button>
              <HideTextToggle className="justify-start px-4 border-b border-foreground" />
              <DarkModeToggle className="justify-start  px-4" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

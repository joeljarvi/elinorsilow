"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useWorks, CategoryFilter, WorkSort } from "@/context/WorksContext";
import { useExhibitions, ExhibitionSort } from "@/context/ExhibitionsContext";
import { Button } from "./ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { HideTextToggle } from "./HideTextToggle";
import NavSearch from "./NavSearch";
import { Work, Exhibition } from "../../lib/sanity";
import { ChevronDownIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Caret({ open }: { open: boolean }) {
  return (
    <motion.div
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <ChevronDownIcon className="w-3 h-3 text-foreground" />
    </motion.div>
  );
}

const rowClass =
  "justify-start w-full px-6 py-4 font-bookish text-base border-b border-border rounded-none h-auto";

export default function MobileNavOverlay() {
  const pathname = usePathname();
  const { open, setOpen, proportionalImages, setProportionalImages } = useUI();

  const {
    filteredWorks,
    setActiveWorkSlug,
    workSort,
    setWorkSort,
    categoryFilter,
    setCategoryFilter,
  } = useWorks();
  const {
    filteredExhibitions,
    setActiveExhibitionSlug,
    exhibitionSort,
    setExhibitionSort,
    selectedType,
    setSelectedType,
  } = useExhibitions();

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
            className="lg:hidden fixed inset-0 z-[60] bg-background overflow-y-auto h-screen"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <nav className="flex flex-col font-bookish">
              {/* Elinor Silow */}
              <Button
                variant="ghost"
                size="controls"
                className={rowClass}
                asChild
              >
                <Link href="/" onClick={() => setOpen(false)}>
                  Elinor Silow
                </Link>
              </Button>

              {/* Works row */}
              <div className="flex items-center border-b border-border">
                <Button
                  variant="ghost"
                  size="controls"
                  className="justify-start flex-1 px-6 py-4 text-base font-bookish rounded-none h-auto"
                  asChild
                >
                  <Link href="/works" onClick={() => setOpen(false)}>
                    Works
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  className="px-6 py-4 rounded-none h-auto"
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
                    className="overflow-hidden flex flex-col"
                  >
                    <Select
                      value={categoryFilter}
                      onValueChange={(v) =>
                        setCategoryFilter(v as CategoryFilter)
                      }
                    >
                      <SelectTrigger className="w-full rounded-none border-0 border-b border-border shadow-none h-auto font-bookish text-base focus:ring-0 bg-background text-foreground px-6 py-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border rounded-none shadow-none font-bookish">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="drawing">Drawing</SelectItem>
                        <SelectItem value="sculpture">Sculpture</SelectItem>
                        <SelectItem value="textile">Textile</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={workSort}
                      onValueChange={(v) => setWorkSort(v as WorkSort)}
                    >
                      <SelectTrigger className="w-full rounded-none border-0 border-b border-border shadow-none h-auto font-bookish text-base focus:ring-0 bg-background text-foreground px-6 py-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border rounded-none shadow-none font-bookish">
                        <SelectItem value="year-latest">
                          Year — latest
                        </SelectItem>
                        <SelectItem value="year-oldest">
                          Year — oldest
                        </SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="controls"
                      className={rowClass}
                      aria-pressed={proportionalImages}
                      onClick={() => {
                        setProportionalImages(!proportionalImages);
                        setOpen(false);
                      }}
                    >
                      {proportionalImages ? "Full width" : "Proportional"}
                    </Button>
                    <HideTextToggle
                      variant="ghost"
                      className={rowClass}
                    />
                    <Button
                      variant="ghost"
                      size="controls"
                      className={rowClass}
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
                          <div className="flex flex-col">
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
                                  variant="ghost"
                                  size="controls"
                                  className="justify-start px-8 py-4 text-base font-bookish border-b border-border rounded-none h-auto"
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
              <div className="flex items-center border-b border-border">
                <Button
                  variant="ghost"
                  size="controls"
                  className="justify-start flex-1 px-6 py-4 text-base font-bookish rounded-none h-auto"
                  asChild
                >
                  <Link href="/exhibitions" onClick={() => setOpen(false)}>
                    Exhibitions
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  className="px-6 py-4 rounded-none h-auto"
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
                    className="overflow-hidden flex flex-col"
                  >
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger className="w-full rounded-none border-0 border-b border-border shadow-none h-auto font-bookish text-base focus:ring-0 bg-background text-foreground px-6 py-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border rounded-none shadow-none font-bookish">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Solo">Solo Exhibitions</SelectItem>
                        <SelectItem value="Group">Group Exhibitions</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={exhibitionSort}
                      onValueChange={(v) =>
                        setExhibitionSort(v as ExhibitionSort)
                      }
                    >
                      <SelectTrigger className="w-full rounded-none border-0 border-b border-border shadow-none h-auto font-bookish text-base focus:ring-0 bg-background text-foreground px-6 py-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border rounded-none shadow-none font-bookish">
                        <SelectItem value="year">Year</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="controls"
                      className={rowClass}
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
                          <div className="flex flex-col">
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
                                  variant="ghost"
                                  size="controls"
                                  className="justify-start px-8 py-4 text-base font-bookish border-b border-border rounded-none h-auto"
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

              {/* Information row */}
              <Button
                variant="ghost"
                size="controls"
                className={rowClass}
                asChild
              >
                <Link href="/info" onClick={() => setOpen(false)}>
                  Information
                </Link>
              </Button>

              {/* Contact row */}
              <div className="flex items-center border-b border-border">
                <Button
                  variant="ghost"
                  size="controls"
                  className="justify-start flex-1 px-6 py-4 text-base font-bookish rounded-none h-auto"
                  asChild
                >
                  <Link href="/" onClick={() => setOpen(false)}>
                    Contact
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  className="px-6 py-4 rounded-none h-auto"
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
                    className="overflow-hidden flex flex-col"
                  >
                    <Button
                      variant="ghost"
                      size="controls"
                      className="justify-start px-8 py-4 text-base font-bookish border-b border-border rounded-none h-auto"
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
                      variant="ghost"
                      size="controls"
                      className="justify-start px-8 py-4 text-base font-bookish border-b border-border rounded-none h-auto"
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

              {/* Search */}
              <Button
                variant="ghost"
                size="controls"
                className={rowClass}
                onClick={() => {
                  setOpen(false);
                  setOpenSearch(true);
                }}
              >
                Search
              </Button>

              <HideTextToggle
                variant="ghost"
                className={rowClass}
              />
              <DarkModeToggle
                size="default"
                className={rowClass}
              />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

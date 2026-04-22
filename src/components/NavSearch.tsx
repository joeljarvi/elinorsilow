"use client";

import { useEffect, useRef } from "react";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { buildSearchIndex } from "@/lib/searchIndex";
import { useSiteSearch } from "@/lib/useSiteSearch";
import { Button } from "@/components/ui/button";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import WigglyButton from "./WigglyButton";
import { OGubbeText } from "./OGubbeText";

export default function NavSearch({
  open,
  onClose,
  inline = false,
  filterType,
}: {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
  filterType?: "work" | "exhibition";
}) {
  const { allWorks, setActiveWorkSlug, setOpen: setWorkModalOpen } = useWorks();
  const {
    exhibitions,
    setActiveExhibitionSlug,
    setOpen: setExModalOpen,
  } = useExhibitions();

  const index = buildSearchIndex({ works: allWorks, exhibitions });
  const { query, setQuery, results: allResults } = useSiteSearch(index);
  const results = filterType
    ? allResults.filter((r) => r.type === filterType)
    : allResults;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inline) {
      if (open) {
        inputRef.current?.focus();
      } else {
        setQuery("");
      }
    } else {
      inputRef.current?.focus();
      if (!open) setQuery("");
    }
  }, [open, setQuery, inline]);

  useEffect(() => {
    if (!inline) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) onClose();
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, onClose, inline]);

  const handleResultClick = (item: (typeof results)[0]) => {
    if (item.type === "work") {
      setActiveWorkSlug(item.slug);
      setWorkModalOpen(false);
    } else {
      setActiveExhibitionSlug(item.slug);
      setExModalOpen(false);
    }
    setQuery("");
    if (!inline) onClose();
  };

  if (inline) {
    return (
      <div className="relative flex items-start self-start lg:pt-[32px] lg:px-[9px] w-full bg-blue-500">
        <div className="flex items-center w-full">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search"
            className="outline-none bg-transparent font-timesNewRoman font-bold text-[16px] tracking-wide px-[12px] py-[0px] flex-1 placeholder:text-muted-foreground"
          />
          {query && (
            <button
              className="no-hide-text cursor-pointer shrink-0 px-[12px]"
              onClick={() => setQuery("")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed  inset-0 z-[125] lg:z-[50]   flex flex-col bg-background lg:bg-background p-[32px] lg:pt-[9px] lg:px-[9px]  "
        >
          {/* Search input row */}

          <div className="px-[18px] flex items-center border-b border-border shrink-0 border bg-background  border-x-transparent border-t-transparent lg:rounded-none">
            <MagnifyingGlassIcon className="mr-2 text-muted-foreground shrink-0 w-[16px] h-[16px]   " />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 outline-none bg-transparent text-[16px]  font-timesNewRoman font-normal py-[9px] lg:py-[18px] tracking-wide px-[9px]"
            />
            <button
              className=" no-hide-text cursor-pointer p-[6px] text-muted-foreground hover:opacity-70 transition-opacity "
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close info"
            >
              <Cross1Icon className="w-[16px] h-[16px]  " />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto pt-[9px] lg:pt-[9px]">
            {query && results.length > 0 ? (
              <div className="flex flex-col">
                {results.slice(0, 20).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleResultClick(item)}
                    className="no-hide-text flex items-baseline gap-x-[9px] px-[18px] py-[9px] text-left  "
                  >
                    <span className="font-timesNewRoman font-normal text-[16px]  text-muted-foreground whitespace-nowrap  shrink-0 px-[9px]">
                      {item.type}
                    </span>
                    <OGubbeText
                      text={item.title}
                      className="font-timesNewRoman font-normal text-[16px]  "
                      revealAnimation={false}
                      lettersOnly
                      wrap
                    />
                  </button>
                ))}
              </div>
            ) : query && results.length === 0 ? (
              <div className="px-[18px] py-[24px] font-timesNewRoman text-[16px]  text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </div>
            ) : null}
          </div>

          {/* Mobile close button */}
          <div className="absolute bottom-0 left-0 right-0 lg:hidden  flex justify-center pb-[9px] shrink-0">
            <WigglyButton
              text="close"
              size="text-[16px]"
              bold={true}
              onClick={onClose}
              active={open}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

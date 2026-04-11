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

export default function NavSearch({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { allWorks, setActiveWorkSlug, setOpen: setWorkModalOpen } = useWorks();
  const {
    exhibitions,
    setActiveExhibitionSlug,
    setOpen: setExModalOpen,
  } = useExhibitions();

  const index = buildSearchIndex({ works: allWorks, exhibitions });
  const { query, setQuery, results } = useSiteSearch(index);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [open, setQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleResultClick = (item: (typeof results)[0]) => {
    if (item.type === "work") {
      setActiveWorkSlug(item.slug);
      setWorkModalOpen(false);
    } else {
      setActiveExhibitionSlug(item.slug);
      setExModalOpen(false);
    }
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-background flex flex-col lg:inset-auto lg:top-0 lg:left-0 lg:right-0 lg:bottom-auto"
        >
          <div className=" px-[18px] flex items-center ">
            <MagnifyingGlassIcon className="mx-2 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 outline-none bg-transparent text-24 lg:text-[32px]  font-timesNewRoman font-normal py-[18px] tracking-wide px-[18px]"
            />
            <Button
              variant="ghost"
              size="controlsIcon"
              onClick={onClose}
              aria-label="Close search"
            >
              <Cross1Icon />
            </Button>
          </div>

          {query && results.length > 0 && (
            <div className="flex flex-col">
              {results.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  className="flex flex-row items-baseline  w-full text-left hover:bg-foreground/10 transition-colors"
                  onClick={() => handleResultClick(item)}
                >
                  <span className=" text-muted-foreground font-timesNewRoman whitespace-nowrap tracking-wide py-[18px] px-[18px] ">
                    {item.type === "work" ? "work" : "exhibition"}
                  </span>
                  <span className=" font-timesNewRoman tracking-wide  text-[24px] py-[18px] px-[18px]">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Mobile close button — bottom center */}
          <div className="lg:hidden mt-auto flex justify-center pb-[18px]">
            <WigglyButton text="close" onClick={onClose} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

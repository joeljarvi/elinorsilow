"use client";

import { useEffect, useRef } from "react";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { buildSearchIndex } from "@/lib/searchIndex";
import { useSiteSearch } from "@/lib/useSiteSearch";
import { Button } from "@/components/ui/button";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";

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
          className="fixed inset-0 z-50 bg-background flex flex-col pt-8 px-8 lg:inset-auto lg:top-0 lg:left-0 lg:right-0 lg:bottom-auto"
        >
          <div className="flex items-baseline border-b-[0.5px] border-border pb-2 gap-x-4">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 outline-none bg-transparent text-2xl font-bookish"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="text-foreground"
            >
              <Cross1Icon className="size-4" />
            </button>
          </div>

          {query && results.length > 0 && (
            <div className="flex flex-col mt-0">
              {results.slice(0, 8).map((item) => (
                <Button
                  variant="ghost"
                  size="lg"
                  key={item.id}
                  className="w-full text-left justify-start font-bookish hover:bg-foreground/10"
                  onClick={() => handleResultClick(item)}
                >
                  <span className="opacity-50 mr-4 text-xs font-bookish  tracking-wider">
                    {item.type === "work" ? "Work" : "Exhibition"}
                  </span>
                  {item.title}
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

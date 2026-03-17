"use client";

import { useEffect, useRef } from "react";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { buildSearchIndex } from "@/lib/searchIndex";
import { useSiteSearch } from "@/lib/useSiteSearch";
import { Button } from "@/components/ui/button";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
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
          className="fixed inset-0 z-50 bg-background flex flex-col lg:inset-auto lg:top-0 lg:left-0 lg:right-0 lg:bottom-auto"
        >
          <div className="flex items-center shadow-[var(--shadow-nav)] [&>*+*]:border-l [&>*+*]:border-foreground/8">
            <MagnifyingGlassIcon className="mx-2 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 outline-none bg-transparent text-sm font-bookish py-1.5 px-2"
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
            <div className="flex flex-col shadow-[var(--shadow-md)]">
              {results.slice(0, 8).map((item) => (
                <Button
                  variant="ghost"
                  size="controls"
                  key={item.id}
                  className="w-full justify-start shadow-[0_1px_0_0_rgb(0_0_0/0.05)] dark:shadow-[0_1px_0_0_rgb(255_255_255/0.05)]"
                  onClick={() => handleResultClick(item)}
                >
                  <span className="opacity-50 text-xs tracking-wider">
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

"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CaretDownIcon, CaretUpIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useDebounce } from "../../lib/useDebounce";

type FilterProps = {
  type: "works" | "exhibitions"; // context selector
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function Filter({ type, isOpen, setIsOpen }: FilterProps) {
  const [min, setMin] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Context
  const {
    selectedYear: workYear,
    setSelectedYear: setWorkYear,
    selectedCategory,
    setSelectedCategory,
    selectedExhibition,
    setSelectedExhibition,
    works,
    filteredWorks,
    searchQuery,
    setSearchQuery,
  } = useWorks();

  const {
    selectedYear: exhibitionYear,
    setSelectedYear: setExhibitionYear,
    selectedType,
    setSelectedType,
    exhibitions,
  } = useExhibitions();

  // Add this near the top of the Filter component

  // Debounced value
  // Inside Filter component
  const debouncedSearch = useDebounce(searchQuery, 700);

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch.trim() === "") params.delete("search");
    else params.set("search", debouncedSearch);

    // Use replace to avoid adding to history and losing focus
    router.replace(
      type === "works"
        ? `/?${params.toString()}`
        : `/exhibitions?${params.toString()}`,
      { scroll: false } // 👈 prevent scroll jump
    );
  }, [debouncedSearch]);

  // Shared yearSelected for both the map and the Clear All button
  const yearSelected = type === "works" ? workYear : exhibitionYear;

  // Derived filter data
  const years = React.useMemo(() => {
    if (type === "works" && works) {
      const yearSet = new Set<string>();
      works.forEach((w) => {
        if (w.acf?.year) yearSet.add(w.acf.year.toString());
      });
      return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
    }
    if (type === "exhibitions" && exhibitions) {
      const yearSet = new Set<string>();
      exhibitions.forEach((e) => {
        const y = e.acf.start_date
          ? new Date(e.acf.start_date).getFullYear().toString()
          : null;
        if (y) yearSet.add(y);
      });
      return Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
    }
    return [];
  }, [type, works, exhibitions]);

  const categories = React.useMemo(() => {
    if (type === "works" && works) {
      const counts: Record<string, number> = {};
      works.forEach((w) => {
        const mediums = Array.isArray(w.acf?.medium)
          ? w.acf.medium
          : [w.acf?.medium].filter(Boolean);
        mediums.forEach((m) => {
          counts[m] = (counts[m] || 0) + 1;
        });
      });
      return counts;
    }
    return {};
  }, [type, works]);

  const exhibitionsList = React.useMemo(() => {
    if (type === "works" && works) {
      const exhSet = new Set<string>();
      works.forEach((w) => {
        if (w.acf?.exhibition) exhSet.add(w.acf.exhibition);
      });
      return Array.from(exhSet).sort();
    }
    return [];
  }, [type, works]);

  const types = React.useMemo(() => {
    if (type === "exhibitions" && exhibitions) {
      const typeSet = new Set<string>();
      exhibitions.forEach((e) => {
        if (e.acf.exhibition_type) typeSet.add(e.acf.exhibition_type);
      });
      return Array.from(typeSet).sort();
    }
    return [];
  }, [type, exhibitions]);

  // Update query params
  const updateFilter = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(param);
    else params.set(param, value);

    router.push(
      type === "works"
        ? `/?${params.toString()}`
        : `/exhibitions?${params.toString()}`
    );
  };

  return (
    <motion.div
      initial={{
        y: "-100%",
      }}
      animate={{ y: 0, x: 0 }}
      exit={{
        y: "-100%",
      }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-0 z-20 w-full lg:max-w-md bg-background font-haas border border-foreground   flex flex-col justify-between pt-3 px-3 pb-6 rounded-xs`}
    >
      {/* Header */}
      <div className="flex items-center justify-between text-sm w-full">
        <h2 className="uppercase">
          {type === "works" ? "Filter works" : "Filter exhibitions"}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full px-1 py-0.75 cursor-pointer hover:text-foreground/60"
        >
          <Cross1Icon />
        </button>
      </div>

      {!min && (
        <div className="flex flex-col gap-6 mt-6 text-sm">
          <div className="mb-3 flex flex-col items-start justify-start gap-3 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                type === "works" ? "Search works…" : "Search exhibitions…"
              }
              className="flex-1 p-2 border border-foreground rounded-sm text-sm bg-background text-foreground placeholder:text-foreground/50 w-full"
            />
            {(searchQuery ||
              yearSelected !== "all" ||
              selectedCategory !== "all" ||
              selectedExhibition !== "all") && (
              <Button
                variant="link"
                size="sm"
                className="text-red-600"
                onClick={() => {
                  // Reset search
                  setSearchQuery("");
                  if (type === "works") {
                    setWorkYear("all");
                    setSelectedCategory("all");
                    setSelectedExhibition("all");
                  } else {
                    setExhibitionYear("all");
                    setSelectedType("all");
                  }
                }}
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Shared: Year */}
          <div>
            <span className="block mb-1.5">Year:</span>
            <div className="flex flex-wrap gap-3">
              {years.map((year) => (
                <Button
                  key={year}
                  variant="link"
                  size="sm"
                  className={
                    yearSelected === year ? "opacity-100" : "opacity-30"
                  }
                  onClick={() => {
                    if (type === "works") setWorkYear(year);
                    else setExhibitionYear(year);
                    updateFilter("year", year);
                  }}
                >
                  {year}
                </Button>
              ))}
              <Button
                variant="link"
                size="sm"
                className={
                  yearSelected === "all" ? "opacity-100" : "opacity-30"
                }
                onClick={() => {
                  if (type === "works") setWorkYear("all");
                  else setExhibitionYear("all");
                  updateFilter("year", "all");
                }}
              >
                Show all
              </Button>
            </div>
          </div>

          {type === "works" && (
            <>
              <div>
                <span className="block mb-1.5">Exhibition:</span>
                <div className="flex flex-wrap gap-3">
                  {exhibitionsList.map((exh) => (
                    <Button
                      key={exh}
                      variant="link"
                      size="sm"
                      className={
                        selectedExhibition === exh
                          ? "opacity-100"
                          : "opacity-30"
                      }
                      onClick={() => {
                        setSelectedExhibition(exh);
                        updateFilter("exhibition", exh);
                      }}
                    >
                      {exh}
                    </Button>
                  ))}
                  <Button
                    variant="link"
                    size="sm"
                    className={
                      selectedExhibition === "all"
                        ? "opacity-100"
                        : "opacity-30"
                    }
                    onClick={() => {
                      setSelectedExhibition("all");
                      updateFilter("exhibition", "all");
                    }}
                  >
                    Show all
                  </Button>
                </div>
              </div>

              <div>
                <span className="block mb-1.5">Category:</span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(categories).map(([cat, count]) => (
                    <Button
                      key={cat}
                      variant="link"
                      size="sm"
                      className={
                        selectedCategory === cat ? "opacity-100" : "opacity-30"
                      }
                      onClick={() => {
                        setSelectedCategory(cat);
                        updateFilter("category", cat);
                      }}
                    >
                      {cat} ({count})
                    </Button>
                  ))}
                  <Button
                    variant="link"
                    size="sm"
                    className={
                      selectedCategory === "all" ? "opacity-100" : "opacity-30"
                    }
                    onClick={() => {
                      setSelectedCategory("all");
                      updateFilter("category", "all");
                    }}
                  >
                    Show all
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Exhibitions only */}
          {type === "exhibitions" && (
            <div className="flex flex-col text-sm">
              <span className="block mb-1.5">Type:</span>
              <div className="flex flex-wrap gap-3">
                {types.map((t) => (
                  <Button
                    key={t}
                    variant="link"
                    size="sm"
                    className={
                      selectedType === t ? "opacity-100" : "opacity-30"
                    }
                    onClick={() => {
                      setSelectedType(t);
                      updateFilter("type", t);
                    }}
                  >
                    {t}
                  </Button>
                ))}
                <Button
                  variant="link"
                  size="sm"
                  className={
                    selectedType === "all" ? "opacity-100" : "opacity-30"
                  }
                  onClick={() => {
                    setSelectedType("all");
                    updateFilter("type", "all");
                  }}
                >
                  Show all
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

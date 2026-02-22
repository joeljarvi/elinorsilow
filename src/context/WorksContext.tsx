"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { Work, getAllWorks } from "../../lib/wordpress";
import { useNav } from "./NavContext";

export type WorkSort = "year-latest" | "year-oldest" | "year" | "title";
export type CategoryFilter =
  | "all"
  | "painting"
  | "drawing"
  | "sculpture"
  | "textile";

type WorksContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  allWorks: Work[];
  filteredWorks: Work[];
  availibleYears: number[];
  workLoading: boolean;
  error: Error | null;
  workSort: WorkSort;
  setWorkSort: React.Dispatch<React.SetStateAction<WorkSort>>;
  selectedYear: number | null;
  setSelectedYear: React.Dispatch<React.SetStateAction<number | null>>;
  categoryFilter: CategoryFilter;
  setCategoryFilter: React.Dispatch<React.SetStateAction<CategoryFilter>>;
  featuredWorks: Work[];
  featuredWorksTitles: string[];

  applyFilters: (
    newSort: WorkSort,
    newYear: number | null,
    newCategory: CategoryFilter
  ) => Promise<void>;
  clearFilters: () => Promise<void>;
  isApplyingFilters: boolean;

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  currentWorkIndex: number | null;
  setCurrentWorkIndex: React.Dispatch<React.SetStateAction<number | null>>;
  normalizeSlug: (title: string) => string;
  showAllWorksList: boolean;
  setShowAllWorksList: React.Dispatch<React.SetStateAction<boolean>>;
  activeWorkSlug: string | null;
  setActiveWorkSlug: React.Dispatch<React.SetStateAction<string | null>>;
  openWork: (slug: string) => void;
  uniqueYears: number[];
  getWorkSizeClass: (dimensions?: string) => string;
};

export function normalizeSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

const WorksContext = createContext<WorksContextType | undefined>(undefined);

export function WorksProvider({ children }: { children: ReactNode }) {
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [workLoading, setWorkLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [workSort, setWorkSort] = useState<WorkSort>("year-latest");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [activeWorkSlug, setActiveWorkSlug] = useState<string | null>(null);
  const [currentWorkIndex, setCurrentWorkIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getAllWorks()
      .then((data) => {
        const normalized = data.map((w) => ({
          ...w,
          acf: {
            ...w.acf,
            year: Number(w.acf.year),
            category: w.acf.category?.toLowerCase() || "all",
          },
          image_url: w._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
        }));
        setAllWorks(normalized);
      })
      .catch(setError)
      .finally(() => setWorkLoading(false));
  }, []);

  const applyFilters = async (
    newSort: WorkSort,
    newYear: number | null,
    newCategory: CategoryFilter
  ) => {
    setIsApplyingFilters(true);
    // Simulate a small delay for the loader if it's too fast
    await new Promise((resolve) => setTimeout(resolve, 400));
    setWorkSort(newSort);
    setSelectedYear(newYear);
    setCategoryFilter(newCategory);
    setIsApplyingFilters(false);
  };

  const clearFilters = async () => {
    setIsApplyingFilters(true);
    setWorkSort("year-latest");
    setSelectedYear(null);
    setCategoryFilter("all");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsApplyingFilters(false);
  };

  // Memoized available years
  const availibleYears = React.useMemo(() => {
    return Array.from(
      new Set(
        allWorks
          .map((w) => w.acf.year)
          .filter((y): y is number => Number.isFinite(y))
      )
    ).sort((a, b) => b - a);
  }, [allWorks]);

  // Memoized filtered works
  const filteredWorks = React.useMemo(() => {
    let result = [...allWorks];

    if (categoryFilter !== "all") {
      result = result.filter((w) => w.acf.category === categoryFilter);
    }

    if (workSort === "year" && selectedYear) {
      result = result.filter((w) => w.acf.year === selectedYear);
    }

    if (searchQuery.trim()) {
      result = result.filter((w) =>
        w.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (workSort) {
      case "year-latest":
        result.sort((a, b) => (b.acf.year ?? 0) - (a.acf.year ?? 0));
        break;
      case "year-oldest":
        result.sort((a, b) => (a.acf.year ?? 0) - (b.acf.year ?? 0));
        break;
      case "title":
        result.sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv")
        );
        break;
    }

    return result;
  }, [allWorks, workSort, selectedYear, categoryFilter, searchQuery]);

  const uniqueYears = Array.from(new Set(availibleYears));

  const openWork = (slug: string) => {
    setActiveWorkSlug(slug);
    setOpen(false);
  };

  const getWorkSizeClass = (dimensions?: string) => {
    if (!dimensions) return "w-full";

    const nums = dimensions.match(/\d+/g);
    if (!nums || nums.length < 2) return "w-1/4 ";

    const [w] = nums.map(Number);
    const area = w;

    // tweak threshold to taste

    if (area > 30 && area < 120) return "w-1/2";

    if (area > 120) return "w-3/4 ";

    return "w-1/2";
  };

  const featuredWorksTitles = [
    "Under navelsträngen",
    "Hoppet",
    "Pärlband",
    "Din röst är blå",
  ];

  const featuredWorks: Work[] = useMemo(() => {
    return filteredWorks.filter((w) =>
      featuredWorksTitles.includes(w.title.rendered)
    );
  }, [filteredWorks]);

  return (
    <WorksContext.Provider
      value={{
        open,
        setOpen,
        allWorks,
        filteredWorks,
        availibleYears,
        workLoading,
        error,
        workSort,
        setWorkSort,
        selectedYear,
        setSelectedYear,
        categoryFilter,
        setCategoryFilter,
        featuredWorks,
        featuredWorksTitles,
        applyFilters,
        clearFilters,
        isApplyingFilters,

        searchQuery,
        setSearchQuery,
        currentWorkIndex,
        setCurrentWorkIndex,
        normalizeSlug,
        showAllWorksList,
        setShowAllWorksList,
        activeWorkSlug,
        setActiveWorkSlug,
        openWork,
        uniqueYears,
        getWorkSizeClass,
      }}
    >
      {children}
    </WorksContext.Provider>
  );
}

export function useWorks() {
  const context = useContext(WorksContext);
  if (!context) {
    throw new Error("useWorks must be used within a WorksProvider");
  }
  return context;
}

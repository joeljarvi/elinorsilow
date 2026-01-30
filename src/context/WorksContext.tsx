"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
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
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  currentWorkIndex: number | null;
  setCurrentWorkIndex: React.Dispatch<React.SetStateAction<number | null>>;
  normalizeSlug: (title: string) => string;
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  showAllWorksList: boolean;
  setShowAllWorksList: React.Dispatch<React.SetStateAction<boolean>>;
  activeWorkSlug: string | null;
  setActiveWorkSlug: React.Dispatch<React.SetStateAction<string | null>>;
  openWork: (slug: string) => void;
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
  const [showInfo, setShowInfo] = useState(true);
  const [workSort, setWorkSort] = useState<WorkSort>("year-latest");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [activeWorkSlug, setActiveWorkSlug] = useState<string | null>(null);
  const [currentWorkIndex, setCurrentWorkIndex] = useState<number | null>(null);
  const { view, setViewLoading, setOpen } = useNav();

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

  useEffect(() => {
    if (view === "works" && !workLoading) {
      setViewLoading(false);
    }
  }, [view, workLoading]);

  const openWork = (slug: string) => {
    setActiveWorkSlug(slug);
    setOpen(false);
  };

  return (
    <WorksContext.Provider
      value={{
        allWorks,
        filteredWorks,
        availibleYears,
        showInfo,
        setShowInfo,
        workLoading,
        error,
        workSort,
        setWorkSort,
        selectedYear,
        setSelectedYear,
        categoryFilter,
        setCategoryFilter,
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

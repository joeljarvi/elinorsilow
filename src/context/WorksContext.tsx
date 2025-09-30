"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Work, getAllWorks } from "../../lib/wordpress";

type WorksContextType = {
  allWorks: Work[];
  works: Work[];
  filteredWorks: Work[];
  loading: boolean;
  error: Error | null;
  selectedYear: string;
  setSelectedYear: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedExhibition: string;
  setSelectedExhibition: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
};

const WorksContext = createContext<WorksContextType | undefined>(undefined);

export function WorksProvider({ children }: { children: ReactNode }) {
  const [allWorks, setAllWorks] = useState<Work[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExhibition, setSelectedExhibition] = useState("all");

  useEffect(() => {
    getAllWorks()
      .then((data) => {
        const normalized = data.map((w) => ({
          ...w,
          image_url: w._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
        }));
        setWorks(normalized);
        setAllWorks(normalized);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const filteredWorks = React.useMemo(() => {
    let result = [...allWorks]; // use allWorks as base

    if (selectedYear !== "all") {
      result = result.filter((w) => w.acf.year.toString() === selectedYear);
    }

    if (selectedCategory !== "all") {
      result = result.filter((w) =>
        Array.isArray(w.acf.medium)
          ? w.acf.medium.includes(selectedCategory)
          : w.acf.medium === selectedCategory
      );
    }

    if (selectedExhibition !== "all") {
      result = result.filter((w) => w.acf.exhibition === selectedExhibition);
    }

    if (searchQuery.trim()) {
      result = result.filter((w) =>
        w.title.rendered.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [
    allWorks,
    selectedYear,
    selectedCategory,
    selectedExhibition,
    searchQuery,
  ]);

  return (
    <WorksContext.Provider
      value={{
        allWorks,
        works,
        filteredWorks,
        loading,
        error,
        selectedYear,
        setSelectedYear,
        selectedCategory,
        setSelectedCategory,
        selectedExhibition,
        setSelectedExhibition,
        searchQuery,
        setSearchQuery,
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

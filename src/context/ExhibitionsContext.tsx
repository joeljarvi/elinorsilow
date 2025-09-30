"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { Exhibition, getAllExhibitions } from "../../lib/wordpress";
import { useDebounce } from "use-debounce";

// Function to extract year from start_date and end_date
function getYearFromExhibition(exhibition: Exhibition): number | null {
  const startDate = exhibition.acf.start_date;
  if (startDate) {
    return new Date(startDate).getFullYear();
  }
  return null;
}

type ExhibitionsContextType = {
  exhibitions: Exhibition[] | null;
  loading: boolean;
  error: Error | null;
  sortBy: string;
  setSortBy: (val: string) => void;
  selectedYear: string;
  setSelectedYear: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  showDescription: boolean;
  setShowDescription: (val: boolean) => void;
  filteredExhibitions: Exhibition[];
  soloExhibitions: Exhibition[]; // 👈 Add
  groupExhibitions: Exhibition[]; // 👈 Add
};

const ExhibitionsContext = createContext<ExhibitionsContextType | undefined>(
  undefined
);

export function ExhibitionsProvider({ children }: { children: ReactNode }) {
  const [exhibitions, setExhibitions] = useState<Exhibition[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortBy, setSortBy] = useState("latest");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showDescription, setShowDescription] = useState(true);

  const [debouncedSortBy] = useDebounce(sortBy, 300);
  const [debouncedSelectedYear] = useDebounce(selectedYear, 300);
  const [debouncedSelectedType] = useDebounce(selectedType, 300);

  useEffect(() => {
    getAllExhibitions()
      .then(setExhibitions)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const sortedExhibitions = useMemo(() => {
    if (!exhibitions) return [];

    switch (debouncedSortBy) {
      case "az":
        return [...exhibitions].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered)
        );
      case "random":
        return [...exhibitions].sort(() => Math.random() - 0.5);
      default:
        return [...exhibitions].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  }, [exhibitions, debouncedSortBy]);

  const filteredExhibitions = useMemo(() => {
    let result = [...sortedExhibitions];

    // Filter by year
    if (debouncedSelectedYear !== "all") {
      result = result.filter((e) => {
        const year = getYearFromExhibition(e)?.toString();
        return year === debouncedSelectedYear;
      });
    }

    // Filter by exhibition type
    if (debouncedSelectedType !== "all") {
      result = result.filter(
        (e) => e.acf.exhibition_type?.toString() === debouncedSelectedType
      );
    }

    return result;
  }, [sortedExhibitions, debouncedSelectedYear, debouncedSelectedType]);

  const soloExhibitions = useMemo(() => {
    if (!exhibitions) return [];
    return exhibitions.filter((ex) => ex.acf.exhibition_type === "Solo");
  }, [exhibitions]);

  const groupExhibitions = useMemo(() => {
    if (!exhibitions) return [];
    return exhibitions.filter((ex) => ex.acf.exhibition_type === "Group");
  }, [exhibitions]);

  return (
    <ExhibitionsContext.Provider
      value={{
        exhibitions,
        loading,
        error,
        sortBy,
        setSortBy,
        selectedYear,
        setSelectedYear,
        selectedType,
        setSelectedType,
        showDescription,
        setShowDescription,
        filteredExhibitions,
        soloExhibitions,
        groupExhibitions,
      }}
    >
      {children}
    </ExhibitionsContext.Provider>
  );
}

export function useExhibitions() {
  const context = useContext(ExhibitionsContext);
  if (context === undefined) {
    throw new Error(
      "useExhibitions must be used within an ExhibitionsProvider"
    );
  }
  return context;
}

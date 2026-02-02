"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import {
  Exhibition,
  getAllExhibitions,
  getExhibitionList,
  Exhibition_list,
  getExhibitionBySlug as fetchExhibitionBySlug,
} from "../../lib/wordpress";
import { useNav } from "./NavContext";

import { useDebounce } from "use-debounce";

export type ExhibitionSort = "year" | "title" | "type";

type ExhibitionsContextType = {
  exhibitions: Exhibition[];
  getExhibitionBySlug: (slug: string) => Promise<Exhibition | null>;
  exhibitionList: Exhibition_list[];
  filteredExhibitions: Exhibition[];
  soloExhibitions: Exhibition[];
  groupExhibitions: Exhibition[];
  fullExhibitionList: (Exhibition | Exhibition_list)[];
  open: boolean;
  setOpen: (v: boolean) => void;
  exLoading: boolean;
  error: Error | null;

  exhibitionSort: ExhibitionSort;
  setExhibitionSort: React.Dispatch<React.SetStateAction<ExhibitionSort>>;
  exSelectedYear: string | "all";
  exSetSelectedYear: React.Dispatch<React.SetStateAction<string>>;

  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;

  showDescription: boolean;
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueExYears: string[];
  availableYears: string[];
  debouncedSelectedYear: string;
  activeExhibitionSlug: string | null;
  setActiveExhibitionSlug: (slug: string | null) => void;
  openExhibition: (slug: string) => void;
};

const ExhibitionsContext = createContext<ExhibitionsContextType | undefined>(
  undefined
);

export function ExhibitionsProvider({ children }: { children: ReactNode }) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [exhibitionList, setExhibitionList] = useState<Exhibition_list[]>([]);
  const [exLoading, setExLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [exhibitionSort, setExhibitionSort] = useState<ExhibitionSort>("title");
  const [exSelectedYear, exSetSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showDescription, setShowDescription] = useState(true);
  const [activeExhibitionSlug, setActiveExhibitionSlug] = useState<
    string | null
  >(null);
  const [debouncedSortBy] = useDebounce(exhibitionSort, 200);
  const [debouncedSelectedYear] = useDebounce(exSelectedYear, 200);
  const [debouncedSelectedType] = useDebounce(selectedType, 200);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [exhibitionsData, exhibitionListData] = await Promise.all([
          getAllExhibitions(),
          getExhibitionList(),
        ]);
        setExhibitions(exhibitionsData);
        setExhibitionList(exhibitionListData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setExLoading(false);
      }
    }
    fetchData();
  }, []);

  const getExhibitionBySlug = async (slug: string) => {
    // 1. Try context first (even if loading)
    const existing = exhibitions.find((e) => e.slug === slug);
    if (existing) return existing;

    // 2. Fetch fallback
    try {
      const fetched = await fetchExhibitionBySlug(slug);

      // 3. Cache it
      setExhibitions((prev) => {
        if (prev.some((e) => e.id === fetched.id)) return prev;
        return [...prev, fetched];
      });

      return fetched;
    } catch (err) {
      console.error("getExhibitionBySlug failed", err);
      return null;
    }
  };

  // Available years from acf.year
  const availableYears = useMemo(() => {
    const years = exhibitions
      .map((e) => e.acf.year)
      .filter((y): y is string => !!y); // only keep non-empty strings
    return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
  }, [exhibitions]);

  const sortedExhibitions = useMemo(() => {
    switch (debouncedSortBy) {
      case "title":
        return [...exhibitions].sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered)
        );
      case "type":
        return [...exhibitions].sort((a, b) =>
          (a.acf.exhibition_type ?? "").localeCompare(
            b.acf.exhibition_type ?? ""
          )
        );
      case "year":
      default:
        return [...exhibitions].sort(
          (a, b) => Number(b.acf.year) - Number(a.acf.year)
        );
    }
  }, [exhibitions, debouncedSortBy]);

  const filteredExhibitions = useMemo(() => {
    return sortedExhibitions.filter((e) => {
      const yearMatch =
        debouncedSelectedYear === "all" || e.acf.year === debouncedSelectedYear;
      const typeMatch =
        debouncedSelectedType === "all" ||
        e.acf.exhibition_type === debouncedSelectedType;
      return yearMatch && typeMatch;
    });
  }, [sortedExhibitions, debouncedSelectedYear, debouncedSelectedType]);

  const soloExhibitions = useMemo(
    () => exhibitions.filter((e) => e.acf.exhibition_type === "Solo"),
    [exhibitions]
  );

  const groupExhibitions = useMemo(
    () => exhibitions.filter((e) => e.acf.exhibition_type === "Group"),
    [exhibitions]
  );

  const fullExhibitionList = useMemo(
    () => [...exhibitions, ...exhibitionList],
    [exhibitions, exhibitionList]
  );

  const uniqueExYears = Array.from(new Set(availableYears));

  const openExhibition = (slug: string) => {
    setActiveExhibitionSlug(slug);
    setOpen(false);
  };

  return (
    <ExhibitionsContext.Provider
      value={{
        open,
        setOpen,
        getExhibitionBySlug,
        exhibitions,
        exhibitionList,
        filteredExhibitions,
        soloExhibitions,
        groupExhibitions,
        fullExhibitionList,
        exLoading,
        error,
        exhibitionSort,
        setExhibitionSort,
        exSelectedYear,
        exSetSelectedYear,
        selectedType,
        setSelectedType,
        showDescription,
        setShowDescription,
        availableYears,
        debouncedSelectedYear,
        activeExhibitionSlug,
        setActiveExhibitionSlug,
        openExhibition,
        uniqueExYears,
      }}
    >
      {children}
    </ExhibitionsContext.Provider>
  );
}

export function useExhibitions() {
  const context = useContext(ExhibitionsContext);
  if (!context)
    throw new Error("useExhibitions must be used within ExhibitionsProvider");
  return context;
}

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
} from "../../lib/sanity";
import { useNav } from "./NavContext";

import { useDebounce } from "use-debounce";

export type ExhibitionSort = "year" | "year-oldest" | "title" | "type";
export type ExCategory = "all" | "solo" | "group";
export type ExSort = "year-latest" | "year-oldest" | "title";

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
  featuredExhibitions: Exhibition[];
  featuredExTitles: string[];

  exhibitionSort: ExhibitionSort;
  setExhibitionSort: React.Dispatch<React.SetStateAction<ExhibitionSort>>;
  exSelectedYear: string | "all";
  exSetSelectedYear: React.Dispatch<React.SetStateAction<string>>;

  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;

  applyFilters: (
    newSort: ExhibitionSort,
    newYear: string,
    newType: string
  ) => Promise<void>;
  clearFilters: () => Promise<void>;
  isApplyingFilters: boolean;

  exCat: ExCategory;
  setExCat: React.Dispatch<React.SetStateAction<ExCategory>>;
  exSort: ExSort;
  setExSort: React.Dispatch<React.SetStateAction<ExSort>>;
  exAsList: boolean;
  setExAsList: React.Dispatch<React.SetStateAction<boolean>>;
  showDescription: boolean;
  setShowDescription: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueExYears: string[];
  availableYears: string[];
  debouncedSelectedYear: string;
  activeExhibitionSlug: string | null;
  setActiveExhibitionSlug: (slug: string | null) => void;
  openExhibition: (slug: string) => void;
  findExhibitionSlug: (title: string) => string | undefined;
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

  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  const [exCat, setExCat] = useState<ExCategory>("all");
  const [exSort, setExSort] = useState<ExSort>("year-latest");
  const [exAsList, setExAsList] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [activeExhibitionSlug, setActiveExhibitionSlug] = useState<
    string | null
  >(null);
  const [debouncedSelectedYear] = useDebounce(exSelectedYear, 200);
  const [open, setOpen] = useState(false);

  const applyFilters = async (
    newSort: ExhibitionSort,
    newYear: string,
    newType: string
  ) => {
    setIsApplyingFilters(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setExhibitionSort(newSort);
    exSetSelectedYear(newYear);
    setSelectedType(newType);
    setIsApplyingFilters(false);
  };

  const clearFilters = async () => {
    setIsApplyingFilters(true);
    setExhibitionSort("title");
    exSetSelectedYear("all");
    setSelectedType("all");
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsApplyingFilters(false);
  };

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

const CAT_TO_TYPE: Record<ExCategory, string | null> = {
    all: null,
    solo: "Solo",
    group: "Group",
  };

  const filteredExhibitions = useMemo(() => {
    const typeFilter = CAT_TO_TYPE[exCat];
    let result = typeFilter
      ? exhibitions.filter((e) => e.acf.exhibition_type === typeFilter)
      : [...exhibitions];
    switch (exSort) {
      case "year-latest":
        result.sort((a, b) => Number(b.acf.year) - Number(a.acf.year));
        break;
      case "year-oldest":
        result.sort((a, b) => Number(a.acf.year) - Number(b.acf.year));
        break;
      case "title":
        result.sort((a, b) =>
          a.title.rendered.localeCompare(b.title.rendered, "sv")
        );
        break;
    }
    return result;
  }, [exhibitions, exCat, exSort]);

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

  const findExhibitionSlug = (title: string) => {
    const match = filteredExhibitions.find((ex) => ex.title.rendered === title);
    return match?.slug;
  };

  const featuredExTitles: string[] = [];

  const featuredExhibitions: Exhibition[] = useMemo(() => {
    return exhibitions.filter((ex) => ex.featured);
  }, [exhibitions]);

  return (
    <ExhibitionsContext.Provider
      value={{
        open,
        setOpen,
        getExhibitionBySlug,
        findExhibitionSlug,
        featuredExhibitions,
        featuredExTitles,

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

        applyFilters,
        clearFilters,
        isApplyingFilters,

        exCat,
        setExCat,
        exSort,
        setExSort,
        exAsList,
        setExAsList,
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

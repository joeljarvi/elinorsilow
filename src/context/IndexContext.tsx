"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { WorkSize } from "@/lib/workSize";

// The index section's views: /index/works, /index/exhibitions, /index/info.
export type HomeView = "works" | "exhibitions" | "info";
export type IndexMode = HomeView;
export type IndexSort = "latest" | "title" | "year" | "random";

interface IndexContextValue {
  mode: IndexMode;
  setMode: (m: IndexMode) => void;
  sort: IndexSort;
  setSort: (s: IndexSort) => void;
  // The lists' "by year" and "by size" filters ("all", or a year / a size).
  yearFilter: string;
  setYearFilter: (y: string) => void;
  sizeFilter: WorkSize | "all";
  setSizeFilter: (s: WorkSize | "all") => void;
  // Open works: show the scale and matchbox (the Filter panel's settings).
  showScale: boolean;
  setShowScale: (v: boolean) => void;
  // "random" sort: the order comes from this seed; randomize() picks a new one
  // (and switches to that sort).
  shuffleSeed: number;
  randomize: () => void;
  // Goes up each time the lists should close all their open rows.
  closeRowsSignal: number;
  closeAllRows: () => void;
  tidy: boolean;
  setTidy: (t: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  zoom: number;
  setZoom: (n: number) => void;
  // Works per row in the /index/works grid on desktop (4 → 3 → 2 → 1).
  worksPerRow: number;
  cycleWorksPerRow: () => void;
}

const IndexContext = createContext<IndexContextValue | undefined>(undefined);

export function IndexProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // The current view comes from the URL (works outside the index section).
  const mode: IndexMode =
    pathname === "/index/exhibitions"
      ? "exhibitions"
      : pathname === "/index/info"
        ? "info"
        : "works";
  const setMode = (next: IndexMode) => {
    setSearch(""); // each view starts unfiltered
    router.push(`/index/${next}`, { scroll: false });
  };

  // Default sort per view: exhibitions by year, everything else latest.
  // Reset when switching views; a pick made on a view lasts while you stay.
  const defaultSort: IndexSort = mode === "exhibitions" ? "year" : "latest";
  const [sort, setSort] = useState<IndexSort>(defaultSort);
  useEffect(() => {
    setSort(defaultSort);
  }, [defaultSort]);
  // Each view has its own years, so these start over when switching views.
  const [yearFilter, setYearFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState<WorkSize | "all">("all");
  useEffect(() => {
    setYearFilter("all");
    setSizeFilter("all");
  }, [mode]);
  const [showScale, setShowScale] = useState(true);
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const randomize = () => {
    setShuffleSeed(Math.floor(Math.random() * 1e9) + 1);
    setSort("random");
  };
  const [closeRowsSignal, setCloseRowsSignal] = useState(0);
  const closeAllRows = () => setCloseRowsSignal((n) => n + 1);
  const [tidy, setTidy] = useState(true);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(0);
  const [worksPerRow, setWorksPerRow] = useState(4);
  const cycleWorksPerRow = () => setWorksPerRow((n) => (n > 1 ? n - 1 : 4));

  const value = useMemo(
    () => ({
      mode,
      setMode,
      sort,
      setSort,
      yearFilter,
      setYearFilter,
      sizeFilter,
      setSizeFilter,
      showScale,
      setShowScale,
      shuffleSeed,
      randomize,
      closeRowsSignal,
      closeAllRows,
      tidy,
      setTidy,
      search,
      setSearch,
      zoom,
      setZoom,
      worksPerRow,
      cycleWorksPerRow,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, sort, setSort, yearFilter, sizeFilter, showScale, shuffleSeed, closeRowsSignal, tidy, search, zoom, worksPerRow, pathname],
  );

  return (
    <IndexContext.Provider value={value}>{children}</IndexContext.Provider>
  );
}

export function useIndex() {
  const ctx = useContext(IndexContext);
  if (!ctx) throw new Error("useIndex must be used within IndexProvider");
  return ctx;
}

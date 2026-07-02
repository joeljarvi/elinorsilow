"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type IndexMode = "works" | "exhibitions" | "all";
export type IndexSort = "latest" | "year" | "a-z";

interface IndexContextValue {
  mode: IndexMode;
  setMode: (m: IndexMode) => void;
  sort: IndexSort;
  setSort: (s: IndexSort) => void;
  tidy: boolean;
  setTidy: (t: boolean) => void;
  search: string;
  setSearch: (s: string) => void;
  zoom: number;
  setZoom: (n: number) => void;
}

const IndexContext = createContext<IndexContextValue | undefined>(undefined);

export function IndexProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<IndexMode>("works");
  const [sort, setSort] = useState<IndexSort>("latest");
  const [tidy, setTidy] = useState(false);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(2);
  return (
    <IndexContext.Provider value={{ mode, setMode, sort, setSort, tidy, setTidy, search, setSearch, zoom, setZoom }}>
      {children}
    </IndexContext.Provider>
  );
}

export function useIndex() {
  const ctx = useContext(IndexContext);
  if (!ctx) throw new Error("useIndex must be used within IndexProvider");
  return ctx;
}

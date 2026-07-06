"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter();
  const mode: IndexMode =
    pathname === "/index/works"
      ? "works"
      : pathname === "/index/exhibitions"
        ? "exhibitions"
        : "all";
  const setMode = (m: IndexMode) => {
    const dest =
      m === "works"
        ? "/index/works"
        : m === "exhibitions"
          ? "/index/exhibitions"
          : "/index";
    router.push(dest, { scroll: false });
  };

  const [sort, setSort] = useState<IndexSort>("latest");
  const [tidy, setTidy] = useState(false);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(2);

  const value = useMemo(
    () => ({ mode, setMode, sort, setSort, tidy, setTidy, search, setSearch, zoom, setZoom }),
    [mode, sort, tidy, search, zoom],
  );

  return <IndexContext.Provider value={value}>{children}</IndexContext.Provider>;
}

export function useIndex() {
  const ctx = useContext(IndexContext);
  if (!ctx) throw new Error("useIndex must be used within IndexProvider");
  return ctx;
}

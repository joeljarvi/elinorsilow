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

// The views of the home page ("/"), switched in place.
export type HomeView = "works" | "exhibitions" | "info";
export type IndexMode = HomeView;
const HOME_VIEWS: HomeView[] = ["works", "exhibitions", "info"];
export type IndexSort = "latest" | "title" | "year";

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
  // Works per row in the /index/works grid on desktop (4 → 3 → 2 → 1).
  worksPerRow: number;
  cycleWorksPerRow: () => void;
}

const IndexContext = createContext<IndexContextValue | undefined>(undefined);

export function IndexProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // The home page ("/") is the index: it shows one view — works
  // (default), exhibitions or info — switched in place, without a route change.
  // The view is kept here and mirrored in the URL (?view=…), so links like
  // /?view=works (and the old /index/works, /info, which redirect there)
  // open on it. Read from the URL after mounting (not useSearchParams, which
  // would need a Suspense boundary around the whole layout).
  const [view, setView] = useState<HomeView>("works");
  useEffect(() => {
    if (pathname !== "/") return;
    const v = new URLSearchParams(window.location.search).get("view");
    if (HOME_VIEWS.includes(v as HomeView)) setView(v as HomeView);
    // No view in the URL: works.
    else setView("works");
  }, [pathname]);
  const mode: IndexMode = view;
  const setMode = (next: IndexMode) => {
    setSearch(""); // each view starts unfiltered
    if (pathname === "/") {
      setView(next);
      window.history.replaceState(null, "", `/?view=${next}`);
    } else {
      router.push(`/?view=${next}`, { scroll: false });
    }
  };

  // Default sort per view: exhibitions by year, everything else latest.
  // Reset when switching views; a pick made on a view lasts while you stay.
  const defaultSort: IndexSort = mode === "exhibitions" ? "year" : "latest";
  const [sort, setSort] = useState<IndexSort>(defaultSort);
  useEffect(() => {
    setSort(defaultSort);
  }, [defaultSort]);
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
    [mode, sort, setSort, tidy, search, zoom, worksPerRow, pathname],
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

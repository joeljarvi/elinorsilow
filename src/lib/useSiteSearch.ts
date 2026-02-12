// lib/useSiteSearch.ts
import { useMemo, useState } from "react";
import { SearchItem } from "./searchIndex";

export function useSiteSearch(index: SearchItem[]) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return index.filter((item) => item.title.toLowerCase().includes(q));
  }, [query, index]);

  return { query, setQuery, results };
}

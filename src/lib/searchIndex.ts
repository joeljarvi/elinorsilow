import { Exhibition, Work } from "../../lib/wordpress";

// lib/searchIndex.ts
export type SearchItem = {
  id: number;
  slug: string;
  title: string;
  type: "work" | "exhibition" | "page";
  url: string;
};

export function buildSearchIndex({
  works,
  exhibitions,
}: {
  works: Work[];
  exhibitions: Exhibition[];
}): SearchItem[] {
  return [
    ...works.map((w) => ({
      id: w.id,
      slug: w.slug,
      title: w.title.rendered,
      type: "work" as const,
      url: `/?work=${w.slug}`,
    })),
    ...exhibitions.map((e) => ({
      id: e.id,
      slug: e.slug,
      title: e.title.rendered,
      type: "exhibition" as const,
      url: `/?exhibition=${e.slug}`,
    })),
  ];
}

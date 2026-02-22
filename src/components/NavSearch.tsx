"use client";

import { useRouter } from "next/navigation";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { buildSearchIndex } from "@/lib/searchIndex";
import { useSiteSearch } from "@/lib/useSiteSearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NavSearch({}: {}) {
  const router = useRouter();
  const { allWorks, setActiveWorkSlug, setOpen: setWorkModalOpen } = useWorks();
  const {
    exhibitions,
    setActiveExhibitionSlug,
    setOpen: setExModalOpen,
  } = useExhibitions();

  const index = buildSearchIndex({ works: allWorks, exhibitions });
  const { query, setQuery, results } = useSiteSearch(index);

  const handleResultClick = (item: (typeof results)[0]) => {
    if (item.type === "work") {
      setActiveWorkSlug(item.slug);
      setWorkModalOpen(false); // close nav if you want
    } else {
      setActiveExhibitionSlug(item.slug);
      setExModalOpen(false);
    }
    setQuery(""); // clear search
  };
  return (
    <div className="relative bg-background w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full border-b border-b-foreground   outline-none  py-0 font-directorLight text-4xl lg:text-5xl lg:max-w-md bg-transparent h-16 px-4"
      />

      {query && results.length > 0 && (
        <div className="absolute top-full font-directorMono left-0 w-full bg-background z-50 lg:shadow-none flex flex-col items-start justify-start gap-y-0 ">
          {" "}
          {results.slice(0, 8).map((item) => (
            <Button
              variant="ghost"
              size="lg"
              key={item.id}
              asChild
              className="w-full text-left justify-start h-16  px-4  hover:bg-foreground/10 hover:underline-none "
              onClick={() => handleResultClick(item)}
            >
              <div>
                <span className="opacity-50 mr-4 text-xs">
                  {item.type === "work" ? "Work" : "Exhibition"}
                </span>
                {item.title}
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

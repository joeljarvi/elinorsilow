"use client";

import { useRouter } from "next/navigation";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { buildSearchIndex } from "@/lib/searchIndex";
import { useSiteSearch } from "@/lib/useSiteSearch";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cross1Icon } from "@radix-ui/react-icons";

export default function NavSearch({ onClose }: { onClose?: () => void }) {
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
    <div className="relative  w-full">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full  border-b-[0.5px] border-foreground  outline-none  py-0 pb-1  font-directorLight text-3xl  max-w-70 lg:max-w-96 bg-transparent h pl-2 pr-8 lg:pb-1"
      />
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground"
        >
          <Cross1Icon className="size-4" />
        </button>
      )}

      {query && results.length > 0 && (
        <div className="absolute top-full font-directorMono left-0 w-full bg-transparent  z-50 lg:shadow-none flex flex-col items-start justify-start gap-y-0 ">
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

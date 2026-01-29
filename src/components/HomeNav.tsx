"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNav } from "@/context/NavContext";
import HDivider from "@/components/HDivider";

export default function HomeNav({
  exhibitions,
  allWorks,
}: {
  exhibitions: any[];
  allWorks: any[];
}) {
  const [open, setOpen] = useState(false);
  const [showWorksMenu, setShowWorksMenu] = useState(false);
  const [showExhibitionsMenu, setShowExhibitionsMenu] = useState(false);
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [showAllExhibitionsList, setShowAllExhibitionsList] = useState(false);
  const [showWorksFilter, setShowWorksFilter] = useState(false);
  const [showExhibitionsFilter, setShowExhibitionsFilter] = useState(false);
  const [workSort, setWorkSort] = useState<"year" | "title" | "medium">("year");
  const [exhibitionSort, setExhibitionSort] = useState<
    "year" | "title" | "type"
  >("year");

  const { setView } = useNav();

  return (
    <nav className="fixed left-0 top-0 h-screen w-72 p-4 bg-white dark:bg-black overflow-y-auto">
      {/* Example: Works */}
      <div>
        <div className="flex justify-between items-center">
          <span>Works</span>
          <button onClick={() => setShowWorksMenu((prev) => !prev)}>
            {showWorksMenu ? <MinusIcon /> : <PlusIcon />}
          </button>
        </div>
        {showWorksMenu && (
          <>
            <button onClick={() => setShowAllWorksList((prev) => !prev)}>
              Index
            </button>
            {showAllWorksList && (
              <div>
                {allWorks.map((work) => (
                  <Link
                    key={work.slug}
                    href={`/?work=${work.slug}`}
                    className="block"
                  >
                    {work.title.rendered}
                  </Link>
                ))}
              </div>
            )}
            <button onClick={() => setShowWorksFilter((prev) => !prev)}>
              Filter works
            </button>
            {showWorksFilter && (
              <Select
                value={workSort}
                onValueChange={(v) => setWorkSort(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort works" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>

      <HDivider />

      {/* Example: Exhibitions (same pattern) */}
      <div>
        <div className="flex justify-between items-center">
          <span>Exhibitions</span>
          <button onClick={() => setShowExhibitionsMenu((prev) => !prev)}>
            {showExhibitionsMenu ? <MinusIcon /> : <PlusIcon />}
          </button>
        </div>
        {showExhibitionsMenu && (
          <>
            <button onClick={() => setShowAllExhibitionsList((prev) => !prev)}>
              Index
            </button>
            {showAllExhibitionsList && (
              <div>
                {exhibitions.map((ex) => (
                  <Link
                    key={ex.slug}
                    href={`/exhibitions/${ex.slug}`}
                    className="block"
                  >
                    {ex.acf.title}
                  </Link>
                ))}
              </div>
            )}
            <button onClick={() => setShowExhibitionsFilter((prev) => !prev)}>
              Filter exhibitions
            </button>
            {showExhibitionsFilter && (
              <Select
                value={exhibitionSort}
                onValueChange={(v) => setExhibitionSort(v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort exhibitions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

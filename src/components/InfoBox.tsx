"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Work, Exhibition } from "../../lib/wordpress";
import { TypingText } from "./animate-ui/primitives/texts/typing";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Link from "next/link";
import { Button } from "./ui/button";
import { useWindowSize } from "@/hooks/useWindowSize";

type InfoData = Work | Exhibition;

interface InfoBoxProps {
  data: InfoData | null;
  showInfo: boolean;
  min: boolean;
  setMin: (min: boolean) => void;
}

export function InfoBox({ data, showInfo, min, setMin }: InfoBoxProps) {
  const pathname = usePathname();
  const { filteredExhibitions } = useExhibitions();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const isWorkSlugPage =
    pathname.startsWith("/works/") && pathname !== "/works";
  const isExhibitionsPage = pathname === "/exhibitions";
  const isExhibitionSlugPage =
    pathname.startsWith("/exhibitions/") && pathname !== "/exhibitions";

  const isWork = (item: InfoData): item is Work =>
    "acf" in item && "materials" in item.acf;

  if (isExhibitionSlugPage || !showInfo || !data) return null;

  const matchedExhibition =
    isWork(data) && data.acf.exhibition
      ? filteredExhibitions.find(
          (exh) =>
            exh.acf.title.trim().toLowerCase() ===
            data.acf.exhibition.trim().toLowerCase()
        )
      : null;

  return (
    <>
      <div
        className={`z-30  fixed left-0 bottom-18 lg:bottom-12   w-full flex flex-col   font-pressuraLight   px-12  text-sm   `}
      >
        {/* Title top half */}
        <div className="flex flex-col items-start justify-start">
          <h1 className="flex gap-8 justify-between lg:justify-start w-full mb-4">
            <h2
              key={isWork(data) && `work-${data.id}`}
              className="text-left font-pressura   "
            >
              {isWork(data) && data.title.rendered}
            </h2>

            {isWorkSlugPage && isMobile && (
              <Button
                variant="squared_2"
                className="   "
                onClick={() => setMin(!min)}
              >
                {!min ? "Close" : "More info"}
              </Button>
            )}
          </h1>
        </div>
        {!min && !isExhibitionsPage && (
          <div className="flex flex-col max-w-lg  ">
            {isWork(data) ? (
              <>
                {data.acf.dimensions && (
                  <span className="flex  flex-wrap gap-[0.25rem]">
                    <h3>Dimensions:</h3> {data.acf.dimensions}
                  </span>
                )}
                {data.acf.materials && (
                  <span className="flex flex-wrap  gap-[0.25rem]">
                    <h3>Materials:</h3> {data.acf.materials}
                  </span>
                )}
                {data.acf.year && (
                  <span className="flex flex-wrap gap-[0.25rem]">
                    <h3>Year:</h3> {data.acf.year}
                  </span>
                )}

                {/* ✅ Exhibition link */}
                {data.acf.exhibition && (
                  <span className="flex flex-wrap gap-[0.25rem]">
                    <h3>Exhibition:</h3>
                    {matchedExhibition ? (
                      <Link
                        href={`/exhibitions/${matchedExhibition.slug}`}
                        className="hover:underline"
                      >
                        {matchedExhibition.acf.title}
                      </Link>
                    ) : (
                      <span>{data.acf.exhibition}</span>
                    )}
                  </span>
                )}
              </>
            ) : (
              <>
                {(data.acf.start_date || data.acf.end_date) && (
                  <span className="flex flex-wrap gap-[0.25rem]">
                    <h3>Duration:</h3> {data.acf.start_date ?? ""}—
                    {data.acf.end_date ?? ""}
                  </span>
                )}
                {data.acf.exhibition_type && (
                  <span className="flex flex-wrap gap-[0.25rem]">
                    <h3>Exhibition type:</h3> {data.acf.exhibition_type}
                  </span>
                )}
                {data.acf.venue && (
                  <span className="flex flex-wrap gap-[0.25rem]">
                    <h3>Venue:</h3> {data.acf.venue}
                  </span>
                )}
                {data.acf.city && (
                  <span className="flex flex-wrap gap-[0.25rem]">
                    <h3>City:</h3> {data.acf.city}
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

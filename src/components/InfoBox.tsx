"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Work, Exhibition } from "../../lib/wordpress";
import { TypingText } from "./animate-ui/primitives/texts/typing";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Link from "next/link";

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
        className={`z-60  fixed left-0 bottom-0 w-full flex flex-col gap-0  lg:gap-3 font-hershey text-2xl  lg:text-xl  max-w-3/4 p-3 `}
      >
        {/* Title top half */}
        <div className="flex gap-1.5">
          <AnimatePresence mode="wait">
            <TypingText
              key={isWork(data) ? `work-${data.id}` : `exh-${data.id}`}
              text={isWork(data) ? data.title.rendered : data.acf.title ?? ""}
              className="text-left uppercase "
            />
          </AnimatePresence>
          {isWorkSlugPage && (
            <button
              onClick={() => setMin(!min)}
              className="cursor-pointer opacity-30 pl-1.5"
            >
              (+)
            </button>
          )}
        </div>
        {!min && !isExhibitionsPage && (
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-3 lg:w-full ">
            {isWork(data) ? (
              <>
                {data.acf.year && (
                  <span className="flex gap-1.5">
                    <h3>Year:</h3> {data.acf.year}
                  </span>
                )}
                {data.acf.dimensions && (
                  <span className="flex gap-1.5">
                    <h3>Dimensions:</h3> {data.acf.dimensions}
                  </span>
                )}
                {data.acf.materials && (
                  <span className="flex flex-wrap lg:flex-nowrap gap-x-1.5">
                    <h3>Materials:</h3> {data.acf.materials}
                  </span>
                )}

                {/* ✅ Exhibition link */}
                {data.acf.exhibition && (
                  <span className="flex gap-1.5">
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
                  <span className="flex gap-1.5">
                    <h3>Duration:</h3> {data.acf.start_date ?? ""}—
                    {data.acf.end_date ?? ""}
                  </span>
                )}
                {data.acf.exhibition_type && (
                  <span className="flex gap-1.5">
                    <h3>Exhibition type:</h3> {data.acf.exhibition_type}
                  </span>
                )}
                {data.acf.venue && (
                  <span className="flex gap-1.5">
                    <h3>Venue:</h3> {data.acf.venue}
                  </span>
                )}
                {data.acf.city && (
                  <span className="flex gap-1.5">
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

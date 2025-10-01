"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Work, Exhibition } from "../../lib/wordpress";
import { TypingText } from "./animate-ui/primitives/texts/typing";

type InfoData = Work | Exhibition;

interface InfoBoxProps {
  data: InfoData | null;
  showInfo: boolean;
  min: boolean;
}

export function InfoBox({ data, showInfo, min }: InfoBoxProps) {
  const pathname = usePathname();

  const isWorksPage = pathname === "/";
  const isExhibitionsPage = pathname === "/exhibitions";
  const isExhibitionSlugPage =
    pathname.startsWith("/exhibitions/") && pathname !== "/exhibitions";

  const isWork = (item: InfoData): item is Work =>
    "acf" in item && "materials" in item.acf;

  if (isExhibitionSlugPage || !showInfo || !data) return null;

  const boxPosition =
    isWorksPage || isExhibitionsPage
      ? "bottom-0 top-auto lg:top-1/2"
      : "bottom-0";

  return (
    <>
      <div
        className={`fixed left-3 w-full pb-3 flex flex-col gap-0 lg:flex-row lg:gap-3 ${boxPosition}`}
      >
        {/* Title top half */}

        <AnimatePresence mode="wait">
          <TypingText
            key={isWork(data) ? `work-${data.id}` : `exh-${data.id}`}
            text={isWork(data) ? data.title.rendered : data.acf.title ?? ""}
            className="text-base lg:text-xs text-left uppercase"
          />
        </AnimatePresence>

        {/* Details pinned to bottom */}
        {!min && !isExhibitionsPage && (
          <div
            className={`flex flex-col lg:flex-row gap-0 lg:gap-4 text-base max-w-2/3 lg:text-xs lg:w-full`}
          >
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
                {data.acf.exhibition && (
                  <span className="flex flex-wrap lg:flex-nowrap gap-x-1.5">
                    <h3>Part of exhibition:</h3> {data.acf.exhibition}
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

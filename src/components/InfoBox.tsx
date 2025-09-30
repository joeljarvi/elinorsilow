"use client";

import { AnimatePresence } from "framer-motion";
import { Work, Exhibition } from "../../lib/wordpress";

import { TypingText } from "./animate-ui/primitives/texts/typing";

type InfoData = Work | Exhibition;

interface InfoBoxProps {
  data: InfoData | null;
  showInfo: boolean;

  min: boolean;
}

export function InfoBox({
  data,
  showInfo,

  min,
}: InfoBoxProps) {
  const isWork = (item: InfoData): item is Work =>
    "acf" in item && "materials" in item.acf;

  if (!showInfo || !data) return null;

  return (
    <div className="max-h-1/4 flex flex-col lg:flex-row font-haas justify-start items-start lg:items-center lg:justify-start gap-0 p-3 lg:gap-1.5 w-full uppercase">
      {/* Title + toggle */}
      <div className="flex items-center justify-start w-full lg:w-auto  gap-1.5">
        <AnimatePresence mode="wait">
          <TypingText
            text={isWork(data) ? data.title.rendered : data.acf.title ?? ""}
            className="font-haas text-base lg:text-xs text-left  uppercase  "
          />
        </AnimatePresence>
      </div>

      {/* Details */}
      {!min && (
        <div className=" flex flex-col lg:flex-row text-base lg:text-xs gap-0 lg:gap-1.5">
          {isWork(data) ? (
            <>
              {data.acf.year && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">Year:</h3> {data.acf.year}
                </span>
              )}
              {data.acf.dimensions && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">Dimensions:</h3> {data.acf.dimensions}
                </span>
              )}

              {data.acf.materials && (
                <span className="flex flex-wrap lg:flex-nowrap items-baseline justify-start gap-x-1.5">
                  <h3 className="">Materials:</h3> {data.acf.materials}
                </span>
              )}
              {data.acf.exhibition && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">Part of exhibition:</h3>{" "}
                  {data.acf.exhibition}
                </span>
              )}
            </>
          ) : (
            <>
              {(data.acf.start_date || data.acf.end_date) && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">Duration:</h3> {data.acf.start_date ?? ""}—
                  {data.acf.end_date ?? ""}
                </span>
              )}
              {data.acf.exhibition_type && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">Exhibition type:</h3>{" "}
                  {data.acf.exhibition_type}
                </span>
              )}
              {data.acf.venue && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">Venue:</h3> {data.acf.venue}
                </span>
              )}
              {data.acf.city && (
                <span className="flex items-baseline justify-start gap-1.5">
                  <h3 className="">City:</h3> {data.acf.city}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import type { Work } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import Ticker from "./Ticker";

// The home page: the nav (ESNav) and one
// featured work filling the screen under it, its details below. It doesn't
// scroll. Mobile: the image, then the details a line each. Desktop: the image
// in cols 3–12, the details in the list rows' columns.
export default function HomeLayoutClient({ work }: { work: Work | null }) {
  const { siteReveal } = useUI();
  // Hidden behind the "under construction" overlay; fades in when it closes.
  const fade = `transition-opacity duration-1000 ${siteReveal === "covered" ? "opacity-0" : "opacity-100"}`;
  const details = work
    ? [
        { text: work.title.rendered, cols: "lg:col-start-3 lg:col-span-2" },
        { text: work.acf.materials, cols: "lg:col-start-5 lg:col-span-3" },
        { text: work.acf.dimensions, cols: "lg:col-start-8 lg:col-span-2" },
        { text: work.acf.year, cols: "lg:col-start-10 lg:col-span-1" },
      ]
    : [];
  return (
    <>
      {work && (
        <main className="h-dvh flex flex-col pt-12 px-3 lg:pt-9 lg:px-4 font-stix text-sm leading-none text-primary">
          {work.image_url && (
            <div className="flex-1 min-h-0 lg:grid lg:grid-cols-12 lg:gap-x-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${work.image_url}?w=2000&auto=format`}
                alt={work.title.rendered}
                className={`${fade} block w-full h-full min-h-0 object-contain object-left lg:object-center lg:col-start-3 lg:col-span-10`}
              />
            </div>
          )}
          <div
            className={`${fade} flex flex-col py-3 lg:py-0 lg:grid lg:grid-cols-12 lg:gap-x-4`}
          >
            {details
              .filter((d) => d.text)
              .map((d) => (
                <span
                  key={d.cols}
                  className={`flex items-center h-12 lg:h-9 min-w-0 ${d.cols}`}
                >
                  <Ticker className="w-full">{d.text}</Ticker>
                </span>
              ))}
          </div>
        </main>
      )}
    </>
  );
}

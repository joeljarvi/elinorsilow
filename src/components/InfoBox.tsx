"use client";

import { Fragment, useEffect, useState } from "react";
import { Work, Exhibition } from "../../lib/sanity";
import { useUI } from "@/context/UIContext";
import WigglyButton from "./WigglyButton";

function truncateTitle(title: string, maxChars = 45): string {
  if (title.length <= maxChars) return title;
  return title.slice(0, maxChars - 5).trimEnd() + " (..)";
}

export function InfoRow({
  label,
  children,
  labelClassName = "text-muted-foreground italic",
}: {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-[16px]">
      <span
        className={`text-[16px] leading-[1.3] px-[0px] tracking-wide font-timesNewRoman ${labelClassName}`}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export default function InfoBox({
  work,
  exhibition,
  onClose,
  hideZoom = false,
  onWorkSelect,
  className = "",
  centered = false,
  titleOnly = false,
  hideTitle = false,
  titleSize = "text-lg",
  titleBold = true,
  metaGrid = false,
}: {
  work?: Work;
  exhibition?: Exhibition;
  onClose?: () => void;
  hideZoom?: boolean;
  onWorkSelect?: (workTitle: string) => void;
  className?: string;
  centered?: boolean;
  titleOnly?: boolean;
  hideTitle?: boolean;
  titleSize?: string;
  titleBold?: boolean;
  /** Metadata keeps a grid at lg too — year, materials and dimensions pinned to
   *  cols 1, 4 and 8 of a 12-col row — instead of collapsing to one comma line. */
  metaGrid?: boolean;
}) {
  const { small } = useUI();
  const [cookieAccepted, setCookieAccepted] = useState(false);
  useEffect(() => {
    setCookieAccepted(localStorage.getItem("cookiesAccepted") !== null);
  }, []);

  if (work) {
    const parts: { key: string; node: React.ReactNode }[] = [
      {
        key: "title",
        node: (
          <WigglyButton
            text={truncateTitle(work.title.rendered)}
            size={titleSize}
            mobileSize={titleSize}
            bold={titleBold}
            className="px-4 mt-2 tracking-wider leading-tight whitespace-break-spaces"
            forceBaseline
            wiggleGradient
            active
          />
        ),
      },
      ...(work.acf.year
        ? [
            {
              key: "year",
              node: <span className="text-base">{work.acf.year}</span>,
            },
          ]
        : []),
      ...(work.acf.materials
        ? [
            {
              key: "mat",
              node: (
                <span className="lowercase whitespace-break-spaces text-base px-4">
                  {work.acf.materials}
                </span>
              ),
            },
          ]
        : []),
      ...(work.acf.dimensions
        ? [{ key: "dim", node: <span>{work.acf.dimensions}</span> }]
        : []),
    ];

    const visibleParts = titleOnly
      ? parts.filter((p) => p.key === "title")
      : hideTitle
        ? parts.filter((p) => p.key !== "title")
        : parts;

    return (
      <div className={`text-foreground no-hide text-base   ${className}`}>
        {/* Metadata on its own: mobile sets it as a two-column grid — year and
            materials side by side, dimensions under the year — instead of the
            single comma-run line desktop keeps. w-full so the tracks come from
            the container rather than the content: as a shrink-to-fit box the
            columns would sit somewhere different for every work. */}
        {hideTitle && (
          <div
            className={`grid w-full grid-cols-2 gap-x-4 items-baseline font-timesNewRoman gap-y-2 text-base lg:text-lg leading-tight tracking-wide text-left ${metaGrid ? "lg:grid-cols-12 lg:gap-y-0" : "lg:hidden"}`}
          >
            {work.acf.year && (
              <span
                className={`col-start-1 row-start-1 px-4 ${metaGrid ? "pb-6 lg:pb-0 lg:col-start-1 lg:row-start-1" : ""}`}
              >
                {work.acf.year}
              </span>
            )}
            {work.acf.materials && (
              <span
                className={`col-start-2 row-start-1 lowercase whitespace-break-spaces px-4 ${metaGrid ? "pb-6 lg:pb-0 lg:col-start-4 lg:col-span-4 lg:row-start-1" : ""}`}
              >
                {work.acf.materials}
              </span>
            )}
            {work.acf.dimensions && (
              <span
                className={`col-start-1 row-start-2 px-4 ${metaGrid ? "pb-6 lg:pb-0 lg:col-start-11 lg:col-span-2 lg:row-start-1" : ""}`}
              >
                {work.acf.dimensions}
              </span>
            )}
          </div>
        )}
        <span
          className={`${hideTitle ? (metaGrid ? "hidden" : "hidden lg:flex") : "flex"} flex-wrap items-baseline font-timesNewRoman text-lg lg:text-lg leading-tight tracking-wide ${centered ? "justify-center text-center" : "justify-start text-left"}`}
        >
          {visibleParts.map((part, i) => {
            // The year normally rides along with the title; with the title
            // hidden it has to render as a part of its own or it disappears.
            if (part.key === "year" && !hideTitle) return null;
            const yearPart = visibleParts.find((p) => p.key === "year");
            if (part.key === "title") {
              return (
                <Fragment key={part.key}>
                  <span className="inline-flex items-baseline flex-wrap">
                    {part.node}
                    {yearPart && (
                      <>
                        <span className="mr-1.5">, </span>
                        {yearPart.node}
                      </>
                    )}
                  </span>
                </Fragment>
              );
            }
            return (
              <Fragment key={part.key}>
                {i > 0 && <span className="mr-1.5">, </span>}
                {part.node}
              </Fragment>
            );
          })}
          {onClose && (
            <button
              className="cursor-pointer ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </span>
      </div>
    );
  }

  if (exhibition) {
    const [descExpanded, setDescExpanded] = useState(false);

    const parts: { key: string; node: React.ReactNode }[] = [
      {
        key: "title",
        node: (
          <WigglyButton
            text={truncateTitle(exhibition.title.rendered)}
            size="text-lg"
            mobileSize="text-lg"
            bold
            className="px-0 tracking-wide whitespace-normal leading-tight"
            forceBaseline
            wiggleGradient
            active
          />
        ),
      },
      ...(exhibition.acf.year
        ? [
            {
              key: "year",
              node: <span className="">{exhibition.acf.year}</span>,
            },
          ]
        : []),
      ...(exhibition.acf.location
        ? [
            {
              key: "loc",
              node: (
                <span className="lowercase">{exhibition.acf.location}</span>
              ),
            },
          ]
        : []),
      ...(exhibition.acf.exhibition_type
        ? [
            {
              key: "type",
              node: (
                <span className="lowercase">
                  {exhibition.acf.exhibition_type} exhibition
                </span>
              ),
            },
          ]
        : []),
    ];

    const visibleParts = titleOnly
      ? parts.filter((p) => p.key === "title")
      : hideTitle
        ? parts.filter((p) => p.key !== "title")
        : parts;

    return (
      <div
        className={`text-foreground no-hide ${!cookieAccepted ? "mb-12" : "mb-4 lg:mb-4"} ${className}`}
      >
        <span
          className={`flex flex-wrap items-baseline font-areal my-text leading-tight tracking-wide ${centered ? "justify-center text-center" : "justify-start text-left"}`}
        >
          {visibleParts.map((part, i) => {
            // The year normally rides along with the title; with the title
            // hidden it has to render as a part of its own or it disappears.
            if (part.key === "year" && !hideTitle) return null;
            const yearPart = visibleParts.find((p) => p.key === "year");
            if (part.key === "title") {
              return (
                <Fragment key={part.key}>
                  <span className="inline-flex items-baseline flex-wrap">
                    {part.node}
                    {yearPart && (
                      <>
                        <span className="mr-[2px]">, </span>
                        {yearPart.node}
                      </>
                    )}
                  </span>
                </Fragment>
              );
            }
            return (
              <Fragment key={part.key}>
                {i > 0 && <span className="mr-[2px]">, </span>}
                {part.node}
              </Fragment>
            );
          })}
        </span>
      </div>
    );
  }

  return null;
}

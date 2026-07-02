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
}) {
  const { small } = useUI();
  const [cookieAccepted, setCookieAccepted] = useState(false);
  useEffect(() => {
    setCookieAccepted(localStorage.getItem("cookiesAccepted") === "true");
  }, []);

  if (work) {
    const parts: { key: string; node: React.ReactNode }[] = [
      {
        key: "title",
        node: (
          <WigglyButton
            text={truncateTitle(work.title.rendered)}
            size="text-3xl"
            mobileSize="text-2xl"
            bold
            className="px-0 tracking-widest leading-tight whitespace-break-spaces"
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
              node: <span className="font-bold">{work.acf.year}</span>,
            },
          ]
        : []),
      ...(work.acf.materials
        ? [
            {
              key: "mat",
              node: (
                <span className="lowercase whitespace-break-spaces">
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
      <div
        className={`text-foreground no-hide ${!cookieAccepted ? "mb-12" : "mb-4 lg:mb-4"} ${className}`}
      >
        <span
          className={`inline-flex flex-wrap items-baseline font-timesNewRoman text-2xl lg:text-3xl leading-tight tracking-wide ${centered ? "lg:justify-center lg:text-center" : ""}`}
        >
          {visibleParts.map((part, i) => (
            <Fragment key={part.key}>
              {i > 0 && <span className="mr-1.5">, </span>}
              {part.node}
            </Fragment>
          ))}
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
            size="text-3xl"
            mobileSize="text-2xl"
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
              node: <span className="font-bold">{exhibition.acf.year}</span>,
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
          className={`inline-flex flex-wrap items-baseline font-timesNewRoman text-2xl lg:text-3xl leading-tight tracking-wide ${centered ? "lg:justify-center" : ""}`}
        >
          {visibleParts.map((part, i) => (
            <Fragment key={part.key}>
              {i > 0 && <span className="mr-[2px]">, </span>}
              {part.node}
            </Fragment>
          ))}
        </span>
      </div>
    );
  }

  return null;
}

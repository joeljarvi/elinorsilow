"use client";

import { useState } from "react";
import { Work, Exhibition } from "../../lib/sanity";

import { useUI } from "@/context/UIContext";
import WigglyButton from "./WigglyButton";

import { Cross2Icon } from "@radix-ui/react-icons";

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
        className={`text-[16px]  leading-[1.3] px-[0px]  tracking-wide font-timesNewRoman  ${labelClassName}`}
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
}: {
  work?: Work;
  exhibition?: Exhibition;
  onClose?: () => void;
  hideZoom?: boolean;
  onWorkSelect?: (workTitle: string) => void;
}) {
  const { showColorBg } = useUI();

  if (work) {
    const yearDimensions = [work.acf.year, work.acf.dimensions]
      .filter(Boolean)
      .join(", ");

    return (
      <div
        className={`text-foreground relative group  block gap-x-[18px] no-hide items-center  overflow-hidden pt-[9px] px-[0px] lg:px-[0px] pb-[9px] w-full`}
      >
        {/* Metadata */}
        <div className="font-timesNewRoman text-[16px]  leading-tight tracking-wider w-full">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-between gap-x-[9px] w-full  mb-[0px]">
              <span className="flex gap-x-[6px] items-center w-full">
                <WigglyButton
                  text={work.title.rendered}
                  className="hidden lg:flex text-[16px] px-0  font-timesNewRoman font-normal  items-center  tracking-wider "
                  size="text-[28px] "
                  revealAnimation={false}
                  active={true}
                  sizeGradient={{ from: 28, to: 16 }}
                />

                <WigglyButton
                  text={work.title.rendered}
                  className="flex lg:hidden text-[16px] px-0  font-timesNewRoman font-normal items-baseline  tracking-wider "
                  size="text-[24px] "
                  revealAnimation={false}
                  active={true}
                  sizeGradient={{ from: 24, to: 16 }}
                />
              </span>
              {onClose && (
                <button
                  className="cursor-pointer "
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  aria-label="Close"
                >
                  x
                </button>
              )}
            </div>
            {yearDimensions && <p className="w-full">{yearDimensions}</p>}
            {work.acf.materials && (
              <p className="w-full">{work.acf.materials}</p>
            )}
            {work.acf.exhibition && (
              <div className="w-full flex flex-wrap items-baseline justify-start gap-x-[5px] whitespace-normal ">
                Part of exhibition:
                <button className="">{work.acf.exhibition}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (exhibition) {
    const [descExpanded, setDescExpanded] = useState(false);

    const descWords = exhibition.acf.description?.split(/\s+/) ?? [];
    const descHead = descWords.slice(0, 3).join(" ");
    const descBodyWords = descWords.slice(3);
    const TRUNCATE_AT = 15;
    const isTruncatable = descBodyWords.length > TRUNCATE_AT;
    const descBody =
      !descExpanded && isTruncatable
        ? descBodyWords.slice(0, TRUNCATE_AT).join(" ") + " (...)"
        : descBodyWords.join(" ");

    const works = [
      exhibition.acf.work_1,
      exhibition.acf.work_2,
      exhibition.acf.work_3,
      exhibition.acf.work_4,
      exhibition.acf.work_5,
      exhibition.acf.work_6,
      exhibition.acf.work_7,
      exhibition.acf.work_8,
      exhibition.acf.work_9,
      exhibition.acf.work_10,
    ].filter(Boolean) as string[];

    return (
      <div className="text-foreground relative group   pt-[0px] px-[0px] pb-[9px]  w-auto   lg:mt-[0px] mb-[0x]  ">
        <div className="flex flex-col  justify-start items-start gap-x-[32px] gap-y-[32px] lg:gap-y-[32px] font-timesNewRoman text-[16px] leading-tight tracking-wide max-w-3xl pt-[0px] pb-[0px]  ">
          <div className=" flex-col items-start justify-start col-span-2 w-full">
            <div className="flex items-start justify-between w-full">
              <span className="flex justify-between gap-x-[6px] w-full ">
                <WigglyButton
                  text={exhibition.title.rendered}
                  className="px-0 font-timesNewRoman "
                  size="text-[16px] lg:text-[16px]  "
                  revealAnimation={false}
                  active
                />

                {onClose && (
                  <button
                    className="cursor-pointer px-1  bg-transparent text-[16px] "
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    aria-label="Close"
                  >
                    X
                  </button>
                )}
              </span>
            </div>
            {exhibition.acf.exhibition_type && (
              <div className="whitespace-nowrap tracking-wider">
                {exhibition.acf.exhibition_type} exhibition
              </div>
            )}
            {exhibition.acf.location && (
              <div className="tracking-wider">{exhibition.acf.location}</div>
            )}
            {exhibition.acf.city && (
              <div className="whitespace-nowrap tracking-wider">
                {exhibition.acf.city}
              </div>
            )}
            {exhibition.acf.year && (
              <div className="tracking-wider">{exhibition.acf.year}</div>
            )}
          </div>

          {exhibition.acf.description && (
            <div className="col-start-1 col-span-2 max-w-md lg:max-w-xl tracking-wider">
              <p className="font-timesNewRoman text-[24px] tracking-wide leading-[1.2]">
                {descHead && (
                  <>
                    <WigglyButton
                      text={descHead + " "}
                      className=" inline-flex lg:hidden px-0 font-timesNewRoman align-baseline"
                      size="text-[24px] lg:text-[28px] leading-[1.2]"
                      sizeGradient={{ from: 24, to: 24 }}
                      wiggleGradient
                      revealAnimation={false}
                      active
                    />
                    <WigglyButton
                      text={descHead + " "}
                      className="hidden lg:inline-flex px-0 font-timesNewRoman align-baseline"
                      size="text-[24px] lg:text-[28px] leading-[1.2]"
                      sizeGradient={{ from: 28, to: 28 }}
                      wiggleGradient
                      revealAnimation={false}
                      active
                    />
                  </>
                )}
                {descBody && <span>{descBody}</span>}
              </p>
              {isTruncatable && (
                <WigglyButton
                  text={descExpanded ? "Read less" : "Read more"}
                  size="text-[16px]"
                  className="px-0 mt-[9px] text-foreground"
                  revealAnimation={false}
                  active
                  onClick={() => setDescExpanded((v) => !v)}
                />
              )}
            </div>
          )}

          <div className="px-0 col-start-2 col-span-1">
            {works.length > 0 && (
              <>
                <WigglyButton
                  text="Featuring the works:"
                  size="text-[16px] lg:text-[16px] "
                  className=" px-0 justify-start"
                  revealAnimation={false}
                  active
                />
                {works.map((w, i) => (
                  <WigglyButton
                    size="text-[24px] lg:text-[28px] "
                    bold={false}
                    className="pl-0 justify-start"
                    revealAnimation={false}
                    text={w}
                    key={i}
                    onClick={() => onWorkSelect?.(w)}
                  />
                ))}
              </>
            )}
          </div>
          {exhibition.acf.credits && (
            <div className="col-start-1 col-span-1 mb-[32px] mx-0 tracking-wider">
              <WigglyButton
                text="Credits"
                size="text-[16px] "
                className="  pl-0"
                revealAnimation={false}
                active
              />
              <div>{exhibition.acf.credits}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

"use client";

import { useState } from "react";
import { Work, Exhibition } from "../../lib/sanity";
import CornerFrame from "@/components/CornerFrame";
import { useUI } from "@/context/UIContext";
import WigglyButton from "./WigglyButton";
import { Button } from "./ui/button";
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons";

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
}: {
  work?: Work;
  exhibition?: Exhibition;
  onClose?: () => void;
  hideZoom?: boolean;
}) {
  const { showColorBg } = useUI();

  if (work) {
    const yearDimensions = [work.acf.year, work.acf.dimensions]
      .filter(Boolean)
      .join(", ");

    return (
      <div
        className={`text-foreground relative group  block gap-x-[18px]  items-center  overflow-hidden pt-[9px] px-[0px] lg:px-[0px] pb-[9px] w-full`}
      >
        {/* Metadata */}
        <div className="font-timesNewRoman text-[16px]  leading-tight tracking-wider w-full">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-between gap-x-[9px] w-full mb-[0px]">
              <span className="flex gap-x-[6px]">
                {onClose && (
                  <button
                    className="cursor-pointer "
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    aria-label="Close"
                  >
                    <Cross2Icon className="w-4 h-4" />
                  </button>
                )}
                <WigglyButton
                  text={work.title.rendered}
                  className="hidden lg:flex text-[16px] px-0  font-timesNewRoman font-normal  items-end -mt-[9px]  tracking-wider "
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
              {/* {onImageClick && !hideZoom && (
                <button
                  className="cursor-pointer text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick();
                  }}
                  aria-label="Zoom"
                >
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </button>
              )} */}
            </div>
            {yearDimensions && <div className="w-full">{yearDimensions}</div>}
            {work.acf.materials && (
              <div className="w-full">{work.acf.materials}</div>
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
    const descHead = descWords.slice(0, 2).join(" ");
    const descBody = descWords.slice(2, -8).join(" ");
    const descTail = descWords.slice(-8).join(" ");

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
      <div className="text-foreground relative group   pt-[0px] px-[0px] pb-[9px]  w-auto   lg:mt-[0px] mb-[0x] ">
        <div className="grid grid-cols-2 justify-start items-start gap-x-[32px] gap-y-[32px] lg:gap-y-[32px] font-timesNewRoman text-[16px] leading-tight tracking-wide max-w-3xl pt-[0px] pb-[0px]  ">
          <div className=" flex-col items-start justify-start col-span-2 w-full">
            <span className="flex gap-x-[6px] ">
              {onClose && (
                <button
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  aria-label="Close"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              )}
              <WigglyButton
                text={exhibition.title.rendered}
                className="px-0 font-timesNewRoman "
                size="text-[16px] lg:text-[16px]  "
                revealAnimation={false}
                active
              />
            </span>
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
            <div className="col-start-1 col-span-2 max-w-md lg:max-w-xl tracking-wider ">
              <p
                className={`font-timesNewRoman text-[24px] tracking-wide leading-[1.2] `}
              >
                {descHead && (
                  <WigglyButton
                    text={descHead + " "}
                    className="inline-flex px-0 font-timesNewRoman align-baseline"
                    size="text-[24px] lg:text-[28px] leading-[1.2]"
                    sizeGradient={{ from: 24, to: 24 }}
                    wiggleGradient
                    revealAnimation={false}
                    active
                  />
                )}
                {descBody && <span>{descBody} </span>}
                {descTail && (
                  <WigglyButton
                    text={descTail}
                    className="inline-flex px-0 font-timesNewRoman align-baseline"
                    size="text-[24px] lg:text-[28px] leading-[1.2]"
                    sizeGradient={{ from: 24, to: 16 }}
                    wiggleGradient
                    revealAnimation={false}
                    active
                  />
                )}
              </p>
            </div>
          )}

          {exhibition.acf.credits && (
            <div className="col-start-1 col-span-1  mx-0 tracking-wider">
              <WigglyButton
                text="credits"
                size="text-[16px] "
                className="  pl-0"
                revealAnimation={false}
                active
              />
              <div>{exhibition.acf.credits}</div>
            </div>
          )}
          <div className="px-0 col-start-2 col-span-1">
            {works.length > 0 && (
              <>
                <WigglyButton
                  text="featuring the works:"
                  size="text-[16px] "
                  className=" px-0"
                  revealAnimation={false}
                  active
                />
                {works.map((w, i) => (
                  <WigglyButton
                    size="text-[16px] "
                    bold={false}
                    className="pl-0"
                    revealAnimation={false}
                    active={false}
                    text={w}
                    key={i}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

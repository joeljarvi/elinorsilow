"use client";

import { Work, Exhibition } from "../../lib/sanity";
import { OGubbeText } from "@/components/OGubbeText";
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
        className={`text-muted-foreground relative group  block gap-x-[18px]  items-center  overflow-hidden pt-[9px] px-[0px] lg:px-[0px] pb-[9px] w-full`}
      >
        {/* Metadata */}
        <div className="font-timesNewRoman text-[16px]  leading-tight tracking-wider w-full">
          <div className="flex flex-col items-start justify-center">
            <div className="flex items-center justify-between gap-x-[9px] w-full mb-[0px]">
              <span className="flex gap-x-[6px]">
                {onClose && (
                  <button
                    className="cursor-pointer text-shadow-md"
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
                  className="text-[16px] px-0  font-timesNewRoman font-normal text-muted-foreground tracking-wider text-shadow-md"
                  size="text-[16px] "
                  revealAnimation={false}
                  active={true}
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
      <div className="text-muted-foreground relative group  border-b-1 pt-[0px] px-[0px] pb-[9px]  w-full   lg:mt-[0px] mb-[0x]">
        <div className="flex flex-col lg:grid lg:grid-cols-2 justify-start items-start gap-x-[32px] gap-y-[32px] font-timesNewRoman text-[16px] leading-tight tracking-wide w-full pt-[0px] pb-[0px]">
          <div className=" flex-col items-start justify-start col-span-1 w-full">
            <span className="flex gap-x-[6px] ">
              {onClose && (
                <button
                  className="cursor-pointer text-muted-foreground text-shadow-md"
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
                className="px-0 font-timesNewRoman text-muted-foreground text-shadow-md"
                size="text-[16px]"
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
            <div className="col-start-2 col-span-1 tracking-wider ">
              <WigglyButton
                text="description"
                size="text-[16px] "
                className=" px-0 text-muted-foreground text-shadow-md"
                revealAnimation={false}
                active
              />
              {exhibition.acf.description}
            </div>
          )}
          {exhibition.acf.credits && (
            <div className="col-start-1 col-span-1  mx-0 tracking-wider">
              <WigglyButton
                text="credits"
                size="text-[16px] "
                className="  pl-0  text-muted-foreground text-shadow-md"
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
                  text="featuring"
                  size="text-[16px] "
                  className=" px-0 text-muted-foreground text-shadow-md "
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

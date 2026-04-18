"use client";

import { Work, Exhibition } from "../../lib/sanity";
import { OGubbeText } from "@/components/OGubbeText";
import CornerFrame from "@/components/CornerFrame";
import { useUI } from "@/context/UIContext";
import WigglyButton from "./WigglyButton";

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
    <div className="flex flex-row items-baseline gap-x-[16px]">
      <span
        className={`text-[16px] lg:text-[19px] leading-[1.3] px-[0px] no-hide-text tracking-wide font-timesNewRoman ${labelClassName}`}
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
  onImageClick,
  hideZoom = false,
}: {
  work?: Work;
  exhibition?: Exhibition;
  onClose?: () => void;
  onImageClick?: () => void;
  hideZoom?: boolean;
}) {
  const { showColorBg } = useUI();

  if (work) {
    const yearDimensions = [work.acf.year, work.acf.dimensions]
      .filter(Boolean)
      .join(", ");

    return (
      <div
        className={`text-muted-foreground mb-[32px] lg:mt-[32px] lg:mb-[18px] relative group max-h-dvh block gap-x-[18px] gap-y-[9px] lg:gap-y-[18px] items-center bg-transparent overflow-hidden pt-[9px] px-[9px] pb-[9px]`}
      >
        {/* Close / zoom buttons */}
        {(onClose || onImageClick) && (
          <div className="absolute top-[9px] right-[9px] z-30 no-hide-text flex items-center gap-x-[9px] mt-[20px] mr-[18px]">
            {onImageClick && !hideZoom && (
              <>
                <WigglyButton
                  text="(zoom)"
                  className="flex cursor-pointer  text-muted-foreground px-0"
                  size="text-[16px] lg:text-[19px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick();
                  }}
                />
              </>
            )}
            {onClose && (
              <WigglyButton
                text="(x)"
                className="cursor-pointer px-0  text-muted-foreground"
                size="text-[16px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              />
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="font-timesNewRoman text-[16px] lg:text-[19px] leading-tight tracking-wider px-[18px] pt-[18px] pb-[18px] w-full">
          {/* Title using OGubbeText */}

          <div className="flex flex-col items-start justify-center">
            <WigglyButton
              text={work.title.rendered}
              className="text-[16px] px-0 mb-[4px] lg:mb-[18px] lg:text-[19px] font-timesNewRoman font-normal text-foreground tracking-wider"
              size="text-[16px] lg:text-[19px]"
              revealAnimation={false}
              active={true}
              bold={true}
            />
            {yearDimensions && <div className="w-full">{yearDimensions}</div>}
            {work.acf.materials && (
              <div className="w-full">{work.acf.materials}</div>
            )}
            {work.acf.exhibition && (
              <div className="w-full flex items-baseline gap-x-[5px] ">
                Part of exhibition:{" "}
                <WigglyButton
                  text={work.acf.exhibition}
                  className="px-0"
                  size="text-[16px] lg:text-[19px]"
                />
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
      <div className="text-muted-foreground no-hide-text relative group bg-transparent pt-[18px] px-[18px] pb-[18px] w-full max-w-5xl mx-auto lg:mt-[32px] mb-[18px]">
        {/* Close / zoom buttons */}
        {(onClose || onImageClick) && (
          <div className="absolute top-[18px] right-[18px] z-30 no-hide-text flex items-center">
            {onImageClick && (
              <>
                <WigglyButton
                  text="(+)"
                  className="lg:hidden cursor-pointer text-foreground"
                  size="text-[16px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick();
                  }}
                />
              </>
            )}
            {onClose && (
              <WigglyButton
                text="(X)"
                className="cursor-pointer text-foreground"
                size="text-[16px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              />
            )}
          </div>
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-11 justify-start items-start gap-x-[64px] gap-y-[32px] font-timesNewRoman text-[16px] lg:text-[19px] leading-tight tracking-wide w-full pt-[0px] pb-[18px]">
          <div className="col-start-1 col-span-3 flex-col items-start justify-start">
            <WigglyButton
              text={exhibition.title.rendered}
              className=" px-0 mb-[9px] lg:mb-[18px] font-timesNewRoman text-foreground "
              size="text-[16px] lg:text-[19px]"
              bold={true}
              revealAnimation={false}
              active={true}
            />
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
            <WigglyButton
              text="(show gallery)"
              className="hidden mt-[18px] px-0 lg:flex cursor-pointer text-muted-foreground"
              size="text-[16px]"
              onClick={(e) => {
                e.stopPropagation();
                onImageClick();
              }}
            />
          </div>
          <div className="flex flex-col col-start-4 col-span-5 gap-y-[32px] lg:gap-y-[44px] ">
            {exhibition.acf.description && (
              <div className="  tracking-wider ">
                <WigglyButton
                  text="description"
                  size="text-[16px] lg:text-[19px]"
                  className="mb-[9px] lg:mb-[18px] px-0 text-foreground "
                  active={true}
                  bold={true}
                  revealAnimation={false}
                />
                {exhibition.acf.description}
              </div>
            )}
            {exhibition.acf.credits && (
              <div className="max-w-lg mx-0 tracking-wider">
                <WigglyButton
                  text="credits"
                  size="text-[16px] lg:text-[19px]"
                  className="mb-[9px] lg:mb-[18px] pl-0  text-foreground"
                  active={true}
                  bold={true}
                  revealAnimation={false}
                />
                <div>{exhibition.acf.credits}</div>
              </div>
            )}
          </div>
          <div className="px-0 col-start-9 col-span-3">
            {works.length > 0 && (
              <>
                <WigglyButton
                  text="featuring"
                  size="text-[16px] lg:text-[19px]"
                  className="mb-[9px] lg:mb-[18px] px-0 text-foreground "
                  active={true}
                  bold={true}
                  revealAnimation={false}
                />
                {works.map((w, i) => (
                  <WigglyButton
                    size="text-[16px] lg:text-[19px]"
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

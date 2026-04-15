"use client";

import { Work, Exhibition } from "../../lib/sanity";
import { OGubbeText } from "@/components/OGubbeText";
import CornerFrame from "@/components/CornerFrame";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useUI } from "@/context/UIContext";

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
      <span className={`text-[16px] lg:text-[19px] leading-[1.3] px-[0px] no-hide-text tracking-wide font-timesNewRoman ${labelClassName}`}>
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
}: {
  work?: Work;
  exhibition?: Exhibition;
  onClose?: () => void;
}) {
  const { showColorBg } = useUI();

  if (work) {
    const yearDimensions = [work.acf.year, work.acf.dimensions]
      .filter(Boolean)
      .join(", ");

    return (
      <div className="no-hide-text relative group max-h-dvh block gap-x-[18px] gap-y-[9px] lg:gap-y-[18px] items-center bg-transparent overflow-hidden pt-[9px] px-[9px] pb-[9px]">
        {/* Corner frame background — hidden when color bg is active */}

        {/* Close button */}
        {onClose && (
          <button
            className="absolute top-[9px] right-[9px] z-30 no-hide-text cursor-pointer p-[6px] text-foreground hover:opacity-70 transition-opacity mt-[20px] mr-[18px]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close info"
          >
            <Cross1Icon className="w-[14px] h-[14px]" />
          </button>
        )}

        {/* Metadata */}
        <div className="font-timesNewRoman text-[16px] lg:text-[19px] leading-tight tracking-wide px-[18px] pt-[18px] pb-[18px] w-full">
          {/* Title using OGubbeText */}
          <div className="mb-[6px]">
            <OGubbeText
              text={work.title.rendered}
              lettersOnly
              className="text-[16px] lg:text-[19px] font-timesNewRoman font-normal"
              sizes="19px"
              revealAnimation={false}
            />
          </div>
          {yearDimensions && <div>{yearDimensions}</div>}
          {work.acf.materials && (
            <div>
              <em>{work.acf.materials}</em>
            </div>
          )}
          {work.acf.exhibition && (
            <div>
              part of exhibition: <em>{work.acf.exhibition}</em>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (exhibition) {
    const location = [exhibition.acf.location, exhibition.acf.city]
      .filter(Boolean)
      .join(", ");

    return (
      <div className="no-hide-text relative group max-h-dvh flex flex-col justify-start gap-y-[18px] bg-transparent px-[32px] pt-[64px] pb-[44px] overflow-auto">
        {/* Corner frame background — hidden when color bg is active */}
        {!showColorBg && <CornerFrame padding="inset-2" />}

        {/* Close button */}
        {onClose && (
          <button
            className="absolute top-[9px] right-[9px] z-30 no-hide-text cursor-pointer p-[6px] text-foreground hover:opacity-70 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close info"
          >
            <Cross1Icon className="w-[14px] h-[14px]" />
          </button>
        )}

        {/* Title using OGubbeText */}
        <OGubbeText
          text={exhibition.title.rendered}
          lettersOnly
          className="text-[21px] tracking-wide text-neutral-700"
          sizes="21px"
          revealAnimation={false}
        />
        <div className="p">
          {exhibition.acf.year && <div>{exhibition.acf.year}</div>}
          {location && <div>{location}</div>}
          {exhibition.acf.exhibition_type && (
            <div>
              <em>{exhibition.acf.exhibition_type}</em>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

"use client";

import Image from "next/image";
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
  onImageClick,
}: {
  work?: Work;
  exhibition?: Exhibition;
  onClose?: () => void;
  onImageClick?: () => void;
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
      <div className="no-hide-text relative group bg-transparent pt-[9px] px-[9px] pb-[9px]">
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

        <div className="font-timesNewRoman text-[16px] lg:text-[19px] leading-tight tracking-wide px-[18px] pt-[18px] pb-[18px] w-full">
          {/* Image — clicking opens modal */}
          {exhibition.acf.image_1?.url && onImageClick && (
            <button
              className="block w-full mb-[12px] cursor-zoom-in"
              onClick={onImageClick}
              aria-label={`Open ${exhibition.title.rendered}`}
            >
              <div className="relative w-full max-h-[40vh] overflow-hidden">
                <Image
                  src={exhibition.acf.image_1.url}
                  alt={exhibition.acf.image_1.alt || exhibition.title.rendered}
                  width={800}
                  height={600}
                  className="w-full h-auto object-contain max-h-[40vh]"
                />
              </div>
            </button>
          )}

          {/* Title */}
          <div className="mb-[6px]">
            <OGubbeText
              text={exhibition.title.rendered}
              lettersOnly
              className="text-[16px] lg:text-[19px] font-timesNewRoman font-normal"
              sizes="19px"
              revealAnimation={false}
            />
          </div>

          {/* Year */}
          {exhibition.acf.year && <div>{exhibition.acf.year}</div>}

          {/* Type */}
          {exhibition.acf.exhibition_type && (
            <div><em>{exhibition.acf.exhibition_type} exhibition</em></div>
          )}

          {/* Venue / city */}
          {exhibition.acf.location && <div>{exhibition.acf.location}</div>}
          {exhibition.acf.city && <div>{exhibition.acf.city}</div>}

          {/* Featured works */}
          {works.length > 0 && (
            <div className="mt-[9px]">
              <div className="text-muted-foreground italic mb-[2px]">featuring</div>
              {works.map((w, i) => (
                <div key={i}>{w}</div>
              ))}
            </div>
          )}

          {/* Credits */}
          {exhibition.acf.credits && (
            <div className="mt-[9px]">
              <div className="text-muted-foreground italic mb-[2px]">credits</div>
              <div>{exhibition.acf.credits}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

"use client";

import { Work, Exhibition } from "../../lib/sanity";
import { OGubbeText } from "@/components/OGubbeText";

export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-baseline gap-x-[16px]">
      <span className="text-[24px] lg:text-[21px] leading-[1.3]  px-[0px] no-hide-text  tracking-wide font-timesNewRoman  text-muted-foreground italic">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function InfoBox({
  work,
  exhibition,
}: {
  work?: Work;
  exhibition?: Exhibition;
}) {
  if (work) {
    const yearDimensions = [work.acf.year, work.acf.dimensions]
      .filter(Boolean)
      .join(", ");

    return (
      <div className="no-hide-text max-h-dvh flex flex-row justify-start gap-x-[18px] gap-y-[9px] lg:gap-y-[18px] items-center bg-transparent  overflow-hidden">
        {/* Title */}
        {/* <OGubbeText
          text={work.title.rendered}
          lettersOnly
          className="text-[24px] lg:text-[21px] tracking-wider font-timesNewRoman font-bold max-h-[calc(100dvh-64px)]"
          sizes="21px"
          wrap
          vertical
          rotate={false}
        /> */}
        {/* <span className="font-timesNewRoman font-bold  text-[18px] lg:text-[21px] leading-snug tracking-wider ">
          {work.title.rendered}
        </span> */}

        {/* Bottom: metadata */}

        <div className="font-timesNewRoman  text-[18px] leading-snug tracking-wide mt-[18px] bg-transparent px-[9px] pb-[18px] w-full  ">
          {work.acf.materials && <div>{work.title.rendered}</div>}
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
      <div className="no-hide-text max-h-dvh flex flex-col justify-start gap-y-[18px] bg-transparent px-[32px] pt-[64px] pb-[44px] overflow-auto">
        <OGubbeText
          text={exhibition.title.rendered}
          lettersOnly
          className="text-[21px] tracking-wide text-neutral-700"
          sizes="21px"
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

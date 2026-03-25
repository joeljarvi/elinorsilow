"use client";

import { ReactNode } from "react";
import { OGubbeText } from "./OGubbeText";

interface PageHeaderProps {
  title: string;
  count?: number;
  sortLabel?: string;
  onSortClick?: () => void;
  loading?: boolean;
  controls?: ReactNode;
}

export function PageHeader({
  title,
  count,
  sortLabel,
  onSortClick,
  loading,
  controls,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col items-center lg:items-start">
      <div className="flex flex-col px-[18px] pt-[18px] lg:pt-0 pb-[9px] lg:px-0 items-center lg:items-start gap-x-8">
        <OGubbeText
          text={title}
          loading={loading}
          className="block lg:hidden text-[18px] font-universNextProExt font-extrabold leading-none mb-[9px] font-timesNewRomanWide"
        />
        <span className="flex flex-col lg:flex-row items-start lg:items-center gap-x-4">
          {count !== undefined && (
            <p className="text-[14px] lg:text-[18px] font-timesNewRomanWide leading-relaxed">
              Now showing{" "}
              <span className="font-bold">({loading ? "—" : count})</span>{" "}
              {title.toLowerCase()}
            </p>
          )}
          {sortLabel && (
            <p className="text-[14px] lg:text-[18px] font-timesNewRomanWide leading-relaxed">
              sorted by{" "}
              <button
                onClick={onSortClick}
                className="font-timesNewRomanWide font-bold hover:underline underline-offset-2 cursor-pointer"
              >
                ({sortLabel.toLowerCase()})
              </button>
            </p>
          )}
        </span>
      </div>
      {controls && (
        <div className="hidden lg:flex fixed bottom-0 left-1/2 -translate-x-1/2 z-50 items-center gap-x-4 px-[32px] py-[12px] bg-transparent ]">
          {controls}
        </div>
      )}
    </div>
  );
}

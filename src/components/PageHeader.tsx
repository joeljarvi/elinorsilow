"use client";
import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  count?: number;
  sortLabel?: string;
  onSortClick?: () => void;
  filterLabel?: string;
}

export function PageHeader({
  title,
  count,
  sortLabel,
  onSortClick,
  filterLabel,
}: PageHeaderProps) {
  return (
    <div className=" flex items-baseline justify-between lg:justify-start gap-4 lg:gap-8 w-full px-4 pt-4 lg:px-8 font-bookish mb-4">
      <h1 className="h1 text-xl lg:text-2xl ">Elinor Silow</h1>
      <span className="text-xl lg:text-2xl">
        {title}
        {count !== undefined && <span className="ml-1 ">({count})</span>}
      </span>
      {sortLabel && onSortClick && (
        <Button
          variant="link"
          size="lg"
          aria-label="Sort"
          onClick={onSortClick}
          className="hidden lg:inline-flex text-2xl opacity-40 hover:opacity-100 transition-opacity"
        >
          {sortLabel}
        </Button>
      )}
      {filterLabel && (
        <span className="hidden lg:inline text-2xl opacity-40">
          {filterLabel}
        </span>
      )}
    </div>
  );
}

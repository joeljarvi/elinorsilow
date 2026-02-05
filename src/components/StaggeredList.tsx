"use client";

import { Button } from "./ui/button";
import Staggered from "./Staggered";
import { sortAZ } from "@/lib/sort-az";

type BaseItem = {
  id?: number;
  slug?: string;
  title: { rendered: string };
};

interface StaggeredListProps<T extends BaseItem> {
  items: T[];
  loading?: boolean;
  onSelect?: (item: T) => void;
  setOpen?: (open: boolean) => void;
  isDesktop?: boolean;
  getKey?: (item: T) => string | number;
}

export default function StaggeredList<T extends BaseItem>({
  items = [],
  loading = false,
  onSelect,
  setOpen,
  isDesktop = true,
  getKey,
}: StaggeredListProps<T>) {
  return (
    <div className="relative w-full">
      <Staggered
        items={sortAZ(items)}
        loading={loading}
        className="flex flex-col gap-x-4 items-start justify-start space-y-0 mb-1 w-full"
        getKey={getKey}
        renderItem={(item) => (
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              onSelect?.(item);
              if (!isDesktop && setOpen) setOpen(false);
            }}
            className="transition-all font-gintoRegularItalic hover:font-gintoRegular w-full justify-center lg:justify-start text-sm text-blue-600 hover:text-blue-600"
          >
            {item.title.rendered}
          </Button>
        )}
      />
    </div>
  );
}

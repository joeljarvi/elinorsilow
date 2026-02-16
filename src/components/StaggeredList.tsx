"use client";

import { Button } from "./ui/button";
import Staggered from "./Staggered";
import { sortAZ } from "@/lib/sort-az";
import { Badge } from "./ui/badge";
import HDivider from "./HDivider";

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
    <div className="relative w-full line-clamp-6  mb-2">
      <Staggered
        items={sortAZ(items)}
        loading={loading}
        className="flex flex-wrap   pt-2 gap-2 px-8 lg:gap-4 items-baseline justify-start space-y-0  mb-4 w-full overflow-y-scroll  "
        getKey={getKey}
        renderItem={(item) => (
          <Badge
            variant="default"
            onClick={() => {
              onSelect?.(item);
            }}
            className=""
          >
            {item.title.rendered}
          </Badge>
        )}
      />
    </div>
  );
}

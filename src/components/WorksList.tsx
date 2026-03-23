"use client";

import { Work } from "../../lib/sanity";
import { Button } from "@/components/ui/button";

interface WorksListProps {
  works: Work[];
  onSelect: (work: Work) => void;
}

export default function WorksList({ works, onSelect }: WorksListProps) {
  return (
    <div className="pt-[18px]">
      {works.map((work) => (
        <Button
          variant="ghost"
          size="controls"
          key={work.id}
          onClick={() => onSelect(work)}
          className="w-full rounded-none justify-start"
          aria-label={`Show work: ${work.title.rendered}`}
        >
          {work.title.rendered}
        </Button>
      ))}
    </div>
  );
}

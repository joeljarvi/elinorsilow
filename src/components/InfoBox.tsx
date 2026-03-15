import React from "react";
import { Work } from "../../lib/sanity";
import HDivider from "@/components/HDivider";

export function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | number | React.ReactNode;
  children?: React.ReactNode;
}) {
  if (!value && !children) return null;
  return (
    <>
      <div className="grid grid-cols-4 gap-x-3 items-center justify-start font-bookish">
        <span className="text-sm text-left text-muted-foreground whitespace-nowrap py-1.5 border-r border-border px-4">
          {label}
        </span>
        <div className="text-sm py-1.5 text-left col-span-3 px-3">
          {children ?? value}
        </div>
      </div>
      <HDivider />
    </>
  );
}

export default function InfoBox({ work }: { work: Work }) {
  return (
    <div className="relative w-full mt-2">
      <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      <HDivider />
      <InfoRow label="Title" value={work.title.rendered} />
      <InfoRow label="Year" value={work.acf.year} />
      <InfoRow label="Materials" value={work.acf.materials} />
      <InfoRow label="Dimensions" value={work.acf.dimensions} />
    </div>
  );
}

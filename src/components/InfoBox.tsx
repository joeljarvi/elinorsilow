import React from "react";
import { Work, Exhibition } from "../../lib/sanity";
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
      <div className="flex flex-row items-baseline font-bookish shadow-[var(--shadow-ui)] transition-shadow">
        <span className="text-left text-muted-foreground whitespace-nowrap py-1.5 border-r border-foreground/10 px-2 font-bookish h3">
          {label}
        </span>
        <div className="h3 py-1.5 text-left px-3">{children ?? value}</div>
      </div>
      <HDivider className="group-hover:border-foreground" />
    </>
  );
}

export default function InfoBox({
  work,
  exhibition,
}: {
  work?: Work;
  exhibition?: Exhibition;
}) {
  return (
    <div className="relative w-full mt-0 px-4">
      <HDivider className="group-hover:border-foreground" />
      {work && (
        <>
          <InfoRow label="Title" value={work.title.rendered} />
          <InfoRow label="Materials" value={work.acf.materials} />
          <InfoRow label="Dimensions" value={work.acf.dimensions} />
          <InfoRow label="Year" value={work.acf.year} />
          <InfoRow label="Exhibition" value={work.acf.exhibition} />
          {work.acf.status && (
            <InfoRow label="Status">
              <span className="flex items-center gap-2">
                {work.acf.status === "sold" && (
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                )}
                {work.acf.status === "on view" && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                )}
              </span>
            </InfoRow>
          )}
        </>
      )}
      {exhibition && (
        <>
          <InfoRow label="Title" value={exhibition.title.rendered} />
          <InfoRow label="Year" value={exhibition.acf.year} />
          <InfoRow label="Location" value={exhibition.acf.location} />
          <InfoRow label="City" value={exhibition.acf.city} />
        </>
      )}
    </div>
  );
}

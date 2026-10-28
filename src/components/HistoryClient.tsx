"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ActivityEntry } from "../../lib/sanity";
import { Badge } from "@/components/ui/badge";
import { BadgeDollarSignIcon } from "lucide-react";

const VISIBLE = 4;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE");
}

function actionLabel(type: ActivityEntry["type"]) {
  if (type === "work") return "added work";
  return "added exhibition";
}

function typeBadge(type: ActivityEntry["type"]) {
  switch (type) {
    case "work":
      return "w";
    case "exhibitions":
    case "exhibition_list":
      return "e";
    default:
      return "?";
  }
}

function entryHref(entry: ActivityEntry) {
  if (entry.type === "works") return `/${entry.slug}`;
  return `/exhibitions/${entry.slug}`;
}

export default function HistoryClient({
  updates,
}: {
  updates: ActivityEntry[];
}) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? updates : updates.slice(0, VISIBLE);
  const hasMore = updates.length > VISIBLE;

  return (
    <>
      <div className="flex flex-col items-start justify-start text-2xl font-areal font-normal w-full  ">
        <div className=" flex flex-col justify-start items-start w-full ">
          {visible.map((entry, i) => (
            <Link
              key={i}
              href={entryHref(entry)}
              className="flex py-4 items-start justify-start gap-x-2 hover:text-muted-foreground transition-colors h-[25vh]  border-b border-b-foreground w-full"
            >
              <div className="flex  flex-col-reverse lg:flex-wrap  items-start justify-between lg:justify-start text-xl gap-x-2 h-full lg:h-min w-full">
                <span className="flex gap-x-2">
                  <Badge>{formatDate(entry.updatedAt)}</Badge>
                  <Badge className="  ">{actionLabel(entry.type)}</Badge>
                </span>
                <span className="lg:hidden text-xl lg:text-xl">
                  {entry.title}
                </span>
                <span className="hidden lg:inline text-xl lg:text-xl ">
                  {entry.title}
                </span>
              </div>

              {entry.image && (
                <Image
                  src={entry.image}
                  alt={entry.title}
                  width={100}
                  height={100}
                  className="shrink-0 h-full w-auto object-contain"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ActivityEntry } from "../../lib/sanity";

const VISIBLE = 4;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE");
}

function formatNow(d: Date) {
  return (
    d.toLocaleDateString("sv-SE") +
    " " +
    d.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  );
}

function actionLabel(type: ActivityEntry["type"]) {
  if (type === "work") return "added work";
  return "added exhibition";
}

function entryHref(entry: ActivityEntry) {
  if (entry.type === "work") return `/${entry.slug}`;
  return `/exhibitions/${entry.slug}`;
}

export default function HistoryClient({
  updates,
}: {
  updates: ActivityEntry[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState("");

  useEffect(() => {
    setNow(formatNow(new Date()));
    const id = setInterval(() => setNow(formatNow(new Date())), 1_000);
    return () => clearInterval(id);
  }, []);

  const visible = showAll ? updates : updates.slice(0, VISIBLE);
  const hasMore = updates.length > VISIBLE;

  return (
    <div className=" font-timesNewRoman text-sm tracking-wide text-foreground p-2 w-md flex flex-wrap gap-x-2 min-h-9 bg-pink-600  ">
      <div className="flex items-center justify-start w-full gap-x-2  ">
        <span className="whitespace-nowrap">{now}</span>
        {hasMore && (
          <button
            className=" text-forground font-normal  hover:text-muted-foreground transition-colors   px-2 whitespace-nowrap "
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "(hide history)" : "(show history)"}
          </button>
        )}
        <span className="whitespace-nowrap flex items-baseline ">
          site last updated:{" "}
          {updates[0] ? formatDate(updates[0].updatedAt) : "—"}
        </span>
      </div>
      <div className="col-start-2 col-span-2 flex flex-col gap-y-[2px]  ">
        {visible.map((entry, i) => (
          <Link
            key={i}
            href={entryHref(entry)}
            className="flex items-center justify-center gap-x-2 hover:text-muted-foreground transition-colors"
          >
            <span className="shrink-0">{formatDate(entry.updatedAt)}</span>
            <span className="shrink-0 italic">{actionLabel(entry.type)}</span>
            <span className="">
              <span className="lg:hidden">{entry.title}</span>
              <span className="hidden lg:inline">{entry.title}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

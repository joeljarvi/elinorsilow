"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import WorkModal from "@/components/WorkModal";
import ExhibitionModal from "@/app/exhibitions/ExhibitionModal";

type Result = {
  key: string;
  kind: "Work" | "Exhibition" | "Archive" | "Education" | "Grant" | "Page";
  title: string;
  detail: string;
  // Searched text: title + detail, normalized.
  haystack: string;
  open: () => void;
};

const MAX_RESULTS = 12;

// Lowercase and strip accents, so "malmo" finds "Malmö".
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const PAGES = [
  { title: "Works", href: "/index/works" },
  { title: "Exhibitions", href: "/index/exhibitions" },
  { title: "Index", href: "/index" },
  { title: "Info", href: "/info" },
  { title: "CV", href: "/info" },
  { title: "Privacy policy", href: "/privacy-policy" },
];

// The nav's "Search": a plain link-style button until clicked, then an
// input with its borders showing. Searches works, exhibitions, the
// exhibition archive, education, grants and pages; works and exhibitions
// open in their modals, everything else navigates.
export default function SiteSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { allWorks } = useWorks();
  const { exhibitions, exhibitionList } = useExhibitions();
  const { educations, grants } = useInfo();

  const [active, setActive] = useState(false);
  const [query, setQuery] = useState("");
  const [workSlug, setWorkSlug] = useState<string | null>(null);
  const [exhibitionSlug, setExhibitionSlug] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => {
    setActive(false);
    setQuery("");
  };

  // Click outside → close.
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [active]);

  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  const index = useMemo<Result[]>(() => {
    const make = (r: Omit<Result, "haystack">): Result => ({
      ...r,
      haystack: normalize(`${r.title} ${r.detail}`),
    });
    return [
      ...allWorks.map((w) =>
        make({
          key: `work-${w.id}`,
          kind: "Work",
          title: w.title.rendered,
          detail: [w.acf.year, w.acf.materials, w.acf.category]
            .filter(Boolean)
            .join(", "),
          open: () => setWorkSlug(w.slug),
        }),
      ),
      ...exhibitions.map((e) =>
        make({
          key: `ex-${e.id}`,
          kind: "Exhibition",
          title: e.title.rendered,
          detail: [e.acf.year, e.acf.location, e.acf.city]
            .filter(Boolean)
            .join(", "),
          open: () => setExhibitionSlug(e.slug),
        }),
      ),
      ...exhibitionList.map((e) =>
        make({
          key: `exl-${e.id}`,
          kind: "Archive",
          title: e.title.rendered,
          detail: [e.acf.year, e.acf.venue, e.acf.city]
            .filter(Boolean)
            .join(", "),
          open: () => router.push("/info#exhibitions"),
        }),
      ),
      ...educations.map((e) =>
        make({
          key: `edu-${e.id}`,
          kind: "Education",
          title: e.acf.school,
          detail: [`${e.acf.start_year}–${e.acf.end_year}`, e.acf.city]
            .filter(Boolean)
            .join(", "),
          open: () => router.push("/info#education"),
        }),
      ),
      ...grants.map((g) =>
        make({
          key: `grant-${g.id}`,
          kind: "Grant",
          title: g.acf.title,
          detail: g.acf.year,
          open: () => router.push("/info#grants"),
        }),
      ),
      ...PAGES.map((p) =>
        make({
          key: `page-${p.title}`,
          kind: "Page",
          title: p.title,
          detail: "",
          open: () => router.push(p.href),
        }),
      ),
    ];
  }, [allWorks, exhibitions, exhibitionList, educations, grants, router]);

  const q = normalize(query.trim());
  const results = q
    ? index.filter((r) => r.haystack.includes(q)).slice(0, MAX_RESULTS)
    : [];

  const choose = (r: Result) => {
    r.open();
    close();
  };

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      {active ? (
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "Enter" && results[0]) choose(results[0]);
          }}
          placeholder="Search"
          aria-label="Search the site"
          className="w-full h-6 px-2 pb-1 bg-transparent border-l border-b border-foreground font-areal font-medium  tracking-wide text-sm placeholder:text-foreground placeholder:italic outline-none"
        />
      ) : (
        <Button
          variant="link"
          size="sm"
          className="w-full justify-start px-0 h-6"
          onClick={() => setActive(true)}
        >
          Search
        </Button>
      )}

      {active && q && (
        <div className="absolute left-0 right-0 top-full mt-2 z-90 max-h-[60vh] overflow-y-auto scrollbar-hide bg-background border-l border-b border-foreground font-areal font-medium uppercase tracking-wide text-xs">
          {results.length === 0 ? (
            <p className="px-2 py-2">No results</p>
          ) : (
            results.map((r) => (
              <button
                key={r.key}
                type="button"
                className="flex w-full flex-col items-start gap-0.5 px-2 py-1.5 text-left hover:font-bold"
                onClick={() => choose(r)}
              >
                <span className="text-muted-foreground">{r.kind}</span>
                <span>{r.title}</span>
                {r.detail && (
                  <span className="text-muted-foreground normal-case">
                    {r.detail}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}

      {/* Portaled to <body>: inside the nav (its own z-80 stacking
          context) the modals would cover the nav instead of sitting under
          it like everywhere else. */}
      {workSlug &&
        createPortal(
          <WorkModal slug={workSlug} onClose={() => setWorkSlug(null)} />,
          document.body,
        )}
      {exhibitionSlug &&
        createPortal(
          <ExhibitionModal
            slug={exhibitionSlug}
            onClose={() => setExhibitionSlug(null)}
          />,
          document.body,
        )}
    </div>
  );
}

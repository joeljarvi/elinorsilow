"use client";

// Column labels for the works / exhibitions lists, fixed across the bottom
// of the screen on the same grid as the (closed) list rows, so each label
// lines up with its column. Desktop: 12 cols — title (3–5), materials / venue (6–7),
// dimensions / type (8–9), year (10), category (11–12, works). Mobile: 4 cols like the closed rows —
// title (1–2), materials / venue (3), year (4, right-aligned). Col 1
// names the list ("Works" / "Exhibitions").
export default function IndexNav({ mode }: { mode: "works" | "exhibitions" }) {
  const labels =
    mode === "works"
      ? { place: "Materials", kind: "Dimensions" }
      : { place: "Venue", kind: "Type" };
  return (
    <div className="hidden fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 lg:grid-cols-12 gap-x-2 lg:gap-x-4 px-6 py-0 lg:px-2 font-stix text-xs tracking-wide leading-none text-primary pointer-events-none bg-background border-t border-t-primary">
      {/* Which list this is, col 1 (desktop). */}
      <span className="hidden lg:block lg:col-start-1 lg:col-span-2 uppercase py-1 px-1">
        {mode === "works" ? "Works" : "Exhibitions"}
      </span>
      {/* Title column: "Title" (w-min), with "Description" right after it
          on exhibitions (the description sits under the title in an open
          row). */}
      <span
        className={`col-span-1 flex gap-x-2 lg:col-start-3 border-l border-l-primary  ${mode === "works" ? "lg:col-span-2" : "lg:col-span-3"}`}
      >
        <span className="w-min py-1 px-1">Title</span>
        {mode === "exhibitions" && (
          <span className="border-l border-l-primary py-1 px-1">
            Description
          </span>
        )}
      </span>
      {/* Venue / materials column: the label (w-min), with "Credits"
          right after it on exhibitions (the credits sit under the venue in
          an open row). */}
      <span
        className={`${mode === "works" ? "col-span-1" : "col-span-2"} flex gap-x-2 truncate border-l border-l-primary  ${mode === "works" ? "lg:col-start-5 lg:col-span-3" : "lg:col-start-6 lg:col-span-2"}`}
      >
        <span className="w-min py-1 px-1">{labels.place}</span>
        {mode === "exhibitions" && (
          <span className="border-l border-l-primary py-1 px-1">Credits</span>
        )}
      </span>
      <span className="hidden lg:block border-l border-l-primary py-1 px-1 lg:col-start-8 lg:col-span-2">
        {labels.kind}
      </span>
      {/* Mobile, exhibitions: no Year (closed rows show title and venue
          only). */}
      <span
        className={`${mode === "exhibitions" ? "hidden lg:block" : "col-span-1"} border-l border-l-primary py-1 px-1 text-right lg:text-left lg:col-start-10 lg:col-span-1`}
      >
        Year
      </span>
      {mode === "works" && (
        <span className="hidden lg:block lg:col-start-11 lg:col-span-2">
          Category
        </span>
      )}
    </div>
  );
}

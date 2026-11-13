import Link from "next/link";

// A work's or an exhibition's title, then its metadata ("year, materials,
// dimensions" / "year, venue, city, type") — the one style for it
// everywhere: the feeds' current title, an exhibition's or a work's own
// page. One run of text, wrapping as a whole; with `href`, "Read more"
// (opens its page) follows the metadata. `stacked`: the metadata under the
// title (no comma between) — a work's own page.
export default function TitleBlock({
  title,
  metadata,
  href,
  heading = false,
  stacked = false,
  className = "",
  textWidth = "lg:max-w-xl",
}: {
  title: string;
  metadata?: string;
  href?: string;
  // The page's h1 (a work's own page), else a span.
  heading?: boolean;
  // The title and metadata stacked (flex-col), no comma after the title.
  stacked?: boolean;
  className?: string;
  // Stacked only: a width limit for the title and metadata (default:
  // max-w-xl on desktop). Otherwise the block's own width (className).
  textWidth?: string;
}) {
  const Title = heading ? "h1" : "span";
  // Stacked: the title, then the metadata under it.
  if (stacked)
    return (
      <div
        className={`flex flex-col font-gensco text-[18px] lg:text-[24px] text-left items-start justify-start leading-tight max-w-6xl text-neutral-800 ${className}`}
      >
        <Title className={`uppercase ${textWidth}`}>{title}</Title>
        {metadata && <p className={textWidth}>{metadata},</p>}
      </div>
    );
  // Otherwise one run of text, wrapping word by word as a whole: "TITLE,
  // metadata, Read more" ("Read more" never split across lines).
  return (
    <div
      className={`font-gensco text-[18px] lg:text-[24px] text-left leading-tight max-w-6xl text-neutral-800 ${className}`}
    >
      <Title className="inline uppercase">{title},</Title>
      {metadata && (
        <>
          {" "}
          <span>{metadata},</span>
        </>
      )}
      {href && (
        <>
          {" "}
          <Link
            href={href}
            prefetch={false}
            className="pointer-events-auto underline whitespace-nowrap"
          >
            Read more
          </Link>
        </>
      )}
    </div>
  );
}

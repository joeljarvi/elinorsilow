import Link from "next/link";

// A work's or an exhibition's title, then its metadata ("year, materials,
// dimensions" / "year, venue, city, type") on an indented line — the one
// style for it everywhere: the feed's current title, the grid's hover, a
// work's own page. With `href`, "Read more" (opens its page) follows the
// metadata. `stacked`: the metadata under the title (no comma between) —
// a work's own page.
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
  // The page's h1 (a work's own page), else a p.
  heading?: boolean;
  // The title and metadata stacked (flex-col), no comma after the title.
  stacked?: boolean;
  className?: string;
  // A width limit for the title and metadata (default: max-w-xl on desktop).
  textWidth?: string;
}) {
  const Title = heading ? "h1" : "p";
  return (
    <div
      className={`flex ${stacked ? "flex-col" : "flex-wrap"} font-gensco text-[24px] text-left items-start justify-start leading-tight max-w-6xl text-neutral-800 ${className}`}
    >
      <Title className={`uppercase   ${textWidth}`}>{title}</Title>
      {!stacked && ","}
      {metadata && (
        <p className={`pl-0 ${stacked ? "" : "lg:ml-1"} ${textWidth}`}>
          {metadata},
          {/* A space before "Read more" — invisible if it wraps. */}
          {href && "\u00a0"}
        </p>
      )}
      {/* "Read more": its own item after the metadata — when the block
          wraps, it moves as a whole to a new row, from the left (under the
          title), instead of trailing the metadata's last line. */}
      {href && (
        <Link
          href={href}
          prefetch={false}
          className="pointer-events-auto underline whitespace-nowrap"
        >
          Read more
        </Link>
      )}
    </div>
  );
}

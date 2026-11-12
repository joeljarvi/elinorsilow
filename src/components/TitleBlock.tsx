import Link from "next/link";

// A work's or an exhibition's title, then its metadata ("year, materials,
// dimensions" / "year, venue, city, type") on an indented line — the one
// style for it everywhere: the feed's current title, the grid's hover, a
// work's own page. With `href`, "Read more" (opens its page) follows the
// metadata.
export default function TitleBlock({
  title,
  metadata,
  href,
  heading = false,
  className = "",
  textWidth = "",
}: {
  title: string;
  metadata?: string;
  href?: string;
  // The page's h1 (a work's own page), else a p.
  heading?: boolean;
  className?: string;
  // A width limit for the title and metadata.
  textWidth?: string;
}) {
  const Title = heading ? "h1" : "p";
  return (
    <div
      className={`flex flex-col font-gensco text-[18px] lg:text-[21px] leading-tight text-neutral-800 ${className}`}
    >
      <Title className={`uppercase  ${textWidth}`}>{title}</Title>
      {(metadata || href) && (
        <p className={`pl-0 lg:pl-4 ${textWidth}`}>
          {metadata},{/* "Read more" at the end of the metadata. */}
          {href && (
            <>
              {metadata && " "}
              <Link
                href={href}
                prefetch={false}
                className="pointer-events-auto underline"
              >
                Read more
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}

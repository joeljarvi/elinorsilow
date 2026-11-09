import Link from "next/link";

// A work's or an exhibition's title, then its metadata ("year, materials,
// dimensions" / "year, venue, city, type") on an indented line — the one
// style for it everywhere: the feed's current title, the grid's hover, a
// work's own page. With `href`, "Read more" (opens its page) sits at the
// right on the metadata's baseline.
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
  // A width limit for the title and metadata only ("Read more" stays at the
  // right of the whole block).
  textWidth?: string;
}) {
  const Title = heading ? "h1" : "p";
  return (
    <div
      className={`flex flex-col font-gensco text-[18px] lg:text-[21px] leading-tight text-neutral-800 ${className}`}
    >
      <Title className={`uppercase ${textWidth}`}>{title}</Title>
      {(metadata || href) && (
        <div className="flex items-baseline justify-start lg:justify-between gap-x-3 lg:gap-x-6">
          <p className={`indent-6 lg:indent-12 ${textWidth}`}>
            {metadata},{/* Mobile: "Read more" at the end of the metadata. */}
            {href && (
              <>
                {metadata && " "}
                <Link
                  href={href}
                  prefetch={false}
                  className="lg:hidden pointer-events-auto underline"
                >
                  Read more
                </Link>
              </>
            )}
          </p>
          {/* Desktop: "Read more" at the right, on the metadata's baseline. */}
          {href && (
            <Link
              href={href}
              prefetch={false}
              className="hidden lg:block shrink-0 pointer-events-auto hover:underline"
            >
              Read more
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

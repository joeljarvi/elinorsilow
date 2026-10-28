"use client";

import { useEffect, useState } from "react";

const LINK_PATTERN =
  /(\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b|https?:\/\/[^\s]+)/g;

// Typing speed per character.
const TYPE_MS = 18;

type Segment = { text: string; href?: string; external?: boolean };

// Splits the text into plain runs and links (emails → mailto:, URLs open in
// a new tab).
function toSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    const isEmail = token.includes("@");
    segments.push({
      text: token,
      href: isEmail ? `mailto:${token}` : token,
      external: !isEmail,
    });
    lastIndex = LINK_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
}

// Types itself out on load. The untyped rest stays in the layout
// (invisible) so the text doesn't reflow while it types; screen readers get
// the whole text at once.
export default function HeroText({
  bio,
  className,
}: {
  bio: string;
  className?: string;
}) {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(bio.length);
      return;
    }
    setTyped(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(i);
      if (i >= bio.length) clearInterval(id);
    }, TYPE_MS);
    return () => clearInterval(id);
  }, [bio]);

  let offset = 0;
  return (
    <p className={className} aria-label={bio}>
      {toSegments(bio).map((seg, i) => {
        const start = offset;
        offset += seg.text.length;
        const shown = Math.max(0, Math.min(seg.text.length, typed - start));
        const content = (
          <>
            <span aria-hidden="true">{seg.text.slice(0, shown)}</span>
            <span aria-hidden="true" className="invisible">
              {seg.text.slice(shown)}
            </span>
          </>
        );
        return seg.href ? (
          <a
            key={i}
            href={seg.href}
            {...(seg.external && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            className="underline underline-offset-2 decoration-2 hover:no-underline"
          >
            {content}
          </a>
        ) : (
          <span key={i}>{content}</span>
        );
      })}
    </p>
  );
}

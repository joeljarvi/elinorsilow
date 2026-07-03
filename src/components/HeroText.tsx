import { Fragment } from "react";

const LINK_PATTERN =
  /(\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b|https?:\/\/[^\s]+)/g;

function renderWithLinks(text: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    const href = token.includes("@") ? `mailto:${token}` : token;
    parts.push(
      <a
        key={match.index}
        href={href}
        {...(!token.includes("@") && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        className="underline underline-offset-4 decoration-1 hover:no-underline"
      >
        {token}
      </a>,
    );
    lastIndex = LINK_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function HeroText({ bio }: { bio: string }) {
  return (
    <div className="font-timesNewRoman tracking-wide whitespace-normal max-w-4xl pt-8 mx-0 lg:mx-auto w-full">
      <p className="text-foreground text-xl leading-[1.2] lg:leading-[1.1] lg:text-3xl text-left lg:text-center">
        {renderWithLinks(bio).map((part, i) => (
          <Fragment key={i}>{part}</Fragment>
        ))}
      </p>
    </div>
  );
}

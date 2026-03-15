"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Image from "next/image";

function pickRandom<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function HoverWord({
  children,
  imageUrls,
  alt,
}: {
  children: React.ReactNode;
  imageUrls: string[];
  alt: string;
}) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  if (!imageUrls.length) return <>{children}</>;

  const isTouch = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  const show = () => setActiveUrl(pickRandom(imageUrls) ?? null);
  const hide = () => setActiveUrl(null);

  return (
    <span
      className="relative inline-block cursor-pointer text-blue-600 underline underline-offset-4 decoration-2 hover:no-underline"
      onMouseEnter={() => !isTouch() && show()}
      onMouseLeave={() => !isTouch() && hide()}
      onClick={() => isTouch() && (activeUrl ? hide() : show())}
    >
      {children}

      <AnimatePresence>
        {activeUrl && (
          <>
            {/* Mobile: tap backdrop to close */}
            <motion.span
              key="hover-backdrop"
              className="fixed inset-0 z-10 lg:hidden"
              onClick={(e) => {
                e.stopPropagation();
                hide();
              }}
            />
            <motion.span
              key={activeUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 w-full h-[50vh] lg:w-1/2 lg:h-screen pointer-events-none z-10 lg:-z-10"
            >
              <Image
                src={activeUrl}
                alt={alt}
                fill
                className="object-contain object-center lg:object-right p-30"
              />
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </span>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 decoration-2 inline-flex items-baseline gap-0.5 text-blue-600 hover:no-underline"
    >
      {children}
    </Link>
  );
}

export default function Hero() {
  const { allWorks } = useWorks();
  const { featuredExhibitions } = useExhibitions();

  const paintingUrls = useMemo(
    () =>
      allWorks
        .filter((w) => w.acf?.category === "painting" && w.image_url)
        .map((w) => w.image_url as string),
    [allWorks],
  );
  const sculptureUrls = useMemo(
    () =>
      allWorks
        .filter((w) => w.acf?.category === "sculpture" && w.image_url)
        .map((w) => w.image_url as string),
    [allWorks],
  );
  const textileUrls = useMemo(
    () =>
      allWorks
        .filter((w) => w.acf?.category === "textile" && w.image_url)
        .map((w) => w.image_url as string),
    [allWorks],
  );
  const allWorkUrls = useMemo(
    () => allWorks.filter((w) => w.image_url).map((w) => w.image_url as string),
    [allWorks],
  );
  const exhibitionUrls = useMemo(
    () =>
      featuredExhibitions.flatMap((ex) =>
        [1, 2, 3, 4, 5]
          .map(
            (i) =>
              ex.acf?.[`image_${i}` as keyof typeof ex.acf] as
                | { url?: string }
                | undefined,
          )
          .filter((img): img is { url: string } => !!img?.url)
          .map((img) => img.url),
      ),
    [featuredExhibitions],
  );

  return (
    <div className="max-w-full lg:max-w-1/2 pt-4 pl-4 pr-8 pb-4 lg:p-4 relative z-10">
      <p className="font-bookish text-2xl lg:text-2xl leading-snug">
        <span className="font-medium">Elinor Silow</span> (b. 1993, Malmö,
        Sweden) is a Stockholm-based artist working with{" "}
        <HoverWord imageUrls={paintingUrls} alt="painting">
          <NavLink href="/works?category=painting">painting</NavLink>
        </HoverWord>
        ,{" "}
        <HoverWord imageUrls={sculptureUrls} alt="sculpture">
          <NavLink href="/works?category=sculpture">sculpture</NavLink>
        </HoverWord>
        , and{" "}
        <HoverWord imageUrls={textileUrls} alt="textile">
          <NavLink href="/works?category=textile">textile pieces</NavLink>
        </HoverWord>
        . Her work explores raw emotion through material, gesture, and form.{" "}
        Discover her{" "}
        <HoverWord imageUrls={allWorkUrls} alt="works">
          <NavLink href="/works">works</NavLink>
        </HoverWord>
        , or see{" "}
        <HoverWord imageUrls={exhibitionUrls} alt="exhibition">
          <NavLink href="/exhibitions">exhibitions</NavLink>
        </HoverWord>{" "}
        where the work has been presented publicly. For further information,
        including CV and background, visit the{" "}
        <NavLink href="/info">info</NavLink> page. For collaborations or
        inquiries:{" "}
        <NavLink href="mailto:elinor.silow@gmail.com">
          hej@elinorsilow.com
        </NavLink>
        .
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Work, Exhibition } from "../../lib/sanity";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";
import UnderConstruction from "@/components/UnderConstruction";
import Hero from "@/components/Hero";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";

function UnderConstructionOverlay() {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="under-construction"
          className="fixed inset-0 z-[999] bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            className="no-hide-text absolute top-0 right-0 aspect-square h-auto"
            size="sm"
            variant="ghost"
            onClick={() => setOpen(false)}
            aria-label="Stäng"
          >
            <Cross1Icon aria-hidden="true" />
          </Button>
          <UnderConstruction />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 pt-4 bg-background">
      <div className="mx-4 flex items-center font-bookish text-sm shadow-[var(--shadow-ui)]">
        <span className="h3 px-3 py-1.5 text-neutral-600 dark:text-neutral-400">{children}</span>
      </div>
    </div>
  );
}

function WorkItem({ work, onClick }: { work: Work; onClick: () => void }) {
  const { showInfo } = useUI();
  return (
    <button
      onClick={onClick}
      className="group relative cursor-pointer w-full flex flex-col"
      aria-label={`Open work: ${work.title.rendered}`}
    >
      <div className="relative h-[75vh] w-full overflow-hidden p-4 pb-0">
        <CornerFrame />
        {work.image_url && (
          <div className="absolute inset-4 flex items-end">
            <Image
              src={work.image_url}
              alt={work.title.rendered}
              fill
              sizes="50vw"
              className="object-contain object-left"
            />
          </div>
        )}
      </div>
      {showInfo && <InfoBox work={work} />}
    </button>
  );
}

function ExhibitionItem({
  exhibition,
  onClick,
}: {
  exhibition: Exhibition;
  onClick: () => void;
}) {
  const { showInfo } = useUI();
  const imgUrl = exhibition.acf?.image_1?.url;
  return (
    <button
      onClick={onClick}
      className="group relative cursor-pointer w-full flex flex-col"
      aria-label={`Open exhibition: ${exhibition.title.rendered}`}
    >
      <div className="relative h-[75vh] w-full overflow-hidden p-4 pb-0">
        <CornerFrame />
        {imgUrl && (
          <div className="absolute inset-4 flex items-end">
            <Image
              src={imgUrl}
              alt={exhibition.title.rendered}
              fill
              sizes="50vw"
              className="object-contain object-left"
            />
          </div>
        )}
      </div>
      {showInfo && <InfoBox exhibition={exhibition} />}
    </button>
  );
}

export default function HomePageClient() {
  const { setOpen, navVisible } = useUI();
  const { setActiveWorkSlug, activeWorkSlug, featuredWorks } = useWorks();
  const { activeExhibitionSlug, setActiveExhibitionSlug, featuredExhibitions } =
    useExhibitions();
  const [heroOpen, setHeroOpen] = useState(true);

  return (
    <div className="min-h-full w-full">
      {/* Mobile: hero text + links only */}
      <div className="lg:hidden min-h-screen pt-4">
        <Hero />
      </div>

      {/* Desktop: 2 fixed scrolling columns */}
      <div
        className="hidden lg:flex lg:fixed lg:left-0 lg:right-0 lg:bottom-0 transition-[top] duration-[250ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ top: navVisible ? "var(--nav-height, 0px)" : "0px" }}
      >
        {/* Col 1: Featured Works */}
        <div className="flex-1 overflow-y-auto h-full flex flex-col shadow-[var(--shadow-col-left)]">
          <SectionHeader>Featured Works</SectionHeader>
          {featuredWorks.map((work: Work) => (
            <WorkItem
              key={work.id}
              work={work}
              onClick={() => {
                setActiveWorkSlug(work.slug);
                setOpen(false);
                window.history.pushState(null, "", `/works?work=${work.slug}`);
              }}
            />
          ))}
          <div className="px-4 py-4 mt-auto">
            <Button
              variant="ghost"
              size="controls"
              className="w-full shadow-[var(--shadow-ui)] font-bookish h3 rounded-none"
              asChild
            >
              <Link href="/works">See more works</Link>
            </Button>
          </div>
        </div>

        <div className="w-px bg-foreground/10 self-stretch flex-none" />

        {/* Col 2: Featured Exhibitions */}
        <div className="flex-1 overflow-y-auto h-full flex flex-col shadow-[var(--shadow-col-right)]">
          <SectionHeader>Featured Exhibitions</SectionHeader>
          {featuredExhibitions.map((ex: Exhibition) => (
            <ExhibitionItem
              key={ex.id}
              exhibition={ex}
              onClick={() => {
                setActiveExhibitionSlug(ex.slug);
                setOpen(false);
                window.history.pushState(
                  null,
                  "",
                  `/exhibitions?exhibition=${ex.slug}`,
                );
              }}
            />
          ))}
          <div className="px-4 py-4 mt-auto">
            <Button
              variant="ghost"
              size="controls"
              className="w-full shadow-[var(--shadow-ui)] font-bookish h3 rounded-none"
              asChild
            >
              <Link href="/exhibitions">See more exhibitions</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero text overlay — desktop only */}
      <AnimatePresence>
        {heroOpen && (
          <>
            {/* Backdrop: click outside to close */}
            <motion.div
              key="hero-backdrop"
              className="hidden lg:block fixed inset-0 z-[19]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHeroOpen(false)}
            />
            <motion.div
              key="hero-overlay"
              className="hidden lg:block fixed top-14 left-8 z-20 w-[50vw] h-[90vh] bg-background/80 backdrop-blur-md shadow-[var(--shadow-md)]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-end shadow-[0_1px_0_0_rgb(0_0_0/0.06)] dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)] px-3 py-1.5">
                <Button
                  variant="ghost"
                  size="controlsIcon"
                  onClick={() => setHeroOpen(false)}
                  aria-label="Close"
                  className="no-hide-text"
                >
                  <Cross1Icon />
                </Button>
              </div>
              <Hero />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <UnderConstructionOverlay />

      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => {
            setActiveWorkSlug(null);
            setOpen(true);
          }}
        />
      )}

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => {
            setActiveExhibitionSlug(null);
            setOpen(true);
          }}
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Work, Exhibition } from "../../lib/sanity";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Cross1Icon, WidthIcon } from "@radix-ui/react-icons";
import WorksList from "@/components/WorksList";
import UnderConstruction from "@/components/UnderConstruction";
import Hero from "@/components/Hero";
import InfoBox from "@/components/InfoBox";
import CornerFrame from "@/components/CornerFrame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

function WorkItem({ work, onClick }: { work: Work; onClick: () => void }) {
  const { showInfo } = useUI();
  return (
    <button
      onClick={onClick}
      className="group relative cursor-pointer w-full flex flex-col gap-y-[18px] mb-[32px]"
      aria-label={`Open work: ${work.title.rendered}`}
    >
      <div className="relative h-[75vh] w-full overflow-hidden">
        <CornerFrame />
        {work.image_url && (
          <div className="absolute inset-0 flex items-end">
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
      className="group relative cursor-pointer w-full flex flex-col gap-y-[18px] mb-[32px]"
      aria-label={`Open exhibition: ${exhibition.title.rendered}`}
    >
      <div className="relative h-[75vh] w-full overflow-hidden">
        <CornerFrame />
        {imgUrl && (
          <div className="absolute inset-0 flex items-end">
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

type RightSection =
  | "works"
  | "all-works"
  | "exhibitions"
  | "all-exhibitions"
  | "info";

export default function HomePageClient() {
  const {
    setOpen,
    showInfo,
    setShowInfo,
    proportionalImages,
    setProportionalImages,
  } = useUI();
  const { setActiveWorkSlug, activeWorkSlug, featuredWorks, allWorks } =
    useWorks();
  const {
    activeExhibitionSlug,
    setActiveExhibitionSlug,
    featuredExhibitions,
    exhibitions,
  } = useExhibitions();
  const { soloExhibitions, groupExhibitions } = useInfo();
  const [rightSection, setRightSection] = useState<RightSection>("works");
  const [asList, setAsList] = useState(false);

  const selectTriggerClass =
    "border-0 shadow-none bg-secondary text-neutral-600 dark:text-neutral-400 w-full";

  return (
    <div className="min-h-full w-full">
      {/* Mobile: hero text + links only */}
      <div className="lg:hidden min-h-screen">
        <Hero />
      </div>

      {/* Desktop: 2 fixed scrolling columns */}
      <div
        className="hidden lg:flex fixed top-0 left-0 right-0 bottom-0 flex-col"
      >
        {/* SubNavbar */}
        <div className="flex-none flex items-center bg-background border-b border-foreground/[0.06] shadow-[var(--shadow-ui)]">
          {/* Col1: empty spacer to align with hero col */}
          <div className="flex-1 px-[32px] py-[18px]" />

          {/* Col2: section select + controls */}
          <div className="flex-1 flex items-center px-[32px] py-[18px]">
            <div className="flex-1 min-w-0 [&>*]:w-full">
              <Select
                value={rightSection}
                onValueChange={(v) => {
                  setRightSection(v as RightSection);
                  setAsList(false);
                }}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="works">Featured Works</SelectItem>
                  <SelectItem value="all-works">All Works</SelectItem>
                  <SelectItem value="exhibitions">
                    Featured Exhibitions
                  </SelectItem>
                  <SelectItem value="all-exhibitions">
                    All Exhibitions
                  </SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-2 flex items-center gap-x-0 bg-secondary rounded-full">
              <Button
                variant="secondary"
                size="controlsIcon"
                className="aspect-square"
                onClick={() => setAsList((v) => !v)}
              >
                {asList ? "⊞" : "☰"}
              </Button>
              <Button
                variant="secondary"
                size="controlsIcon"
                className="aspect-square"
                onClick={() => setShowInfo(!showInfo)}
              >
                T
              </Button>
              <Button
                variant="secondary"
                size="controlsIcon"
                className="aspect-square"
                onClick={() => setProportionalImages(!proportionalImages)}
                aria-label={proportionalImages ? "Full width" : "Proportional"}
              >
                <WidthIcon />
              </Button>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
          {/* Col 1: Hero */}
          <div className="overflow-y-auto h-full flex flex-col">
            <Hero />
          </div>

          {/* Col 2: switchable content */}
          <div className="overflow-y-auto h-full flex flex-col px-[32px] pt-[18px]">
            {(rightSection === "works" || rightSection === "all-works") && (
              <>
                {asList ? (
                  <WorksList
                    works={
                      rightSection === "all-works" ? allWorks : featuredWorks
                    }
                    onSelect={(work) => {
                      setActiveWorkSlug(work.slug);
                      setOpen(false);
                      window.history.pushState(
                        null,
                        "",
                        `/works?work=${work.slug}`,
                      );
                    }}
                  />
                ) : (
                  (rightSection === "all-works" ? allWorks : featuredWorks).map(
                    (work: Work) => (
                      <WorkItem
                        key={work.id}
                        work={work}
                        onClick={() => {
                          setActiveWorkSlug(work.slug);
                          setOpen(false);
                          window.history.pushState(
                            null,
                            "",
                            `/works?work=${work.slug}`,
                          );
                        }}
                      />
                    ),
                  )
                )}
                {rightSection === "works" && (
                  <div className="py-4 mt-auto">
                    <Button
                      variant="ghost"
                      size="controls"
                      className="w-full shadow-[var(--shadow-ui)] font-bookish h3 rounded-none"
                      asChild
                    >
                      <Link href="/works">See all works</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {(rightSection === "exhibitions" ||
              rightSection === "all-exhibitions") && (
              <>
                {asList ? (
                  <div className="pt-[18px]">
                    {(rightSection === "all-exhibitions"
                      ? exhibitions
                      : featuredExhibitions
                    ).map((ex: Exhibition) => (
                      <Button
                        key={ex.id}
                        variant="ghost"
                        size="controls"
                        onClick={() => {
                          setActiveExhibitionSlug(ex.slug);
                          setOpen(false);
                          window.history.pushState(
                            null,
                            "",
                            `/exhibitions?exhibition=${ex.slug}`,
                          );
                        }}
                        className="w-full rounded-none justify-start"
                      >
                        {ex.title.rendered}
                      </Button>
                    ))}
                  </div>
                ) : (
                  (rightSection === "all-exhibitions"
                    ? exhibitions
                    : featuredExhibitions
                  ).map((ex: Exhibition) => (
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
                  ))
                )}
                {rightSection === "exhibitions" && (
                  <div className="py-4 mt-auto">
                    <Button
                      variant="ghost"
                      size="controls"
                      className="w-full shadow-[var(--shadow-ui)] font-bookish h3 rounded-none"
                      asChild
                    >
                      <Link href="/exhibitions">See all exhibitions</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {rightSection === "info" && (
              <div className="flex flex-col font-bookish pb-8">
                <div className="flex flex-col gap-y-3 mb-6">
                  <p className="h3">
                    Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm
                    based artist who explores raw emotion through painting,
                    sculpture and textile.
                  </p>
                  <p className="h3">
                    Please contact{" "}
                    <Link
                      href="mailto:hej@elinorsilow.com"
                      className="underline underline-offset-4 decoration-1 hover:no-underline"
                    >
                      hej@elinorsilow.com
                    </Link>{" "}
                    for collaborations and inquiries.
                  </p>
                </div>

                {soloExhibitions.length > 0 && (
                  <>
                    <p className="font-universNextPro font-medium text-[14px] text-muted-foreground mb-2">
                      Solo Exhibitions
                    </p>
                    {soloExhibitions.slice(0, 8).map((ex) => (
                      <p
                        key={ex.id}
                        className="h3 border-b border-foreground/[0.06] py-1"
                      >
                        {ex.acf.year} — {ex.title.rendered}
                      </p>
                    ))}
                  </>
                )}

                {groupExhibitions.length > 0 && (
                  <>
                    <p className="font-universNextPro font-medium text-[14px] text-muted-foreground mt-4 mb-2">
                      Group Exhibitions
                    </p>
                    {groupExhibitions.slice(0, 8).map((ex) => (
                      <p
                        key={ex.id}
                        className="h3 border-b border-foreground/[0.06] py-1"
                      >
                        {ex.acf.year} — {ex.title.rendered}
                      </p>
                    ))}
                  </>
                )}

                <div className="py-4 mt-4">
                  <Button
                    variant="ghost"
                    size="controls"
                    className="w-full shadow-[var(--shadow-ui)] font-bookish h3 rounded-none"
                    asChild
                  >
                    <Link href="/info">Full CV</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

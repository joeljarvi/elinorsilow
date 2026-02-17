"use client";

import { useEffect, useState } from "react";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { useNav } from "@/context/NavContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

import type { Work, Exhibition } from "../../lib/wordpress";

import Staggered from "@/components/Staggered";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { FeaturedWorksCarousel } from "@/components/FeaturedWorksCarousel";
import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import InfoPageClient from "@/components/InfoPageClient";

type Props = {
  showInfo?: boolean;
  setShowInfo?: (v: boolean) => void;
  view?: "works" | "exhibitions" | "info";
  setView?: (v: "works" | "exhibitions" | "info") => void;
};

function MainContent({}: Props) {
  const [initialAnimDone, setInitialAnimDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const lenis = useLenis();

  const { setOpen, showInfo } = useUI();
  const {
    setActiveWorkSlug,
    activeWorkSlug,
    workLoading,
    getWorkSizeClass,
    featuredWorks,
  } = useWorks();
  const {
    activeExhibitionSlug,
    setActiveExhibitionSlug,
    exLoading,
    featuredExhibitions,
  } = useExhibitions();

  const { infoLoading } = useInfo();

  const router = useRouter();

  useEffect(() => {
    if (!workLoading && !exLoading && !infoLoading) {
      setDataLoaded(true);
    }
  }, [workLoading, exLoading, infoLoading]);

  useEffect(() => {
    if (dataLoaded) {
      const t = setTimeout(() => {
        setInitialAnimDone(true);
      }, 600); // length of your intro animation

      return () => clearTimeout(t);
    }
  }, [dataLoaded]);

  const loading = !initialAnimDone || !dataLoaded;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-background">
          <span className="h3 animate-pulse ">Loading elinorsilow.com...</span>
        </div>
      )}

      {!loading && (
        <section
          className=" mx-0
      flex flex-col items-start justify-start w-full pt-11 lg:pt-34   "
        >
          <span className="sticky top-11 lg:top-0 z-30 flex justify-between lg:px-4 lg:justify-start gap-x-4  py-1 w-full shadow bg-background ">
            <Button
              variant="link"
              className="col-span-2 text-sm font-directorBold uppercase    justify-start    "
            >
              Verk i urval
            </Button>
            <Button className="col-span-2 col-start-4  " variant="link" asChild>
              <Link href="/works">• Se alla</Link>
            </Button>
          </span>
          <FeaturedWorksCarousel />
          <span className="sticky top-11 lg:top-0 z-30 flex py-1 lg:px-4 justify-between bg-background w-full ">
            <Button
              variant="link"
              className="col-span-2 text-sm font-directorBold uppercase  w-full  justify-start   "
            >
              Utställningar i urval
            </Button>
            <Button
              className="col-span-2  justify-start "
              variant="link"
              asChild
            >
              <Link href="/exhibitions">• Se alla</Link>
            </Button>
          </span>

          <ExhibitionsCarousel items={featuredExhibitions} />

          <div className="bg-foreground text-background  min-h-screen">
            <span className="sticky top-11 lg:top-0 z-30 py-1 lg:px-4 flex justify-between bg-background w-full ">
              <Button
                variant="link"
                className="col-span-2 text-sm font-directorBold uppercase  w-full  justify-start   "
              >
                Info / CV
              </Button>
              <Button
                className="col-span-2  justify-start "
                variant="link"
                asChild
              >
                <Link href="/exhibitions">• Läs mer</Link>
              </Button>
            </span>
            <div className="grid grid-cols-6 w-full px-4 pt-8 lg:px-8   items-start justify-start mb-8 ">
              <p className="p col-span-6 lg:col-span-2  text-left mb-4 ">
                Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based
                artist who explores raw emotion through painting, sculpture and
                textile.
              </p>

              <p className="col-start-1 p col-span-6 lg:col-span-2 text-left mb-0">
                Please contact
                <Link
                  href="mailto:elinor.silow@gmail.com"
                  className="text-blue-600 mx-2"
                >
                  hej@elinorsilow.com
                </Link>
                for collaborations and inquires.
              </p>
            </div>

            <div className="w-full flex justify-start lg:px-4  ">
              <Button
                variant="link"
                className="invert text-foreground hover:text-foreground/70"
                onClick={() => lenis?.scrollTo(0)}
              >
                • Tillbaka upp
              </Button>
            </div>
          </div>
        </section>
      )}
      {activeWorkSlug && (
        <WorkModal
          slug={activeWorkSlug}
          onClose={() => setActiveWorkSlug(null)}
        />
      )}

      {activeExhibitionSlug && (
        <ExhibitionModal
          slug={activeExhibitionSlug}
          onClose={() => setActiveExhibitionSlug(null)}
        />
      )}
    </>
  );
}

export default function HomePageClient() {
  return (
    <div className="min-h-full w-full   ">
      <MainContent />
    </div>
  );
}

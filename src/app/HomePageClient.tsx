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

  // Start loader animation immediately
  useEffect(() => {
    // Immediately mark animation done if data is ready
    if (!workLoading && !exLoading && !infoLoading) {
      setInitialAnimDone(true);
      setDataLoaded(true);
    }

    // Optional: fallback in case something hangs
    const fallback = setTimeout(() => {
      setInitialAnimDone(true);
      setDataLoaded(true);
    }, 1000); // 1s max wait for slow connections

    return () => clearTimeout(fallback);
  }, [workLoading, exLoading, infoLoading]);

  return (
    <>
      <section
        className=" mx-0
      flex flex-col items-start justify-start w-full pt-10 lg:pt-40   "
      >
        <FeaturedWorksCarousel />

        <ExhibitionsCarousel items={featuredExhibitions} />

        <div className="bg-red-600 pt-2 min-h-screen">
          <div className="relative  flex items-center justify-between w-full lg:justify-start gap-4 px-4 mb-4 ">
            <h2 className="h2">Information</h2>
            <Button variant="link" asChild>
              <Link href="/exhibitions">•Läs mer</Link>
            </Button>
          </div>

          <div className="grid grid-cols-6 w-full px-4   items-start justify-start mb-16 ">
            <p className="p col-span-6 lg:col-span-2  text-left mb-4 ">
              Elinor Silow (b. 1993) in Malmö, Sweden, is a Stockholm based
              artist who explores raw emotion through painting, sculpture and
              textile.
            </p>

            <p className="col-start-1 p col-span-6 lg:col-span-2 text-left mb-4">
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
          <div className="w-full flex justify-start py-8">
            <Button
              variant="link"
              size="sm"
              className="p text-foreground hover:text-foreground/70"
              onClick={() => lenis?.scrollTo(0)}
            >
              Back to Top
            </Button>
          </div>
        </div>
      </section>

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
      <Footer />
    </div>
  );
}

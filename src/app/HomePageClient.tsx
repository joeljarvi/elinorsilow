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
      flex flex-col items-start justify-start w-full pt-13 lg:pt-30   "
      >
        <div className="sticky top-13 lg:top-14 z-20 flex items-center justify-between w-full lg:justify-start gap-4  px-4 mb-1 lg:mb-0 ">
          <h2 className="h2">Verk i urval</h2>
          <Button variant="link" asChild>
            <Link href="/works">•Se alla verk</Link>
          </Button>
        </div>
        <Staggered
          items={featuredWorks}
          getKey={(item) => item.id}
          className="flex flex-col items-center justify-center w-full lg:flex-row lg:justify-start lg:items-start px-4 mb-30"
          renderItem={(item: Work) => (
            <div
              className="aspect-square flex flex-col justify-start lg:justify-between cursor-pointer gap-y-2  w-[100vw] lg:w-[476px] bg-background hover:bg-foreground/10 transition-all"
              onClick={() => {
                setActiveWorkSlug(item.slug);
                setOpen(false);
                router.push(`/?work=${item.slug}`);
              }}
            >
              <div
                className={`relative aspect-square   mx-auto lg:mx-0 ${getWorkSizeClass(
                  item.acf.dimensions
                )} flex`}
              >
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.title.rendered}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain object-top lg:object-top-left"
                  />
                )}
              </div>

              <div className="flex flex-col items-baseline p-4 lg:p-0 text-sm font-directorMono">
                <span>{item.title.rendered}</span>
                {item.acf.year && <span>{item.acf.year}</span>}
                {item.acf.materials && <span>{item.acf.materials}</span>}
                {item.acf.dimensions && <span>{item.acf.dimensions}</span>}
              </div>
            </div>
          )}
        />

        <div className="sticky top-21 z-30 flex items-center justify-between w-full lg:justify-start gap-4 px-4 ">
          <h2 className="h2">Utställningar i urval</h2>
          <Button variant="link" asChild>
            <Link href="/exhibitions">•Se alla utställningar</Link>
          </Button>
        </div>
        <Staggered
          items={featuredExhibitions}
          getKey={(item) => item.id}
          className="flex flex-col items-center justify-center w-full lg:flex-row lg:items-start lg:justify-start  gap-x-4"
          renderItem={(item: Exhibition, index: number) => (
            <div
              className="flex flex-col justify-start lg:justify-between cursor-pointer gap-y-4 lg:gap-y-2  w-full h-full bg-background hover:bg-foreground/10 transition-all  "
              onClick={() => {
                setActiveExhibitionSlug(item.slug);
                setOpen(false);
                router.push(`/?exhibition=${item.slug}`);
              }}
            >
              {" "}
              <div className="relative  mx-auto lg:mx-0 h-full w-screen lg:w-auto  lg:h-[calc(100vh-10rem)] aspect-square lg:aspect-video ">
                {" "}
                {item.acf.image_1?.url && (
                  <Image
                    src={item.acf.image_1.url}
                    alt={item.title.rendered}
                    fill
                    priority={index < 3}
                    className="object-cover object-top lg:object-center px-4 lg:px-0"
                  />
                )}{" "}
              </div>{" "}
              <div className="flex flex-col  justify-start items-baseline gap-x-8 h3  px-4  pb-4 ">
                {" "}
                <span>{item.title.rendered}</span>{" "}
                <span className="">{item.acf.exhibition_type}</span>{" "}
                <span className="">{item.acf.location}</span>{" "}
                <span className="">{item.acf.city}</span>{" "}
                <span className="">{item.acf.year}</span>{" "}
              </div>{" "}
            </div>
          )}
        />

        <div className="w-full flex justify-center py-8">
          <Button
            variant="link"
            size="sm"
            className="p text-foreground hover:text-foreground/70"
            onClick={() => lenis?.scrollTo(0)}
          >
            Back to Top
          </Button>
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

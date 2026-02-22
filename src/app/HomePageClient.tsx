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
import { motion } from "framer-motion";
import Staggered from "@/components/Staggered";
import Link from "next/link";
import { useLenis } from "lenis/react";

import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import InfoPageClient from "@/components/InfoPageClient";
import HDivider from "@/components/HDivider";

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
          className=" mx-auto
      flex flex-col items-center justify-start w-full   "
        >
          <div
            className="
  flex flex-col

  w-full 
"
          >
            {/* Works */}
            {/* <span className="sticky top-0 z-30 flex   lg:px-4 justify-start gap-x-4   w-full  items-baseline bg-background">
              <Button
                variant="link"
                className="col-span-1 text-base font-gintoBlack uppercase    justify-start    "
              >
                Verk i urval
              </Button>
              <Button
                className="col-start-2 lg:col-start-3 justify-start "
                variant="link"
                asChild
              >
                <Link href="/works">• Se alla</Link>
              </Button>
            </span> */}
            <motion.div className="min-h-screen flex flex-col gap-y-4 lg:flex-row pt-0 gap-x-4  lg:px-8">
              {featuredWorks.map((work: Work, idx: number) => (
                <motion.div
                  key={work.id}
                  className="w-full h-[80vh] lg:h-[75vh] flex flex-col bg-background justify-start items-start   "
                >
                  <div
                    onClick={() => {
                      setActiveWorkSlug(work.slug);
                      setOpen(false);
                      router.push(`/?work=${work.slug}`);
                    }}
                    className="relative cursor-pointer w-full flex justify-center"
                  >
                    {/* Image box */}
                    <div
                      className={`relative w-full mx-auto h-[50vh] lg:h-[50vh] `}
                    >
                      {work.image_url && (
                        <Image
                          src={work.image_url}
                          alt={work.title.rendered}
                          fill
                          className="object-contain object-center lg:object-top-left"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex lg:hidden relative w-full  pointer-events-none">
                    <div className="flex flex-col items-start justify-center  p-4  pointer-events-auto w-full  ">
                      <span className="h1  ">{work.title.rendered}</span>
                      <div className="flex flex-col justify-center items-start  h3 whitespace-normal gap-x-2 ">
                        {work.acf.materials && (
                          <span className="max-w-md">
                            {work.acf.materials}{" "}
                          </span>
                        )}
                        {work.acf.dimensions && (
                          <span>{work.acf.dimensions}</span>
                        )}
                        {work.acf.year && (
                          <span className="">{work.acf.year}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <span className="sticky top-0 z-30 flex lg:px-4 justify-start gap-x-4   w-full  items-baseline bg-background ">
              <Button
                variant="link"
                className="col-span-1 text-base font-gintoBlack uppercase    justify-start    "
              >
                Utställningar i urval
              </Button>
              <Button
                className="col-start-2 lg:col-start-3 justify-start "
                variant="link"
                asChild
              >
                <Link href="/exhibitions">• Se alla</Link>
              </Button>
            </span>
            {/* Exhibitions */}
            <motion.div className="min-h-screen w-full flex flex-col gap-y-4 lg:grid lg:grid-cols-3 pt-0 gap-x-8  lg:px-8">
              {featuredExhibitions.map((ex: Exhibition, idx: number) => (
                <motion.div
                  key={ex.id}
                  className="col-span-1 h-[80vh] lg:h-[75vh] flex flex-col bg-background justify-start items-start   "
                >
                  <div
                    onClick={() => {
                      setActiveExhibitionSlug(ex.slug);
                      setOpen(false);
                      router.push(`/?exhibition=${ex.slug}`);
                    }}
                    className="relative cursor-pointer w-full flex justify-center"
                  >
                    {/* Image box */}
                    <div
                      className={`relative  aspect-video mx-auto h-full w-full `}
                    >
                      {ex.acf.image_1 && (
                        <Image
                          src={ex.acf.image_1.url}
                          alt={ex.title.rendered}
                          fill
                          className="object-cover object-center lg:object-center"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex lg:hidden relative w-full  pointer-events-none">
                    <div className="flex flex-col items-start justify-center  p-4  pointer-events-auto w-full  ">
                      <span className="h1  ">{ex.title.rendered}</span>
                      <div className="flex flex-col justify-center items-start  h3 whitespace-normal gap-x-2 ">
                        {ex.acf.exhibition_type && (
                          <span className="max-w-md">
                            {ex.acf.exhibition_type}{" "}
                          </span>
                        )}
                        {ex.acf.location && <span>{ex.acf.location}</span>}
                        {ex.acf.city && <span>{ex.acf.city}</span>}
                        {ex.acf.year && <span className="">{ex.acf.year}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="bg-foreground text-background  min-h-screen">
            <span className="sticky top-11 lg:top-0 z-30 py-1 lg:px-4 flex justify-start items-baseline bg-foreground text-background   w-full ">
              <Button
                variant="link"
                className="col-span-2 text-base font-gintoBlack uppercase   justify-start bg-foreground text-background   "
              >
                Info / CV
              </Button>
              <Button
                className="col-span-2  justify-start bg-foreground text-background   "
                variant="link"
                asChild
              >
                <Link href="/info">• Läs mer</Link>
              </Button>
            </span>
            <div className="grid grid-cols-6 w-full px-4 mt-2 lg:px-8   items-start justify-start mb-8 ">
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

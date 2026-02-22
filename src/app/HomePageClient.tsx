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
      flex flex-col items-center justify-start w-full mt-[50vh] lg:mt-[50vh]  "
        >
          <div
            className="
  flex flex-col

  w-full 
"
          >
            {/* Works */}
            <div
              className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5 
 
    gap-x-4
 
  "
            >
              <span className="px-8 w-full lg:col-span-5 grid grid-cols-5 gap-x-8 bg-transparent">
                {/* Left title */}
                <Button
                  variant="ghost"
                  size="lg"
                  className="hidden lg:flex lg:col-span-4 uppercase  hover:bg-transparent justify-start w-full lg:border-b-1 lg:border-foreground bg-transparent"
                >
                  Selected works
                </Button>

                {/* Right link */}
                <Button
                  className=" hidden lg:flex  lg:col-span-1 w-full uppercase justify-between border-b-1 border-foreground"
                  variant="ghost"
                  size="lg"
                  asChild
                >
                  <Link href="/works">
                    See all works <span>&gt;</span>
                  </Link>
                </Button>
              </span>

              {/* Divider left */}

              <Staggered
                items={featuredWorks}
                getKey={(w) => w.id}
                loading={loading}
                className="
    min-h-screen
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-5
    gap-x-8 
    
    col-span-5
  "
                renderItem={(work: Work) => (
                  <motion.div
                    key={work.id}
                    className="h-screen lg:h-[75vh] flex flex-col   "
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
                        className={`relative mx-0 h-[80vh] lg:h-[50vh] w-full `}
                      >
                        {work.image_url && (
                          <Image
                            src={work.image_url}
                            alt={work.title.rendered}
                            fill
                            className="object-contain object-left lg:object-top-left p-4 lg:pt-4 lg:px-8 lg:pb-4"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              />
              <div className="sticky bottom-0  lg:hidden z-20   ">
                <Button
                  className="w-full uppercase justify-start gap-x-4   items-baseline bg-background shadow.lg"
                  variant="ghost"
                  size="lg"
                  asChild
                >
                  <Link href="/works">
                    See all works <span className=" ">&gt;</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Exhibitions */}
            <div
              className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5 
 
    gap-x-4
 
  "
            >
              {/* Left title */}
              <Button
                variant="ghost"
                size="lg"
                className="hidden lg:blocklg:col-span-4 uppercase  hover:bg-transparent justify-start w-full lg:border-b-1 lg:border-foreground"
              >
                Selected Exhibitions
              </Button>

              {/* Right link */}
              <Button
                className=" hidden lg:block lg:z-auto lg:col-span-1 w-full uppercase justify-between border-b-1 border-foreground"
                variant="ghost"
                size="lg"
                asChild
              >
                <Link href="/exhibitions">
                  See all Exhibitions <span>&gt;</span>
                </Link>
              </Button>

              {/* Divider left */}

              <Staggered
                items={featuredExhibitions}
                getKey={(ex) => ex.id}
                loading={loading}
                className="
    min-h-screen
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-5
    gap-x-8 
    lg:px-0 lg:py-8
    col-span-5
  "
                renderItem={(ex: Exhibition) => (
                  <motion.div
                    key={ex.id}
                    className="h-screen lg:h-[75vh] flex flex-col bg-background   "
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
                        className={`relative mx-0 h-[80vh] lg:h-[50vh] w-full `}
                      >
                        {ex.acf.image_1 && (
                          <Image
                            src={ex.acf.image_1.url}
                            alt={ex.title.rendered}
                            fill
                            className="object-contain object-left lg:object-top-left p-4"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              />
              <div className="sticky bottom-0 lg:hidden z-20 bg-background">
                <Button
                  className="w-full uppercase justify-start gap-x-4  shadow items-baseline "
                  variant="ghost"
                  size="lg"
                  asChild
                >
                  <Link href="/exhibitions">
                    See all Exhibitions <span className=" ">&gt;</span>
                  </Link>
                </Button>
              </div>

              {/* Exhibitions */}
            </div>
            <div className="bg-foreground text-background  min-h-screen relative ">
              <Button
                className="w-full uppercase justify-start gap-x-4  shadow items-baseline bg-foreground text-background font-directorLight hover:text-background/80 "
                variant="ghost"
                size="lg"
                asChild
              >
                <Link href="/exhibitions">
                  About Elinor <span className=" ">&gt;</span>
                </Link>
              </Button>

              <div className="pl-4 pt-4 pr-16">
                <Link
                  onClick={() => {}}
                  className="items-baseline  no-hide-text h3 font-directorLight whitespace-normal col-span-2
   px-0 py
"
                  href="/"
                >
                  <strong className="font-normal   mr-2">Elinor Silow</strong>
                  (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
                  explores raw emotion through painting, sculpture and textile.
                </Link>

                <p className="p mt-4  font-directorLight col-start-1 col-span-2 mb-8">
                  Please contact
                  <Link
                    href="mailto:elinor.silow@gmail.com"
                    className="text-blue-700 mx-2 font-directorBold"
                  >
                    hej@elinorsilow.com
                  </Link>
                  for collaborations and inquires.
                </p>
              </div>
              <Button
                className="w-full uppercase justify-start gap-x-4  shadow items-baseline bg-foreground text-background font-directorLight hover:text-background/80 "
                variant="ghost"
                size="lg"
                asChild
              >
                <Link href="/exhibitions">
                  Read more <span className=" ">&gt;</span>
                </Link>
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

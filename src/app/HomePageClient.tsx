"use client";

import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

import type { Work, Exhibition } from "../../lib/wordpress";
import { motion } from "framer-motion";
import Staggered from "@/components/Staggered";
import Link from "next/link";

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
  const { setOpen, showInfo } = useUI();
  const { setActiveWorkSlug, activeWorkSlug, getWorkSizeClass, featuredWorks } =
    useWorks();
  const { activeExhibitionSlug, setActiveExhibitionSlug, featuredExhibitions } =
    useExhibitions();

  const router = useRouter();

  return (
    <>
      <section
        className=" mx-auto
      flex flex-col items-center justify-start w-full mt-0   "
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
            <span className="mt-[25vh] px-8 w-full col-span-5 lg:col-span-5 grid grid-cols-5 gap-x-8 bg-transparent">
              {/* Left title */}

              {/* Right link */}
              <Button
                className=" hidden lg:flex  lg:col-span-2 w-full uppercase justify-between  border-b-[0.5px] border-foreground items-baseline"
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
              loading={false}
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
            <div className="sticky bottom-0 lg:hidden z-20">
              <Button
                className="
    w-full uppercase justify-between
 lg:shadow-none
    bg-background
hover:bg-background
   border-transparent lg:border-foreground lg:border-b-[0.5px] px-8 pb-4 lg:px-4  
    "
                variant="ghost"
                size="lg"
                asChild
              >
                <Link
                  href="/works"
                  className="flex items-baseline gap-4 w-full"
                >
                  See all works
                  <span>&gt;</span>
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
            {" "}
            <span className="px-0 w-full lg:col-span-5 grid grid-cols-5 gap-x-8 bg-transparent">
              {/* Left title */}

              {/* Right link */}
              <Button
                className="hidden lg:flex  col-span-5   w-full uppercase justify-between
 lg:shadow-none
    bg-background
hover:bg-background
   border-transparent lg:border-foreground lg:border-b-[0.5px]px-8 pb-4 lg:px-4 "
                variant="ghost"
                size="lg"
                asChild
              >
                <Link href="/exhibitions">
                  See all Exhibitions <span>&gt;</span>
                </Link>
              </Button>
            </span>
            {/* Divider left */}
            <Staggered
              items={featuredExhibitions}
              getKey={(ex) => ex.id}
              loading={false}
              className="
    min-h-screen
       col-span-5
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-5
    gap-x-8 
    
 
  "
              renderItem={(ex: Exhibition) => (
                <motion.div
                  key={ex.id}
                  className="lg:col-span-2 h-[50vh] flex flex-col bg-transparent w-full  "
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
                          className="object-contain object-left lg:object-top-left p-4 lg:px-8"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            />
            <div className="sticky bottom-0 lg:hidden z-20 bg-background">
              <Button
                className="
    w-full uppercase justify-between
 lg:shadow-none
    bg-background
hover:bg-background
   border-transparent lg:border-foreground lg:border-b-[0.5px]px-8 lg:px-4 pb-4
    "
                variant="ghost"
                size="lg"
                asChild
              >
                <Link
                  href="/exhibitions"
                  className="flex items-center gap-4 w-full"
                >
                  See all Exhibitions
                  <span>&gt;</span>
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-foreground text-background  min-h-screen relative flex flex-col justify-between lg:grid grid-cols-5  ">
            <Button
              className="col-span-1 w-full uppercase gap-x-4  shadow items-baseline bg-foreground text-background font-directorLight px-8 py-4 lg:px-8 lg:py-4 hover:text-background/80 justify-between "
              variant="ghost"
              size="lg"
              asChild
            >
              <Link href="/info">
                About Elinor <span className=" ">&gt;</span>
              </Link>
            </Button>

            <div className="col-start-1 col-span-2 pl-8 lg:pl-8  pt-8 lg:pt-4 pr-16 lg:pr-8 ">
              <Link
                onClick={() => {}}
                className="items-baseline  no-hide-text h3 font-directorLight  whitespace-normal 
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
              className="col-start-1 w-full uppercase justify-start gap-x-4 shadow items-baseline bg-foreground text-background font-directorLight hover:text-background/80 px-8 lg:px-8 py-4 lg:py-4 pb-8"
              variant="ghost"
              size="lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <span>↑</span>
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
    </div>
  );
}

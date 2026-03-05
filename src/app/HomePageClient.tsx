"use client";

import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useUI } from "@/context/UIContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import type { Work, Exhibition } from "../../lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import Staggered from "@/components/Staggered";
import Link from "next/link";

import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";
import InfoPageClient from "@/components/InfoPageClient";
import HDivider from "@/components/HDivider";
import { useState, useEffect } from "react";
import UnderConstruction from "@/components/UnderConstruction";
import { Cross1Icon } from "@radix-ui/react-icons";

type Props = {
  showInfo?: boolean;
  setShowInfo?: (v: boolean) => void;
  view?: "works" | "exhibitions" | "info";
  setView?: (v: "works" | "exhibitions" | "info") => void;
};

type BottomSection = "works" | "exhibitions" | "info" | "bottom";

function BottomLinkBar() {
  const [activeSection, setActiveSection] = useState<BottomSection>("works");

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 100;

      if (atBottom) {
        setActiveSection("bottom");
        return;
      }

      const exEl = document.getElementById("home-exhibitions");
      const infoEl = document.getElementById("home-info");
      const mid = window.scrollY + window.innerHeight / 2;

      if (infoEl && mid >= infoEl.offsetTop) {
        setActiveSection("info");
      } else if (exEl && mid >= exEl.offsetTop) {
        setActiveSection("exhibitions");
      } else {
        setActiveSection("works");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed bottom-0 w-full lg:hidden z-20 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] bg-background p-4">
      <AnimatePresence mode="wait">
        {activeSection === "works" && (
          <motion.div
            key="works"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              className="w-full uppercase justify-start"
              variant="ghost"
              size="linkSizeLg"
              asChild
            >
              <Link href="/works" className="flex items-baseline gap-4 w-full">
                See all works
              </Link>
            </Button>
          </motion.div>
        )}

        {activeSection === "exhibitions" && (
          <motion.div
            key="exhibitions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              className="w-full uppercase justify-start"
              variant="ghost"
              size="linkSizeLg"
              asChild
            >
              <Link
                href="/exhibitions"
                className="flex items-center gap-4 w-full"
              >
                See all Exhibitions
              </Link>
            </Button>
          </motion.div>
        )}

        {activeSection === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              className="flex items-center justify-between gap-4 w-full"
              variant="ghost"
              size="linkSizeLg"
              asChild
            >
              <Link href="/info">About Elinor</Link>
            </Button>
          </motion.div>
        )}

        {activeSection === "bottom" && (
          <motion.div
            key="bottom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              className="w-full uppercase justify-start"
              variant="ghost"
              size="linkSizeLg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <span>↑</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnderConstructionOverlay() {
  const [open, setOpen] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="under-construction"
          className="fixed inset-0 z-50 bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Button
            className="absolute top-0 right-0 aspect-square h-auto"
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
          <div
            id="home-info"
            className="bg-background  relative flex flex-col items-start justify-start lg:items-baseline  lg:grid grid-cols-5 pl-8 lg:pl-8  pt-8 lg:pt-4 pr-16 lg:pr-8  "
          >
            <Link
              onClick={() => {}}
              className="items-baseline  no-hide-text  text-2xl font-bookish  whitespace-normal col-start-1 col-span-2 
   px-0 py
"
              href="/"
            >
              <strong className="font-normal   mr-2">Elinor Silow</strong>
              (b. 1993) in Malmö, Sweden, is a Stockholm based artist who
              explores raw emotion through painting, sculpture and textile.
            </Link>

            <p className=" mt-4   col-start-3 col-span-2 mb-8 no-hide-text  text-2xl font-bookish">
              Please contact
              <Link
                href="mailto:elinor.silow@gmail.com"
                className="text-blue-700 mx-2 "
              >
                hej@elinorsilow.com
              </Link>
              for collaborations and inquires.
            </p>
          </div>
          {/* Works */}
          <div
            id="home-works"
            className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5

    gap-x-4

  "
          >
            <Staggered
              items={featuredWorks}
              getKey={(w) => w.id}
              loading={false}
              className="
    h-[50vh]
    flex flex-col gap-y-4
    lg:grid lg:grid-cols-5
    gap-x-30

    col-span-5
  "
              renderItem={(work: Work) => (
                <motion.div
                  key={work.id}
                  className="h-screen lg:h-[25vh] flex flex-col   "
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
                    <div className={`relative mx-0 w-full h-[50vh] `}>
                      {work.image_url && (
                        <Image
                          src={work.image_url}
                          alt={work.title.rendered}
                          fill
                          className="object-contain object-left lg:object-top-left p-4 lg:p-8"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            />
          </div>

          {/* Exhibitions */}
          <div
            id="home-exhibitions"
            className="
              flex flex-col
                relative w-full
    lg:grid  grid-cols-5

    gap-x-4

  "
          >
            {" "}
            <Staggered
              items={featuredExhibitions}
              getKey={(ex) => ex.id}
              loading={false}
              className="
    h-[50vh]
       col-span-5
    flex flex-col gap-y-4
lg:flex-row
    gap-x-8


  "
              renderItem={(ex: Exhibition) => (
                <motion.div
                  key={ex.id}
                  className="w-lg h-[50vh] flex flex-col bg-transparent  "
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
          </div>

          {/* Info / Bio */}
          <Button
            className="col-start-1 w-min  "
            variant="link"
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top
          </Button>
        </div>
      </section>

      <BottomLinkBar />

      <UnderConstructionOverlay />

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

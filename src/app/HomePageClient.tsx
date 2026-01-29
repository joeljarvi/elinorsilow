"use client";

import MainContent from "../components/MainContent";
import Nav from "@/components/Nav";
import WorkModal from "./works/WorkModal";
import ExhibitionModal from "./exhibitions/ExhibitionModal";
import { Loader } from "@/components/Loader";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import Staggered from "@/components/Staggered";
import { useNav } from "@/context/NavContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import HDivider from "@/components/HDivider";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CombinedExhibition, Exhibition, Work } from "../../lib/wordpress";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

interface HomePageContentProps {
  loading: boolean;
  fullExhibitionList: CombinedExhibition[];
  exhibitions: Exhibition[];
  allWorks: Work[];
}

type WorkSort = "year" | "title" | "medium";
type ExhibitionSort = "year" | "title" | "type";

function HomePageContent({
  loading,
  exhibitions,
  allWorks,
  fullExhibitionList,
}: HomePageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read modal slugs from URL
  const workSlug = searchParams.get("work");
  const exhibitionSlug = searchParams.get("exhibition");

  const closeModal = () => router.push("/", { scroll: false });
  const [open, setOpen] = useState(false);
  const { activeWorkSlug, setActiveWorkSlug } = useWorks();
  const { activeExhibitionSlug, setActiveExhibitionSlug } = useExhibitions();

  return (
    <>
      <div className="flex flex-col lg:grid lg:grid-cols-4 w-full gap-0 pt-0 lg:pt-4   ">
        {/* DESKTOP NAV */}

        <MainContent />

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
      </div>
    </>
  );
}

export default function HomePageClient() {
  const {
    exhibitions,
    loading: exhibitionsLoading,
    fullExhibitionList,
  } = useExhibitions();
  const { allWorks, loading: worksLoading } = useWorks();
  const loading = exhibitionsLoading || worksLoading;

  if (loading) return <div></div>;

  return (
    <HomePageContent
      loading={loading}
      exhibitions={exhibitions}
      allWorks={allWorks}
      fullExhibitionList={fullExhibitionList}
    />
  );
}

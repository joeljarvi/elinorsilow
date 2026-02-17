"use client";

import Staggered from "@/components/Staggered";
import { useWorks } from "@/context/WorksContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Work, Exhibition } from "../../../lib/wordpress";
import { useUI } from "@/context/UIContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import WorksFilter from "@/components/WorksFilter";
import ExFilter from "@/components/ExFilter";
import { ExhibitionsCarousel } from "@/components/ExhibitionsCarousel";

export default function ExhibitionsPageClient() {
  const { filteredExhibitions, setActiveExhibitionSlug, activeExhibitionSlug } =
    useExhibitions();

  const router = useRouter();
  const {
    showInfo,
    open,
    setOpen,
    showExhibitionsFilter,
    handleOpenExhibitionsFilter,
  } = useUI();

  return (
    <section className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full mt-0 lg:mt-30 ">
      <ExhibitionsCarousel items={filteredExhibitions} />
    </section>
  );
}

"use client";

import { WorksProvider } from "@/context/WorksContext";
import dynamic from "next/dynamic";

const HomeContent = dynamic(() => import("@/components/HomeContent"), {
  ssr: false,
});

export default function WorksPage() {
  return (
    <WorksProvider>
      <HomeContent />
    </WorksProvider>
  );
}

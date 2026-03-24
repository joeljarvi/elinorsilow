import { Suspense } from "react";
import WorksPageClient from "./works/WorksPageClient";
import Hero from "@/components/Hero";
import UnderConstruction from "@/components/UnderConstruction";

export default function Home() {
  return (
    <>
      <UnderConstruction />

      <Suspense>
        <WorksPageClient />
      </Suspense>
    </>
  );
}

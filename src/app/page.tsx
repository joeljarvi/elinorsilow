import { Suspense } from "react";
import HomePageClient from "./HomePageClient";
import WorksPageClient from "./works/WorksPageClient";
import ExhibitionsPageClient from "./exhibitions/ExhibitionsPageClient";
import InfoPageClient from "@/components/InfoPageClient";
import UnderConstruction from "@/components/UnderConstruction";

export default function Home() {
  return (
    <>
      <UnderConstruction />
      <HomePageClient />
    </>
  );
}

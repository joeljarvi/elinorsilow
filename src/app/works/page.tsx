import { Suspense } from "react";
import WorksPageClient from "./WorksPageClient";
import UnderConstruction from "@/components/UnderConstruction";

export default function WorksPage() {
  return (
    <>
      <UnderConstruction />

      <Suspense>
        <WorksPageClient />
      </Suspense>
    </>
  );
}

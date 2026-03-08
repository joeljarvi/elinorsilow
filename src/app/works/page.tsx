import { Suspense } from "react";
import WorksPageClient from "./WorksPageClient";

export default function WorksPage() {
  return (
    <Suspense>
      <WorksPageClient />
    </Suspense>
  );
}

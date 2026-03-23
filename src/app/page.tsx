import { Suspense } from "react";
import WorksPageClient from "./works/WorksPageClient";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <Suspense>
      <WorksPageClient />
    </Suspense>
  );
}

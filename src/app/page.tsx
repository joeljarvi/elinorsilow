import HomePageClient from "./HomePageClient";
import React from "react";
import { Loader } from "@/components/Loader";

export default function Home() {
  return (
    <>
      <React.Suspense fallback={<Loader />}>
        <HomePageClient />
      </React.Suspense>
    </>
  );
}

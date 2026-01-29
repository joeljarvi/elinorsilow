import React from "react";

import { Loader } from "@/components/Loader";
import ExhibitionsList from "./ExhibitionsList";

export default function ExhibitionsPage() {
  return (
    <React.Suspense fallback={<Loader />}>
      <ExhibitionsList />
    </React.Suspense>
  );
}

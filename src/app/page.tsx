// /app/page.tsx
import HomePageClient from "./HomePageClient";
import React from "react";

export default function Home() {
  // No useSearchParams here
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <HomePageClient />
    </React.Suspense>
  );
}

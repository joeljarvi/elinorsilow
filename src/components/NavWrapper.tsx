"use client";

import { usePathname } from "next/navigation";
import DesktopNav from "./DesktopNav";
import FilterBox from "./FilterBox";
import PageHeader from "./PageHeader";
import SeoShortBio from "./SeoShortBio";
import ViewportFrame from "./ViewportFrame";

export default function NavWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;
  const hideFilter = pathname === "/info";
  return (
    <>
      <DesktopNav />
    </>
  );
}

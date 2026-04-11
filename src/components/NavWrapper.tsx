"use client";

import { usePathname } from "next/navigation";
import DesktopNav from "./DesktopNav";
import FilterBox from "./FilterBox";

export default function NavWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;
  const hideFilter = pathname === "/" || pathname === "/info";
  return (
    <>
      <DesktopNav />
      {!hideFilter && <FilterBox />}
    </>
  );
}

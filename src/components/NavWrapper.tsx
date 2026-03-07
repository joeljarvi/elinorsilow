"use client";

import { usePathname } from "next/navigation";
import DesktopNav from "./DesktopNav";
import MobileNavButton from "./MobileNavButton";
import MobileNavOverlay from "./MobileNavOverlay";

export default function NavWrapper() {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;
  return (
    <>
      <DesktopNav />
      <MobileNavOverlay />
      <MobileNavButton />
    </>
  );
}

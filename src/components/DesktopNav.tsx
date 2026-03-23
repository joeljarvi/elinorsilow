"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import NavSearch from "./NavSearch";
import { DarkModeToggle } from "./DarkModeToggle";
import { useNav } from "@/context/NavContext";
import { useInfo } from "@/context/InfoContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { OGubbeText } from "./OGubbeText";

function NavItem({
  href,
  children,
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Button variant="link" size="controls" className={className} asChild>
      <Link href={href} onClick={onClick}>
        {children}
      </Link>
    </Button>
  );
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);
  const pathname = usePathname();
  const { setOpen } = useUI();
  const { viewLoading } = useNav();
  const { infoLoading } = useInfo();
  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (!initialLoaded && !workLoading && !exLoading && !infoLoading) {
      setInitialLoaded(true);
    }
    const fallback = setTimeout(() => setInitialLoaded(true), 2000);
    return () => clearTimeout(fallback);
  }, [initialLoaded, workLoading, exLoading, infoLoading]);

  const loading = !initialLoaded || viewLoading;

  useEffect(() => {
    setOpen(true);
  }, [pathname, setOpen]);

  return (
    <div
      id="main-nav"
      className={` z-[80] fixed top-0 left-0 w-full bg-background shadow-[var(--shadow-ui)]`}
      onClick={() => setOpen(false)}
    >
      <NavSearch open={openSearch} onClose={() => setOpenSearch(false)} />
      <nav
        aria-label="Site navigation"
        className="relative flex justify-between items-center  lg:px-[18px] pt-[32px] pb-[9px] lg:pt-[18px] font-bookish no-hide-text bg-background"
      >
        <NavItem href="/">
          <OGubbeText
            className="text-[18px] "
            text="Elinor Silow"
            loading={loading}
          />
        </NavItem>

        <span className="hidden lg:flex absolute left-1/2 -translate-x-1/2 flex-row items-baseline gap-x-0">
          <NavItem href="/">
            {pathname === "/" ? (
              <OGubbeText text="Works" className="text-[18px]" />
            ) : (
              "Works"
            )}
          </NavItem>
          <NavItem href="/exhibitions">
            {pathname.startsWith("/exhibitions") ? (
              <OGubbeText text="Exhibitions" className="text-[18px]" />
            ) : (
              "Exhibitions"
            )}
          </NavItem>
          <NavItem href="/info">
            {pathname.startsWith("/info") ? (
              <OGubbeText text="Info" className="text-[18px]" />
            ) : (
              "Info"
            )}
          </NavItem>
          <NavItem href="/contact">
            {pathname.startsWith("/contact") ? (
              <OGubbeText text="Contact" className="text-[18px]" />
            ) : (
              "Contact"
            )}
          </NavItem>
        </span>

        <span className="flex items-center gap-x-0">
          <DarkModeToggle className="hidden lg:flex" />
          <Button
            className="hidden lg:flex"
            variant="link"
            size="controls"
            onClick={() => setOpenSearch(true)}
          >
            Search
          </Button>
        </span>
      </nav>
      <div className="absolute bottom-0 left-0 w-full h-[10px] translate-y-full pointer-events-none bg-gradient-to-b from-background to-background/0" />
    </div>
  );
}

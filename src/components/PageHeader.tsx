"use client";

import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import WigglyButton from "./WigglyButton";

export default function PageHeader() {
  const pathname = usePathname();
  const {
    activePage,
    visibleWorkIndex,
    visibleExhibitionIndex,
    hoveredItemTitle,
    showAsList,
  } = useUI();
  const { filteredWorks } = useWorks();
  const { filteredExhibitions, exAsList } = useExhibitions();

  if (pathname.startsWith("/studio")) return null;

  const isInfoPage = pathname.startsWith("/info");

  // Mobile: topmost visible item via IntersectionObserver
  let mobileTitle: string | null = null;

  if (isInfoPage) {
    mobileTitle = "info";
  } else if (activePage === "works" || activePage === "home") {
    mobileTitle = filteredWorks[visibleWorkIndex]?.title.rendered ?? null;
  } else if (activePage === "exhibitions") {
    mobileTitle =
      filteredExhibitions[visibleExhibitionIndex]?.title.rendered ?? null;
  }
  // Desktop: whichever item is currently hovered

  const desktopTitle = pathname.startsWith("/info")
    ? "info"
    : hoveredItemTitle?.trim() ||
      (activePage === "exhibitions" ? "exhibitions" : "elinor silow / works");
  return (
    <>
      {/* Mobile: fixed top-center */}

      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-[100] flex items-center px-[9px] pt-[6px] pb-[9px] gap-y-0 bg-transparent pointer-events-none w-full`}
      >
        {mobileTitle && ((!exAsList && !showAsList) || isInfoPage) && (
          <WigglyButton
            key={mobileTitle}
            text={mobileTitle}
            size="text-[16px]"
            active={true}
            revealAnimation
            className="no-hide-text mt-[4px] text-[16px]  font-timesNewRoman font-normal text-foreground text-shadow-md justify-center tracking-normal w-full mb-0 "
          />
        )}
        <div className="hidden  absolute top-full left-0 right-0 h-[9px] bg-gradient-to-b from-background to-transparent lg:hidden" />
      </div>

      {/* Desktop: fixed top-left */}
      <div
        className={`hidden  lg:flex fixed top-0 left-0 z-[90] items-center pt-[9px] pb-[0px] px-[9px] pointer-events-none bg-transparent `}
      >
        {desktopTitle && !pathname.startsWith("/info") && (
          <>
            <div className=" w-full">
              <WigglyButton
                key={desktopTitle}
                text={desktopTitle}
                size="text-[16px]"
                active={true}
                revealAnimation
                className="font-timesNewRoman font-normal text-foreground "
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

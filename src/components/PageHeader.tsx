"use client";

import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import WigglyButton from "./WigglyButton";

import WigglyDivider from "./WigglyDivider";

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

  const mobileText =
    !isInfoPage && mobileTitle && !exAsList && !showAsList ? mobileTitle : null;

  return (
    <>
      {/* Mobile: fixed top-center */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-[100] flex flex-col pr-[9px] pt-[6px] pb-[0px] gap-y-0 bg-background pointer-events-none w-full pl-[0px]`}
      >
        {mobileText && (
          <WigglyButton
            key={mobileText}
            text={mobileText}
            size="text-[24px]"
            active
            revealAnimation
            wiggleGradient
            sizeGradient={{ from: 28, to: 16 }}
            className="no-hide-text font-timesNewRoman font-normal justify-start text-foreground items-baseline tracking-normal w-full"
          />
        )}
      </div>

      {/* Desktop: fixed top-left */}
      <div
        className={`hidden lg:flex fixed top-0 left-0 z-[90] items-start pt-[3px] pb-[0px] px-[0px] pointer-events-none bg-transparent`}
      >
        {!pathname.startsWith("/info") &&
          (() => {
            const desktopTitle = hoveredItemTitle?.trim() || mobileTitle;
            return desktopTitle ? (
              <WigglyButton
                key={desktopTitle}
                text={desktopTitle}
                size="text-[28px]"
                active={true}
                revealAnimation
                className="font-timesNewRoman font-normal items-center justify-start text-foreground"
                sizeGradient={{ from: 28, to: 16 }}
              />
            ) : null;
          })()}
      </div>
    </>
  );
}

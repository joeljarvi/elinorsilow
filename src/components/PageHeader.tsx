"use client";

import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { OGubbeText } from "./OGubbeText";
import WigglyButton from "./WigglyButton";
import work from "../../schemas/work";

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

  const pageLabel =
    activePage === "home" || activePage === "works"
      ? "works"
      : activePage === "exhibitions"
        ? "exhibitions"
        : activePage;

  const breadcrumb = `elinor silow / ${pageLabel}`;

  // Mobile: topmost visible item via IntersectionObserver
  let mobileTitle: string | null = null;
  if (activePage === "works" || activePage === "home") {
    mobileTitle = filteredWorks[visibleWorkIndex]?.title.rendered ?? null;
  } else if (activePage === "exhibitions") {
    mobileTitle =
      filteredExhibitions[visibleExhibitionIndex]?.title.rendered ?? null;
  }

  // Desktop: whichever item is currently hovered
  const desktopTitle = hoveredItemTitle;

  return (
    <>
      {/* Mobile: fixed top-center */}

      <div className="lg:hidden fixed top-0 left-0 right-0 z-[70] flex flex-col items-start  px-[9px] pt-[9px] gap-y-0">
        {/* <div className="fixed top-0 h-[48px] w-full shrink-0 bg-gradient-to-b from-background to-transparent pointer-events-none -mb-[48px] z-[80]" /> */}
        <WigglyButton text={breadcrumb} size="text-[16px]" className="" />

        {mobileTitle && !exAsList && !showAsList && (
          <div className="overflow-hidden flex items-center justify-start w-full ml-[132px]  -mt-[9px]  ">
            <OGubbeText
              key={mobileTitle}
              text={mobileTitle}
              lettersOnly
              className="no-hide-text text-[16px] font-timesNewRoman font-normal text-foreground justify-center max-w-[70vw]"
              sizes="16px"
            />
          </div>
        )}
      </div>

      {/* Desktop: fixed top-left, title shown on hover */}
      <div className="hidden lg:flex fixed top-0 left-0 z-[70] items-baseline gap-x-[0px] pt-[9px] lg:pt-[9px] px-[9px] pointer-events-none">
        <WigglyButton
          text={breadcrumb}
          size="text-[16px] lg:text-[19px]"
          className="text-muted-foreground pointer-events-none "
        />
        <WigglyButton
          text="/"
          size="text-[16px] lg:text-[19px]"
          className="text-muted-foreground pointer-events-none pl-0"
        />

        {(desktopTitle || mobileTitle) && (
          <div className="overflow-hidden max-w-[40vw]">
            <OGubbeText
              key={desktopTitle ?? mobileTitle ?? ""}
              text={desktopTitle ?? mobileTitle ?? ""}
              lettersOnly
              revealAnimation
              className="text-[16px] lg:text-[19px] font-timesNewRoman font-normal text-foreground"
              sizes="16px"
            />
          </div>
        )}
      </div>
    </>
  );
}

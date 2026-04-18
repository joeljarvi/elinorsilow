"use client";

import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { OGubbeText } from "./OGubbeText";
import WigglyButton from "./WigglyButton";

export default function PageHeader() {
  const pathname = usePathname();
  const {
    activePage,
    visibleWorkIndex,
    visibleExhibitionIndex,
    hoveredItemTitle,
    showAsList,
    showColorBg,
  } = useUI();
  const { filteredWorks } = useWorks();
  const { filteredExhibitions, exAsList } = useExhibitions();

  if (pathname.startsWith("/studio")) return null;

  const pageLabel = pathname.startsWith("/info")
    ? "info"
    : activePage === "home" || activePage === "works"
      ? "works"
      : activePage === "exhibitions"
        ? "exhibitions"
        : activePage;

  const pageLabelHref = pathname.startsWith("/info")
    ? "/info"
    : pathname.startsWith("/exhibitions")
      ? "/exhibitions"
      : "/";

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

      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-[70] flex flex-col items-center px-[9px] pt-[9px] gap-y-0`}
      >
        {/* <div className="fixed top-0 h-[48px] w-full shrink-0 bg-gradient-to-b from-background to-transparent pointer-events-none -mb-[48px] z-[80]" /> */}
        <span className=" hidden">
          <WigglyButton
            text="elinor silow"
            size="text-[16px]"
            className="text-muted-foreground tracking-widest"
            href="/"
            active={false}
          />
          <span className="text-[16px] font-timesNewRoman text-muted-foreground ">
            /
          </span>
          <WigglyButton
            text={pageLabel}
            size="text-[16px]"
            className="text-muted-foreground"
            href={pageLabelHref}
            active={true}
          />
          <span className="text-[16px] font-timesNewRoman text-muted-foreground hidden ">
            /
          </span>
        </span>
        {mobileTitle &&
          !exAsList &&
          !showAsList &&
          !pathname.startsWith("/info") && (
            <WigglyButton
              key={mobileTitle}
              text={mobileTitle}
              size="text-[16px]"
              active={true}
              bold={true}
              revealAnimation
              className=" fixed top-[9px] left-0 no-hide-text text-[16px] ml-[0px] font-timesNewRoman font-normal text-foreground justify-center max-w-[70vw] tracking-normal"
              vertical
            />
          )}
      </div>

      {/* Desktop: fixed top-left, title shown on hover */}
      <div
        className={`hidden lg:flex fixed top-0 left-0 z-[70] items-center gap-x-[0px] pt-[9px] lg:pt-[9px] px-[9px] pointer-events-none `}
      >
        <WigglyButton
          text="elinor silow"
          size="text-[16px] lg:text-[19px]"
          className="text-muted-foreground "
          href="/"
        />
        <span className="text-[16px] font-timesNewRoman text-muted-foreground ">
          /
        </span>
        <WigglyButton
          text={pageLabel}
          size="text-[16px] lg:text-[19px]"
          className="text-muted-foreground"
          href={pageLabelHref}
          active={true}
        />
        {desktopTitle && !pathname.startsWith("/info") && (
          <>
            <span className="text-[16px] lg:text-[19px] font-timesNewRoman text-muted-foreground px-[2px]">
              /
            </span>
            <div className="overflow-hidden max-w-[40vw]">
              <WigglyButton
                key={desktopTitle}
                text={desktopTitle}
                size="text-[16px] lg:text-[19px]"
                active={true}
                revealAnimation
                className=" text-[16px] ml-[0px] font-timesNewRoman font-normal text-foreground justify-center max-w-[70vw]"
                bold={true}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

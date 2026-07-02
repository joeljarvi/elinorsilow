"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useUI } from "@/context/UIContext";
import { useIndex, IndexSort, IndexMode } from "@/context/IndexContext";
import { useWorks, CategoryFilter } from "@/context/WorksContext";
import { useExhibitions, ExCategory } from "@/context/ExhibitionsContext";
import { usePathname } from "next/navigation";
import WigglyButton from "./WigglyButton";

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/works", label: "works" },
  { href: "/exhibitions", label: "exhibitions" },
  { href: "/index", label: "index" },
  { href: "/info", label: "info" },
  { href: "/contact", label: "contact" },
  {
    href: "https://www.instagram.com/elinorsilow",
    label: "instagram",
    target: "_blank",
    rel: "noopener noreferrer",
  },
];

const INDEX_SORTS: IndexSort[] = ["latest", "year", "a-z"];
const INDEX_MODES: IndexMode[] = ["works", "exhibitions", "all"];

const WORK_FILTERS: { label: string; value: CategoryFilter }[] = [
  { label: "all works", value: "all" },
  { label: "paintings", value: "painting" },
  { label: "sculptures", value: "sculpture" },
  { label: "drawings", value: "drawing" },
];

const EX_CATS: { label: string; value: ExCategory }[] = [
  { label: "all exhibitions", value: "all" },
  { label: "group exhibitions", value: "group" },
  { label: "solo exhibitions", value: "solo" },
];

const INFO_SECTIONS = [
  "bio",
  "group exhibitions",
  "solo exhibitions",
  "education",
  "grants",
  "press",
];

function NewNavOverlay({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();
  const { mode, setMode, sort, setSort, zoom, setZoom, tidy, setTidy } =
    useIndex();

  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const onWorks = pathname === "/works";
  const onInfo = pathname === "/info";
  const onIndex = pathname === "/index";
  const onExhibitions = pathname === "/exhibitions";

  useEffect(() => {
    if (!onInfo) return;
    const ids = INFO_SECTIONS.map((s) => s.replace(/\s+/g, "-"));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [onInfo]);

  const renderSubmenu = () => {
    if (onWorks) {
      return WORK_FILTERS.map((f) => {
        const active = categoryFilter === f.value;
        return (
          <WigglyButton
            key={f.value}
            text={f.label}
            mobileSize="text-2xl"
            className={`tracking-wide px-0 leading-tight  `}
            onClick={() => setCategoryFilter(f.value)}
            bold={active}
            anchorFill="currentColor"
            forceBaseline
          />
        );
      });
    }
    if (onInfo) {
      return INFO_SECTIONS.map((s) => {
        const id = s.replace(/\s+/g, "-");
        return (
          <WigglyButton
            key={s}
            text={s}
            mobileSize="text-2xl"
            className="tracking-wide leading-tight px-0 text-foreground"
            href={`#${id}`}
            bold={activeSection === id}
            anchorFill="currentColor"
            forceBaseline
            onClick={onClose}
          />
        );
      });
    }
    if (onIndex) {
      return (
        <>
          {INDEX_MODES.map((m) => {
            const active = mode === m;
            return (
              <WigglyButton
                key={m}
                text={m}
                mobileSize="text-2xl"
                className="tracking-wide px-0 text-foreground leading-tight"
                onClick={() => setMode(m)}
                bold={active}
                anchorFill="currentColor"
                forceBaseline
              />
            );
          })}
          {INDEX_SORTS.map((s) => {
            const active = sort === s;
            return (
              <WigglyButton
                key={s}
                text={s}
                mobileSize="text-2xl"
                className="tracking-wide px-0 text-foreground leading-tight"
                onClick={() => setSort(s)}
                bold={active}
                anchorFill="currentColor"
                forceBaseline
              />
            );
          })}
          <WigglyButton
            text="settings"
            mobileSize="text-2xl"
            className="tracking-wide px-0 text-foreground leading-tight"
            onClick={() => setShowSettings((v) => !v)}
            bold={showSettings}
            anchorFill="currentColor"
            forceBaseline
          />
          {showSettings && (
            <>
              <WigglyButton
                text="zoom in"
                mobileSize="text-2xl"
                className="tracking-wide px-0 text-foreground leading-tight"
                onClick={() => setZoom(Math.max(0, zoom - 1))}
                anchorFill="currentColor"
                forceBaseline
              />
              <WigglyButton
                text="zoom out"
                mobileSize="text-2xl"
                className="tracking-wide px-0 text-foreground leading-tight"
                onClick={() => setZoom(Math.min(4, zoom + 1))}
                anchorFill="currentColor"
                forceBaseline
              />
              <WigglyButton
                text="tidy up"
                mobileSize="text-2xl"
                className="tracking-wide px-0 text-foreground leading-tight"
                onClick={() => setTidy(!tidy)}
                bold={tidy}
                active={tidy}
                anchorFill="currentColor"
                forceBaseline
              />
            </>
          )}
        </>
      );
    }
    if (onExhibitions) {
      return EX_CATS.map((c) => {
        const active = exCat === c.value;
        return (
          <WigglyButton
            key={c.value}
            text={c.label}
            mobileSize="text-2xl"
            className="tracking-wide px-0 text-foreground leading-tight"
            onClick={() => setExCat(c.value)}
            bold={active}
            anchorFill="currentColor"
            forceBaseline
          />
        );
      });
    }
    return null;
  };

  return (
    <div
      className={`lg:hidden fixed inset-0 z-[125] ${pathname === "/info" ? "bg-blue-600" : "bg-[#B0916E]"} px-6 pb-4 pointer-events-auto grid grid-cols-2 gap-x-4 grid-rows-2 gap-y-0 h-dvh`}
    >
      {/* Row 1, Col 1: spacer — logo+menu floats here at z-[131] */}

      {/* Row 1, Col 2: nav links */}
      <div className="col-start-1 mt-1 row-start-1 flex flex-col items-start justify-baseline gap-y-2 pt-12">
        {NAV_LINKS.map(({ href, label, target, rel }) => (
          <WigglyButton
            key={href}
            text={label}
            mobileSize="text-2xl"
            className="tracking-wide px-0 text-foreground leading-tight"
            href={href}
            target={target}
            rel={rel}
            bold={pathname === href}
            anchorFill="currentColor"
            onClick={onClose}
            forceBaseline
          />
        ))}
      </div>
      {/* Row 2, Col 1: page-specific submenu */}
      <div className="col-start-1 row-start-2 flex flex-col items-start gap-y-2 ">
        {renderSubmenu()}
      </div>
      {/* Close button — bottom center */}
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-x-4 px-6 pb-8">
        <WigglyButton
          text="close"
          mobileSize="text-2xl"
          className=" col-start-2 tracking-wide px-0 text-foreground leading-tight"
          onClick={onClose}
          anchorFill="currentColor"
          bold
          forceBaseline
        />
      </div>
    </div>
  );
}

export default function DesktopNav() {
  const pathname = usePathname();
  const { sans } = useUI();
  const { mode, setMode, tidy, setTidy, zoom, setZoom, search, setSearch } =
    useIndex();

  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("sans-mode", sans);
  }, [sans]);

  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  const onIndex = pathname === "/index";
  const onWorks = pathname === "/works";
  const onExhibitions = pathname === "/exhibitions";
  const onInfo = pathname === "/info";

  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();

  useEffect(() => {
    if (!onIndex) return;
    function handleScroll() {
      if (window.innerWidth < 1024) setNavOpen(false);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onIndex]);

  useEffect(() => {
    if (!onInfo) return;
    const ids = INFO_SECTIONS.map((s) => s.replace(/\s+/g, "-"));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [onInfo]);

  return (
    <>
      {/* Main nav — z-[131], always above NewNavOverlay */}
      <div
        id="main-nav"
        className={`fixed left-0 right-0 z-[131] flex flex-col items-center pt-2 lg:pt-0 pointer-events-none ${onInfo ? " max-lg:bg-blue-600" : ""}`}
      >
        {/* Flex-wrap row: logo + "," + menu [+ ":" + nav links on desktop when open] */}
        <div className="flex flex-wrap items-baseline justify-start lg:justify-center pointer-events-auto px-6 lg:px-4 gap-x-0 w-full">
          <WigglyButton
            text="elinor silow"
            size="text-3xl"
            mobileSize="text-2xl"
            className="tracking-wide leading-tight items-baseline text-foreground px-0 mx-0"
            href="/"
            bold
            anchorFill="currentColor"
            wiggleGradient={true}
            forceBaseline
            active
          />
          <span className="font-timesNewRoman text-2xl lg:text-3xl text-foreground select-none leading-tight font-bold">
            ,{" "}
          </span>
          <WigglyButton
            text="menu"
            size="text-3xl"
            mobileSize="text-2xl"
            className="tracking-wide leading-tight px-0 mx-0 ml-2 text-foreground"
            onClick={() => setNavOpen((v) => !v)}
            anchorFill="currentColor"
            forceBaseline
            wiggleGradient={true}
            active
          />
          {/* ":" on mobile when nav open */}
          {navOpen && (
            <span className="lg:hidden font-timesNewRoman text-2xl text-foreground select-none font-bold leading-none">
              :
            </span>
          )}
          {/* ":" on desktop before nav links */}
          {navOpen && (
            <span className="hidden lg:inline font-timesNewRoman text-3xl select-none leading-tight mr-1.5">
              {":"}
            </span>
          )}
          {/* Desktop nav links — hidden on mobile (NewNavOverlay handles mobile) */}
          {NAV_LINKS.map(({ href, label, target, rel }, idx) => (
            <Fragment key={href}>
              {idx > 0 && navOpen && (
                <span className="hidden lg:inline font-timesNewRoman text-3xl select-none leading-tight mr-1.5">
                  ,{" "}
                </span>
              )}
              <WigglyButton
                text={label}
                size="text-3xl"
                mobileSize="text-2xl"
                className={`tracking-wide leading-tight px-0 ml-0 ${navOpen ? "hidden lg:inline-flex" : "hidden"}`}
                href={href}
                target={target}
                rel={rel}
                bold={pathname === href}
                anchorFill="currentColor"
                forceBaseline
              />
            </Fragment>
          ))}
        </div>

        {/* Desktop submenus — flex-wrap rows below the nav row */}

        {/* Works: category filter */}
        {onWorks && navOpen && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto ">
            {WORK_FILTERS.map((f, i) => {
              const active = categoryFilter === f.value;
              return (
                <Fragment key={f.value}>
                  {i > 0 && (
                    <span className="font-timesNewRoman text-3xl select-none leading-tight text-foreground">
                      ,
                    </span>
                  )}
                  <WigglyButton
                    text={f.label}
                    size="text-3xl"
                    className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
                    onClick={() => setCategoryFilter(f.value)}
                    bold={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                </Fragment>
              );
            })}
          </div>
        )}

        {/* Exhibitions: always-visible desktop category row */}
        {onExhibitions && (
          <div className="hidden lg:flex -mt-2 gap-x-0 items-baseline justify-center pointer-events-auto ">
            {EX_CATS.map((c, i) => {
              const active = exCat === c.value;
              return (
                <Fragment key={c.value}>
                  {i > 0 && (
                    <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground">
                      ,
                    </span>
                  )}
                  <WigglyButton
                    text={c.label}
                    size="text-3xl"
                    className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
                    onClick={() => setExCat(c.value)}
                    bold={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                </Fragment>
              );
            })}
          </div>
        )}

        {/* Index: mode filter + settings toggle */}
        {onIndex && navOpen && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto  w-full">
            {INDEX_MODES.map((m, i) => {
              const active = mode === m;
              return (
                <Fragment key={m}>
                  {i > 0 && (
                    <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground">
                      ,
                    </span>
                  )}
                  <WigglyButton
                    text={m}
                    size="text-3xl"
                    className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
                    onClick={() => setMode(m)}
                    bold={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                </Fragment>
              );
            })}
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground">
              ,
            </span>
            <WigglyButton
              text="settings"
              size="text-3xl"
              className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
              onClick={() => setShowSettings((v) => !v)}
              bold={showSettings}
              anchorFill="currentColor"
              forceBaseline
            />
          </div>
        )}

        {/* Index: settings sub-panel */}
        {onIndex && navOpen && showSettings && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto ">
            <WigglyButton
              text="zoom in"
              size="text-3xl"
              className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
              onClick={() => setZoom(Math.max(0, zoom - 1))}
              anchorFill="currentColor"
              forceBaseline
            />
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground">
              ,
            </span>
            <WigglyButton
              text="zoom out"
              size="text-3xl"
              className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
              onClick={() => setZoom(Math.min(4, zoom + 1))}
              anchorFill="currentColor"
              forceBaseline
            />
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground">
              ,
            </span>
            <WigglyButton
              text="tidy up"
              size="text-3xl"
              className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
              onClick={() => setTidy(!tidy)}
              bold={tidy}
              anchorFill="currentColor"
              forceBaseline
            />
          </div>
        )}

        {/* Info: section links */}
        {onInfo && navOpen && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto ">
            {INFO_SECTIONS.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && (
                  <span className="font-timesNewRoman text-2xl select-none text-foreground leading-tight ">
                    ,
                  </span>
                )}
                <WigglyButton
                  text={s}
                  size="text-3xl"
                  className="tracking-wide leading-tight px-0 lg:ml-2 "
                  href={`#${s.replace(/\s+/g, "-")}`}
                  bold={activeSection === s.replace(/\s+/g, "-")}
                  anchorFill="currentColor"
                  forceBaseline
                  onClick={() => setNavOpen(false)}
                />
              </Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Mobile overlay — z-[125], behind logo/menu */}
      {navOpen && (
        <NewNavOverlay onClose={() => setNavOpen(false)} pathname={pathname} />
      )}

      {/* Search overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center pointer-events-none w-full px-4 bg-background">
          <div className="pointer-events-auto relative inline-flex items-center border-b-1 border-foreground w-full">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search..."
              className="bg-transparent border-none outline-none font-timesNewRoman text-2xl lowercase font-normal tracking-wide placeholder:text-foreground text-foreground px-2 pr-8"
            />
            <button
              onClick={() => {
                setSearch("");
                setShowSearch(false);
              }}
              className="absolute right-0 text-foreground text-2xl font-timesNewRoman"
              aria-label="Close search"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

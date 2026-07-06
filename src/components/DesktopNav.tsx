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
  { href: "/index/works", label: "works" },
  { href: "/index/exhibitions", label: "exhibitions" },
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
const INDEX_MODES: { label: string; value: IndexMode }[] = [
  { label: "all works", value: "works" },
  { label: "all exhibitions", value: "exhibitions" },
  { label: "all", value: "all" },
];

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

const INFO_SECTIONS = ["bio", "exhibitions", "education", "grants", "press"];

function NewNavOverlay({
  onClose,
  pathname,
}: {
  onClose: () => void;
  pathname: string;
}) {
  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();
  const {
    mode,
    setMode,
    sort,
    setSort,
    zoom,
    setZoom,
    tidy,
    setTidy,
    search,
    setSearch,
  } = useIndex();

  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  const onInfo = pathname === "/info";
  const onIndexAny = pathname.startsWith("/index");
  const onIndexRoot = pathname === "/index";
  const onIndexWorks = pathname === "/index/works";
  const onIndexExhibitions = pathname === "/index/exhibitions";

  useEffect(() => {
    if (onIndexRoot) searchRef.current?.focus();
  }, [onIndexRoot]);

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
    if (onInfo) {
      return INFO_SECTIONS.map((s) => {
        const id = s.replace(/\s+/g, "-");
        const active = activeSection === id;
        return (
          <WigglyButton
            key={s}
            text={s}
            mobileSize="text-xl"
            className="tracking-wide leading-tight px-0 text-foreground items-baseline"
            href={`#${id}`}
            bold={active}
            active={active}
            anchorFill="currentColor"
            forceBaseline
            onClick={onClose}
          />
        );
      });
    }
    if (onIndexAny) {
      return (
        <>
          {onIndexRoot && (
            <div className="flex flex-col gap-y-2">
              {INDEX_MODES.map(({ label, value }) => {
                const active = mode === value;
                return (
                  <WigglyButton
                    key={value}
                    text={label}
                    mobileSize="text-xl"
                    className="tracking-wide px-0 text-foreground leading-tight items-baseline"
                    onClick={() => setMode(value)}
                    bold
                    active={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                );
              })}
            </div>
          )}
          <div className="flex flex-col gap-y-2 mt-0">
            {INDEX_SORTS.map((s) => {
              const active = sort === s;
              return (
                <WigglyButton
                  key={s}
                  text={s}
                  mobileSize="text-xl"
                  className="tracking-wide px-0 text-foreground leading-tight items-baseline"
                  onClick={() => setSort(s)}
                  bold
                  active={active}
                  anchorFill="currentColor"
                  forceBaseline
                />
              );
            })}
          </div>
          {onIndexRoot && (
            <div className="flex flex-col gap-y-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search..."
                className="bg-transparent border-none outline-none font-timesNewRoman text-xl lowercase font-bold tracking-wide placeholder:text-foreground text-foreground px-0"
              />
            </div>
          )}
          <div className="flex flex-col gap-y-2">
            <WigglyButton
              text="settings"
              mobileSize="text-xl"
              className="tracking-wide px-0 text-foreground leading-tight items-baseline"
              onClick={() => setShowSettings((v) => !v)}
              bold={showSettings}
              active={showSettings}
              anchorFill="currentColor"
              forceBaseline
            />
            {showSettings && (
              <>
                <WigglyButton
                  text="zoom in"
                  mobileSize="text-xl"
                  className="tracking-wide px-0 text-foreground leading-tight items-baseline"
                  onClick={() => setZoom(Math.max(0, zoom - 1))}
                  anchorFill="currentColor"
                  forceBaseline
                  active
                />
                <WigglyButton
                  text="zoom out"
                  mobileSize="text-xl"
                  className="tracking-wide px-0 text-foreground leading-tight items-baseline"
                  onClick={() => setZoom(Math.min(4, zoom + 1))}
                  anchorFill="currentColor"
                  forceBaseline
                  active
                />
                <WigglyButton
                  text="tidy up"
                  mobileSize="text-xl"
                  className="tracking-wide px-0 text-foreground leading-tight items-baseline"
                  onClick={() => setTidy(!tidy)}
                  bold={tidy}
                  active={tidy}
                  anchorFill="currentColor"
                  forceBaseline
                />
              </>
            )}
          </div>
          {onIndexWorks && (
            <div className="flex flex-col gap-y-2 mt-0">
              {WORK_FILTERS.map((f) => {
                const active = categoryFilter === f.value;
                const disabled = f.value === "drawing";
                return (
                  <WigglyButton
                    key={f.value}
                    text={f.label}
                    mobileSize="text-xl"
                    className={`tracking-wide px-0 leading-tight items-baseline ${disabled ? "opacity-50 cursor-none" : "text-foreground"}`}
                    onClick={
                      disabled ? undefined : () => setCategoryFilter(f.value)
                    }
                    bold={active}
                    active={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                );
              })}
            </div>
          )}
          {onIndexExhibitions && (
            <div className="flex flex-col gap-y-2 mt-0">
              {EX_CATS.map((c) => {
                const active = exCat === c.value;
                return (
                  <WigglyButton
                    key={c.value}
                    text={c.label}
                    mobileSize="text-xl"
                    className="tracking-wide px-0 text-foreground leading-tight items-baseline"
                    onClick={() => setExCat(c.value)}
                    bold={active}
                    active={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                );
              })}
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <div
      className={`lg:hidden fixed inset-0 z-[125] ${pathname === "/info" ? "bg-blue-600" : "bg-[#B0916E]"} px-6 pb-4 pointer-events-auto grid grid-cols-2 gap-x-4 grid-rows-2 gap-y-0 h-dvh`}
    >
      {/* Row 1, Col 1: spacer — logo+menu floats here at z-[131] */}

      {/* Row 1, Col 2: nav links */}
      <div className="col-start-2 col-span-1 mt-1 row-start-1 flex flex-col items-start text-left justify-baseline gap-y-2 pt-5.5">
        {NAV_LINKS.map(({ href, label, target, rel }) => (
          <WigglyButton
            key={href}
            text={label}
            mobileSize="text-xl"
            className="tracking-wide px-0 text-foreground leading-tight items-baseline"
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
      <div className="col-start-1 col-span-1 row-start-2 flex flex-col items-start text-left gap-y-2">
        {renderSubmenu()}
      </div>
      {/* Close button — bottom center */}
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-4 justify-center px-6 pb-8 w-full">
        <WigglyButton
          text="close"
          mobileSize="text-xl"
          className="col-start-2 tracking-wide px-0 text-foreground leading-tight"
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

  const [showSettings, setShowSettings] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("sans-mode", sans);
  }, [sans]);

  const onIndexAny = pathname.startsWith("/index");
  const onIndexRoot = pathname === "/index";
  const onIndexWorks = pathname === "/index/works";
  const onIndexExhibitions = pathname === "/index/exhibitions";
  const onInfo = pathname === "/info";

  useEffect(() => {
    if (onIndexRoot && navOpen) searchRef.current?.focus();
  }, [onIndexRoot, navOpen]);

  const { categoryFilter, setCategoryFilter } = useWorks();
  const { exCat, setExCat } = useExhibitions();

  useEffect(() => {
    if (!onIndexAny) return;
    function handleScroll() {
      if (window.innerWidth < 1024) setNavOpen(false);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onIndexAny]);

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
        className={`fixed left-0 right-0 z-[131] flex flex-col  items-center pt-2 lg:pt-0 pointer-events-none `}
      >
        {/* Flex-wrap row: logo + "," + menu [+ ":" + nav links on desktop when open] */}
        <div className="flex flex-wrap items-baseline justify-start lg:justify-center pointer-events-auto px-6 lg:px-4 gap-x-0 w-full">
          {navOpen ? (
            <>
              <WigglyButton
                text="e. silow"
                size="text-3xl"
                mobileSize="text-xl"
                className="tracking-wide leading-tight items-baseline text-foreground px-0 mx-0 lg:hidden"
                href="/"
                bold
                anchorFill="currentColor"
                wiggleGradient={true}
                forceBaseline
                active
              />
              <WigglyButton
                text="elinor silow"
                size="text-3xl"
                mobileSize="text-xl"
                className="tracking-wide leading-tight items-baseline text-foreground px-0 mx-0 hidden lg:inline-flex"
                href="/"
                bold
                anchorFill="currentColor"
                wiggleGradient={true}
                forceBaseline
                active
              />
            </>
          ) : (
            <WigglyButton
              text="elinor silow"
              size="text-3xl"
              mobileSize="text-xl"
              className="tracking-wide leading-tight items-baseline text-foreground px-0 mx-0"
              href="/"
              bold
              anchorFill="currentColor"
              wiggleGradient={true}
              forceBaseline
              active
            />
          )}
          <span className="font-timesNewRoman text-xl lg:text-3xl text-foreground select-none leading-tight font-bold">
            ,{" "}
          </span>
          <WigglyButton
            text="menu"
            size="text-3xl"
            mobileSize="text-xl"
            className="tracking-wide leading-tight px-0 mx-0 ml-1 text-foreground"
            onClick={() => setNavOpen((v) => !v)}
            anchorFill="currentColor"
            forceBaseline
          />
          {/* ":" on mobile when nav open */}
          {navOpen && (
            <span className="lg:hidden font-timesNewRoman text-xl text-foreground select-none font-bold leading-none">
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
                mobileSize="text-xl"
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

        {/* Index: mode filter + settings toggle + search — root /index only */}
        {onIndexRoot && navOpen && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto  w-full">
            {INDEX_MODES.map(({ label, value }, i) => (
              <Fragment key={value}>
                {i > 0 && (
                  <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
                    ,
                  </span>
                )}
                <WigglyButton
                  text={label}
                  size="text-3xl"
                  className={`tracking-wide leading-tight px-0 lg:ml-2 ${mode === value ? "text-foreground" : "text-muted-foreground"}`}
                  onClick={() => setMode(value)}
                  bold
                  active={mode === value}
                  anchorFill="currentColor"
                  forceBaseline
                />
              </Fragment>
            ))}
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
              ,
            </span>
            <WigglyButton
              text="settings"
              size="text-3xl"
              className={`tracking-wide leading-tight px-0 lg:ml-2 ${showSettings ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setShowSettings((v) => !v)}
              bold
              active={showSettings}
              anchorFill="currentColor"
              forceBaseline
            />
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
              ,
            </span>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search..."
              className="bg-transparent border-none outline-none font-timesNewRoman text-3xl lowercase font-bold tracking-wide leading-tight placeholder:text-foreground text-foreground px-0 lg:ml-2 w-40"
            />
          </div>
        )}

        {/* Works: category filter + settings toggle — shown on /index/works */}
        {onIndexWorks && navOpen && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto ">
            {WORK_FILTERS.map((f, i) => {
              const active = categoryFilter === f.value;
              const disabled = f.value === "drawing";
              return (
                <Fragment key={f.value}>
                  {i > 0 && (
                    <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
                      ,
                    </span>
                  )}
                  <WigglyButton
                    text={f.label}
                    size="text-3xl"
                    className={`tracking-wide leading-tight px-0 lg:ml-2 ${disabled ? "text-muted-foreground cursor-none" : active ? "text-foreground" : "text-muted-foreground"}`}
                    onClick={
                      disabled ? undefined : () => setCategoryFilter(f.value)
                    }
                    bold
                    active={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                </Fragment>
              );
            })}
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
              ,
            </span>
            <WigglyButton
              text="settings"
              size="text-3xl"
              className={`tracking-wide leading-tight px-0 lg:ml-2 ${showSettings ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setShowSettings((v) => !v)}
              bold
              active={showSettings}
              anchorFill="currentColor"
              forceBaseline
            />
          </div>
        )}

        {/* Exhibitions: category filter + settings toggle — shown on /index/exhibitions */}
        {onIndexExhibitions && navOpen && (
          <div className="hidden lg:flex -mt-2 gap-x-0 items-baseline justify-center pointer-events-auto ">
            {EX_CATS.map((c, i) => {
              const active = exCat === c.value;
              return (
                <Fragment key={c.value}>
                  {i > 0 && (
                    <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
                      ,
                    </span>
                  )}
                  <WigglyButton
                    text={c.label}
                    size="text-3xl"
                    className={`tracking-wide leading-tight px-0 lg:ml-2 ${active ? "text-foreground" : "text-muted-foreground"}`}
                    onClick={() => setExCat(c.value)}
                    bold
                    active={active}
                    anchorFill="currentColor"
                    forceBaseline
                  />
                </Fragment>
              );
            })}
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
              ,
            </span>
            <WigglyButton
              text="settings"
              size="text-3xl"
              className={`tracking-wide leading-tight px-0 lg:ml-2 ${showSettings ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setShowSettings((v) => !v)}
              bold
              active={showSettings}
              anchorFill="currentColor"
              forceBaseline
            />
          </div>
        )}

        {/* Index: settings sub-panel — below whichever submenu row is active */}
        {onIndexAny && navOpen && showSettings && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto ">
            <WigglyButton
              text="zoom in"
              size="text-3xl"
              className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
              onClick={() => setZoom(Math.max(0, zoom - 1))}
              anchorFill="currentColor"
              forceBaseline
              bold
              active
            />
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
              ,
            </span>
            <WigglyButton
              text="zoom out"
              size="text-3xl"
              className="tracking-wide leading-tight px-0 lg:ml-2 text-foreground"
              onClick={() => setZoom(Math.min(4, zoom + 1))}
              anchorFill="currentColor"
              forceBaseline
              bold
              active
            />
            <span className="font-timesNewRoman text-3xl select-none leading-tight text-muted-foreground font-bold">
              ,
            </span>
            <WigglyButton
              text="tidy up"
              size="text-3xl"
              className={`tracking-wide leading-tight px-0 lg:ml-2 ${tidy ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setTidy(!tidy)}
              anchorFill="currentColor"
              forceBaseline
              bold
              active={tidy}
            />
          </div>
        )}

        {/* Info: section links */}
        {onInfo && (
          <div className="hidden lg:flex -mt-2 flex-wrap gap-x-0 items-baseline justify-center pointer-events-auto ">
            {INFO_SECTIONS.map((s, i) => {
              const active = activeSection === s.replace(/\s+/g, "-");
              return (
                <Fragment key={s}>
                  {i > 0 && (
                    <span className="font-timesNewRoman text-2xl select-none text-muted-foreground leading-tight ">
                      ,
                    </span>
                  )}
                  <WigglyButton
                    text={s}
                    size="text-3xl"
                    className={`tracking-wide leading-tight px-0 lg:ml-2 ${active ? "text-foreground" : "text-muted-foreground"}`}
                    href={`#${s.replace(/\s+/g, "-")}`}
                    bold
                    active={active}
                    anchorFill="currentColor"
                    forceBaseline
                    onClick={() => setNavOpen(false)}
                  />
                </Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile overlay — z-[125], behind logo/menu */}
      {navOpen && (
        <NewNavOverlay onClose={() => setNavOpen(false)} pathname={pathname} />
      )}
    </>
  );
}

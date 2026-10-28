"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
} from "react";

interface UIContextValue {
  inactive: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  boring: boolean;
  setBoring: Dispatch<boolean>;
  moreFun: boolean;
  setMoreFun: Dispatch<boolean>;
  sans: boolean;
  setSans: Dispatch<boolean>;
  small: boolean;
  setSmall: Dispatch<boolean>;
  funForeground: boolean;
  setFunForeground: Dispatch<boolean>;
  showAnchorsAll: boolean;
  setShowAnchorsAll: Dispatch<boolean>;
  moreFunBg: string;
  refreshMoreFunBg: () => void;
  homeBg: string | null;
  setHomeBg: (v: string | null) => void;
  // Home page intro: the backdrop fades in, then the hero media, then the
  // nav and news. Starts at "backdrop" so the server render already hides
  // the nav on "/" (no flash); runs once per visit.
  introPhase: IntroPhase;
  // Site-wide image size setting (S / M / L), used by the works and
  // exhibitions lists; remembered in this browser.
  imageSize: ImageSize;
  setImageSize: (s: ImageSize) => void;
  setIntroPhase: (p: IntroPhase) => void;
  // The site's reveal once the "under construction" overlay is closed:
  // "covered" (overlay up; list rows and ESNav hidden) → "rows" (the rows
  // fade in, staggered) → "done" (the featured work opens, ESNav shows).
  siteReveal: SiteReveal;
  setSiteReveal: (r: SiteReveal) => void;
  navVisible: boolean;
  setNavVisible: (v: boolean) => void;
  openDesktopNav: boolean;
  setOpenDesktopNav: (v: boolean) => void;
  showWorksMenu: boolean;
  setShowWorksMenu: Dispatch<boolean>;
  showExhibitionsMenu: boolean;
  setShowExhibitionsMenu: Dispatch<boolean>;
  showContact: boolean;
  setShowContact: Dispatch<boolean>;
  showAllWorksList: boolean;
  setShowAllWorksList: Dispatch<boolean>;
  showAllExhibitionsList: boolean;
  setShowAllExhibitionsList: Dispatch<boolean>;
  showWorksFilter: boolean;
  setShowWorksFilter: Dispatch<boolean>;
  showExhibitionsFilter: boolean;
  setShowExhibitionsFilter: Dispatch<boolean>;
  showInfo: boolean;
  setShowInfo: Dispatch<boolean>;
  showSettings: boolean;
  setShowSettings: Dispatch<boolean>;
  proportionalImages: boolean;
  setProportionalImages: Dispatch<boolean>;
  showAsList: boolean;
  setShowAsList: Dispatch<boolean>;
  gridCols: number;
  setGridCols: Dispatch<number>;
  gridRows: number;
  setGridRows: Dispatch<number>;
  visibleWorkIndex: number;
  setVisibleWorkIndex: Dispatch<number>;
  visibleExhibitionIndex: number;
  setVisibleExhibitionIndex: Dispatch<number>;
  hoveredItemTitle: string | null;
  setHoveredItemTitle: Dispatch<string | null>;
  exGridCols: number;
  setExGridCols: Dispatch<number>;
  exGridRows: number;
  setExGridRows: Dispatch<number>;
  showTitles: boolean;
  setShowTitles: Dispatch<boolean>;
  showColorBg: boolean;
  setShowColorBg: Dispatch<boolean>;
  textBlurred: boolean;
  setTextBlurred: Dispatch<boolean>;
  activePage: "home" | "works" | "exhibitions" | "info";
  setActivePage: Dispatch<"home" | "works" | "exhibitions" | "info">;
  filterOpen: boolean;
  setFilterOpen: Dispatch<boolean>;
  handleFilterOpen: () => void;
  openSearch: boolean;
  setOpenSearch: Dispatch<boolean>;
  handleShowSettings: () => void;
  handleOpen: () => void;
  handleOpenWorksMenu: () => void;
  handleOpenAllWorksList: () => void;
  handleOpenWorksFilter: () => void;
  handleOpenAllExhibitionsList: () => void;
  handleOpenExhibitionsMenu: () => void;
  handleOpenExhibitionsFilter: () => void;
  handleOpenContact: () => void;
}

function randomHsl() {
  return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
}

// Home page intro: the backdrop fades in, then the hero media, then the nav
// and news ("done").
// S — a quarter of the screen tall; M — 60% (the default); L — 78% and the
// full width. All leave room for the open row's text below the image.
export type ImageSize = "S" | "M" | "L";

export type IntroPhase = "backdrop" | "media" | "done";

export type SiteReveal = "covered" | "rows" | "done";
// The rows' reveal (seconds): each row's background fades in REVEAL_FADE,
// REVEAL_STAGGER after the one above (the first REVEAL_ROWS rows; the rest
// with the last of them), its text REVEAL_TEXT_AFTER after its background.
export const REVEAL_STAGGER = 0.05;
export const REVEAL_ROWS = 24;
export const REVEAL_TEXT_AFTER = 0.25;
export const REVEAL_FADE = 0.4;
export const REVEAL_MS =
  ((REVEAL_ROWS - 1) * REVEAL_STAGGER + REVEAL_TEXT_AFTER + REVEAL_FADE) *
  1000;

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [inactive, setInactive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function resetTimer() {
      setInactive(false);
      clearTimeout(timer);
      timer = setTimeout(() => setInactive(true), 4000);
    }
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"] as const;
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
    };
  }, []);

  const [open, setOpen] = useState(false);
  const [boring, setBoring] = useState(false);
  const [moreFun, setMoreFun] = useState(false);
  const [sans, setSans] = useState(false);
  const [small, setSmall] = useState(false);
  const [funForeground, setFunForeground] = useState(true);
  const [showAnchorsAll, setShowAnchorsAll] = useState(false);
  const [moreFunBg, setMoreFunBg] = useState(() => randomHsl());
  const [homeBg, setHomeBg] = useState<string | null>(null);
  const [introPhase, setIntroPhase] = useState<IntroPhase>("backdrop");
  const [siteReveal, setSiteReveal] = useState<SiteReveal>("covered");
  // Starts at M on the server and first render (no hydration mismatch),
  // then picks up the saved choice; saving is best-effort (storage can be
  // unavailable, e.g. private browsing).
  const [imageSize, setImageSizeState] = useState<ImageSize>("L");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("imageSize");
      if (saved === "S" || saved === "M" || saved === "L")
        setImageSizeState(saved);
    } catch {}
  }, []);
  const setImageSize = (s: ImageSize) => {
    setImageSizeState(s);
    try {
      localStorage.setItem("imageSize", s);
    } catch {}
  };
  const [openDesktopNav, setOpenDesktopNav] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  const [showWorksMenu, setShowWorksMenu] = useState(false);
  const [showExhibitionsMenu, setShowExhibitionsMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [showAllExhibitionsList, setShowAllExhibitionsList] = useState(false);
  const [showWorksFilter, setShowWorksFilter] = useState(false);
  const [showExhibitionsFilter, setShowExhibitionsFilter] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [proportionalImages, setProportionalImages] = useState(false);
  const [showAsList, setShowAsList] = useState(false);
  const [gridCols, setGridCols] = useState(2);
  const [gridRows, setGridRows] = useState(1);
  const [visibleWorkIndex, setVisibleWorkIndex] = useState(0);
  const [visibleExhibitionIndex, setVisibleExhibitionIndex] = useState(0);
  const [hoveredItemTitle, setHoveredItemTitle] = useState<string | null>(null);
  const [exGridCols, setExGridCols] = useState(1);
  const [exGridRows, setExGridRows] = useState(1);
  const [showTitles, setShowTitles] = useState(false);
  const [showColorBg, setShowColorBg] = useState(false);
  const [textBlurred, setTextBlurred] = useState(false);
  const [activePage, setActivePage] = useState<
    "home" | "works" | "exhibitions" | "info"
  >("home");
  const [filterOpen, setFilterOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  function handleFilterOpen() {
    setFilterOpen((prev) => !prev);
  }

  function handleOpen() {
    setOpen((prev) => !prev);
  }

  function handleOpenWorksMenu() {
    setShowWorksMenu((prev) => !prev);
  }
  function handleOpenAllWorksList() {
    setShowAllWorksList((prev) => !prev);
  }
  function handleOpenWorksFilter() {
    setShowWorksFilter((prev) => !prev);
  }
  function handleOpenAllExhibitionsList() {
    setShowAllExhibitionsList((prev) => !prev);
  }
  function handleOpenExhibitionsMenu() {
    setShowExhibitionsMenu((prev) => !prev);
  }
  function handleOpenExhibitionsFilter() {
    setShowExhibitionsFilter((prev) => !prev);
  }
  function handleOpenContact() {
    setShowContact((prev) => !prev);
  }

  function handleShowSettings() {
    setShowSettings((prev) => !prev);
  }

  return (
    <UIContext.Provider
      value={{
        inactive,
        open,
        setOpen,
        boring,
        setBoring,
        moreFun,
        setMoreFun,
        sans,
        setSans,
        small,
        setSmall,
        funForeground,
        setFunForeground,
        showAnchorsAll,
        setShowAnchorsAll,
        moreFunBg,
        refreshMoreFunBg: () => setMoreFunBg(randomHsl()),
        homeBg,
        setHomeBg,
        introPhase,
        setIntroPhase,
        siteReveal,
        setSiteReveal,
        imageSize,
        setImageSize,
        navVisible,
        setNavVisible,
        openDesktopNav,
        setOpenDesktopNav,
        showWorksMenu,
        setShowWorksMenu,
        showExhibitionsMenu,
        setShowExhibitionsMenu,
        showContact,
        setShowContact,
        showAllWorksList,
        setShowAllWorksList,
        showAllExhibitionsList,
        setShowAllExhibitionsList,
        showWorksFilter,
        setShowWorksFilter,
        showExhibitionsFilter,
        setShowExhibitionsFilter,
        showInfo,
        setShowInfo,
        showSettings,
        setShowSettings,
        proportionalImages,
        setProportionalImages,
        showAsList,
        setShowAsList,
        gridCols,
        setGridCols,
        gridRows,
        setGridRows,
        visibleWorkIndex,
        setVisibleWorkIndex,
        visibleExhibitionIndex,
        setVisibleExhibitionIndex,
        hoveredItemTitle,
        setHoveredItemTitle,
        exGridCols,
        setExGridCols,
        exGridRows,
        setExGridRows,
        showTitles,
        setShowTitles,
        showColorBg,
        setShowColorBg,
        textBlurred,
        setTextBlurred,
        activePage,
        setActivePage,
        filterOpen,
        setFilterOpen,
        handleFilterOpen,
        openSearch,
        setOpenSearch,
        handleOpen,
        handleOpenWorksMenu,
        handleOpenAllWorksList,
        handleOpenWorksFilter,
        handleOpenAllExhibitionsList,
        handleOpenExhibitionsMenu,
        handleOpenExhibitionsFilter,
        handleOpenContact,
        handleShowSettings,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within a UIProvider");
  return ctx;
}

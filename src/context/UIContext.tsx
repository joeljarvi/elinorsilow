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
  open: boolean;
  setOpen: (v: boolean) => void;
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

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const [openDesktopNav, setOpenDesktopNav] = useState(true);
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
  const [gridCols, setGridCols] = useState(3);
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

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setFilterOpen(true);
    }
  }, []);

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
        open,
        setOpen,
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

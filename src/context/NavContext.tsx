"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
} from "react";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { useEffect } from "react";

export type ViewMode = "works" | "exhibitions" | "info";

interface NavContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  openDesktopNav: boolean;
  setOpenDesktopNav: (v: boolean) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  nextView: ViewMode | null;
  setNextView: (v: ViewMode | null) => void;
  viewLoading: boolean;
  setViewLoading: (v: boolean) => void;
  goToView: (v: ViewMode) => void;
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

  handleOpen: () => void;
  handleDesktopOpen: () => void;
  handleOpenWorksMenu: () => void;
  handleOpenAllWorksList: () => void;
  handleOpenWorksFilter: () => void;
  handleOpenAllExhibitionsList: () => void;
  handleOpenExhibitionsMenu: () => void;
  handleOpenExhibitionsFilter: () => void;
  handleOpenContact: () => void;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);
  const [openDesktopNav, setOpenDesktopNav] = useState(true);
  const [view, setView] = useState<ViewMode>("works");
  const [viewLoading, setViewLoading] = useState(false);
  const [showWorksMenu, setShowWorksMenu] = useState(false);
  const [showExhibitionsMenu, setShowExhibitionsMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [showAllExhibitionsList, setShowAllExhibitionsList] = useState(false);
  const [showWorksFilter, setShowWorksFilter] = useState(false);
  const [showExhibitionsFilter, setShowExhibitionsFilter] = useState(false);
  const [nextView, setNextView] = useState<ViewMode | null>(null);

  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const { infoLoading } = useInfo();

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setOpen(false);
    }
  }, []);

  if (!NavContext.Provider) {
    throw new Error("NavContext.Provider is undefined");
  }

  function handleOpen() {
    setOpen((prev) => !prev);
  }
  function handleDesktopOpen() {
    setOpenDesktopNav((prev) => !prev);
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

  const goToView = (v: ViewMode) => {
    setNextView(v); // remember which view we are switching to
    setView(v); // actually switch the view
    setViewLoading(true); // start the loader
  };

  // Then, use an effect to stop the loader automatically
  useEffect(() => {
    if (!workLoading && !exLoading && !infoLoading && viewLoading) {
      setViewLoading(false); // all data is ready, stop the loader
      setNextView(null); // reset nextView
    }
  }, [workLoading, exLoading, infoLoading, viewLoading]);
  return (
    <NavContext.Provider
      value={{
        open,
        setOpen,
        openDesktopNav,
        setOpenDesktopNav,
        view,
        setView,
        nextView,
        setNextView,
        viewLoading,
        setViewLoading,
        goToView,
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
        handleOpen,
        handleDesktopOpen,
        handleOpenWorksMenu,
        handleOpenAllWorksList,
        handleOpenWorksFilter,
        handleOpenAllExhibitionsList,
        handleOpenExhibitionsMenu,
        handleOpenExhibitionsFilter,
        handleOpenContact,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within a NavProvider");
  return ctx;
}

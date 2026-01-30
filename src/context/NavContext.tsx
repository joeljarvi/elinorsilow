"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
} from "react";

export type ViewMode = "works" | "exhibitions" | "info";

interface NavContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  view: ViewMode;
  setView: (v: ViewMode) => void;
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
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("works");
  const [viewLoading, setViewLoading] = useState(false);
  const [showWorksMenu, setShowWorksMenu] = useState(false);
  const [showExhibitionsMenu, setShowExhibitionsMenu] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAllWorksList, setShowAllWorksList] = useState(false);
  const [showAllExhibitionsList, setShowAllExhibitionsList] = useState(false);
  const [showWorksFilter, setShowWorksFilter] = useState(false);
  const [showExhibitionsFilter, setShowExhibitionsFilter] = useState(false);

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

  const goToView = (v: ViewMode) => {
    setViewLoading(true);
    setView(v);
  };

  return (
    <NavContext.Provider
      value={{
        open,
        setOpen,
        view,
        setView,
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

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
  setOpen: Dispatch<boolean>;
  view: ViewMode;
  setView: (v: ViewMode) => void;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("works");

  return (
    <NavContext.Provider
      value={{
        open,
        setOpen,
        view,
        setView,
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

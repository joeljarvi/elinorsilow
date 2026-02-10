"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useTransition,
} from "react";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { useEffect } from "react";

export type ViewMode = "works" | "exhibitions" | "info";

interface NavContextValue {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  nextView: ViewMode | null;
  setNextView: (v: ViewMode | null) => void;
  viewLoading: boolean;
  setViewLoading: (v: boolean) => void;
  goToView: (v: ViewMode) => void;
  isPending: boolean;
}

const NavContext = createContext<NavContextValue | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewMode>("works");
  const [viewLoading, setViewLoading] = useState(false);
  const [nextView, setNextView] = useState<ViewMode | null>(null);
  const [isPending, startTransition] = useTransition();

  const { workLoading } = useWorks();
  const { exLoading } = useExhibitions();
  const { infoLoading } = useInfo();

  const goToView = (v: ViewMode) => {
    setNextView(v);
    setViewLoading(true);
    
    startTransition(() => {
      setView(v);
    });
  };

  useEffect(() => {
    if (!workLoading && !exLoading && !infoLoading && viewLoading && !isPending) {
      setViewLoading(false);
      setNextView(null);
    }
  }, [workLoading, exLoading, infoLoading, viewLoading, isPending]);

  return (
    <NavContext.Provider
      value={{
        view,
        setView,
        nextView,
        setNextView,
        viewLoading,
        setViewLoading,
        goToView,
        isPending,
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
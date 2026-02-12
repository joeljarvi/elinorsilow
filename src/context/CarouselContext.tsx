// lib/CarouselContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CarouselContextType = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined
);

export function CarouselProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <CarouselContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </CarouselContext.Provider>
  );
}

export function useCarouselContext() {
  const ctx = useContext(CarouselContext);
  if (!ctx)
    throw new Error("useCarouselContext must be used inside CarouselProvider");
  return ctx;
}

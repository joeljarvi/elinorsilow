"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface NavSlotContextType {
  centerContent: ReactNode;
  setCenterContent: (content: ReactNode) => void;
}

const NavSlotContext = createContext<NavSlotContextType>({
  centerContent: null,
  setCenterContent: () => {},
});

export function NavSlotProvider({ children }: { children: ReactNode }) {
  const [centerContent, setCenterContent] = useState<ReactNode>(null);
  return (
    <NavSlotContext.Provider value={{ centerContent, setCenterContent }}>
      {children}
    </NavSlotContext.Provider>
  );
}

export function useNavSlot() {
  return useContext(NavSlotContext);
}

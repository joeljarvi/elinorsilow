"use client";

import { createContext, useContext } from "react";
import { ActivityEntry } from "../../lib/sanity";

const ActivityContext = createContext<ActivityEntry[]>([]);

export function ActivityProvider({
  children,
  updates,
}: {
  children: React.ReactNode;
  updates: ActivityEntry[];
}) {
  return (
    <ActivityContext.Provider value={updates}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  return useContext(ActivityContext);
}

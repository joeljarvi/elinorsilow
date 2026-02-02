"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAllEducations,
  getAllGrants,
  getExhibitionList,
  Education,
  Grant,
  Exhibition_list,
} from "../../lib/wordpress";

interface InfoContextProps {
  educations: Education[];
  grants: Grant[];
  exhibitionList: Exhibition_list[];
  infoLoading: boolean;
  refresh: () => void;
}

const InfoContext = createContext<InfoContextProps | undefined>(undefined);

export const InfoProvider = ({ children }: { children: ReactNode }) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [exhibitionList, setExhibitionList] = useState<Exhibition_list[]>([]);
  const [infoLoading, setInfoLoading] = useState(true);

  const fetchData = async () => {
    setInfoLoading(true);
    try {
      const [edu, gr, exhibitions] = await Promise.all([
        getAllEducations(),
        getAllGrants(),
        getExhibitionList(),
      ]);

      setEducations(edu);
      setGrants(gr);
      setExhibitionList(exhibitions);
    } catch (err) {
      console.error("Error fetching info:", err);
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <InfoContext.Provider
      value={{
        educations,
        grants,
        exhibitionList,
        infoLoading,
        refresh: fetchData,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
};

// Custom hook for convenience
export const useInfo = () => {
  const context = useContext(InfoContext);
  if (!context) throw new Error("useInfo must be used within an InfoProvider");
  return context;
};

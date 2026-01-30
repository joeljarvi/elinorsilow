"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getBiography,
  getAllEducations,
  getAllGrants,
  getExhibitionList,
  Biography,
  Education,
  Grant,
  Exhibition_list,
} from "../../lib/wordpress";
import { useNav } from "./NavContext";

interface InfoContextProps {
  biography: Biography | null;
  educations: Education[];
  grants: Grant[];
  exhibitionList: Exhibition_list[];
  infoLoading: boolean;
  refresh: () => void;
}

const InfoContext = createContext<InfoContextProps | undefined>(undefined);

export const InfoProvider = ({ children }: { children: ReactNode }) => {
  const [biography, setBiography] = useState<Biography | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [exhibitionList, setExhibitionList] = useState<Exhibition_list[]>([]);
  const [infoLoading, setInfoLoading] = useState(true);

  const { view, setViewLoading } = useNav();

  const fetchData = async () => {
    setInfoLoading(true);
    try {
      const [bio, edu, gr, exhibitions] = await Promise.all([
        getBiography(),
        getAllEducations(),
        getAllGrants(),
        getExhibitionList(),
      ]);
      setBiography(bio);
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

  useEffect(() => {
    if (view === "info" && !infoLoading) {
      setViewLoading(false);
    }
  }, [view, infoLoading]);

  return (
    <InfoContext.Provider
      value={{
        biography,
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

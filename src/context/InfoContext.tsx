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

interface InfoContextProps {
  biography: Biography | null;
  educations: Education[];
  grants: Grant[];
  exhibitionList: Exhibition_list[];
  loading: boolean;
  refresh: () => void;
}

const InfoContext = createContext<InfoContextProps | undefined>(undefined);

export const InfoProvider = ({ children }: { children: ReactNode }) => {
  const [biography, setBiography] = useState<Biography | null>(null);
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [exhibitionList, setExhibitionList] = useState<Exhibition_list[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <InfoContext.Provider
      value={{
        biography,
        educations,
        grants,
        exhibitionList,
        loading,
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

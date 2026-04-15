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
  getLongBio,
  getShortBio,
  Education,
  Grant,
  Exhibition_list,
} from "../../lib/sanity";

interface InfoContextProps {
  educations: Education[];
  grants: Grant[];
  exhibitionList: Exhibition_list[];
  longBio: string;
  shortBio: string;
  infoLoading: boolean;
  refresh: () => void;
  soloExhibitions: Exhibition_list[];
  groupExhibitions: Exhibition_list[];
}

const InfoContext = createContext<InfoContextProps | undefined>(undefined);

export const InfoProvider = ({ children }: { children: ReactNode }) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [exhibitionList, setExhibitionList] = useState<Exhibition_list[]>([]);
  const [longBio, setLongBio] = useState<string>("");
  const [shortBio, setShortBio] = useState<string>("");
  const [infoLoading, setInfoLoading] = useState(true);

  const fetchData = async () => {
    setInfoLoading(true);
    try {
      const [edu, gr, exhibitions, bio, short] = await Promise.all([
        getAllEducations(),
        getAllGrants(),
        getExhibitionList(),
        getLongBio(),
        getShortBio(),
      ]);

      setEducations(edu);
      setGrants(gr);
      setExhibitionList(exhibitions);
      setLongBio(bio);
      setShortBio(short);
    } catch (err) {
      console.error("Error fetching info:", err);
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const soloExhibitions = exhibitionList.filter(
    (ex) => ex.acf.exhibition_type === "Solo Exhibition"
  );

  const groupExhibitions = exhibitionList.filter(
    (ex) => ex.acf.exhibition_type === "Group Exhibition"
  );

  return (
    <InfoContext.Provider
      value={{
        educations,
        grants,
        exhibitionList,
        longBio,
        shortBio,
        soloExhibitions,
        groupExhibitions,
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

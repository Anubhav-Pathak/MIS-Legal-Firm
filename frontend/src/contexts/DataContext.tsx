import React, { useEffect, useState, useRef } from "react";
import { getFilter, postRead, postSearch } from "@/utils/API";

type TimelineEntry = [string, string][];
type Data = {
  results: { [key: string]: string | null }[];
  remainingData: number;
  tabs: string[];
};

interface DataContextValue {
  filter: {};
  data: Data;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  error: string;
  searchHandler: (search: string) => void;
  filterHandler: (params: {
    column: string;
    value: string;
    reset?: boolean;
  }) => void;
  setError: (message: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  timeline: TimelineEntry;
  setTimeline: (timeline: TimelineEntry) => void;
  setFilter: (filter: {}) => void;
  setData: (data: Data) => void;
  remainingData: number;
  setRemainingData: (remainingData: number) => void;
  company: {
    name: string;
    tab: string;
  };
  setCompany: (company: { name: string; tab: string }) => void;
}

const DataContext = React.createContext<DataContextValue>({
  filter: {},
  data: { results: [], remainingData: 0, tabs: [] },
  page: 1,
  setPage: () => {},
  limit: 15,
  setLimit: () => {},
  error: "",
  searchHandler: () => {},
  filterHandler: () => {},
  setError: () => {},
  loading: true,
  setLoading: () => {},
  timeline: [],
  setTimeline: () => {},
  setFilter: () => {},
  setData: () => {},
  remainingData: 0,
  setRemainingData: () => {},
  company: { name: "", tab: "" },
  setCompany: () => {},
});

const transformData = (
  data: { [key: string]: string | null }[]
): { [key: string]: string | null }[] => {
  const uniqueKeys: string[] = Array.from(
    new Set(data.flatMap((obj: {}) => Object.keys(obj)))
  );

  const updatedData = data.map((obj: { [x: string]: string | null }) => {
    const updatedObj: { [key: string]: string | null } = {};
    uniqueKeys.forEach((key) => {
      updatedObj[key] = obj[key] || null;
    });
    return updatedObj;
  });

  return updatedData;
};

export const DataContextProvider = (props: any) => {
  const [data, setData] = useState<Data>({
    results: [],
    remainingData: 0,
    tabs: [],
  });
  const [filter, setFilter] = useState({});
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineEntry>([]);

  const [company, setCompany] = useState<{ name: string; tab: string }>({
    name: props.clientName,
    tab: "LRN MIS Sheet",
  });

  const isMountedRef = useRef(false);

  async function searchHandler(search: string) {
    try {
      setLoading(true);
      const { results, remainingData } = await postSearch(
        search,
        page,
        limit,
        company.name,
        company.tab
      );
      if (!results) throw Error("No data found !");
      setData({
        results: transformData(results),
        remainingData,
        tabs: [],
      });
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
    }
  }

  async function filterHandler({
    column,
    value,
    reset,
  }: {
    column: string;
    value: string;
    reset?: boolean;
  }) {
    try {
      setLoading(true);
      if (reset) {
        setFilter((prevState) => {
          if (!column) return {};
          const updatedFilter: { [key: string]: any } = { ...prevState };
          delete updatedFilter[column];
          return updatedFilter;
        });
      } else {
        setFilter((prevState) => ({ ...prevState, [column]: value }));
      }
    } catch (error: any) {
      setError(error.message);
    }
  }

  /* broken, keeps firing on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { results, remainingData, tabs } = await getFilter(
          filter,
          page,
          limit,
          company.name,
          company.tab
        );
        if (!results) throw Error("No data found !");
        if (isMountedRef.current) {
          setData({
            results: transformData(results),
            remainingData,
            tabs,
          });
          setLoading(false);
        }
      } catch (error: any) {
        if (isMountedRef.current) {
          setError(error.message);
        }
      }
    };

    if (isMountedRef.current) {
      fetchData();
    }

    return () => {
      isMountedRef.current = true;
    };
  }, [filter]);
  */

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { results, remainingData, tabs } = await postRead(
          page,
          company.name,
          limit,
          company.tab
        );
        if (!results) throw Error("No data found !");
        setData({
          results: transformData(results),
          remainingData,
          tabs,
        });
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
      }
    }
    fetchData();
  }, [page, company.name, limit, company.tab]);

  return (
    <DataContext.Provider
      value={{
        filter,
        data,
        searchHandler,
        filterHandler,
        page,
        setPage,
        limit,
        setLimit,
        error,
        setError,
        loading,
        setLoading,
        timeline,
        setTimeline,
        setFilter,
        setData: (data: Data) =>
          setData((prevState) => ({
            ...prevState,
            results: transformData(data.results),
          })),
        remainingData: data.remainingData,
        setRemainingData: (remainingData: number) =>
          setData((prevState) => ({
            ...prevState,
            remainingData,
          })),
        company,
        setCompany,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;

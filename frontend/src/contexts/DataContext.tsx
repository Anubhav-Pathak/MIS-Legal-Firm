import React, { useEffect, useState, useRef } from "react";
import { getFilter, postRead, postSearch } from "@/utils/API";

type TimelineEntry = [string, string][];

const DataContext = React.createContext({
  filter: {},
  data: [] as { [key: string]: string | null }[],
  page: 1,
  setPage: (page: number) => {},
  limit: 15,
  setLimit: (limit: number) => {},
  error: "",
  searchHandler: (search: string) => {},
  filterHandler: ({
    column: column,
    value: value,
    reset: reset,
  }: {
    column: string;
    value: string;
    reset?: boolean;
  }) => {},
  setError: (message: string) => {},
  loading: true,
  setLoading: (loading: boolean) => {},
  timeline: [] as unknown as TimelineEntry,
  setTimeline: (timeline: TimelineEntry) => {},
  setFilter: (filter: {}) => {},
  setData: (data: { [key: string]: string | null }[]) => {},
  remainingData: 0,
  setRemainingData: (remainingData: number) => {},
});

const transformData = (
  data: { [key: string]: null }[]
): { [key: string]: string | null }[] => {
  const uniqueKeys: string[] = Array.from(
    new Set(data.flatMap((obj: {}) => Object.keys(obj)))
  );

  const updatedData = data.map((obj: { [x: string]: null }) => {
    const updatedObj: { [key: string]: string | null } = {};
    uniqueKeys.forEach((key) => {
      updatedObj[key] = obj[key] || null;
    });
    return updatedObj;
  });

  return updatedData;
};

export const DataContextProvider = (props: any) => {
  const [data, setData] = useState<{ [key: string]: string | null }[]>([]);
  const [filter, setFilter] = useState({});
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [company, setCompany] = useState("SME ");
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<TimelineEntry>([]);
  const [remainingData, setRemainingData] = useState(0);

  const isMountedRef = useRef(false);

  async function searchHandler(search: string) {
    try {
      setLoading(true);
      const { results, remainingData } = await postSearch(search, page, limit);
      if (!results) throw Error("No data found !");
      setData(transformData(results));
      setRemainingData(remainingData);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { results, remainingData } = await getFilter(filter, page, limit);
        if (!results) throw Error("No data found !");
        if (isMountedRef.current) {
          setData(transformData(results));
          setRemainingData(remainingData);
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

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { results, remainingData } = await postRead(page, company, limit);
        if (!results) throw Error("No data found !");

        setData(transformData(results));
        setRemainingData(remainingData);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
      }
    }
    fetchData();
  }, [page, company, limit]);

  return (
    <DataContext.Provider
      value={{
        filter: filter,
        data: data,
        searchHandler: searchHandler,
        filterHandler: filterHandler,
        page: page,
        setPage: setPage,
        limit: limit,
        setLimit: setLimit,
        error: error,
        setError: setError,
        loading: loading,
        setLoading: setLoading,
        timeline: timeline,
        setTimeline: setTimeline,
        setFilter: (filter: {}) => {},
        setData: setData,
        remainingData: remainingData,
        setRemainingData: setRemainingData,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;

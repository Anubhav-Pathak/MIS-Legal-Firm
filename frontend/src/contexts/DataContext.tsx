import React, { useEffect, useState } from "react";
import { getFilter, postRead, postSearch } from "@/utils/API";

type TimelineEntry = [string, string][];

const DataContext = React.createContext({
  filter: {},
  data: [],
  page: 1,
  setPage: (page: number) => {},
  limit: 15,
  setLimit: (limit: number) => {},
  error: "",
  searchHandler: (search: string) => {},
  filterHandler: ({
    column: column,
    value: value,
  }: {
    column: string;
    value: string;
  }) => {},
  setError: (message: string) => {},
  loading: true,
  setLoading: (loading: boolean) => {},
  timeline: [] as unknown as TimelineEntry,
  setTimeline: (timeline: TimelineEntry) => {},
});

export const DataContextProvider = (props: any) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({});
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [company, setCompany] = useState("SME ");
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState<TimelineEntry>([]);

  async function searchHandler(search: string) {
    try {
      const data = await postSearch(search);
      if (!data) throw Error("No data found !");
      setData(data);
    } catch (error: any) {
      setError(error.message);
    }
  }
  async function filterHandler({
    column: column,
    value: value,
  }: {
    column: string;
    value: string;
  }) {
    try {
      setFilter((prevState) => ({ ...prevState, [column]: value }));
      const data = await getFilter(filter);
      if (!data) throw Error("No data found !");
      setData(data);
    } catch (error: any) {
      setError(error.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await postRead(page, company, limit);
        if (!data) throw Error("No data found !");

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

        setData(updatedData);
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
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;

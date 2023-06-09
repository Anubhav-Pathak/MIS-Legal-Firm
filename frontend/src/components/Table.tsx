import DataContext from "@/contexts/DataContext";
import Button from "./UI/Button";
import React, { useState, useMemo } from "react";
import Image from "next/image";

interface IHeaders {
  columns: string[];
  onSearch: (column: string, value: string) => void;
}

type TimelineEntry = [string, string][];

const Header = ({ columns, onSearch }: IHeaders) => {
  return (
    <>
      <tr className="text-neutral">
        {columns.map((column: string) => (
          <th key={column} className="bg-primary rounded-none text-center font-bold text-xl">
            {column}
          </th>
        ))}
      </tr>
      <tr className="text-neutral">
        {columns.map((column: string) => (
          <th key={column} className="bg-primary rounded-none">
            <input
              type="text"
              placeholder={`Search ${column?.trim()}`}
              className={`input input-bordered bg-gray-300 input-xs w-full max-w-xs focus:outline-none text-black`}
              onChange={(e) => onSearch(column, e.target.value)}
            />
          </th>
        ))}
      </tr>
    </>
  );
};

const Table = () => {
  const dataContext = React.useContext(DataContext);
  const columns = dataContext.data[0] ? Object.keys(dataContext.data[0]) : [];
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});

  const handleSearch = (column: string, value: string) => {
    if (value === "") {
      const { [column]: _, ...rest } = searchTerms;
      setSearchTerms(rest);
      return;
    }
    setSearchTerms((prevSearchTerms) => ({
      ...prevSearchTerms,
      [column]: value,
    }));
  };

  const filterData = useMemo(() => {
    return dataContext.data.filter((row) => {
      if (Object.keys(searchTerms).length === 0) return true;
      for (const column in searchTerms) {
        const searchTerm = searchTerms[column];
        if (
          searchTerm &&
          String(row[column]).toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
  }, [dataContext.data, searchTerms]);

  const TimelineHandler = (row: any) => {
    const dateRow: TimelineEntry = (
      Object.entries(row) as Array<[string, string]>
    ).filter((i) => {
      return String(i[1]).match(/^\d{2}\.\d{2}\.\d{4}$/);
    });
    dataContext.setTimeline(dateRow);
  };

  if (dataContext.loading) {
    return (
      <div className="alert flex flex-row justify-center animate-pulse">
        <div className="rounded-full border-8 border-t-8 border-gray-200 h-10 w-10 bg-primary"></div>
        <span className="font-bold text-xl uppercase">Loading...</span>
      </div>
    );
  }

  if (!dataContext.data.length) {
    return (
      <div className="alert bg-primary flex flex-row justify-center font-bold text-xl rounded-tl-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-info shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span className="uppercase text-white">No data found!</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table bg-white w-full text-center">
        <thead>
          <Header columns={columns} onSearch={handleSearch} />
        </thead>
        <tbody>
          {filterData.map((row: {}, index: number) => (
            <tr key={index}>
              {Object.values(row).map((column: any, index: number) =>
                index !== 0 ? (
                  <td key={index}>{column}</td>
                ) : (
                  <th
                    key={index}
                    className="tooltip tooltip-right tooltip-primary cursor-pointer hover:bg-primary hover:text-white duration-200 rounded-none"
                    data-tip="click to view timeline"
                    onClick={() => TimelineHandler(row)}
                  >
                    {column}
                  </th>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

import DataContext from "@/contexts/DataContext";
import Button from "./UI/Button";
import React from "react";

interface IHeaders {
  columns: string[];
}

type TimelineEntry = [string, string][];

const Header = ({ columns }: IHeaders) => {
  return (
    <tr className="text-neutral">
      {columns.map((column: string) => (
        <th key={column} className="bg-primary rounded-none">
          {column}
        </th>
      ))}
    </tr>
  );
};

const Table = () => {
  const dataContext = React.useContext(DataContext);
  const loading = dataContext.loading;
  const columns = dataContext.data[0] ? Object.keys(dataContext.data[0]) : [];
  return (
    <div className="overflow-x-auto">
      <table className={`table bg-white w-full ${loading && "blur-2xl"}`}>
        {loading && (
          <div className="flex flex-col justify-center items-center z-50">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}
        <thead>
          <Header columns={columns} />
        </thead>
        <tbody>
          {dataContext.data.map((row: {}, index: number) => (
            <tr key={index}>
              {Object.values(row).map((column: any, index: number) =>
                index !== 0 ? (
                  <td key={index}>{column}</td>
                ) : (
                  <th key={index}>{column}</th>
                )
              )}
              <Button
                styles="btn btn-success btn-xs"
                clickHandler={() => {
                  const dateRow: TimelineEntry = (
                    Object.entries(row) as Array<[string, string]>
                  ).filter((i) => {
                    return String(i[1]).match(/^\d{2}\.\d{2}\.\d{4}$/);
                  });
                  dataContext.setTimeline(dateRow);
                }}
              >
                Timeline
              </Button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
